"use client";

import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

import { getJwtSubject } from "@/apis/auth/jwt";
import { getAccessToken } from "@/apis/auth/tokenStorage";
import { getChatMessages, getMyChatRooms } from "@/apis/chat";
import { WS_BASE_URL } from "@/apis/env";
import type { MessageItem } from "@/components/ui/MessageDropdown";
import type { ChatMessageHistorySearchResponse } from "@/types/chat";

import { parseServerDate } from "../utils/parseServerDate";
import { resolveChatRoom } from "../utils/resolveChatRoom";

type RoomPreview = {
  chatRoomId: number;
  counterpartName: string;
  lastMessage: ChatMessageHistorySearchResponse;
};

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(parseServerDate(value));

const isFromCounterpart = (message: ChatMessageHistorySearchResponse, myParticipantId: string | null) =>
  myParticipantId === null || message.sender_id !== myParticipantId;

const findLastCounterpartMessage = (
  messages: ChatMessageHistorySearchResponse[],
  myParticipantId: string | null,
): ChatMessageHistorySearchResponse | null => {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (isFromCounterpart(messages[index], myParticipantId)) return messages[index];
  }
  return null;
};

export function useChatNotifications() {
  const [previews, setPreviews] = useState<Record<number, RoomPreview>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    let isActive = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const roomsResponse = await getMyChatRooms();
        if (!isActive) return;

        const myId = getJwtSubject(accessToken);
        const rooms = roomsResponse.data.chat_rooms.map((room) => resolveChatRoom(room, myId));

        const historyResults = await Promise.allSettled(
          rooms.map((room) => getChatMessages(room.chatRoomId)),
        );
        if (!isActive) return;

        const initialPreviews: Record<number, RoomPreview> = {};
        rooms.forEach((room, index) => {
          const result = historyResults[index];
          const messages = result.status === "fulfilled" ? result.value.data.messages : [];
          const lastMessage = findLastCounterpartMessage(messages, room.myParticipantId);
          if (!lastMessage) return;

          initialPreviews[room.chatRoomId] = {
            chatRoomId: room.chatRoomId,
            counterpartName: room.counterpartName,
            lastMessage,
          };
        });
        setPreviews(initialPreviews);

        if (!WS_BASE_URL) return;

        const client = new Client({
          brokerURL: `${WS_BASE_URL}/ws/chat`,
          connectHeaders: { Authorization: `Bearer ${accessToken}` },
          onConnect: () => {
            rooms.forEach((room) => {
              client.subscribe(`/topic/chat/${room.chatRoomId}`, (frame) => {
                const message: ChatMessageHistorySearchResponse = JSON.parse(frame.body);
                if (!isFromCounterpart(message, room.myParticipantId)) return;

                setPreviews((current) => ({
                  ...current,
                  [room.chatRoomId]: {
                    chatRoomId: room.chatRoomId,
                    counterpartName: room.counterpartName,
                    lastMessage: message,
                  },
                }));
              });
            });
          },
          reconnectDelay: 3000,
        });

        client.activate();
        clientRef.current = client;
      } catch {
        if (isActive) setError("메시지를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void load();
    return () => {
      isActive = false;
      void clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, []);

  const messages: MessageItem[] = Object.values(previews)
    .sort((a, b) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime())
    .map((preview) => ({
      content: preview.lastMessage.content,
      href: `/chat?chatRoomId=${preview.chatRoomId}`,
      sender: preview.counterpartName,
      time: formatTime(preview.lastMessage.created_at),
      unread: true,
    }));

  return { error, isLoading, messages };
}

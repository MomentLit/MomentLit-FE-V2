"use client";

import { useCallback, useEffect, useState } from "react";

import { getChatMessages } from "@/apis/chat";
import type { ChatMessageHistorySearchResponse } from "@/types/chat";

import type { ChatRoom } from "./useChatRooms";
import { useChatSocket } from "./useChatSocket";

export type ChatMessage = {
  id: number;
  senderName: string;
  content: string;
  createdAt: string;
  isMine: boolean;
};

const toChatMessage = (
  message: ChatMessageHistorySearchResponse,
  myParticipantId: string | null,
): ChatMessage => ({
  content: message.content,
  createdAt: message.created_at,
  id: message.message_id,
  isMine: myParticipantId !== null && message.sender_id === myParticipantId,
  senderName: message.sender_name,
});

export function useChatMessages(room: ChatRoom | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadMessages = async () => {
      if (!room) {
        setMessages([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getChatMessages(room.chatRoomId);
        if (!isActive) return;

        setMessages(
          response.data.messages
            .map((message) => toChatMessage(message, room.myParticipantId))
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
        );
      } catch {
        if (isActive) setError("메시지를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadMessages();
    return () => {
      isActive = false;
    };
  }, [room]);

  const handleRealtimeMessage = useCallback(
    (raw: ChatMessageHistorySearchResponse) => {
      setMessages((current) => {
        if (current.some((message) => message.id === raw.message_id)) return current;
        return [...current, toChatMessage(raw, room?.myParticipantId ?? null)];
      });
    },
    [room?.myParticipantId],
  );

  const socket = useChatSocket(room?.chatRoomId ?? null, { onMessage: handleRealtimeMessage });

  return {
    error: error ?? socket.error,
    isConnected: socket.isConnected,
    isLoading,
    messages,
    sendMessage: socket.sendMessage,
  };
}

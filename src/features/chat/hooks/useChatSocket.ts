"use client";

import type { IMessage, StompSubscription } from "@stomp/stompjs";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";

import { getAccessToken } from "@/apis/auth/tokenStorage";
import { WS_BASE_URL } from "@/apis/env";
import type { ChatMessageHistorySearchResponse } from "@/types/chat";

type UseChatSocketOptions = {
  onMessage: (message: ChatMessageHistorySearchResponse) => void;
};

export function useChatSocket(chatRoomId: number | null, { onMessage }: UseChatSocketOptions) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configError = WS_BASE_URL ? null : "실시간 채팅 서버 설정이 없습니다.";

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!WS_BASE_URL) return;

    const accessToken = getAccessToken();
    if (!accessToken) return;

    const client = new Client({
      brokerURL: `${WS_BASE_URL}/ws/chat`,
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => setIsConnected(true),
      onDisconnect: () => setIsConnected(false),
      onStompError: (frame) => setError(frame.headers.message ?? "채팅 서버 연결에 실패했습니다."),
      onWebSocketError: () => setError("채팅 서버에 연결하지 못했습니다."),
      reconnectDelay: 3000,
    });

    client.activate();
    clientRef.current = client;

    return () => {
      void client.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    };
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (!client || !isConnected || !chatRoomId) return;

    const subscription = client.subscribe(`/topic/chat/${chatRoomId}`, (frame: IMessage) => {
      onMessageRef.current(JSON.parse(frame.body));
    });
    subscriptionRef.current = subscription;

    return () => {
      subscription.unsubscribe();
      subscriptionRef.current = null;
    };
  }, [chatRoomId, isConnected]);

  const sendMessage = (content: string) => {
    const client = clientRef.current;
    if (!client || !isConnected || !chatRoomId) return;

    client.publish({
      body: JSON.stringify({ content }),
      destination: `/app/chat/${chatRoomId}`,
    });
  };

  return { error: configError ?? error, isConnected, sendMessage };
}

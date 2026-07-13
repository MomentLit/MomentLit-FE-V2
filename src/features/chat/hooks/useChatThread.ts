"use client";

import { useState } from "react";

import type { ChatMessage, ChatRoom } from "@/types/chat";

import { buildMockThread } from "../data/mockMessages";

export function useChatThread(room: ChatRoom | null) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => (room ? buildMockThread(room) : []));
  const [syncedRoomId, setSyncedRoomId] = useState<number | null>(room?.matchingId ?? null);

  if ((room?.matchingId ?? null) !== syncedRoomId) {
    setSyncedRoomId(room?.matchingId ?? null);
    setMessages(room ? buildMockThread(room) : []);
  }

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || !room) return;

    setMessages((current) => [
      ...current,
      {
        content: trimmed,
        id: `me-${Date.now()}`,
        sender: "me",
        time: new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(new Date()),
      },
    ]);
  };

  return { messages, sendMessage };
}

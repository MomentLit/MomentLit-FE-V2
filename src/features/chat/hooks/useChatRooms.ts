"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getJwtSubject } from "@/apis/auth/jwt";
import { getAccessToken } from "@/apis/auth/tokenStorage";
import { getMyChatRooms } from "@/apis/chat";

import { resolveChatRoom } from "../utils/resolveChatRoom";
import type { ResolvedChatRoom } from "../utils/resolveChatRoom";

export type ChatRoom = ResolvedChatRoom;

export function useChatRooms() {
  const router = useRouter();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadRooms = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        router.replace("/login");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const roomsResponse = await getMyChatRooms();
        if (!isActive) return;

        const myId = getJwtSubject(accessToken);
        const nextRooms = roomsResponse.data.chat_rooms
          .map((room) => resolveChatRoom(room, myId))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setRooms(nextRooms);
      } catch {
        if (isActive) setError("채팅방을 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadRooms();
    return () => {
      isActive = false;
    };
  }, [router]);

  return { error, isLoading, rooms };
}

"use client";

import { useMemo, useState } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import { useChatMessages } from "../hooks/useChatMessages";
import { useChatRooms } from "../hooks/useChatRooms";
import ChatRoomList from "./ChatRoomList";
import ChatThread from "./ChatThread";

type ChatPageScreenProps = {
  initialChatRoomId?: number;
};

export default function ChatPageScreen({ initialChatRoomId }: ChatPageScreenProps) {
  const { rooms, isLoading, error } = useChatRooms();
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(initialChatRoomId ?? null);
  const [syncedRooms, setSyncedRooms] = useState(rooms);

  if (rooms !== syncedRooms) {
    setSyncedRooms(rooms);
    if (rooms.length > 0 && !rooms.some((room) => room.chatRoomId === selectedChatRoomId)) {
      setSelectedChatRoomId(rooms[0].chatRoomId);
    }
  }

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.chatRoomId === selectedChatRoomId) ?? null,
    [rooms, selectedChatRoomId],
  );
  const {
    error: messagesError,
    isConnected,
    isLoading: isMessagesLoading,
    messages,
    sendMessage,
  } = useChatMessages(selectedRoom);

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header type="landing" />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-[24px] px-[20px] py-[32px] lg:flex-row">
        <ChatRoomList
          error={error}
          isLoading={isLoading}
          onSelect={setSelectedChatRoomId}
          rooms={rooms}
          selectedChatRoomId={selectedChatRoomId}
        />
        <ChatThread
          error={messagesError}
          isConnected={isConnected}
          isLoading={isMessagesLoading}
          messages={messages}
          onSend={sendMessage}
          room={selectedRoom}
        />
      </main>
      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

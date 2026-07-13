"use client";

import { useMemo, useState } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

import { useChatRooms } from "../hooks/useChatRooms";
import { useChatThread } from "../hooks/useChatThread";
import ChatRoomList from "./ChatRoomList";
import ChatThread from "./ChatThread";

type ChatPageScreenProps = {
  initialMatchingId?: number;
};

export default function ChatPageScreen({ initialMatchingId }: ChatPageScreenProps) {
  const { rooms, isLoading, error } = useChatRooms();
  const [selectedMatchingId, setSelectedMatchingId] = useState<number | null>(initialMatchingId ?? null);
  const [syncedRooms, setSyncedRooms] = useState(rooms);

  if (rooms !== syncedRooms) {
    setSyncedRooms(rooms);
    if (rooms.length > 0 && !rooms.some((room) => room.matchingId === selectedMatchingId)) {
      setSelectedMatchingId(rooms[0].matchingId);
    }
  }

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.matchingId === selectedMatchingId) ?? null,
    [rooms, selectedMatchingId],
  );
  const { messages, sendMessage } = useChatThread(selectedRoom);

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header type="landing" />
      <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-[24px] px-[20px] py-[32px] lg:flex-row">
        <ChatRoomList
          error={error}
          isLoading={isLoading}
          onSelect={setSelectedMatchingId}
          rooms={rooms}
          selectedMatchingId={selectedMatchingId}
        />
        <ChatThread messages={messages} onSend={sendMessage} room={selectedRoom} />
      </main>
      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

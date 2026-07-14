"use client";

import { useState } from "react";

import DefaultProfile from "@/components/ui/DefaultProfile";
import type { ChatMessage } from "@/features/chat/hooks/useChatMessages";
import type { ChatRoom } from "@/features/chat/hooks/useChatRooms";
import { parseServerDate } from "@/features/chat/utils/parseServerDate";
import { cn } from "@/utils/cn";

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" }).format(parseServerDate(value));

type ChatThreadProps = {
  room: ChatRoom | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error?: string | null;
  onSend: (content: string) => void;
};

export default function ChatThread({ room, messages, isLoading, isConnected, error, onSend }: ChatThreadProps) {
  const [draft, setDraft] = useState("");

  if (!room) {
    return (
      <section className="flex min-h-[560px] flex-1 items-center justify-center rounded-[30px] bg-white p-[24px]">
        <p className="text-[15px] font-medium text-[#67728A]">왼쪽에서 대화를 선택해주세요.</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-[560px] flex-1 flex-col rounded-[30px] bg-white p-[24px]">
      <header className="flex items-center gap-[12px] border-b border-[#D0D3DB] pb-[16px]">
        <DefaultProfile className="size-[40px]" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[18px] font-bold text-[#222831]">{room.counterpartName}</h2>
          <p className="truncate text-[13px] font-medium text-[#67728A]">{room.spaceName}</p>
        </div>
        <span className={cn("shrink-0 rounded-full px-[10px] py-[4px] text-[11px] font-bold", isConnected ? "bg-[#E8F6F7] text-[#00ADB5]" : "bg-[#F1F1F1] text-[#67728A]")}>
          {isConnected ? "실시간 연결됨" : "연결 중"}
        </span>
      </header>

      <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto py-[20px]">
        {isLoading && <p className="py-[48px] text-center text-[14px] text-[#67728A]">메시지를 불러오는 중입니다.</p>}
        {!isLoading && error && <p className="py-[48px] text-center text-[14px] text-[#DA294A]">{error}</p>}
        {!isLoading && !error && messages.length === 0 && (
          <p className="py-[48px] text-center text-[14px] text-[#67728A]">아직 주고받은 메시지가 없습니다.</p>
        )}
        {!isLoading && !error && messages.map((message) => (
          <div
            className={cn("flex flex-col gap-[4px]", message.isMine ? "items-end" : "items-start")}
            key={message.id}
          >
            <p
              className={cn(
                "max-w-[360px] rounded-[16px] px-[16px] py-[10px] text-[14px] font-medium leading-[1.4]",
                message.isMine ? "bg-[#00ADB5] text-white" : "bg-[#F8FBFB] text-[#222831]",
              )}
            >
              {message.content}
            </p>
            <time className="text-[11px] font-medium text-[#99A1B1]">{formatTime(message.createdAt)}</time>
          </div>
        ))}
      </div>

      <form
        className="flex items-center gap-[12px] border-t border-[#D0D3DB] pt-[16px]"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.trim()) return;
          onSend(draft);
          setDraft("");
        }}
      >
        <label className="sr-only" htmlFor="chat-message-input">메시지 입력</label>
        <input
          className="min-w-0 flex-1 rounded-[12px] border border-[#D0D3DB] px-[16px] py-[12px] text-[14px] text-[#222831] outline-none placeholder:text-[#99A1B1] disabled:bg-[#F8FBFB]"
          disabled={!isConnected}
          id="chat-message-input"
          onChange={(event) => setDraft(event.target.value)}
          placeholder={isConnected ? "메시지를 입력해주세요." : "실시간 채팅 서버에 연결하는 중입니다."}
          value={draft}
        />
        <button
          className="h-[46px] shrink-0 rounded-[12px] bg-[#00ADB5] px-[20px] text-[14px] font-bold text-white hover:bg-[#00979E] disabled:cursor-not-allowed disabled:bg-[#D0D3DB] disabled:text-[#67728A]"
          disabled={!isConnected || !draft.trim()}
          type="submit"
        >
          전송
        </button>
      </form>
    </section>
  );
}

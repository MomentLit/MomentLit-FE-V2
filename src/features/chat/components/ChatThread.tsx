"use client";

import { useState } from "react";

import DefaultProfile from "@/components/ui/DefaultProfile";
import type { ChatMessage, ChatRoom } from "@/types/chat";
import { cn } from "@/utils/cn";

type ChatThreadProps = {
  room: ChatRoom | null;
  messages: ChatMessage[];
  onSend: (content: string) => void;
};

export default function ChatThread({ room, messages, onSend }: ChatThreadProps) {
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
        <div className="min-w-0">
          <h2 className="truncate text-[18px] font-bold text-[#222831]">{room.title}</h2>
          <p className="truncate text-[13px] font-medium text-[#67728A]">{room.subtitle}</p>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto py-[20px]">
        {messages.map((message) => (
          <div
            className={cn("flex flex-col gap-[4px]", message.sender === "me" ? "items-end" : "items-start")}
            key={message.id}
          >
            <p
              className={cn(
                "max-w-[360px] rounded-[16px] px-[16px] py-[10px] text-[14px] font-medium leading-[1.4]",
                message.sender === "me" ? "bg-[#00ADB5] text-white" : "bg-[#F8FBFB] text-[#222831]",
              )}
            >
              {message.content}
            </p>
            <time className="text-[11px] font-medium text-[#99A1B1]">{message.time}</time>
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
          className="min-w-0 flex-1 rounded-[12px] border border-[#D0D3DB] px-[16px] py-[12px] text-[14px] text-[#222831] outline-none placeholder:text-[#99A1B1]"
          id="chat-message-input"
          onChange={(event) => setDraft(event.target.value)}
          placeholder="메시지를 입력해주세요."
          value={draft}
        />
        <button
          className="h-[46px] shrink-0 rounded-[12px] bg-[#00ADB5] px-[20px] text-[14px] font-bold text-white hover:bg-[#00979E] disabled:cursor-not-allowed disabled:bg-[#D0D3DB] disabled:text-[#67728A]"
          disabled={!draft.trim()}
          type="submit"
        >
          전송
        </button>
      </form>
    </section>
  );
}

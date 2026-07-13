import type { ChatRoom } from "@/types/chat";
import { cn } from "@/utils/cn";

const statusText: Record<ChatRoom["status"], string> = {
  APPROVED: "수락됨",
  CANCELED: "취소됨",
  REJECTED: "거절됨",
  REQUESTED: "검토 대기",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(value));

type ChatRoomListProps = {
  rooms: ChatRoom[];
  selectedMatchingId: number | null;
  onSelect: (matchingId: number) => void;
  isLoading: boolean;
  error?: string | null;
};

export default function ChatRoomList({ rooms, selectedMatchingId, onSelect, isLoading, error }: ChatRoomListProps) {
  return (
    <section className="flex w-full flex-col gap-[16px] rounded-[30px] bg-white p-[20px] lg:w-[340px]">
      <h1 className="text-[24px] font-bold text-[#222831]">메시지</h1>

      {isLoading && <p className="py-[48px] text-center text-[14px] text-[#67728A]">대화 목록을 불러오는 중입니다.</p>}
      {!isLoading && error && <p className="py-[48px] text-center text-[14px] text-[#DA294A]">{error}</p>}
      {!isLoading && !error && rooms.length === 0 && (
        <p className="rounded-[12px] bg-[#F8FBFB] px-[16px] py-[48px] text-center text-[14px] text-[#67728A]">
          아직 주고받은 문의가 없습니다.
        </p>
      )}
      {!isLoading && !error && rooms.length > 0 && (
        <ul className="flex flex-col gap-[8px] overflow-y-auto">
          {rooms.map((room) => {
            const isSelected = room.matchingId === selectedMatchingId;

            return (
              <li key={room.matchingId}>
                <button
                  className={cn(
                    "flex w-full items-center gap-[12px] rounded-[12px] p-[12px] text-left transition-colors",
                    isSelected ? "bg-[#E8F6F7]" : "hover:bg-[#F8FBFB]",
                  )}
                  onClick={() => onSelect(room.matchingId)}
                  type="button"
                >
                  <span
                    className={cn(
                      "grid size-[40px] shrink-0 place-items-center rounded-full text-[15px] font-bold text-white",
                      isSelected ? "bg-[#00ADB5]" : "bg-[#D0D3DB]",
                    )}
                  >
                    {room.title[0] ?? "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-[8px]">
                      <h3 className="truncate text-[14px] font-bold text-[#222831]">{room.title}</h3>
                      <time className="shrink-0 text-[11px] font-medium text-[#99A1B1]">{formatDate(room.createdAt)}</time>
                    </div>
                    <p className="mt-[2px] truncate text-[13px] font-medium text-[#67728A]">{room.subtitle}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-[8px] py-[4px] text-[11px] font-bold",
                      room.status === "REQUESTED" ? "bg-[#E8F6F7] text-[#00ADB5]" : "bg-[#F1F1F1] text-[#67728A]",
                    )}
                  >
                    {statusText[room.status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

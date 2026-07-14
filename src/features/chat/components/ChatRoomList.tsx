import type { ChatRoom } from "@/features/chat/hooks/useChatRooms";
import { cn } from "@/utils/cn";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(value));

type ChatRoomListProps = {
  rooms: ChatRoom[];
  selectedChatRoomId: number | null;
  onSelect: (chatRoomId: number) => void;
  isLoading: boolean;
  error?: string | null;
};

export default function ChatRoomList({ rooms, selectedChatRoomId, onSelect, isLoading, error }: ChatRoomListProps) {
  return (
    <section className="flex w-full flex-col gap-[16px] rounded-[30px] bg-white p-[20px] lg:w-[340px]">
      <h1 className="text-[24px] font-bold text-[#222831]">메시지</h1>

      {isLoading && <p className="py-[48px] text-center text-[14px] text-[#67728A]">대화 목록을 불러오는 중입니다.</p>}
      {!isLoading && error && <p className="py-[48px] text-center text-[14px] text-[#DA294A]">{error}</p>}
      {!isLoading && !error && rooms.length === 0 && (
        <p className="rounded-[12px] bg-[#F8FBFB] px-[16px] py-[48px] text-center text-[14px] text-[#67728A]">
          아직 주고받은 채팅이 없습니다.
        </p>
      )}
      {!isLoading && !error && rooms.length > 0 && (
        <ul className="flex flex-col gap-[8px] overflow-y-auto">
          {rooms.map((room) => {
            const isSelected = room.chatRoomId === selectedChatRoomId;

            return (
              <li key={room.chatRoomId}>
                <button
                  className={cn(
                    "flex w-full items-center gap-[12px] rounded-[12px] p-[12px] text-left transition-colors",
                    isSelected ? "bg-[#E8F6F7]" : "hover:bg-[#F8FBFB]",
                  )}
                  onClick={() => onSelect(room.chatRoomId)}
                  type="button"
                >
                  <span
                    className={cn(
                      "grid size-[40px] shrink-0 place-items-center rounded-full text-[15px] font-bold text-white",
                      isSelected ? "bg-[#00ADB5]" : "bg-[#D0D3DB]",
                    )}
                  >
                    {room.counterpartName[0] ?? "?"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-[8px]">
                      <h3 className="truncate text-[14px] font-bold text-[#222831]">{room.counterpartName}</h3>
                      <time className="shrink-0 text-[11px] font-medium text-[#99A1B1]">{formatDate(room.createdAt)}</time>
                    </div>
                    <p className="mt-[2px] truncate text-[13px] font-medium text-[#67728A]">{room.spaceName}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

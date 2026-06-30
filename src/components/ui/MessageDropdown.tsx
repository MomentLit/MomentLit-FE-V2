import Button from "@/components/common/Button";
import { cn } from "@/utils/cn";

type MessageItem = {
  sender: string;
  content: string;
  time: string;
  unread?: boolean;
};

type MessageDropdownProps = {
  items?: MessageItem[];
  className?: string;
};

const defaultItems: MessageItem[] = [
  { sender: "브랜드 팀", content: "성수 아트 라운지 일정 확인 가능할까요?", time: "방금 전", unread: true },
  { sender: "호스트", content: "주말 반입 시간은 오전 10시부터 가능합니다.", time: "18분 전", unread: true },
  { sender: "운영 지원", content: "등록해주신 공간 정보 검토가 완료되었습니다.", time: "어제" },
];

export default function MessageDropdown({ items = defaultItems, className }: MessageDropdownProps) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <section className={cn("flex h-[392px] w-[336px] flex-col gap-[12px] overflow-hidden rounded-[20px] bg-white p-[16px]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#222831]">메시지</h2>
        <span className="rounded-full bg-[#E8F6F7] px-[10px] py-[6px] text-[12px] font-bold text-[#00ADB5]">미확인 {unreadCount}</span>
      </div>
      {items.map((item) => (
        <article className={cn("flex gap-[10px] rounded-[12px] p-[12px]", item.unread ? "bg-[#F8FBFB]" : "bg-white")} key={item.sender}>
          <span className={cn("grid size-[36px] shrink-0 place-items-center rounded-full text-[14px] font-bold text-white", item.unread ? "bg-[#00ADB5]" : "bg-[#D0D3DB]")}>
            {item.sender[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[8px]">
                <h3 className="text-[14px] font-bold text-[#222831]">{item.sender}</h3>
                {item.unread && <span className="size-[8px] rounded-full bg-[#00ADB5]" />}
              </div>
              <time className="text-[12px] font-medium text-[#99A1B1]">{item.time}</time>
            </div>
            <p className="mt-[4px] w-[208px] text-[13px] font-medium leading-[1.35] text-[#67728A]">{item.content}</p>
          </div>
        </article>
      ))}
      <Button className="h-[42px] w-full rounded-[12px] bg-[#222831] text-[14px] hover:bg-[#222831]" fullWidth>
        전체 메시지 보기
      </Button>
    </section>
  );
}

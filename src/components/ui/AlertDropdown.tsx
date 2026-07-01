import Button from "@/components/common/Button";
import { cn } from "@/utils/cn";

type AlertItem = {
  title: string;
  content: string;
  time: string;
  unread?: boolean;
};

type AlertDropdownProps = {
  items?: AlertItem[];
  className?: string;
};

const defaultItems: AlertItem[] = [
  { title: "매칭 요청 도착", content: "브랜드 팝업 팀이 성수 아트 라운지에 새로운 매칭 요청을 보냈어요.", time: "방금 전", unread: true },
  { title: "예약 일정 업데이트", content: "연남 포토 살롱의 예약 가능 일정이 새로 열렸어요.", time: "12분 전", unread: true },
  { title: "관리자 승인 완료", content: "등록한 공간이 승인되어 이제 검색 결과에 노출됩니다.", time: "1시간 전" },
];

export default function AlertDropdown({ items = defaultItems, className }: AlertDropdownProps) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <section className={cn("flex h-[386px] w-[336px] flex-col gap-[12px] overflow-hidden rounded-[20px] bg-white p-[16px]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#222831]">알림</h2>
        <span className="rounded-full bg-[#E8F6F7] px-[10px] py-[6px] text-[12px] font-bold text-[#00ADB5]">새 알림 {unreadCount}</span>
      </div>
      {items.map((item) => (
        <article className={cn("flex flex-col gap-[8px] rounded-[12px] p-[12px]", item.unread ? "bg-[#F8FBFB]" : "bg-white")} key={item.title}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <span className={cn("size-[8px] rounded-full", item.unread ? "bg-[#00ADB5]" : "bg-[#D0D3DB]")} />
              <h3 className="text-[14px] font-bold text-[#222831]">{item.title}</h3>
            </div>
            <time className="text-[12px] font-medium text-[#99A1B1]">{item.time}</time>
          </div>
          <p className="w-[280px] text-[13px] font-medium leading-[1.35] text-[#67728A]">{item.content}</p>
        </article>
      ))}
      <Button className="h-[42px] w-full rounded-[12px] bg-[#222831] text-[14px] hover:bg-[#222831]" fullWidth size="custom">
        전체 알림 보기
      </Button>
    </section>
  );
}

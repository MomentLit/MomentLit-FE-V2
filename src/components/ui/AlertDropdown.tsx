import Button from "@/components/common/Button";
import { cn } from "@/utils/cn";

export type AlertItem = {
  title: string;
  content: string;
  time: string;
  unread?: boolean;
};

type AlertDropdownProps = {
  items?: AlertItem[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
};

export default function AlertDropdown({ items = [], isLoading = false, error, className }: AlertDropdownProps) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <section className={cn("flex h-[386px] w-[336px] flex-col gap-[12px] overflow-hidden rounded-[20px] bg-white p-[16px]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#222831]">알림</h2>
        <span className="rounded-full bg-[#E8F6F7] px-[10px] py-[6px] text-[12px] font-bold text-[#00ADB5]">새 알림 {unreadCount}</span>
      </div>
      {isLoading && <p className="grid flex-1 place-items-center text-[14px] text-[#67728A]">알림을 불러오는 중입니다.</p>}
      {!isLoading && error && <p className="grid flex-1 place-items-center text-center text-[14px] text-[#DA294A]">{error}</p>}
      {!isLoading && !error && items.length === 0 && (
        <p className="grid flex-1 place-items-center text-[14px] text-[#67728A]">새 알림이 없습니다.</p>
      )}
      {!isLoading && !error && items.map((item) => (
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
      <Button className="h-[42px] w-full rounded-[12px] bg-[#222831] text-[14px] hover:bg-[#222831]" disabled={isLoading} fullWidth size="custom">
        전체 알림 보기
      </Button>
    </section>
  );
}

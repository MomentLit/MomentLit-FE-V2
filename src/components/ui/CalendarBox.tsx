import { cn } from "@/utils/cn";

type CalendarBoxProps = {
  year?: number;
  month?: number;
  selectedDays?: number[];
  mutedDays?: number[];
  className?: string;
};

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const days = Array.from({ length: 31 }, (_, index) => index + 1);

export default function CalendarBox({
  year = 2026,
  month = 5,
  selectedDays = [2, 9, 12, 16, 22, 25, 30],
  mutedDays = [1, 11, 24],
  className,
}: CalendarBoxProps) {
  return (
    <section className={cn("flex w-[400px] flex-col gap-[9px] rounded-[20px] bg-[#F8FBFB] p-[16px]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#222831]">
          {year}년 {month}월
        </h2>
        <div className="flex gap-[8px]">
          <button className="rounded-full bg-white px-[11px] py-[7px] text-[14px] font-bold text-[#67728A]" type="button">
            &lt;
          </button>
          <button className="rounded-full bg-white px-[11px] py-[7px] text-[14px] font-bold text-[#67728A]" type="button">
            &gt;
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-[9px]">
        {weekdays.map((weekday) => (
          <div className="grid h-[18px] place-items-center text-[10px] font-bold text-[#7C8799]" key={weekday}>
            {weekday}
          </div>
        ))}
        {days.map((day) => {
          const selected = selectedDays.includes(day);
          const muted = mutedDays.includes(day);

          return (
            <button
              className={cn(
                "grid h-[40px] w-full max-w-[41px] place-items-center justify-self-center rounded-[13px] text-[13px] font-semibold",
                selected && "bg-[#E8F6F7] font-bold text-[#008992]",
                muted && !selected && "bg-[#F3F7F7] text-[#8A94A6]",
                !selected && !muted && "bg-white text-[#222831]",
              )}
              key={day}
              type="button"
            >
              {day}
            </button>
          );
        })}
        {Array.from({ length: 4 }, (_, index) => (
          <span className="h-[40px] w-full max-w-[41px] justify-self-center" key={`empty-${index}`} />
        ))}
      </div>
    </section>
  );
}

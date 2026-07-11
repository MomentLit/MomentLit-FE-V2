import { cn } from "@/utils/cn";

type CalendarBoxProps = {
  year?: number;
  month?: number;
  selectedDays?: number[];
  mutedDays?: number[];
  className?: string;
};

const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function CalendarBox({
  year,
  month,
  selectedDays = [],
  mutedDays = [],
  className,
}: CalendarBoxProps) {
  const today = new Date();
  const calendarYear = year ?? today.getFullYear();
  const calendarMonth = month ?? today.getMonth() + 1;
  const firstDay = new Date(calendarYear, calendarMonth - 1, 1).getDay();
  const leadingEmptyDays = (firstDay + 6) % 7;
  const daysInMonth = new Date(calendarYear, calendarMonth, 0).getDate();
  const trailingEmptyDays = (7 - ((leadingEmptyDays + daysInMonth) % 7)) % 7;
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  return (
    <section className={cn("flex w-[400px] flex-col gap-[9px] rounded-[20px] bg-[#F8FBFB] p-[16px]", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-[#222831]">
          {calendarYear}년 {calendarMonth}월
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
        {Array.from({ length: leadingEmptyDays }, (_, index) => (
          <span className="h-[40px] w-full max-w-[41px] justify-self-center" key={`leading-empty-${index}`} />
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
        {Array.from({ length: trailingEmptyDays }, (_, index) => (
          <span className="h-[40px] w-full max-w-[41px] justify-self-center" key={`trailing-empty-${index}`} />
        ))}
      </div>
    </section>
  );
}

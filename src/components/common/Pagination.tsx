import { cn } from "@/src/utils/cn";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  className?: string;
  onPageChange?: (page: number) => void;
};

export default function Pagination({
  currentPage = 1,
  totalPages = 8,
  className,
  onPageChange,
}: PaginationProps) {
  const pages = [1, 2, 3];

  return (
    <nav className={cn("flex h-[32px] items-center justify-center gap-[8px]", className)} aria-label="페이지네이션">
      <button
        aria-label="이전 페이지"
        className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[16px] font-bold text-[#67728A]"
        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
        type="button"
      >
        ‹
      </button>
      {pages.map((page) => (
        <button
          aria-current={currentPage === page ? "page" : undefined}
          className={cn(
            "grid size-[32px] place-items-center rounded-[10px] text-[13px] font-semibold",
            currentPage === page ? "bg-[#00ADB5] font-bold text-white" : "bg-white text-[#67728A]",
          )}
          key={page}
          onClick={() => onPageChange?.(page)}
          type="button"
        >
          {page}
        </button>
      ))}
      <span className="grid size-[32px] place-items-center text-[16px] font-semibold text-[#67728A]">…</span>
      <button
        className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[13px] font-semibold text-[#67728A]"
        onClick={() => onPageChange?.(totalPages)}
        type="button"
      >
        N
      </button>
      <button
        aria-label="다음 페이지"
        className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[16px] font-bold text-[#67728A]"
        onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
        type="button"
      >
        ›
      </button>
    </nav>
  );
}

import { cn } from "@/utils/cn";

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
  const safeTotalPages = Math.max(1, totalPages);
  const startPage = Math.max(1, Math.min(currentPage - 1, safeTotalPages - 2));
  const pages = Array.from(
    { length: Math.min(3, safeTotalPages) },
    (_, index) => startPage + index,
  );
  const showLastPage = !pages.includes(safeTotalPages);

  return (
    <nav className={cn("flex h-[32px] items-center justify-center gap-[8px]", className)} aria-label="페이지네이션">
      <button
        aria-label="이전 페이지"
        className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[16px] font-bold text-[#67728A] disabled:opacity-40"
        disabled={currentPage <= 1}
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
      {showLastPage && <span className="grid size-[32px] place-items-center text-[16px] font-semibold text-[#67728A]">…</span>}
      {showLastPage && (
        <button
          className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[13px] font-semibold text-[#67728A]"
          onClick={() => onPageChange?.(safeTotalPages)}
          type="button"
        >
          {safeTotalPages}
        </button>
      )}
      <button
        aria-label="다음 페이지"
        className="grid size-[32px] place-items-center rounded-[10px] bg-white text-[16px] font-bold text-[#67728A] disabled:opacity-40"
        disabled={currentPage >= safeTotalPages}
        onClick={() => onPageChange?.(Math.min(safeTotalPages, currentPage + 1))}
        type="button"
      >
        ›
      </button>
    </nav>
  );
}

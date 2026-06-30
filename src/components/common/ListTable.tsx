import type { ReactNode } from "react";

import { cn } from "@/utils/cn";

type ListTableProps = {
  headers?: string[];
  rows?: ReactNode[][];
  className?: string;
};

const defaultHeaders = ["팝업", "신청", "희망 공간", "요청일", "검토"];
const columnClass = ["w-[270px]", "w-[130px]", "w-[210px]", "w-[114px]", "w-[152px]"];

export default function ListTable({ headers = defaultHeaders, rows = [], className }: ListTableProps) {
  return (
    <div className={cn("w-full max-w-[876px] overflow-hidden rounded-[24px] bg-white", className)}>
      <div className="flex h-[56px] bg-[#D9F7F8] text-[16px] font-bold text-black">
        {headers.map((header, index) => (
          <div className={cn("flex items-center px-[16px]", columnClass[index])} key={header}>
            {header}
          </div>
        ))}
      </div>
      {rows.map((row, rowIndex) => (
        <div
          className={cn(
            "flex min-h-[82px] border-t border-[#D0D3DB] text-[16px] text-[#222831]",
            rowIndex === rows.length - 1 && "rounded-b-[24px]",
          )}
          key={`row-${rowIndex}`}
        >
          {row.map((cell, index) => (
            <div className={cn("flex items-center px-[16px]", columnClass[index])} key={`cell-${index}`}>
              {cell}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

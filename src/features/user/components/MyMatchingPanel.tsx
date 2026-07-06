"use client";

import { useState } from "react";

import type { MatchingListSearchResponse } from "@/types/matching";

type MyMatchingPanelProps = {
  matchings: MatchingListSearchResponse[];
  isLoading: boolean;
  error?: string | null;
  onDecision: (matchingId: number, decision: "approve" | "reject") => Promise<void>;
};

const formatCount = (value: number) => String(value).padStart(2, "0");
const formatDate = (value: string) => new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(value));

export default function MyMatchingPanel({ matchings, isLoading, error, onDecision }: MyMatchingPanelProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const requested = matchings.filter((item) => item.status === "REQUESTED").length;
  const approved = matchings.filter((item) => item.status === "APPROVED").length;

  const handleDecision = async (matchingId: number, decision: "approve" | "reject") => {
    setPendingId(matchingId);
    try {
      await onDecision(matchingId, decision);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">공간 &amp; 팝업</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {[
          ["받은 요청", matchings.length],
          ["검토 대기", requested],
          ["확정 매칭", approved],
        ].map(([label, value]) => (
          <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#F7F7F7] p-[22px]" key={label}>
            <p className="text-[14px] font-semibold text-[#5E687E]">{label}</p>
            <p className="text-[34px] font-bold text-[#222831]">{formatCount(Number(value))}</p>
          </div>
        ))}
      </div>

      {isLoading && <p className="py-[48px] text-center text-[#67728A]">매칭 요청을 불러오는 중입니다.</p>}
      {!isLoading && error && <p className="py-[48px] text-center text-[#DA294A]">{error}</p>}
      {!isLoading && !error && matchings.length === 0 && (
        <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[48px] text-center text-[14px] text-[#67728A]">받은 매칭 요청이 없습니다.</p>
      )}
      {!isLoading && !error && matchings.length > 0 && (
        <div className="overflow-x-auto rounded-[24px]">
          <table className="w-full min-w-[760px] table-fixed text-left text-[14px]">
            <thead className="h-[56px] bg-[#D9F7F8] text-[#222831]">
              <tr>
                <th className="w-[28%] px-[16px]">희망 공간</th>
                <th className="w-[24%] px-[16px]">이용 기간</th>
                <th className="w-[17%] px-[16px]">금액</th>
                <th className="w-[13%] px-[16px]">요청일</th>
                <th className="w-[18%] px-[16px]">검토</th>
              </tr>
            </thead>
            <tbody>
              {matchings.map((matching) => (
                <tr className="h-[82px] border-t border-[#D0D3DB]" key={matching.matching_id}>
                  <td className="truncate px-[16px]">{matching.address}</td>
                  <td className="px-[16px] text-[13px] text-[#67728A]">{formatDate(matching.start_time)} - {formatDate(matching.end_time)}</td>
                  <td className="px-[16px]">{matching.total_price.toLocaleString("ko-KR")}원</td>
                  <td className="px-[16px]">{formatDate(matching.created_at)}</td>
                  <td className="px-[16px]">
                    {matching.status === "REQUESTED" ? (
                      <div className="flex gap-[8px]">
                        <button className="rounded-[12px] bg-[#00ADB5] px-[14px] py-[10px] text-[12px] font-bold text-white disabled:opacity-60" disabled={pendingId === matching.matching_id} onClick={() => void handleDecision(matching.matching_id, "approve")} type="button">수락</button>
                        <button className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-bold text-[#64748B] disabled:opacity-60" disabled={pendingId === matching.matching_id} onClick={() => void handleDecision(matching.matching_id, "reject")} type="button">거절</button>
                      </div>
                    ) : (
                      <span className="font-semibold text-[#67728A]">{matching.status === "APPROVED" ? "수락됨" : "거절됨"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

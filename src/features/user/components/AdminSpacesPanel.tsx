import { useState } from "react";

import type { MatchingListSearchResponse } from "@/types/matching";

type AdminSpacesPanelProps = {
  matchings: MatchingListSearchResponse[];
  isLoading: boolean;
  error?: string | null;
  onDecision: (matchingId: number, decision: "approve" | "reject") => Promise<void>;
};

const formatCount = (value: number) => String(value).padStart(2, "0");
const formatDate = (value: string) => new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(value));
const statusText: Record<MatchingListSearchResponse["status"], string> = {
  APPROVED: "수락",
  CANCELED: "취소",
  REJECTED: "거절",
  REQUESTED: "",
};

const getMatchingSpaceLabel = (matching: MatchingListSearchResponse) =>
  matching.space_name?.trim() || matching.address?.trim() || "공간 정보 없음";
const getApplicantName = (matching: MatchingListSearchResponse) =>
  matching.applicant_name?.trim()
    || matching.requester_name?.trim()
    || matching.user_name?.trim()
    || "신청자 정보 없음";

export default function AdminSpacesPanel({
  matchings,
  isLoading,
  error,
  onDecision,
}: AdminSpacesPanelProps) {
  const [pendingMatchingId, setPendingMatchingId] = useState<number | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const pendingMatchings = matchings.filter((matching) => matching.status === "REQUESTED");
  const approvedMatchings = matchings.filter((matching) => matching.status === "APPROVED");

  const handleDecision = async (matchingId: number, decision: "approve" | "reject") => {
    setPendingMatchingId(matchingId);
    setDecisionError(null);

    try {
      await onDecision(matchingId, decision);
    } catch (requestError) {
      setDecisionError(requestError instanceof Error ? requestError.message : "매칭 요청을 처리하지 못했습니다.");
    } finally {
      setPendingMatchingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">요청된 공간</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {[
          ["받은 요청", matchings.length],
          ["검토 대기", pendingMatchings.length],
          ["확정 매칭", approvedMatchings.length],
        ].map(([label, value]) => (
          <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#F7F7F7] p-[22px]" key={label}>
            <p className="text-[14px] font-semibold text-[#5E687E]">{label}</p>
            <p className="text-[34px] font-bold text-[#222831]">{formatCount(Number(value))}</p>
          </div>
        ))}
      </div>
      {isLoading && (
        <p className="rounded-[24px] bg-[#F7F7F7] px-[24px] py-[64px] text-center text-[14px] text-[#67728A]">
              매칭 승인 요청을 불러오는 중입니다.
        </p>
      )}
      {!isLoading && error && (
        <p className="rounded-[24px] bg-[#F7F7F7] px-[24px] py-[64px] text-center text-[14px] font-semibold text-[#DA294A]">
          {error}
        </p>
      )}
      {!isLoading && !error && (
        <div className="flex flex-col gap-[16px]">
          {decisionError && (
            <p className="rounded-[12px] bg-[#F7F7F7] px-[16px] py-[12px] text-[13px] font-semibold text-[#DA294A]">
              {decisionError}
            </p>
          )}
          {matchings.length === 0 ? (
            <p className="rounded-[24px] bg-[#F7F7F7] px-[24px] py-[64px] text-center text-[14px] text-[#67728A]">
              검토할 매칭 요청이 없습니다.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-[#E0F7F8] text-[14px] font-bold text-[#222831]">
                    <th className="rounded-l-[14px] px-[18px] py-[16px]">공간</th>
                    <th className="px-[18px] py-[16px]">신청</th>
                    <th className="px-[18px] py-[16px]">공간 위치</th>
                    <th className="px-[18px] py-[16px]">요청일</th>
                    <th className="rounded-r-[14px] px-[18px] py-[16px]">검토</th>
                  </tr>
                </thead>
                <tbody>
                  {matchings.map((matching) => (
                    <tr className="border-b border-[#EEEEEE]" key={matching.matching_id}>
                      <td className="px-[18px] py-[18px] text-[14px] font-semibold text-[#222831]">{getMatchingSpaceLabel(matching)}</td>
                      <td className="px-[18px] py-[18px] text-[13px] text-[#67728A]">{getApplicantName(matching)}</td>
                      <td className="px-[18px] py-[18px] text-[13px] text-[#67728A]">{matching.address?.trim() || "공간 위치 정보 없음"}</td>
                      <td className="px-[18px] py-[18px] text-[13px] font-semibold text-[#5E687E]">{formatDate(matching.created_at)}</td>
                      <td className="px-[18px] py-[18px]">
                        {matching.status === "REQUESTED" ? (
                          <div className="flex gap-[8px]">
                            <button
                              className="rounded-[12px] bg-[#00ADB5] px-[14px] py-[10px] text-[12px] font-bold text-white disabled:opacity-60"
                              disabled={pendingMatchingId === matching.matching_id}
                              onClick={() => void handleDecision(matching.matching_id, "approve")}
                              type="button"
                            >
                              수락
                            </button>
                            <button
                              className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-bold text-[#64748B] disabled:opacity-60"
                              disabled={pendingMatchingId === matching.matching_id}
                              onClick={() => void handleDecision(matching.matching_id, "reject")}
                              type="button"
                            >
                              거절
                            </button>
                          </div>
                        ) : (
                          <span className="text-[13px] font-semibold text-[#67728A]">{statusText[matching.status]}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

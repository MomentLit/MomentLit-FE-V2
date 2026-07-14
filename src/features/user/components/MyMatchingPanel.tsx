"use client";

import { useState } from "react";

import type { MatchingListSearchResponse } from "@/types/matching";

type MyMatchingPanelProps = {
  matchings: MatchingListSearchResponse[];
  sentMatchings: MatchingListSearchResponse[];
  isLoading: boolean;
  error?: string | null;
  onDecision: (matchingId: number, decision: "approve" | "reject") => Promise<void>;
  profileName?: string;
};

const formatCount = (value: number) => String(value).padStart(2, "0");
const formatDate = (value: string) => new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(value));
const statusText: Record<MatchingListSearchResponse["status"], string> = {
  APPROVED: "수락",
  CANCELED: "",
  REJECTED: "거절",
  REQUESTED: "",
};
const getMatchingSpaceLabel = (matching: MatchingListSearchResponse) =>
  matching.space_name?.trim() || matching.address?.trim() || "공간 정보 없음";
const getApplicantName = (matching: MatchingListSearchResponse, fallbackName?: string) =>
  matching.applicant_name?.trim()
    || matching.requester_name?.trim()
    || matching.user_name?.trim()
    || fallbackName?.trim()
    || "신청자 정보 없음";
const getDesiredSpaceName = (matching: MatchingListSearchResponse) =>
  matching.desired_space_name?.trim()
    || matching.space_name?.trim()
    || matching.address?.trim()
    || "희망 공간 정보 없음";

export default function MyMatchingPanel({ matchings, sentMatchings, isLoading, error, onDecision, profileName }: MyMatchingPanelProps) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);
  const approved = [...matchings, ...sentMatchings].filter((item) => item.status === "APPROVED").length;
  const hasMatchings = matchings.length > 0 || sentMatchings.length > 0;

  const handleDecision = async (matchingId: number, decision: "approve" | "reject") => {
    setPendingId(matchingId);
    setDecisionError(null);
    try {
      await onDecision(matchingId, decision);
    } catch (requestError) {
      setDecisionError(requestError instanceof Error ? requestError.message : "매칭 요청을 처리하지 못했습니다.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">공간 매칭</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {[
          ["받은 요청", matchings.length],
          ["보낸 요청", sentMatchings.length],
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
      {!isLoading && !error && decisionError && (
        <p className="rounded-[12px] bg-[#FFF1F3] px-[20px] py-[14px] text-center text-[14px] font-semibold text-[#DA294A]">{decisionError}</p>
      )}
      {!isLoading && !error && !hasMatchings && (
        <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[48px] text-center text-[14px] text-[#67728A]">매칭 요청이 없습니다.</p>
      )}
      {!isLoading && !error && hasMatchings && (
        <div className="flex flex-col gap-[24px]">
          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[22px] font-bold text-[#222831]">받은 요청</h3>
            {matchings.length === 0 ? (
              <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[32px] text-center text-[14px] text-[#67728A]">받은 매칭 요청이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto rounded-[24px]">
                <table className="w-full min-w-[760px] table-fixed text-left text-[14px]">
                  <thead className="h-[56px] bg-[#D9F7F8] text-[#222831]">
                    <tr>
                      <th className="w-[24%] px-[16px]">공간</th>
                      <th className="w-[20%] px-[16px]">신청</th>
                      <th className="w-[24%] px-[16px]">희망 공간</th>
                      <th className="w-[14%] px-[16px]">요청일</th>
                      <th className="w-[18%] px-[16px]">검토</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchings.map((matching) => (
                      <tr className="h-[82px] border-t border-[#D0D3DB]" key={matching.matching_id}>
                        <td className="truncate px-[16px]">{getMatchingSpaceLabel(matching)}</td>
                        <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getApplicantName(matching)}</td>
                        <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getDesiredSpaceName(matching)}</td>
                        <td className="px-[16px]">{formatDate(matching.created_at)}</td>
                        <td className="px-[16px]">
                          {matching.status === "REQUESTED" ? (
                            <div className="flex gap-[8px]">
                              <button className="rounded-[12px] bg-[#00ADB5] px-[14px] py-[10px] text-[12px] font-bold text-white disabled:opacity-60" disabled={pendingId === matching.matching_id} onClick={() => void handleDecision(matching.matching_id, "approve")} type="button">수락</button>
                              <button className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-bold text-[#64748B] disabled:opacity-60" disabled={pendingId === matching.matching_id} onClick={() => void handleDecision(matching.matching_id, "reject")} type="button">거절</button>
                            </div>
                          ) : (
                            <span className="font-semibold text-[#67728A]">{statusText[matching.status]}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-[12px]">
            <h3 className="text-[22px] font-bold text-[#222831]">보낸 요청</h3>
            {sentMatchings.length === 0 ? (
              <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[32px] text-center text-[14px] text-[#67728A]">보낸 매칭 요청이 없습니다.</p>
            ) : (
              <div className="overflow-x-auto rounded-[24px]">
                <table className="w-full min-w-[760px] table-fixed text-left text-[14px]">
                  <thead className="h-[56px] bg-[#D9F7F8] text-[#222831]">
                    <tr>
                      <th className="w-[24%] px-[16px]">공간</th>
                      <th className="w-[20%] px-[16px]">신청</th>
                      <th className="w-[24%] px-[16px]">희망 공간</th>
                      <th className="w-[14%] px-[16px]">요청일</th>
                      <th className="w-[18%] px-[16px]">검토</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sentMatchings.map((matching) => (
                      <tr className="h-[82px] border-t border-[#D0D3DB]" key={matching.matching_id}>
                        <td className="truncate px-[16px]">{getMatchingSpaceLabel(matching)}</td>
                        <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getApplicantName(matching, profileName)}</td>
                        <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getDesiredSpaceName(matching)}</td>
                        <td className="px-[16px]">{formatDate(matching.created_at)}</td>
                        <td className="px-[16px] font-semibold text-[#67728A]">{statusText[matching.status]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

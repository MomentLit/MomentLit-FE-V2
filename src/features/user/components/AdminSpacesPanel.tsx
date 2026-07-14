"use client";

import { useEffect, useMemo, useState } from "react";

import { adminApproveSpace, adminRejectSpace } from "@/apis/admin";
import { getReceivedMatchings } from "@/apis/matching";
import { getSpaceDetail } from "@/apis/space";
import type { AddressResponse } from "@/types/common";
import type { MatchingListSearchResponse } from "@/types/matching";

type AdminMatchingItem = MatchingListSearchResponse & {
  resolved_address?: string;
  resolved_space_name?: string;
};

const formatCount = (value: number) => String(value).padStart(2, "0");

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
  }).format(new Date(value));

const statusText: Record<MatchingListSearchResponse["status"], string> = {
  APPROVED: "수락",
  CANCELED: "취소",
  REJECTED: "거절",
  REQUESTED: "",
};

const getAddressLabel = (address?: AddressResponse) => {
  if (!address) return "";
  return [address.sido, address.sigungu, address.road_address, address.detail_address]
    .filter(Boolean)
    .join(" ");
};

const getSpaceLabel = (matching: AdminMatchingItem) =>
  matching.space_name?.trim()
    || matching.resolved_space_name?.trim()
    || matching.desired_space_name?.trim()
    || "공간 정보 없음";

const getApplicantName = (matching: AdminMatchingItem) =>
  matching.applicant_name?.trim()
    || matching.requester_name?.trim()
    || matching.user_name?.trim()
    || "신청자 정보 없음";

const getLocationLabel = (matching: AdminMatchingItem) =>
  matching.address?.trim() || matching.resolved_address?.trim() || "공간 위치 정보 없음";

const enrichMatchings = async (
  matchings: MatchingListSearchResponse[]
): Promise<AdminMatchingItem[]> => {
  const spaceIds = Array.from(
    new Set(
      matchings
        .map((matching) => matching.space_id)
        .filter((spaceId): spaceId is number => typeof spaceId === "number")
    )
  );

  const detailResults = await Promise.allSettled(
    spaceIds.map(async (spaceId) => {
      const response = await getSpaceDetail(spaceId);
      return [spaceId, response.data] as const;
    })
  );

  const detailMap = new Map(
    detailResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value)
  );

  return matchings.map((matching) => {
    const spaceDetail = matching.space_id ? detailMap.get(matching.space_id) : undefined;
    return {
      ...matching,
      resolved_address: getAddressLabel(spaceDetail?.address),
      resolved_space_name: spaceDetail?.name,
    };
  });
};

export default function AdminSpacesPanel() {
  const [matchings, setMatchings] = useState<AdminMatchingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const stats = useMemo(
    () => [
      ["받은 요청", matchings.length],
      ["검토 대기", matchings.filter((matching) => matching.status === "REQUESTED").length],
      ["확정 매칭", matchings.filter((matching) => matching.status === "APPROVED").length],
    ],
    [matchings]
  );

  useEffect(() => {
    let isMounted = true;

    const loadMatchings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getReceivedMatchings();
        const enrichedMatchings = await enrichMatchings(response.data.matchings);
        if (isMounted) {
          setMatchings(enrichedMatchings);
        }
      } catch {
        if (isMounted) {
          setError("공간 승인 요청을 불러오지 못했습니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMatchings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdminDecision = async (matching: AdminMatchingItem, decision: "approve" | "reject") => {
    if (!matching.space_id) {
      setError("공간 식별값이 없어 요청을 처리하지 못했습니다.");
      return;
    }

    setPendingId(matching.matching_id);
    setError(null);
    try {
      if (decision === "approve") {
        await adminApproveSpace(String(matching.space_id));
      } else {
        await adminRejectSpace(String(matching.space_id));
      }

      setMatchings((current) =>
        current.map((item) =>
          item.matching_id === matching.matching_id
            ? { ...item, status: decision === "approve" ? "APPROVED" : "REJECTED" }
            : item
        )
      );
    } catch {
      setError("공간 승인 요청을 처리하지 못했습니다.");
    } finally {
      setPendingId(null);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">요청된 공간</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {stats.map(([label, value]) => (
          <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#F7F7F7] p-[22px]" key={label}>
            <p className="text-[14px] font-semibold text-[#5E687E]">{label}</p>
            <p className="text-[34px] font-bold text-[#222831]">{formatCount(Number(value))}</p>
          </div>
        ))}
      </div>

      {isLoading && (
        <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[48px] text-center text-[14px] text-[#67728A]">
          공간 승인 요청을 불러오는 중입니다.
        </p>
      )}
      {!isLoading && error && (
        <p className="rounded-[12px] bg-[#FFF1F3] px-[20px] py-[14px] text-center text-[14px] font-semibold text-[#DA294A]">
          {error}
        </p>
      )}
      {!isLoading && !error && matchings.length === 0 && (
        <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[48px] text-center text-[14px] text-[#67728A]">
          공간 승인 요청이 없습니다.
        </p>
      )}
      {!isLoading && !error && matchings.length > 0 && (
        <div className="overflow-x-auto rounded-[24px]">
          <table className="w-full min-w-[760px] table-fixed text-left text-[14px]">
            <thead className="h-[56px] bg-[#D9F7F8] text-[#222831]">
              <tr>
                <th className="w-[22%] px-[16px]">공간</th>
                <th className="w-[18%] px-[16px]">신청</th>
                <th className="w-[28%] px-[16px]">공간 위치</th>
                <th className="w-[14%] px-[16px]">요청일</th>
                <th className="w-[18%] px-[16px]">검토</th>
              </tr>
            </thead>
            <tbody>
              {matchings.map((matching) => (
                <tr className="h-[82px] border-t border-[#D0D3DB]" key={matching.matching_id}>
                  <td className="truncate px-[16px]">{getSpaceLabel(matching)}</td>
                  <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getApplicantName(matching)}</td>
                  <td className="truncate px-[16px] text-[13px] text-[#67728A]">{getLocationLabel(matching)}</td>
                  <td className="px-[16px]">{formatDate(matching.created_at)}</td>
                  <td className="px-[16px]">
                    {matching.status === "REQUESTED" ? (
                      <div className="flex gap-[8px]">
                        <button
                          className="rounded-[12px] bg-[#00ADB5] px-[14px] py-[10px] text-[12px] font-bold text-white disabled:opacity-60"
                          disabled={pendingId === matching.matching_id}
                          onClick={() => void handleAdminDecision(matching, "approve")}
                          type="button"
                        >
                          수락
                        </button>
                        <button
                          className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-bold text-[#64748B] disabled:opacity-60"
                          disabled={pendingId === matching.matching_id}
                          onClick={() => void handleAdminDecision(matching, "reject")}
                          type="button"
                        >
                          거절
                        </button>
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
    </section>
  );
}

import Link from "next/link";
import { useState } from "react";

import MarkerIcon from "@/components/ui/MarkerIcon";
import type { MatchingListSearchResponse } from "@/types/matching";
import type { MySpaceListSearchResponse } from "@/types/space";

import type { MyPopupItem } from "../hooks/useMyPageData";

type MySpacesPanelProps = {
  spaces: MySpaceListSearchResponse[];
  popups: MyPopupItem[];
  matchings: MatchingListSearchResponse[];
  isLoading: boolean;
  error?: string | null;
  onDeleteSpace: (spaceId: number) => Promise<void>;
};

const formatCount = (value: number) => String(value).padStart(2, "0");

function AssetCard({ title, address, imageUrl }: { title: string; address: string; imageUrl?: string }) {
  return (
    <article className="flex min-w-0 flex-col gap-[8px]">
      <div
        className="aspect-[270/201] w-full rounded-[12px] bg-[#EEEEEE] bg-cover bg-center"
        style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
      />
      <h3 className="truncate text-[16px] font-bold text-[#222831]">{title}</h3>
      <p className="flex min-w-0 items-center gap-[4px] text-[13px] text-[#67728A]">
        <MarkerIcon className="shrink-0 text-[#8A94A8]" />
        <span className="truncate">{address}</span>
      </p>
    </article>
  );
}

function EmptyList({ children }: { children: string }) {
  return <p className="rounded-[12px] bg-[#F7F7F7] px-[20px] py-[32px] text-center text-[14px] text-[#67728A]">{children}</p>;
}

export default function MySpacesPanel({ spaces, popups, matchings, isLoading, error, onDeleteSpace }: MySpacesPanelProps) {
  const [deletingSpaceId, setDeletingSpaceId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const activeSpaces = spaces.filter((space) => space.is_active).length;
  const newRequests = matchings.filter((matching) => matching.status === "REQUESTED").length;

  const handleDeleteSpace = async (spaceId: number) => {
    const confirmed = window.confirm("이 공간을 삭제할까요?");
    if (!confirmed) return;

    setDeletingSpaceId(spaceId);
    setDeleteError(null);

    try {
      await onDeleteSpace(spaceId);
    } catch {
      setDeleteError("공간을 삭제하지 못했습니다.");
    } finally {
      setDeletingSpaceId(null);
    }
  };

  return (
    <section className="flex flex-col gap-[24px] rounded-[30px] bg-white p-[28px]">
      <h2 className="text-[30px] font-bold text-[#222831]">등록된 공간 &amp; 팝업</h2>
      <div className="grid gap-[24px] md:grid-cols-3">
        {[
          ["운영 중 공간", activeSpaces],
          ["등록된 팝업", popups.length],
          ["새 문의", newRequests],
        ].map(([label, value]) => (
          <div className="flex flex-col gap-[8px] rounded-[24px] bg-[#F7F7F7] p-[22px]" key={label}>
            <p className="text-[14px] font-semibold text-[#5E687E]">{label}</p>
            <p className="text-[34px] font-bold text-[#222831]">{formatCount(Number(value))}</p>
          </div>
        ))}
      </div>

      {isLoading && <p className="py-[48px] text-center text-[#67728A]">공간 정보를 불러오는 중입니다.</p>}
      {!isLoading && error && <p className="py-[48px] text-center text-[#DA294A]">{error}</p>}
      {!isLoading && !error && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-[24px] font-bold text-[#222831]">공간 리스트</h3>
            <div className="flex gap-[12px]">
              <Link className="rounded-[12px] bg-[#00ADB5] px-[14px] py-[10px] text-[12px] font-semibold text-white" href="/spaces/create">새 공간 등록</Link>
            </div>
          </div>
          {deleteError && <p className="rounded-[12px] bg-[#F7F7F7] px-[16px] py-[12px] text-[13px] font-semibold text-[#DA294A]">{deleteError}</p>}
          {spaces.length === 0 ? <EmptyList>등록된 공간이 없습니다.</EmptyList> : (
            <div className="grid gap-[24px] md:grid-cols-2 xl:grid-cols-3">
              {spaces.map((space) => (
                <div className="flex min-w-0 flex-col gap-[10px]" key={space.space_id}>
                  <Link href={`/spaces/${space.space_id}`}>
                    <AssetCard address={space.address.road_address} imageUrl={space.thumbnail_url || undefined} title={space.name} />
                  </Link>
                  <div className="flex gap-[8px]">
                    <Link
                      className="flex h-[36px] flex-1 items-center justify-center rounded-[12px] bg-[#00ADB5] text-[12px] font-semibold text-white"
                      href={`/spaces/${space.space_id}/edit`}
                    >
                      수정
                    </Link>
                    <button
                      className="h-[36px] flex-1 rounded-[12px] bg-[#D0D3DB] text-[12px] font-semibold text-[#5E687E] disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={deletingSpaceId === space.space_id}
                      onClick={() => void handleDeleteSpace(space.space_id)}
                      type="button"
                    >
                      {deletingSpaceId === space.space_id ? "삭제 중" : "삭제"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-[8px]">
            <h3 className="text-[24px] font-bold text-[#222831]">팝업 리스트</h3>
            <div className="flex gap-[12px]">
              <button className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-semibold text-[#5E687E]" disabled type="button">새 팝업 등록</button>
              <button className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-semibold text-[#5E687E]" disabled type="button">팝업 관리</button>
            </div>
          </div>
          {popups.length === 0 ? <EmptyList>등록된 팝업이 없습니다.</EmptyList> : (
            <div className="grid gap-[24px] md:grid-cols-2 xl:grid-cols-3">
              {popups.map((popup) => (
                <AssetCard address={popup.address} imageUrl={popup.thumbnail_url || undefined} key={popup.popup_id} title={popup.title} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

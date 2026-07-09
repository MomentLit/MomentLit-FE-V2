import Link from "next/link";

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

export default function MySpacesPanel({ spaces, popups, matchings, isLoading, error }: MySpacesPanelProps) {
  const activeSpaces = spaces.filter((space) => space.is_active).length;
  const newRequests = matchings.filter((matching) => matching.status === "REQUESTED").length;

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
              <button className="rounded-[12px] bg-[#D0D3DB] px-[14px] py-[10px] text-[12px] font-semibold text-[#5E687E]" disabled type="button">공간 관리</button>
            </div>
          </div>
          {spaces.length === 0 ? <EmptyList>등록된 공간이 없습니다.</EmptyList> : (
            <div className="grid gap-[24px] md:grid-cols-2 xl:grid-cols-3">
              {spaces.map((space) => (
                <Link href={`/spaces/${space.space_id}`} key={space.space_id}>
                  <AssetCard address={space.address.road_address} imageUrl={space.thumbnail_url || undefined} title={space.name} />
                </Link>
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

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CalendarBox from "@/components/ui/CalendarBox";
import DefaultProfile from "@/components/ui/DefaultProfile";
import SpaceCard from "@/components/ui/SpaceCard";

import { useSpaceDetail } from "../hooks/useSpaceDetail";
import SpaceImageGallery from "./SpaceImageGallery";

type SpaceDetailPageScreenProps = {
  spaceId: number;
};

export default function SpaceDetailPageScreen({ spaceId }: SpaceDetailPageScreenProps) {
  const router = useRouter();
  const detail = useSpaceDetail(spaceId);

  if (detail.isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FBFB]">
        <Header activeNav="spaces" type="landing" />
        <main className="mx-auto min-h-[720px] max-w-[1340px] px-[20px] py-[120px] text-center text-[16px] font-medium text-[#67728A]">
          공간 정보를 불러오는 중입니다.
        </main>
        <Footer variant="mainPage" />
      </div>
    );
  }

  if (detail.error || !detail.space) {
    return (
      <div className="min-h-screen bg-[#F8FBFB]">
        <Header activeNav="spaces" type="landing" />
        <main className="mx-auto flex min-h-[720px] max-w-[1340px] flex-col items-center justify-center gap-[20px] px-[20px] text-center">
          <p className="text-[18px] font-semibold text-[#DA294A]">{detail.error ?? "공간을 찾을 수 없습니다."}</p>
          <Link className="rounded-[12px] bg-[#00ADB5] px-[20px] py-[14px] text-[16px] font-bold text-white" href="/search">
            공간 찾기로 돌아가기
          </Link>
        </main>
        <Footer variant="mainPage" />
      </div>
    );
  }

  const { space } = detail;
  const galleryImages = [space.thumbnail_url, ...space.image_urls].filter(Boolean);
  const address = [space.address.road_address, space.address.detail_address].filter(Boolean).join(" ");
  const ownerName = detail.ownerProfile?.name ?? "공간 등록자";
  const ownerDescription = detail.ownerProfile?.phone ?? detail.ownerProfile?.email ?? "문의 시 상세 정보가 제공됩니다.";

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header activeNav="spaces" type="landing" />

      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-[48px] px-[20px] py-[32px]">
        <div className="flex flex-col gap-[24px]">
          <section className="rounded-[30px] bg-white px-[32px] py-[28px]">
            <h1 className="text-[32px] font-bold text-[#222831] md:text-[42px]">{space.name}</h1>
          </section>

          <div className="flex flex-col items-start gap-[28px] xl:flex-row xl:justify-between">
            <div className="flex w-full flex-col gap-[24px] xl:w-[877px]">
              <SpaceImageGallery images={galleryImages} />

              <section className="flex flex-col gap-[18px] rounded-[28px] bg-white p-[28px]">
                <h2 className="text-[24px] font-bold text-[#00ADB5]">한눈에 보는 AI 공간 정보</h2>
                {space.ai_summary ? (
                  <p className="text-[15px] font-medium leading-[1.4] text-[#67728A]">{space.ai_summary}</p>
                ) : (
                  <p className="text-[15px] font-medium leading-[1.4] text-[#8A94A6]">AI 공간 요약을 준비 중입니다.</p>
                )}
              </section>

              <section className="flex flex-col gap-[20px] rounded-[28px] bg-white p-[28px]">
                <h2 className="text-[24px] font-bold text-[#222831]">공간 소개</h2>
                {space.description ? (
                  <p className="whitespace-pre-wrap text-[15px] font-medium leading-[1.4] text-[#67728A]">{space.description}</p>
                ) : (
                  <p className="text-[15px] font-medium text-[#8A94A6]">등록된 공간 소개가 없습니다.</p>
                )}
              </section>
            </div>

            <aside className="flex w-full flex-col gap-[20px] xl:w-[408px]">
              <section className="flex flex-col gap-[18px] rounded-[30px] bg-white p-[24px]">
                <p className="text-[30px] font-bold leading-[1.4] text-[#222831] md:text-[34px]">
                  {space.price_per_hour.toLocaleString("ko-KR")}원 / 시간
                </p>
                <dl className="flex flex-col gap-[10px] rounded-[20px] bg-[#F8FBFB] p-[18px] text-[14px] leading-[1.4]">
                  <div className="flex items-start justify-between gap-[16px]">
                    <dt className="font-bold text-[#67728A]">예약 가능</dt>
                    <dd className="text-right font-semibold text-[#222831]">{detail.scheduleSummary.range}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-[16px]">
                    <dt className="font-bold text-[#67728A]">상태</dt>
                    <dd className="font-semibold text-[#222831]">{detail.scheduleSummary.selectedDays.length ? "판매중" : "일정 확인 필요"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-[16px]">
                    <dt className="shrink-0 font-bold text-[#67728A]">주소</dt>
                    <dd className="text-right font-semibold text-[#222831]">{address || "주소 미등록"}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-[16px]">
                    <dt className="font-bold text-[#67728A]">카테고리</dt>
                    <dd className="font-semibold text-[#222831]">{space.category || "미분류"}</dd>
                  </div>
                </dl>

                {detail.isOwner && (
                  <div className="grid grid-cols-2 gap-[10px]">
                    <Link
                      className="flex h-[46px] items-center justify-center rounded-[12px] bg-[#00ADB5] text-[15px] font-bold text-white hover:bg-[#00979E]"
                      href={`/spaces/${space.space_id}/edit`}
                    >
                      수정하기
                    </Link>
                    <button
                      className="h-[46px] rounded-[12px] bg-[#D0D3DB] text-[15px] font-bold text-[#5E687E] disabled:cursor-not-allowed disabled:opacity-70"
                      disabled={detail.isDeleting}
                      onClick={async () => {
                        const confirmed = window.confirm("이 공간을 삭제할까요?");
                        if (!confirmed) return;

                        const deleted = await detail.deleteCurrentSpace();
                        if (deleted) router.push("/my?tab=spaces");
                      }}
                      type="button"
                    >
                      {detail.isDeleting ? "삭제 중" : "삭제하기"}
                    </button>
                  </div>
                )}

                {(detail.actionError || detail.actionMessage) && (
                  <p
                    className={`rounded-[12px] bg-[#F8FBFB] px-[16px] py-[12px] text-center text-[13px] font-semibold ${detail.actionError ? "text-[#DA294A]" : "text-[#00ADB5]"}`}
                    role={detail.actionError ? "alert" : "status"}
                  >
                    {detail.actionError ?? detail.actionMessage}
                  </p>
                )}

                <div className="flex flex-col gap-[10px] rounded-[20px] bg-[#F8FBFB] p-[18px]">
                  <p className="text-[13px] font-bold text-[#67728A]">공간 등록자</p>
                  <div className="flex items-center gap-[12px]">
                    <DefaultProfile className="size-[48px]" />
                    <div className="flex flex-col gap-[4px]">
                      <p className="text-[16px] font-bold text-[#222831]">{ownerName}</p>
                      <p className="text-[13px] font-medium text-[#67728A]">{ownerDescription}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-[14px] rounded-[30px] bg-white p-[20px]">
                <h2 className="text-[24px] font-bold text-[#222831]">예약 가능 일정</h2>
                <p className="text-[14px] font-medium text-[#5E687E]">사진 옆에서 바로 예약 가능 일정을 확인할 수 있어요.</p>
                <CalendarBox
                  className="max-w-full"
                  month={detail.scheduleSummary.month}
                  selectedDays={detail.scheduleSummary.selectedDays}
                  year={detail.scheduleSummary.year}
                />
                <button
                  className="flex h-[46px] w-full items-center justify-center rounded-[12px] bg-[#00ADB5] text-[15px] font-bold text-white hover:bg-[#00979E] disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={detail.isOwner || detail.isRequestingMatching}
                  onClick={async () => {
                    const matchingId = await detail.requestMatching();
                    if (!matchingId) return;

                    const chatRoomId = await detail.startChat();
                    if (chatRoomId) router.push(`/chat?chatRoomId=${chatRoomId}`);
                  }}
                  type="button"
                >
                  {detail.isRequestingMatching ? "문의 중" : "공간 문의하기"}
                </button>
              </section>
            </aside>
          </div>
        </div>

        <section className="flex flex-col gap-[18px]">
          <h2 className="text-[28px] font-bold leading-[1.4] text-[#222831]">비슷한 공간</h2>
          {detail.relatedSpaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-[28px] gap-y-[32px] sm:grid-cols-2 lg:grid-cols-4">
              {detail.relatedSpaces.map((relatedSpace) => (
                <Link href={`/spaces/${relatedSpace.space_id}`} key={relatedSpace.space_id}>
                  <SpaceCard
                    address={relatedSpace.address.road_address || relatedSpace.address.jibun_address}
                    className="w-full"
                    imageUrl={relatedSpace.thumbnail_url || undefined}
                    price={`${relatedSpace.price_per_hour.toLocaleString("ko-KR")}원`}
                    title={relatedSpace.name}
                    unit="1시간"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <p className="rounded-[20px] bg-white px-[24px] py-[48px] text-center text-[15px] font-medium text-[#67728A]">
              비슷한 공간을 준비 중입니다.
            </p>
          )}
        </section>
      </main>

      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

"use client";

import { useState } from "react";

import Button from "@/components/common/Button";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useAddressSearch } from "@/hooks/useAddressSearch";

import { useEditSpace } from "../hooks/useEditSpace";
import SpaceImageGallery from "./SpaceImageGallery";

const fieldClassName = "min-h-[43px] w-full rounded-[12px] bg-[#F7F7F7] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:ring-2 focus:ring-[#00ADB5]/30";

type SpaceEditPageScreenProps = {
  spaceId: number;
};

export default function SpaceEditPageScreen({ spaceId }: SpaceEditPageScreenProps) {
  const spaceForm = useEditSpace(spaceId);
  const addressSearch = useAddressSearch();
  const [addressError, setAddressError] = useState<string | null>(null);
  const galleryImages = spaceForm.space
    ? [spaceForm.space.thumbnail_url, ...spaceForm.space.image_urls].filter(Boolean)
    : [];

  const handleAddressSearch = () => {
    void addressSearch.open(
      (result) => {
        setAddressError(null);
        spaceForm.setAddress(result);
      },
      (message) => setAddressError(message),
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header activeNav={null} type="landing" />

      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-[24px] px-[20px] py-[32px]">
        <section className="flex flex-col items-start justify-between gap-[16px] rounded-[30px] bg-white px-[32px] py-[28px] sm:flex-row sm:items-center">
          <h1 className="text-[32px] font-bold text-[#222831] md:text-[42px]">공간 수정</h1>
          <Button
            className="h-[53px] w-[140px] self-end md:w-[180px]"
            disabled={spaceForm.isLoading || spaceForm.isSubmitting}
            form="space-edit-form"
            size="custom"
            type="submit"
          >
            {spaceForm.isSubmitting ? "수정 중" : "수정하기"}
          </Button>
        </section>

        {spaceForm.isLoading && (
          <p className="rounded-[30px] bg-white px-[28px] py-[120px] text-center text-[16px] font-medium text-[#67728A]">
            공간 정보를 불러오는 중입니다.
          </p>
        )}

        {!spaceForm.isLoading && !spaceForm.space && (
          <p className="rounded-[30px] bg-white px-[28px] py-[80px] text-center text-[16px] font-semibold text-[#DA294A]" role="alert">
            {spaceForm.error ?? "공간 정보를 불러오지 못했습니다."}
          </p>
        )}

        {!spaceForm.isLoading && spaceForm.space && (
          <form
            className="flex flex-col gap-[24px]"
            id="space-edit-form"
            onSubmit={(event) => {
              event.preventDefault();
              void spaceForm.submit();
            }}
          >
            <div className="flex flex-col items-start gap-[24px] rounded-[30px] p-[12px] lg:flex-row lg:justify-between lg:p-[28px]">
              <SpaceImageGallery className="lg:w-[816px]" images={galleryImages} />

              <section className="flex w-full flex-col gap-[22px] rounded-[28px] bg-white p-[20px] lg:w-[440px]">
                <div>
                  <h2 className="text-[24px] font-bold text-[#222831]">상세 정보</h2>
                  <p className="mt-[4px] text-[14px] font-medium text-[#5E687E]">수정할 공간 정보를 입력해주세요.</p>
                </div>

                <label className="flex flex-col gap-[4px] text-[16px] font-medium text-[#222831]">
                  시간 당 가격(원)
                  <input
                    className={fieldClassName}
                    inputMode="numeric"
                    min="1"
                    onChange={(event) => spaceForm.setField("pricePerHour", event.target.value)}
                    required
                    type="number"
                    value={spaceForm.form.pricePerHour}
                  />
                </label>

                <fieldset className="flex flex-col gap-[4px]">
                  <legend className="mb-[4px] text-[16px] font-medium text-[#222831]">주소</legend>
                  <div className="flex gap-[4px]">
                    <input
                      aria-label="우편 번호"
                      className={fieldClassName}
                      placeholder="우편 번호"
                      readOnly
                      value={spaceForm.form.postalCode}
                    />
                    <button
                      className="h-[43px] w-[146px] shrink-0 rounded-[12px] bg-[#00ADB5] text-[16px] font-bold text-white hover:bg-[#00979E]"
                      onClick={handleAddressSearch}
                      type="button"
                    >
                      주소 검색
                    </button>
                  </div>
                  <input
                    className={fieldClassName}
                    placeholder="주소 검색을 통해 입력해주세요"
                    readOnly
                    required
                    value={spaceForm.form.roadAddress}
                  />
                  <input
                    className={fieldClassName}
                    onChange={(event) => spaceForm.setField("detailAddress", event.target.value)}
                    placeholder="상세 주소"
                    value={spaceForm.form.detailAddress}
                  />
                  {addressError && (
                    <p className="text-[13px] font-semibold text-[#DA294A]">{addressError}</p>
                  )}
                </fieldset>

                <label className="flex flex-col gap-[4px] text-[16px] font-medium text-[#222831]">
                  카테고리
                  <span className="relative">
                    <select
                      className={`${fieldClassName} appearance-none pr-[40px] text-[#67728A]`}
                      onChange={(event) => spaceForm.setField("category", event.target.value)}
                      required
                      value={spaceForm.form.category}
                    >
                      <option value="">카테고리 선택</option>
                      <option value="CAFE">카페</option>
                      <option value="POPUP_STORE">쇼룸</option>
                      <option value="STUDIO">스튜디오</option>
                      <option value="PRACTICE_ROOM">연습실</option>
                      <option value="OTHER">기타</option>
                    </select>
                    <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 rotate-90 text-[#67728A]">›</span>
                  </span>
                </label>
              </section>
            </div>

            <section className="flex flex-col gap-[14px] rounded-[30px] bg-white px-[32px] py-[28px]">
              <label className="text-[28px] font-bold text-[#222831]" htmlFor="space-name">제목</label>
              <input
                className={fieldClassName}
                id="space-name"
                maxLength={100}
                onChange={(event) => spaceForm.setField("name", event.target.value)}
                required
                value={spaceForm.form.name}
              />
            </section>

            <section className="flex flex-col gap-[14px] rounded-[30px] bg-white p-[28px]">
              <label className="text-[28px] font-bold text-[#222831]" htmlFor="space-description">공간 소개</label>
              <textarea
                className={`${fieldClassName} min-h-[335px] resize-y`}
                id="space-description"
                maxLength={2000}
                onChange={(event) => spaceForm.setField("description", event.target.value)}
                value={spaceForm.form.description}
              />
            </section>

            {spaceForm.error && (
              <p className="rounded-[12px] bg-white px-[20px] py-[16px] text-center text-[14px] font-semibold text-[#DA294A]" role="alert">
                {spaceForm.error}
              </p>
            )}
          </form>
        )}
      </main>

      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

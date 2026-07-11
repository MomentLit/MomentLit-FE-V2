"use client";

import { useMemo } from "react";

import Button from "@/components/common/Button";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CalendarBox from "@/components/ui/CalendarBox";

import { useCreateSpace } from "../hooks/useCreateSpace";
import SpaceImageGallery from "./SpaceImageGallery";

const fieldClassName = "min-h-[43px] w-full rounded-[12px] bg-[#F7F7F7] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:ring-2 focus:ring-[#00ADB5]/30";

const parseDateInput = (value: string) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function SpaceCreatePageScreen() {
  const spaceForm = useCreateSpace();
  const calendar = useMemo(() => {
    const today = new Date();
    const startDate = parseDateInput(spaceForm.form.startDate);
    const endDate = parseDateInput(spaceForm.form.endDate);
    const baseDate = startDate ?? endDate ?? today;
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth() + 1;
    const selectedDays: number[] = [];

    if (startDate && startDate.getFullYear() === year && startDate.getMonth() + 1 === month) {
      const rangeEnd = endDate && endDate >= startDate ? endDate : startDate;
      const lastDay = new Date(year, month, 0).getDate();
      const endDay = rangeEnd.getFullYear() === year && rangeEnd.getMonth() + 1 === month
        ? rangeEnd.getDate()
        : lastDay;

      for (let day = startDate.getDate(); day <= endDay; day += 1) {
        selectedDays.push(day);
      }
    }

    return { month, selectedDays, year };
  }, [spaceForm.form.endDate, spaceForm.form.startDate]);

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header activeNav={null} type="landing" />

      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-[24px] px-[20px] py-[32px]">
        <section className="flex flex-col items-start justify-between gap-[16px] rounded-[30px] bg-white px-[32px] py-[28px] sm:flex-row sm:items-center">
          <h1 className="text-[32px] font-bold text-[#222831] md:text-[42px]">공간 등록 글 작성</h1>
          <Button
            className="h-[53px] w-[140px] self-end md:w-[180px]"
            disabled={spaceForm.isSubmitting}
            form="space-create-form"
            size="custom"
            type="submit"
          >
            {spaceForm.isSubmitting ? "등록 중" : "등록하기"}
          </Button>
        </section>

        <form
          className="flex flex-col gap-[24px]"
          id="space-create-form"
          onSubmit={(event) => {
            event.preventDefault();
            void spaceForm.submit();
          }}
        >
          <div className="flex flex-col items-start gap-[24px] rounded-[30px] p-[12px] lg:flex-row lg:justify-between lg:p-[28px]">
            <SpaceImageGallery
              className="lg:w-[816px]"
              editable
              images={spaceForm.imageUrls}
              onAddImages={(files) => void spaceForm.addImages(files)}
              onRemoveImage={spaceForm.removeImage}
            />

            <section className="flex w-full flex-col gap-[22px] rounded-[28px] bg-white p-[20px] lg:w-[440px]">
              <div>
                <h2 className="text-[24px] font-bold text-[#222831]">상세 정보</h2>
                <p className="mt-[4px] text-[14px] font-medium text-[#5E687E]">이 공간에 대한 정보를 상세히 적어주세요!</p>
              </div>

              <label className="flex flex-col gap-[4px] text-[16px] font-medium text-[#222831]">
                시간 당 가격(원)
                <input
                  className={fieldClassName}
                  inputMode="numeric"
                  min="1"
                  onChange={(event) => spaceForm.setField("pricePerHour", event.target.value)}
                  placeholder="예) 50000"
                  required
                  type="number"
                  value={spaceForm.form.pricePerHour}
                />
              </label>

              <fieldset className="flex flex-col gap-[4px]">
                <legend className="mb-[4px] text-[16px] font-medium text-[#222831]">예약 가능 일자</legend>
                <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <input
                    aria-label="예약 시작일"
                    className={fieldClassName}
                    onChange={(event) => spaceForm.setField("startDate", event.target.value)}
                    type="date"
                    value={spaceForm.form.startDate}
                  />
                  <input
                    aria-label="예약 종료일"
                    className={fieldClassName}
                    min={spaceForm.form.startDate || undefined}
                    onChange={(event) => spaceForm.setField("endDate", event.target.value)}
                    type="date"
                    value={spaceForm.form.endDate}
                  />
                </div>
              </fieldset>

              <CalendarBox
                className="max-w-full self-center"
                month={calendar.month}
                selectedDays={calendar.selectedDays}
                year={calendar.year}
              />

              <fieldset className="flex flex-col gap-[4px]">
                <legend className="mb-[4px] text-[16px] font-medium text-[#222831]">주소</legend>
                <div className="flex gap-[4px]">
                  <input
                    aria-label="우편 번호"
                    className={fieldClassName}
                    onChange={(event) => spaceForm.setField("postalCode", event.target.value)}
                    placeholder="우편 번호"
                    value={spaceForm.form.postalCode}
                  />
                  <button
                    className="h-[43px] w-[146px] shrink-0 rounded-[12px] bg-[#00ADB5] text-[16px] font-bold text-white hover:bg-[#00979E]"
                    onClick={() => document.getElementById("space-road-address")?.focus()}
                    type="button"
                  >
                    주소 입력
                  </button>
                </div>
                <input
                  className={fieldClassName}
                  id="space-road-address"
                  onChange={(event) => spaceForm.setField("roadAddress", event.target.value)}
                  placeholder="도로명 주소"
                  required
                  value={spaceForm.form.roadAddress}
                />
                <input
                  className={fieldClassName}
                  onChange={(event) => spaceForm.setField("detailAddress", event.target.value)}
                  placeholder="상세 주소"
                  value={spaceForm.form.detailAddress}
                />
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
              placeholder="예) 성수 브랜드 팝업 전용 쇼룸"
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
              placeholder="공간의 특징과 활용 방법을 자세히 적어주세요."
              value={spaceForm.form.description}
            />
          </section>

          {spaceForm.error && (
            <p className="rounded-[12px] bg-white px-[20px] py-[16px] text-center text-[14px] font-semibold text-[#DA294A]" role="alert">
              {spaceForm.error}
            </p>
          )}
        </form>
      </main>

      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

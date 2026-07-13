"use client";

import { useMemo } from "react";

import Button from "@/components/common/Button";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import CalendarBox from "@/components/ui/CalendarBox";
import SpaceImageGallery from "@/features/space/components/SpaceImageGallery";

import { useCreatePopup } from "../hooks/useCreatePopup";

const fieldClassName = "min-h-[43px] w-full rounded-[12px] bg-[#F7F7F7] px-[14px] py-[12px] text-[16px] font-medium text-[#222831] outline-none placeholder:text-[#67728A] focus:ring-2 focus:ring-[#00ADB5]/30";

const parseDateInput = (value: string) => {
  if (!value) return null;

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

type PopupCreatePageScreenProps = {
  matchingId: number | null;
};

export default function PopupCreatePageScreen({ matchingId }: PopupCreatePageScreenProps) {
  const popupForm = useCreatePopup(matchingId);

  const calendar = useMemo(() => {
    const today = new Date();
    const startDate = parseDateInput(popupForm.form.startDate);
    const endDate = parseDateInput(popupForm.form.endDate);
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
  }, [popupForm.form.endDate, popupForm.form.startDate]);

  return (
    <div className="min-h-screen bg-[#F8FBFB]">
      <Header activeNav={null} type="landing" />

      <main className="mx-auto flex w-full max-w-[1380px] flex-col gap-[24px] px-[20px] py-[32px]">
        <section className="flex flex-col items-start justify-between gap-[16px] rounded-[30px] bg-white px-[32px] py-[28px] sm:flex-row sm:items-center">
          <h1 className="text-[32px] font-bold text-[#222831] md:text-[42px]">팝업 등록 글 작성</h1>
          <Button
            className="h-[53px] w-[140px] self-end md:w-[180px]"
            disabled={popupForm.isSubmitting}
            form="popup-create-form"
            size="custom"
            type="submit"
          >
            {popupForm.isSubmitting ? "등록 중" : "등록하기"}
          </Button>
        </section>

        <form
          className="flex flex-col gap-[24px]"
          id="popup-create-form"
          onSubmit={(event) => {
            event.preventDefault();
            void popupForm.submit();
          }}
        >
          <div className="flex flex-col items-start gap-[24px] rounded-[30px] p-[12px] lg:flex-row lg:justify-between lg:p-[28px]">
            <SpaceImageGallery
              className="lg:w-[816px]"
              editable
              images={popupForm.imageUrls}
              onAddImages={(files) => void popupForm.addImages(files)}
              onRemoveImage={popupForm.removeImage}
            />

            <section className="flex w-full flex-col gap-[22px] rounded-[28px] bg-white p-[20px] lg:w-[440px]">
              <div>
                <h2 className="text-[24px] font-bold text-[#222831]">상세 정보</h2>
                <p className="mt-[4px] text-[14px] font-medium text-[#5E687E]">이 팝업에 대한 정보를 상세히 적어주세요!</p>
              </div>

              <fieldset className="flex flex-col gap-[4px]">
                <legend className="mb-[4px] text-[16px] font-medium text-[#222831]">예약 가능 일자</legend>
                <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <input
                    aria-label="팝업 시작일"
                    className={fieldClassName}
                    onChange={(event) => popupForm.setField("startDate", event.target.value)}
                    required
                    type="date"
                    value={popupForm.form.startDate}
                  />
                  <input
                    aria-label="팝업 종료일"
                    className={fieldClassName}
                    min={popupForm.form.startDate || undefined}
                    onChange={(event) => popupForm.setField("endDate", event.target.value)}
                    required
                    type="date"
                    value={popupForm.form.endDate}
                  />
                </div>
              </fieldset>

              <CalendarBox
                className="max-w-full self-center"
                month={calendar.month}
                selectedDays={calendar.selectedDays}
                year={calendar.year}
              />
            </section>
          </div>

          <section className="flex flex-col gap-[14px] rounded-[30px] bg-white px-[32px] py-[28px]">
            <label className="text-[28px] font-bold text-[#222831]" htmlFor="popup-title">제목</label>
            <input
              className={fieldClassName}
              id="popup-title"
              maxLength={100}
              onChange={(event) => popupForm.setField("title", event.target.value)}
              placeholder="예) 성수 브랜드 팝업 쇼룸"
              required
              value={popupForm.form.title}
            />
          </section>

          <section className="flex flex-col gap-[14px] rounded-[30px] bg-white p-[28px]">
            <label className="text-[28px] font-bold text-[#222831]" htmlFor="popup-description">팝업 소개</label>
            <textarea
              className={`${fieldClassName} min-h-[335px] resize-y`}
              id="popup-description"
              maxLength={2000}
              onChange={(event) => popupForm.setField("description", event.target.value)}
              placeholder="팝업의 목적과 운영 내용을 자세히 적어주세요."
              required
              value={popupForm.form.description}
            />
          </section>

          {popupForm.error && (
            <p className="rounded-[12px] bg-white px-[20px] py-[16px] text-center text-[14px] font-semibold text-[#DA294A]" role="alert">
              {popupForm.error}
            </p>
          )}
        </form>
      </main>

      <Footer className="mt-[32px]" variant="mainPage" />
    </div>
  );
}

"use client";

import { useState } from "react";

import { cn } from "@/utils/cn";

type SpaceImageGalleryProps = {
  images: string[];
  editable?: boolean;
  onAddImages?: (files: FileList | null) => void;
  onRemoveImage?: (index: number) => void;
  className?: string;
};

const imageStyle = (url?: string) => url
  ? { backgroundImage: `url(${JSON.stringify(url).slice(1, -1)})` }
  : undefined;

export default function SpaceImageGallery({
  images,
  editable = false,
  onAddImages,
  onRemoveImage,
  className,
}: SpaceImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const safeActiveIndex = activeIndex < images.length
    ? activeIndex
    : Math.max(0, images.length - 1);
  const activeImage = images[safeActiveIndex];

  return (
    <section className={cn("flex w-full flex-col gap-[16px] rounded-[24px] bg-white p-[28px]", className)}>
      <div
        className={cn(
          "relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-[28px] bg-[#E6F7F8] bg-cover bg-center",
          activeImage && "bg-[#F7F7F7]",
        )}
        style={imageStyle(activeImage)}
      >
        {!activeImage && editable && (
          <label className="flex size-full cursor-pointer flex-col items-center justify-center gap-[10px] text-center">
            <span className="text-[54px] font-light leading-none text-[#00ADB5]">+</span>
            <span className="text-[24px] font-bold text-[#222831]">사진</span>
            <span className="text-[15px] font-medium text-[#5E687E]">첫 사진이 대표 이미지로 보여집니다</span>
            <input
              accept="image/*"
              className="sr-only"
              multiple
              onChange={(event) => onAddImages?.(event.target.files)}
              type="file"
            />
          </label>
        )}
        {!activeImage && !editable && (
          <p className="text-[15px] font-medium text-[#8A94A6]">등록된 공간 이미지가 없습니다.</p>
        )}
        {activeImage && editable && (
          <button
            aria-label="현재 이미지 삭제"
            className="absolute right-[14px] top-[14px] grid size-[36px] place-items-center rounded-full bg-white/90 text-[20px] font-bold text-[#5E687E]"
            onClick={() => onRemoveImage?.(safeActiveIndex)}
            type="button"
          >
            ×
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-[12px]">
        {Array.from({ length: 4 }, (_, index) => {
          const imageIndex = index + 1;
          const image = images[imageIndex];

          if (!image && editable && images.length < 5) {
            return (
              <label
                className="grid h-[122px] cursor-pointer place-items-center rounded-[20px] bg-[#F7F7F7] text-[14px] font-semibold text-[#8A94A6]"
                key={imageIndex}
              >
                추가 사진
                <input
                  accept="image/*"
                  className="sr-only"
                  multiple
                  onChange={(event) => onAddImages?.(event.target.files)}
                  type="file"
                />
              </label>
            );
          }

          return (
            <button
              aria-label={image ? `${imageIndex + 1}번 이미지 보기` : "빈 이미지"}
              className={cn(
                "h-[122px] rounded-[20px] bg-[#F7F7F7] bg-cover bg-center",
                imageIndex === safeActiveIndex && image && "ring-2 ring-[#00ADB5]",
              )}
              disabled={!image}
              key={imageIndex}
              onClick={() => setActiveIndex(imageIndex)}
              style={imageStyle(image)}
              type="button"
            />
          );
        })}
      </div>

      {editable && images.length > 0 && images.length < 5 && (
        <label className="self-start text-[13px] font-semibold text-[#00ADB5]">
          + 사진 추가
          <input
            accept="image/*"
            className="sr-only"
            multiple
            onChange={(event) => onAddImages?.(event.target.files)}
            type="file"
          />
        </label>
      )}
    </section>
  );
}

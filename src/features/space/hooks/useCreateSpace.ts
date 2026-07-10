"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadImage } from "@/apis/image";
import { createSchedule } from "@/apis/schedule";
import { createSpace } from "@/apis/space";
import { getMyProfile } from "@/apis/user";
import type { AddressRequest } from "@/types/common";

export type SpaceCreateForm = {
  name: string;
  description: string;
  pricePerHour: string;
  startDate: string;
  endDate: string;
  postalCode: string;
  roadAddress: string;
  detailAddress: string;
  category: string;
};

const initialForm: SpaceCreateForm = {
  name: "",
  description: "",
  pricePerHour: "",
  startDate: "",
  endDate: "",
  postalCode: "",
  roadAddress: "",
  detailAddress: "",
  category: "",
};

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const splitRoadAddress = (roadAddress: string) => {
  const [sido = "", sigungu = "", eupMyeonDong = ""] = roadAddress.trim().split(/\s+/);
  return { eupMyeonDong, sido, sigungu };
};

const buildAddressRequest = (form: SpaceCreateForm): AddressRequest => {
  const { eupMyeonDong, sido, sigungu } = splitRoadAddress(form.roadAddress);
  const address: AddressRequest = {
    sido,
    sigungu,
    road_address: form.roadAddress.trim(),
  };

  if (eupMyeonDong) address.eup_myeon_dong = eupMyeonDong;
  if (form.detailAddress.trim()) address.detail_address = form.detailAddress.trim();
  if (form.postalCode.trim()) address.postal_code = form.postalCode.trim();

  return address;
};

const FALLBACK_THUMBNAIL_URL = "https://placehold.co/800x600?text=MomentLit";

const isSpaceImageSource = (value: string) => /^https?:\/\//.test(value);

const getSpaceImageUrls = (imageUrls: string[]) => imageUrls.filter(isSpaceImageSource);

const uploadSpaceImages = async (imageFiles: (File | null)[]) => {
  const uploadedUrls = await Promise.all(
    imageFiles.map((file) => file ? uploadImage(file).then((response) => response.data.image_url) : Promise.resolve(null)),
  );

  return uploadedUrls.filter((url): url is string => Boolean(url));
};

const hasLocalImagePreview = (imageUrls: string[]) => imageUrls.some((url) => url.startsWith("data:image/"));

const toSpaceCategoryRequestValue = (category: string) => {
  const categoryMap: Record<string, string> = {
    "기타": "OTHER",
    "쇼룸": "POPUP_STORE",
    "스튜디오": "STUDIO",
    "연습실": "PRACTICE_ROOM",
    "카페": "CAFE",
  };

  return categoryMap[category] ?? category;
};

const getSpaceId = (response: Awaited<ReturnType<typeof createSpace>>) => {
  const data = response.data as { space_id?: number; id?: number };
  return data.space_id ?? data.id;
};

export function useCreateSpace() {
  const router = useRouter();
  const [form, setForm] = useState<SpaceCreateForm>(initialForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getMyProfile()
      .then((response) => {
        if (isActive) setPhone(response.data.phone ?? "");
      })
      .catch(() => undefined);

    return () => {
      isActive = false;
    };
  }, []);

  const setField = useCallback(<K extends keyof SpaceCreateForm>(key: K, value: SpaceCreateForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const addImages = useCallback(async (files: FileList | null) => {
    if (!files?.length) return;

    try {
      const remainingCount = Math.max(0, 5 - imageUrls.length);
      const selectedFiles = Array.from(files).slice(0, remainingCount);
      const nextImages = await Promise.all(selectedFiles.map(readFileAsDataUrl));
      setImageUrls((current) => [...current, ...nextImages].slice(0, 5));
      setImageFiles((current) => [...current, ...selectedFiles].slice(0, 5));
      setError(null);
    } catch {
      setError("이미지를 불러오지 못했습니다.");
    }
  }, [imageUrls.length]);

  const removeImage = useCallback((index: number) => {
    setImageUrls((current) => current.filter((_, imageIndex) => imageIndex !== index));
    setImageFiles((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }, []);

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    const pricePerHour = Number(form.pricePerHour);
    if (!form.name.trim() || !form.roadAddress.trim() || !form.category || !Number.isFinite(pricePerHour) || pricePerHour <= 0) {
      setError("제목, 시간당 가격, 주소, 카테고리를 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let submitPhone = phone.trim();
      if (!submitPhone) {
        const profileResponse = await getMyProfile();
        submitPhone = profileResponse.data.phone?.trim() ?? "";
        setPhone(submitPhone);
      }

      if (!submitPhone) {
        setError("공간 등록을 위해 전화번호가 필요합니다. 마이페이지에서 전화번호를 등록해주세요.");
        return;
      }

      const uploadedImageUrls = await uploadSpaceImages(imageFiles);
      if (hasLocalImagePreview(imageUrls) && uploadedImageUrls.length === 0) {
        setError("이미지를 업로드하지 못했습니다. 다시 시도해주세요.");
        return;
      }

      const [thumbnailUrl = FALLBACK_THUMBNAIL_URL, ...additionalImageUrls] = [
        ...uploadedImageUrls,
        ...getSpaceImageUrls(imageUrls),
      ];

      const response = await createSpace({
        name: form.name.trim(),
        description: form.description.trim() || null,
        address: buildAddressRequest(form),
        thumbnail_url: thumbnailUrl,
        image_urls: additionalImageUrls,
        price_per_hour: pricePerHour,
        category: toSpaceCategoryRequestValue(form.category),
        phone: submitPhone,
      });

      const spaceId = getSpaceId(response);
      if (!spaceId) {
        router.push("/my?tab=spaces");
        return;
      }

      if (form.startDate && form.endDate) {
        try {
          await createSchedule(spaceId, {
            start_time: `${form.startDate}T00:00:00`,
            end_time: `${form.endDate}T23:59:59`,
          });
        } catch {
          // 일정 등록 실패가 공간 등록 성공 후 상세 페이지 이동을 막지 않게 한다.
        }
      }

      router.push(`/spaces/${spaceId}`);
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message ?? "공간을 등록하지 못했습니다. 입력한 내용을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, imageFiles, imageUrls, isSubmitting, phone, router]);

  return {
    addImages,
    error,
    form,
    imageUrls,
    isSubmitting,
    removeImage,
    setField,
    submit,
  };
}

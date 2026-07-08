"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export function useCreateSpace() {
  const router = useRouter();
  const [form, setForm] = useState<SpaceCreateForm>(initialForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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
      setError(null);
    } catch {
      setError("이미지를 불러오지 못했습니다.");
    }
  }, [imageUrls.length]);

  const removeImage = useCallback((index: number) => {
    setImageUrls((current) => current.filter((_, imageIndex) => imageIndex !== index));
  }, []);

  const submit = useCallback(async () => {
    if (isSubmitting) return;

    const pricePerHour = Number(form.pricePerHour);
    const addressParts = splitRoadAddress(form.roadAddress);

    if (!form.name.trim() || !form.roadAddress.trim() || !form.category || !Number.isFinite(pricePerHour) || pricePerHour <= 0) {
      setError("제목, 시간당 가격, 주소, 카테고리를 확인해주세요.");
      return;
    }

    if (!addressParts.sido || !addressParts.sigungu) {
      setError("도로명 주소를 시/도와 시군구가 포함되도록 입력해주세요.");
      return;
    }

    if (imageUrls.length === 0) {
      setError("대표 이미지를 1장 이상 등록해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const thumbnailUrl = imageUrls[0];

      const response = await createSpace({
        name: form.name.trim(),
        description: form.description.trim() || null,
        address: buildAddressRequest(form),
        thumbnail_url: thumbnailUrl,
        image_urls: imageUrls.slice(1),
        price_per_hour: pricePerHour,
        category: form.category,
        phone,
      });

      const spaceId = response.data.space_id;
      if (form.startDate && form.endDate) {
        await createSchedule(spaceId, {
          start_time: `${form.startDate}T00:00:00`,
          end_time: `${form.endDate}T23:59:59`,
        });
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
  }, [form, imageUrls, isSubmitting, phone, router]);

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

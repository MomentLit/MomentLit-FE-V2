"use client";

import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { uploadImage } from "@/apis/image";
import { createPopup } from "@/apis/popup";

export type PopupCreateForm = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

const initialForm: PopupCreateForm = {
  title: "",
  description: "",
  startDate: "",
  endDate: "",
};

const FALLBACK_THUMBNAIL_URL = "https://placehold.co/800x600?text=MomentLit";

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const getRequestErrorMessage = (requestError: unknown) => {
  if (!axios.isAxiosError(requestError)) return undefined;

  const responseData = requestError.response?.data as { message?: string } | undefined;
  return responseData?.message;
};

const uploadPopupImages = async (imageFiles: (File | null)[]) => {
  const uploadedUrls = await Promise.all(
    imageFiles.map((file) => file ? uploadImage(file).then((response) => response.data.image_url) : Promise.resolve(null)),
  );

  return uploadedUrls.filter((url): url is string => Boolean(url));
};

const hasLocalImagePreview = (imageUrls: string[]) => imageUrls.some((url) => url.startsWith("data:image/"));

export function useCreatePopup(matchingId: number | null) {
  const router = useRouter();
  const [form, setForm] = useState<PopupCreateForm>(initialForm);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = useCallback(<K extends keyof PopupCreateForm>(key: K, value: PopupCreateForm[K]) => {
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

    if (!matchingId) {
      setError("팝업 등록을 위한 매칭 정보가 없습니다.");
      return;
    }

    if (!form.title.trim() || !form.description.trim() || !form.startDate || !form.endDate) {
      setError("제목, 팝업 소개, 운영 기간을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let uploadedImageUrls: string[];
      try {
        uploadedImageUrls = await uploadPopupImages(imageFiles);
      } catch (uploadError) {
        const message = getRequestErrorMessage(uploadError);
        setError(message ? `이미지를 업로드하지 못했습니다. ${message}` : "이미지를 업로드하지 못했습니다. 다시 시도해주세요.");
        return;
      }

      if (hasLocalImagePreview(imageUrls) && uploadedImageUrls.length === 0) {
        setError("이미지를 업로드하지 못했습니다. 다시 시도해주세요.");
        return;
      }

      const [thumbnailUrl = FALLBACK_THUMBNAIL_URL] = uploadedImageUrls;
      await createPopup({
        matching_id: matchingId,
        title: form.title.trim(),
        description: form.description.trim(),
        thumbnail_url: thumbnailUrl,
        start_time: `${form.startDate}T00:00:00`,
        end_time: `${form.endDate}T23:59:59`,
      });

      router.push("/my?tab=spaces");
    } catch (requestError) {
      const message = getRequestErrorMessage(requestError);
      setError(message ?? "팝업을 등록하지 못했습니다. 입력한 내용을 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, imageFiles, imageUrls, isSubmitting, matchingId, router]);

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

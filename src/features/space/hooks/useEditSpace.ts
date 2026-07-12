"use client";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { AddressSearchResult } from "@/hooks/useAddressSearch";
import { getMySpaces, getSpaceDetail, updateSpace } from "@/apis/space";
import type { AddressRequest } from "@/types/common";
import type { SpaceDetailSearchResponse } from "@/types/space";

export type SpaceEditForm = {
  name: string;
  description: string;
  pricePerHour: string;
  postalCode: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  eupMyeonDong: string;
  detailAddress: string;
  category: string;
};

const initialForm: SpaceEditForm = {
  name: "",
  description: "",
  pricePerHour: "",
  postalCode: "",
  roadAddress: "",
  jibunAddress: "",
  sido: "",
  sigungu: "",
  eupMyeonDong: "",
  detailAddress: "",
  category: "",
};

const toForm = (space: SpaceDetailSearchResponse): SpaceEditForm => ({
  category: space.category ?? "",
  description: space.description ?? "",
  detailAddress: space.address.detail_address ?? "",
  eupMyeonDong: space.address.eup_myeon_dong ?? "",
  jibunAddress: space.address.jibun_address ?? "",
  name: space.name ?? "",
  postalCode: space.address.postal_code ?? "",
  pricePerHour: String(space.price_per_hour ?? ""),
  roadAddress: space.address.road_address ?? "",
  sido: space.address.sido ?? "",
  sigungu: space.address.sigungu ?? "",
});

const buildAddressRequest = (form: SpaceEditForm): AddressRequest => {
  const address: AddressRequest = {
    road_address: form.roadAddress.trim(),
    sido: form.sido.trim(),
    sigungu: form.sigungu.trim(),
  };

  if (form.eupMyeonDong.trim()) address.eup_myeon_dong = form.eupMyeonDong.trim();
  if (form.jibunAddress.trim()) address.jibun_address = form.jibunAddress.trim();
  if (form.detailAddress.trim()) address.detail_address = form.detailAddress.trim();
  if (form.postalCode.trim()) address.postal_code = form.postalCode.trim();

  return address;
};

const isOwnedSpace = async (spaceId: number) => {
  const response = await getMySpaces();
  return response.data.spaces.some((space) => space.space_id === spaceId);
};

export function useEditSpace(spaceId: number) {
  const router = useRouter();
  const [form, setForm] = useState<SpaceEditForm>(initialForm);
  const [space, setSpace] = useState<SpaceDetailSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadSpace = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [detailResponse, owned] = await Promise.all([
          getSpaceDetail(spaceId),
          isOwnedSpace(spaceId),
        ]);

        if (!owned) {
          if (isActive) setError("수정할 수 있는 공간이 아닙니다.");
          return;
        }

        if (isActive) {
          setSpace(detailResponse.data);
          setForm(toForm(detailResponse.data));
        }
      } catch {
        if (isActive) setError("공간 정보를 불러오지 못했습니다.");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    void loadSpace();
    return () => {
      isActive = false;
    };
  }, [spaceId]);

  const setField = useCallback(<K extends keyof SpaceEditForm>(key: K, value: SpaceEditForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  }, []);

  const setAddress = useCallback((result: AddressSearchResult) => {
    setForm((current) => ({
      ...current,
      eupMyeonDong: result.eupMyeonDong,
      jibunAddress: result.jibunAddress,
      postalCode: result.postalCode,
      roadAddress: result.roadAddress,
      sido: result.sido,
      sigungu: result.sigungu,
    }));
  }, []);

  const submit = useCallback(async () => {
    if (!space || isSubmitting) return;

    const pricePerHour = Number(form.pricePerHour);
    if (!form.name.trim() || !form.roadAddress.trim() || !form.category || !Number.isFinite(pricePerHour) || pricePerHour <= 0) {
      setError("제목, 시간당 가격, 주소, 카테고리를 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await updateSpace(spaceId, {
        address: buildAddressRequest(form),
        category: form.category,
        description: form.description.trim() || null,
        image_urls: space.image_urls,
        name: form.name.trim(),
        price_per_hour: pricePerHour,
        thumbnail_url: space.thumbnail_url,
      });
      router.push(`/spaces/${spaceId}`);
    } catch (requestError) {
      const message = axios.isAxiosError(requestError)
        ? requestError.response?.data?.message
        : undefined;
      setError(message ?? "공간을 수정하지 못했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  }, [form, isSubmitting, router, space, spaceId]);

  return {
    error,
    form,
    isLoading,
    isSubmitting,
    setAddress,
    setField,
    space,
    submit,
  };
}

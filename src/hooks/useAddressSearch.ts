"use client";

import { useCallback, useRef } from "react";

const POSTCODE_SCRIPT_SRC = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export type AddressSearchResult = {
  postalCode: string;
  roadAddress: string;
  jibunAddress: string;
  sido: string;
  sigungu: string;
  eupMyeonDong: string;
  buildingName: string;
};

let scriptLoadPromise: Promise<void> | null = null;

const loadPostcodeScript = (): Promise<void> => {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.daum?.Postcode) return Promise.resolve();

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = POSTCODE_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptLoadPromise = null;
        reject(new Error("주소 검색 서비스를 불러오지 못했습니다."));
      };
      document.head.appendChild(script);
    });
  }

  return scriptLoadPromise;
};

const toAddressSearchResult = (data: DaumPostcodeData): AddressSearchResult => ({
  buildingName: data.buildingName ?? "",
  eupMyeonDong: data.bname ?? "",
  jibunAddress: data.jibunAddress || data.autoJibunAddress || "",
  postalCode: data.zonecode ?? "",
  roadAddress: data.roadAddress || data.autoRoadAddress || data.jibunAddress || "",
  sido: data.sido ?? "",
  sigungu: data.sigungu ?? "",
});

export function useAddressSearch() {
  const errorRef = useRef<string | null>(null);

  const open = useCallback(async (
    onComplete: (result: AddressSearchResult) => void,
    onError?: (message: string) => void,
  ) => {
    try {
      await loadPostcodeScript();
    } catch {
      const message = "주소 검색 서비스를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.";
      errorRef.current = message;
      onError?.(message);
      return;
    }

    if (!window.daum?.Postcode) {
      const message = "주소 검색 서비스를 사용할 수 없습니다.";
      onError?.(message);
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        onComplete(toAddressSearchResult(data));
      },
    }).open();
  }, []);

  return { open };
}

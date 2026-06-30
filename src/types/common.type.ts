export type ApiResponse<T> = {
  message: string;
  data: T;
};

export type AddressRequest = {
  sido: string;
  sigungu: string;
  eup_myeon_dong?: string;
  road_address: string;
  jibun_address?: string;
  detail_address?: string;
  postal_code?: string;
  lat?: number;
  lng?: number;
};

export type AddressResponse = {
  sido: string;
  sigungu: string;
  eup_myeon_dong: string;
  road_address: string;
  jibun_address: string;
  detail_address: string;
  postal_code: string;
  lat: number;
  lng: number;
};

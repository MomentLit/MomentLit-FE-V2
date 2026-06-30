import type { AddressRequest, AddressResponse } from "./common.type";

export type SpaceCreateRequest = {
  name: string;
  description: string | null;
  address: AddressRequest;
  thumbnail_url: string;
  image_urls: string[];
  price_per_hour: number;
  category: string;
  phone: string;
};

export type SpaceCreateResponse = {
  space_id: number;
};

export type SpaceUpdateRequest = {
  name?: string | null;
  description?: string | null;
  address?: {
    sido?: string | null;
    sigungu?: string | null;
    eup_myeon_dong?: string | null;
    road_address?: string | null;
    jibun_address?: string | null;
    detail_address?: string | null;
    postal_code?: string | null;
    lat?: number | null;
    lng?: number | null;
  } | null;
  ai_summary?: string | null;
  thumbnail_url?: string | null;
  image_urls?: (string | null)[] | null;
  price_per_hour?: number | null;
  category?: string | null;
  phone?: string | null;
};

export type SpaceListSearchResponse = {
  space_id: number;
  name: string;
  address: AddressResponse;
  thumbnail_url: string;
  price_per_hour: number;
  category: string;
};

export type SpaceDetailSearchResponse = {
  space_id: number;
  name: string;
  description: string;
  ai_summary: string;
  address: AddressResponse;
  thumbnail_url: string;
  image_urls: string[];
  price_per_hour: number;
  category: string;
};

export type AdminStatus = "PENDING" | "APPROVED" | "REJECTED";

export type MySpaceListSearchResponse = {
  space_id: number;
  name: string;
  address: AddressResponse;
  thumbnail_url: string;
  price_per_hour: number;
  admin_status: AdminStatus;
  is_active: boolean;
  category: string;
};

export type SpaceListSearchParams = {
  name?: string;
  category?: string;
};

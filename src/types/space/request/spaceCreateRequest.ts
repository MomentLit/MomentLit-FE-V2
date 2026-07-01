import type { AddressRequest } from "@/types/common";

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

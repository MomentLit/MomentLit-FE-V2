import type { AddressResponse } from "@/types/common";

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

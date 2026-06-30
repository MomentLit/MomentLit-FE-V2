import type { AddressResponse } from "@/types/common";

export type SpaceListSearchResponse = {
  space_id: number;
  name: string;
  address: AddressResponse;
  thumbnail_url: string;
  price_per_hour: number;
  category: string;
};

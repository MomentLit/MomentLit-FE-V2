import type { AddressRequest, NullablePartial } from "@/types/common";

export type SpaceUpdateRequest = {
  name?: string | null;
  description?: string | null;
  address?: NullablePartial<AddressRequest> | null;
  ai_summary?: string | null;
  thumbnail_url?: string | null;
  image_urls?: (string | null)[] | null;
  price_per_hour?: number | null;
  category?: string | null;
  phone?: string | null;
};

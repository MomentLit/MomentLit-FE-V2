import type { AddressResponse } from "@/types/common";

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

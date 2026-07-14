type PopupAddress = {
  sido?: string;
  sigungu?: string;
  eup_myeon_dong?: string;
  road_address?: string;
  jibun_address?: string;
  detail_address?: string;
  postal_code?: string;
};

export type PopupDetailSearchResponse = {
  popup_id: number;
  title: string;
  description: string;
  space_name: string;
  address: PopupAddress;
  thumbnail_url: string;
  view_count: number;
  like_count: string | number;
  ai_brand_summary: string;
  start_time: string;
  end_time: string;
  created_at: string;
};

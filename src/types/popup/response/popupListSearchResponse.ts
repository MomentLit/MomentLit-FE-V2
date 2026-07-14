type PopupAddress = {
  sido?: string;
  sigungu?: string;
  eup_myeon_dong?: string;
  road_address?: string;
  jibun_address?: string;
  detail_address?: string;
  postal_code?: string;
};

export type PopupListSearchResponse = {
  popup_id: number;
  title: string;
  address: PopupAddress;
  thumbnail_url: string;
  start_time: string;
  end_time: string;
  view_count: number;
  like_count: number;
};

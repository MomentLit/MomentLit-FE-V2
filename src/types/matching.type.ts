export type MatchingStatus = "REQUESTED" | "APPROVED" | "REJECTED" | "CANCELED";

export type MatchingCreateRequest = {
  space_id: number;
  start_time: string;
  end_time: string;
  total_price: string;
};

export type MatchingCreateResponse = {
  matching_id: number;
};

export type MatchingListSearchResponse = {
  matching_id: number;
  address: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: MatchingStatus;
  created_at: string;
};

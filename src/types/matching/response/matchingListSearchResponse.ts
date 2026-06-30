export type MatchingStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export type MatchingListSearchResponse = {
  matching_id: number;
  address: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: MatchingStatus;
  created_at: string;
};

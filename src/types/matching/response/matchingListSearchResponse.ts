export type MatchingStatus =
  | "REQUESTED"
  | "APPROVED"
  | "REJECTED"
  | "CANCELED";

export type MatchingListSearchResponse = {
  matching_id: number;
  space_id?: number;
  space_name?: string;
  applicant_name?: string;
  requester_name?: string;
  user_name?: string;
  desired_space_name?: string;
  address?: string | null;
  start_time: string;
  end_time: string;
  total_price: number;
  status: MatchingStatus;
  created_at: string;
};

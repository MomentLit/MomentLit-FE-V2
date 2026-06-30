export type ScheduleStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

export type ScheduleCreateRequest = {
  start_time: string;
  end_time: string;
};

export type ScheduleCreateResponse = {
  schedule_id: number;
};

export type ScheduleUpdateRequest = {
  start_time?: string | null;
  end_time?: string | null;
  is_bookable?: boolean | null;
};

export type TimeBlockResponse = {
  schedule_id: number;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
};

export type ScheduleListSearchResponse = {
  date: string;
  time_blocks: TimeBlockResponse[];
};

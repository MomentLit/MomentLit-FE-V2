export type ScheduleStatus = "AVAILABLE" | "BOOKED" | "BLOCKED";

export type TimeBlockResponse = {
  schedule_id: number;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
};

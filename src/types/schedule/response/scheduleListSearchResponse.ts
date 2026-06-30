import type { TimeBlockResponse } from "./timeBlockResponse";

export type ScheduleListSearchResponse = {
  date: string;
  time_blocks: TimeBlockResponse[];
};

export type ChatMessageHistorySearchResponse = {
  message_id: number;
  sender_name: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

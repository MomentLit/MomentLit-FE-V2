import type { MatchingStatus } from "@/types/matching";

export type ChatRoomDirection = "received" | "sent";

export type ChatRoom = {
  matchingId: number;
  direction: ChatRoomDirection;
  title: string;
  subtitle: string;
  status: MatchingStatus;
  createdAt: string;
};

export type ChatMessageSender = "me" | "counterpart";

export type ChatMessage = {
  id: string;
  sender: ChatMessageSender;
  content: string;
  time: string;
};

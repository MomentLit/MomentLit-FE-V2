export type ChatParticipant = {
  id: string;
  name: string;
};

export type ChatRoomListSearchResponse = {
  chat_room_id: number;
  space: {
    id: number;
    name: string;
  };
  host: ChatParticipant;
  seller: ChatParticipant;
  created_at: string;
};

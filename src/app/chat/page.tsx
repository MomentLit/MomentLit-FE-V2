import ChatPageScreen from "@/features/chat/components/ChatPageScreen";

type ChatPageProps = {
  searchParams: Promise<{ chatRoomId?: string }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { chatRoomId } = await searchParams;
  const parsedChatRoomId = chatRoomId ? Number(chatRoomId) : undefined;
  const initialChatRoomId = parsedChatRoomId !== undefined && Number.isFinite(parsedChatRoomId)
    ? parsedChatRoomId
    : undefined;

  return <ChatPageScreen initialChatRoomId={initialChatRoomId} />;
}

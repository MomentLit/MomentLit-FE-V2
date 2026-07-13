import ChatPageScreen from "@/features/chat/components/ChatPageScreen";

type ChatPageProps = {
  searchParams: Promise<{ matchingId?: string }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { matchingId } = await searchParams;
  const parsedMatchingId = matchingId ? Number(matchingId) : undefined;
  const initialMatchingId = parsedMatchingId !== undefined && Number.isFinite(parsedMatchingId)
    ? parsedMatchingId
    : undefined;

  return <ChatPageScreen initialMatchingId={initialMatchingId} />;
}

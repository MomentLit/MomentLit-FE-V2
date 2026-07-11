import SpaceEditPageScreen from "@/features/space/components/SpaceEditPageScreen";

type SpaceEditPageProps = {
  params: Promise<{ spaceId: string }>;
};

export default async function SpaceEditPage({ params }: SpaceEditPageProps) {
  const { spaceId } = await params;
  return <SpaceEditPageScreen spaceId={Number(spaceId)} />;
}

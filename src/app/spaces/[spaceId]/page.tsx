import SpaceDetailPageScreen from "@/features/space/components/SpaceDetailPageScreen";

type SpaceDetailPageProps = {
  params: Promise<{ spaceId: string }>;
};

export default async function SpaceDetailPage({ params }: SpaceDetailPageProps) {
  const { spaceId } = await params;
  return <SpaceDetailPageScreen spaceId={Number(spaceId)} />;
}

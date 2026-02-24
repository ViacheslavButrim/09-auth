import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/serverApi";
import NoteDetails from "@/app/(private routes)/notes/[id]/NoteDetails.client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "400px",
        }}
      >
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NoteDetails id={id} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
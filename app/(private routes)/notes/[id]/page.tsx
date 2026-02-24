import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api/serverApi";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NoteDetails from "./NoteDetails.client";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const note = queryClient.getQueryData(["note", id]);

  if (!note) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetails id={id} />
    </HydrationBoundary>
  );
}
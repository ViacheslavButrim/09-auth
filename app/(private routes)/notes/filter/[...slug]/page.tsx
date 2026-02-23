"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";

export default function FilterNotesPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const slug = pathname.split("/").slice(-1)[0];
  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", slug, page],
    queryFn: () => fetchNotes({ page, tag: slug }),
  });

  const notes = data?.notes ?? [];

  if (isLoading) return <p>Loading notes...</p>;

  return (
    <>
      <NoteList notes={notes} />
      <Pagination currentPage={page} totalPages={data?.totalPages ?? 1} />
    </>
  );
}
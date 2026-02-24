"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import PaginationWithRouter from "@/components/Pagination/PaginationWithRouter";
import css from "./NotesPage.module.css";

export default function NotesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page],
    queryFn: () => fetchNotes({ page }),
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError || !data) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className={css.container}>
      <h1>Notes</h1>
      <NoteList notes={data.notes} />
      <PaginationWithRouter currentPage={page}
        totalPages={data.totalPages} />
    </div>
  );
}
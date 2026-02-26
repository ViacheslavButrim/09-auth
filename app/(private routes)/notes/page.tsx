"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (isError) {
      router.push("/sign-in");
    }
  }, [isError, router]);

  if (isLoading) return <p>Loading...</p>;

  if (!data) return null;
  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <h1>Notes</h1>
        <button
          className={css.button}
          onClick={() => router.push("/notes/new")}
        >
          New Note
        </button>
      </div>

      <NoteList notes={data.notes} />
      <PaginationWithRouter currentPage={page} totalPages={data.totalPages} />
    </div>
  );
}

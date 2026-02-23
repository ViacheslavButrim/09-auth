"use client";

import { useState } from "react";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import css from "./Notes.module.css";

interface Note {
  id: string;
  title: string;
  content?: string;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

interface Props {
  notes: Note[];
  currentPage: number;
  totalPages: number;
}

export default function NotesClient({ notes: initialNotes, currentPage, totalPages }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || currentPage);

  const { data, isLoading, refetch } = useQuery<NotesResponse>({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
    initialData: { notes: initialNotes, totalPages },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
    const params = new URLSearchParams();
    params.set("page", "1");
    if (search) params.set("search", search);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={css.container}>
      <form onSubmit={handleSearchSubmit} className={css.searchForm}>
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={css.searchInput}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <NoteList notes={data!.notes} />
          <Pagination
            currentPage={page}
            totalPages={data!.totalPages}
          />
        </>
      )}
    </div>
  );
}
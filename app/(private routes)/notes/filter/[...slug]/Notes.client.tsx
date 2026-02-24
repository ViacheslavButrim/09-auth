"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/clientApi";
import { Note } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Link from "next/link";
import css from "./Notes.module.css";

interface NotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
}

interface Props {
  notes: Note[];
  currentPage: number;
  totalPages: number;
  currentTag?: string;
}

export default function NotesClient({
  notes: initialNotes,
  currentPage,
  totalPages,
  currentTag = "",
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? ""
  );
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(
    Number(searchParams.get("page")) || currentPage
  );
  const [tag] = useState(currentTag ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();

    params.set("page", page.toString());

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    if (tag) {
      params.set("tag", tag);
    }

    router.push(`?${params.toString()}`);
  }, [debouncedSearch, page, tag, router]);

  const { data, isPending } = useQuery<NotesResponse>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag,
      }),
    initialData: {
      notes: initialNotes,
      totalPages,
      page: currentPage,
    },
  });

  const hasNotes = data.notes.length > 0;

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <SearchBox onSearch={setSearch} />

        <Link href="/notes/action/create">
          Create Note
        </Link>
      </div>

      {isPending ? (
        <p>Loading...</p>
      ) : hasNotes ? (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}
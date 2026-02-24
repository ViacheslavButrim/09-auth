"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function NotesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const tag = searchParams.get("tag") ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setPage(1); 
          return search;
        }
        return prev;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (tag) params.set("tag", tag);

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (newQuery !== currentQuery) {
      router.push(`?${newQuery}`);
    }
  }, [debouncedSearch, page, tag, router, searchParams]);

  const handleSearch = useCallback((value: string) => {
    setSearch((prev) => (prev === value ? prev : value));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);


  const { data, isPending } = useQuery<NotesResponse>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag,
      }),
  });

  const notes = data?.notes ?? [];
  const hasNotes = notes.length > 0;

  return (
    <div className={css.container}>
      <div className={css.topBar}>
        <SearchBox onSearch={handleSearch} />
        <Link href="/notes/action/create">Create Note</Link>
      </div>

      {isPending ? (
        <p>Loading...</p>
      ) : hasNotes ? (
        <>
          <NoteList notes={notes} />
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No notes found.</p>
      )}
    </div>
  );
}

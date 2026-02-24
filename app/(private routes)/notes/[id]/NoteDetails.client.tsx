"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

interface NoteDetailsClientProps {
  id: string;
}

export default function NoteDetailsClient({ id }: NoteDetailsClientProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading note</p>;

  return (
    <div>
      <h2 className={css.header}>{data.title}</h2>
      <p className={css.content}>{data.content}</p>
      <p className={css.date}>
        {new Date(data.createdAt).toLocaleString()}
      </p>
      <span className={css.tag}>{data.tag}</span>
    </div>
  );
}
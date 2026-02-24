"use client";

import Link from "next/link";
import css from "./NoteList.module.css";
import { Note } from "@/types/note";
import { deleteNote } from "@/lib/api/clientApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  notes: Note[];
}

export default function NoteList({ notes }: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <Link href={`/notes/${note.id}`}>
            <h3>{note.title}</h3>
          </Link>

          <p>{note.content}</p>
          <span>{note.tag}</span>

          <button onClick={() => mutation.mutate(note.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
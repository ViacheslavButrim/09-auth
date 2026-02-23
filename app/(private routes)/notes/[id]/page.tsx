import { notFound } from "next/navigation";
import { fetchNoteById } from "@/lib/api/serverApi";
import css from "./NoteDetailsPage.module.css";

interface Props {
  params: {
    id: string;
  };
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  tag?: string;
}

export default async function NoteDetailsPage({ params }: Props) {
  const note: Note | null = await fetchNoteById(params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className={css.container}>
      <h1>{note.title}</h1>
      <p className={css.content}>{note.content}</p>
      <p className={css.date}>
        Created at: {new Date(note.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
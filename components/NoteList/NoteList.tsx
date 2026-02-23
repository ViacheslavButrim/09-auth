import Link from "next/link";
import css from "./NoteList.module.css";

interface Note {
  id: string;
  title: string;
}

interface Props {
  notes: Note[];
}

export default function NoteList({ notes }: Props) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <Link href={`/notes/${note.id}`}>
            {note.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
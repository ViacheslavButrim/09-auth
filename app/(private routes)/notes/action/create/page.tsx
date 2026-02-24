"use client";

import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNotePage.module.css";

export default function CreateNotePage() {
  return (
    <div className={css.container}>
      <h1>Create Note</h1>
      <NoteForm />
    </div>
  );
}
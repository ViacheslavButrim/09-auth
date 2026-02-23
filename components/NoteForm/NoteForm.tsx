"use client";

import css from "./NoteForm.module.css";

interface Props {
  onSubmit: (data: { title: string; content: string }) => void;
  isLoading?: boolean;
}

export default function NoteForm({ onSubmit, isLoading }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const content = (form.elements.namedItem("content") as HTMLTextAreaElement).value;

    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        name="title"
        type="text"
        placeholder="Title"
        required
      />

      <textarea
        name="content"
        placeholder="Content"
        rows={6}
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
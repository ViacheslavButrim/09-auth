"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import NoteForm from "@/components/NoteForm/NoteForm";
import css from "./CreateNotePage.module.css";

interface NoteInput {
  title: string;
  content: string;
  tag: string;
}

export default function CreateNotePage() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: NoteInput) => createNote(data),
    onSuccess: () => router.replace("/notes"),
  });

  const handleSubmit = (data: { title: string; content: string }) => {
    mutation.mutate({ ...data, tag: "general" });
  };

  return (
    <div className={css.container}>
      <h1>Create Note</h1>

      <NoteForm
        onSubmit={handleSubmit}
        isLoading={mutation.isPending}
      />

      {mutation.isError && (
        <p className={css.error}>Failed to create note</p>
      )}
    </div>
  );
}
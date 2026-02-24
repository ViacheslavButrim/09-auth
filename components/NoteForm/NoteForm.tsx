"use client";

import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteDraftStore } from "@/lib/store/noteDraftStore";
import { useRouter } from "next/navigation";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { title, content, tag, setField, reset } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
      router.back();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ title, content, tag });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setField("title", e.target.value)}
        required
      />

      <textarea
        placeholder="Content"
        rows={6}
        value={content}
        onChange={(e) => setField("content", e.target.value)}
        required
      />

      <select
        value={tag}
        onChange={(e) => setField("tag", e.target.value)}
        required
      >
        <option value="">Select tag</option>
        <option value="todo">Todo</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="meeting">Meeting</option>
        <option value="shopping">Shopping</option>
      </select>

      <div>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save"}
        </button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
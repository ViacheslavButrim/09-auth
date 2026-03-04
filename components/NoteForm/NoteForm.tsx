"use client";

import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteDraftStore } from "@/lib/store/noteDraftStore";
import { useRouter } from "next/navigation";

export const NOTE_TAGS = [
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Important",
  "Todo",
] as const;

export type NoteTag = (typeof NOTE_TAGS)[number];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { title, content, tag, setTitle, setContent, setTag, reset } =
    useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: createNote,
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      reset();
      router.push("/notes");
    },
    onError: (error) => {
      console.error("Create note failed:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedTitle = title.trim();
    const normalizedContent = content.trim();
    const normalizedTag = tag.trim() as NoteTag;

    if (!normalizedTitle || !normalizedContent || !normalizedTag) {
      console.error("All fields are required");
      return;
    }

    if (!NOTE_TAGS.includes(normalizedTag)) {
      console.error("Invalid tag value for production API.");
      return;
    }

    if (normalizedTitle.length < 3 || normalizedContent.length < 5) {
      console.error("Title or content too short");
      return;
    }

    mutation.mutate({
      title: normalizedTitle,
      content: normalizedContent,
      tag: normalizedTag,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Content"
        rows={6}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <select
        value={tag}
        onChange={(e) => setTag(e.target.value as NoteTag)}
        required
      >
        <option value="">Select tag</option>
        {NOTE_TAGS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
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

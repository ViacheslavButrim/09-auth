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
  const { title, content, tag, setField, reset } = useNoteDraftStore();

  const mutation = useMutation({
    mutationFn: createNote,
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

    if (!title.trim() || !content.trim() || !tag.trim()) {
      console.error("All fields are required");
      return;
    }

    const productionTagsMap: Record<string, NoteTag> = {
      work: "Work",
      personal: "Personal",
      meeting: "Meeting",
      shopping: "Shopping",
      ideas: "Ideas",
      travel: "Travel",
      finance: "Finance",
      health: "Health",
      important: "Important",
      todo: "Todo",
    };

    const formattedTag = productionTagsMap[tag.toLowerCase()];
    if (!formattedTag) {
      console.error("Invalid tag value for production API.");
      return;
    }

    if (title.trim().length < 3 || content.trim().length < 5) {
      console.error("Title or content too short");
      return;
    }

    mutation.mutate({ title, content, tag: formattedTag });
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

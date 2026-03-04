import { create } from "zustand";
import type { NoteTag } from "@/components/NoteForm/NoteForm";

interface NoteDraftStore {
  title: string;
  content: string;
  tag: NoteTag | "";

  setTitle: (value: string) => void;
  setContent: (value: string) => void;
  setTag: (value: NoteTag) => void;

  reset: () => void;
}

export const useNoteDraftStore = create<NoteDraftStore>((set) => ({
  title: "",
  content: "",
  tag: "",

  setTitle: (value) =>
    set({ title: value }),

  setContent: (value) =>
    set({ content: value }),

  setTag: (value) =>
    set({ tag: value }),

  reset: () =>
    set({
      title: "",
      content: "",
      tag: "",
    }),
}));
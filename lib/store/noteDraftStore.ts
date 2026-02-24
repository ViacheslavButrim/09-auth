import { create } from "zustand";

interface NoteDraftStore {
  title: string;
  content: string;
  tag: string;
  setField: (field: "title" | "content" | "tag", value: string) => void;
  reset: () => void;
}

export const useNoteDraftStore = create<NoteDraftStore>((set) => ({
  title: "",
  content: "",
  tag: "",
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  reset: () =>
    set({
      title: "",
      content: "",
      tag: "",
    }),
}));
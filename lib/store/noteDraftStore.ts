import { create } from "zustand";

interface NoteDraftStore {
  title: string;
  content: string;
  tag: string;
  setField: (field: "title" | "content" | "tag", value: string) => void;
  reset: () => void;
}

const validTags = [
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
];

export const useNoteDraftStore = create<NoteDraftStore>((set) => ({
  title: "",
  content: "",
  tag: "",
  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]:
        field === "tag"
          ? validTags.find((t) => t.toLowerCase() === value.toLowerCase()) || ""
          : value,
    })),
  reset: () =>
    set({
      title: "",
      content: "",
      tag: "",
    }),
}));
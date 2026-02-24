import { create } from "zustand";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

interface NoteStore {
  selectedNote: Note | null;
  isModalOpen: boolean;

  setSelectedNote: (note: Note | null) => void;
  openModal: () => void;
  closeModal: () => void;
}

export const useNoteStore = create<NoteStore>((set) => ({
  selectedNote: null,
  isModalOpen: false,

  setSelectedNote: (note) => set({ selectedNote: note }),

  openModal: () => set({ isModalOpen: true }),

  closeModal: () =>
    set({
      isModalOpen: false,
      selectedNote: null,
    }),
}));
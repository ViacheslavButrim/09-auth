"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, createNote } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import PaginationWithRouter from "@/components/Pagination/PaginationWithRouter";
import { Note } from "@/types/note";
import css from "./NotesPage.module.css";

interface NewNote {
  title: string;
  content: string;
  tag: string;
}

export default function NotesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(search);

  const [showModal, setShowModal] = useState(false);

  const [newNote, setNewNote] = useState<NewNote>({
    title: "",
    content: "",
    tag: "",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () => fetchNotes({ page, search }),
  });


  const addNoteMutation = useMutation<Note, Error, NewNote>({
    mutationFn: (note) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", page, search] });
      setNewNote({ title: "", content: "", tag: "" });
      setShowModal(false); 
    },
    onError: (err) => {
      console.log("CREATE NOTE ERROR:", err);
    },
  });

  useEffect(() => {
    if (isError) {
      router.push("/sign-in");
    }
  }, [isError, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/notes?page=1&search=${encodeURIComponent(searchInput)}`);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content || !newNote.tag) return;
    addNoteMutation.mutate(newNote);
  };

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <h1>Notes</h1>

        <form onSubmit={handleSearch} className={css.searchForm}>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={css.searchInput}
          />
          <button type="submit" className={css.button}>
            Search
          </button>
        </form>

        <button className={css.button} onClick={() => setShowModal(true)}>
          Add Note
        </button>
      </div>

      {showModal && (
        <div className={css.modalBackdrop}>
          <div className={css.modal}>
            <h2>Add New Note</h2>
            <form onSubmit={handleAddNote} className={css.newNoteForm}>
              <input
                type="text"
                placeholder="Title"
                value={newNote.title}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, title: e.target.value }))
                }
                className={css.input}
              />
              <textarea
                placeholder="Content"
                rows={5}
                value={newNote.content}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, content: e.target.value }))
                }
                className={css.input}
                required
              />
              <select
                value={newNote.tag}
                onChange={(e) =>
                  setNewNote((prev) => ({ ...prev, tag: e.target.value }))
                }
                className={css.input}
                required
              >
                <option value="">Select tag</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="important">Important</option>
              </select>
              <div className={css.modalButtons}>
                <button
                  type="submit"
                  className={css.button}
                  disabled={addNoteMutation.isPending}
                >
                  {addNoteMutation.isPending ? "Adding..." : "Add Note"}
                </button>
                <button
                  type="button"
                  className={css.button}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <NoteList notes={data.notes} />

      <PaginationWithRouter currentPage={page} totalPages={data.totalPages} />
    </div>
  );
}

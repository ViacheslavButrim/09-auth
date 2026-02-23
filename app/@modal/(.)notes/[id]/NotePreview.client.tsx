"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css"

interface Props {
  id: string;
}

export default function NotePreview({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !data) return <p>Error loading note</p>;

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
  <div className={css.item}>
    <button
      className={css.backBtn}
      onClick={() => router.back()}
    >
      Close
    </button>

    <div className={css.header}>
      <h2>{data.title}</h2>
      <span className={css.tag}>{data.tag}</span>
    </div>

    <p className={css.content}>{data.content}</p>

    <p className={css.date}>
      {new Date(data.createdAt).toLocaleString()}
    </p>
  </div>
</div>
    </Modal>
  );
}
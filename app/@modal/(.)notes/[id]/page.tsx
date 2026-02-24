"use client";

import { useRouter } from "next/navigation";
import NoteDetails from "@/app/(private routes)/notes/[id]/NoteDetails.client";

interface Props {
  params: {
    id: string;
  };
}

export default function NoteModalPage({ params }: Props) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "400px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <NoteDetails id={params.id} />
      </div>
    </div>
  );
}
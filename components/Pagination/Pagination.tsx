"use client";

import { useRouter, useSearchParams } from "next/navigation";
import css from "./Pagination.module.css";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={css.pagination}>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => changePage(i + 1)}
          disabled={currentPage === i + 1}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
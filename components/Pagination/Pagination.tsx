"use client";

import { useRouter, useSearchParams } from "next/navigation";
import css from "./Pagination.module.css";

interface Props {
  currentPage: number;
  totalPages: number;
   onPageChange: (page: number) => void;
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
      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;

        return (
          <button
            key={page}
            onClick={() => changePage(page)}
            disabled={currentPage === page}
            className={`${css.pageButton} ${currentPage === page ? css.active : ""
              }`}
          >
            {page}
          </button>
        );
      })}
    </div>
  );
}
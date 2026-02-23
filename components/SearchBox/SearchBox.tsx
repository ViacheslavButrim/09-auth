"use client";
import { useState } from "react";
import css from "./SearchBox.module.css";
type Props = { onSearch: (query: string) => void };
export default function SearchBox({ onSearch }: Props) {
  const [value, setValue] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };
  return (
    <form onSubmit={handleSubmit} className={css.searchForm}>
      {" "}
      <input
        type="text"
        placeholder="Search notes..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={css.searchInput}
      />{" "}
      <button type="submit" className={css.searchButton}>
        {" "}
        Search{" "}
      </button>{" "}
    </form>
  );
}

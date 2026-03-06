"use client";

import { useRouter, useSearchParams } from "next/navigation";
import css from "./Sidebar.module.css";

const tags = [
  "All",
  "Work",
  "Personal",
  "Important",
  "Meeting",
  "Shopping",
  "Ideas",
  "Travel",
  "Finance",
  "Health",
  "Todo",
];

export default function Sidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTag = searchParams.get("tag") || "All";
  const search = searchParams.get("search") || "";

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams();

    params.set("page", "1");

    if (search) {
      params.set("search", search);
    }

    if (tag !== "All") {
      params.set("tag", tag);
    }

    router.push(`/notes?${params.toString()}`);
  };

  return (
    <aside className={css.sidebar}>
      <h2 className={css.title}>Tags</h2>

      <ul className={css.list}>
        {tags.map((tag) => (
          <li key={tag}>
            <button
              className={`${css.tag} ${currentTag === tag ? css.active : ""}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

import { fetchNotes } from "@/lib/api/serverApi";
import NoteList from "@/components/NoteList/NoteList";
import PaginationWithRouter from "@/components/Pagination/PaginationWithRouter";

interface FilterNotesPageProps {
  params: { slug?: string[] };
  searchParams: { page?: string };
}

export default async function FilterNotesPage({
  params,
  searchParams,
}: FilterNotesPageProps) {
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const page = Number(searchParams.page ?? 1);

  const data = await fetchNotes({ page, tag: slug });

  return (
    <>
      <NoteList notes={data.notes} />
      <PaginationWithRouter currentPage={page} totalPages={data.totalPages} />
    </>
  );
}

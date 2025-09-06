import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { NoteTag } from '@/types/note';

export default async function FilteredNotes({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug?.[0];

  const validTags: (NoteTag | 'All')[] = [
    'All',
    'Todo',
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
  ];
  const selectedTag = validTags.includes(tag as NoteTag | 'All') ? tag : 'All';

  const queryClient = new QueryClient();

  const searchParams =
    selectedTag === 'All' ? {} : { tag: selectedTag as NoteTag };

  await queryClient.prefetchQuery({
    queryKey: ['notes', { page: 1, search: '', ...searchParams }],
    queryFn: () =>
      fetchNotes({ page: 1, perPage: 12, search: '', ...searchParams }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient selectedTag={selectedTag as NoteTag | 'All'} />
    </HydrationBoundary>
  );
}

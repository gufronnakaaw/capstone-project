import {
  activities,
  books,
  loans,
  members,
  photos,
  prokers,
} from "@/lib/mock-data/library";

/** Mock repository boundary. Replace the returns with fetch/API calls in the backend phase. */
export const libraryService = {
  getBooks: () => books,
  getBook: (id: string) => books.find((book) => book.id === id),
  getMembers: () => members,
  getLoans: () => loans,
  getActivities: () => activities,
  getActivity: (slug: string) =>
    activities.find((activity) => activity.slug === slug),
  getPhotos: () => photos,
  getProkers: () => prokers,
};

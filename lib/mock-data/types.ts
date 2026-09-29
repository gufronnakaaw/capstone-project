export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  coverUrl: string;
  stock: number;
  availableStock: number;
  publishedYear: number;
  synopsis: string;
  createdAt: string;
};
export type Member = {
  id: string;
  name: string;
  memberCode: string;
  contact: string;
  address: string;
  joinDate: string;
  status: "active" | "overdue" | "inactive";
  createdAt: string;
};
export type LoanStatus = "borrowed" | "due-soon" | "overdue" | "returned";
export type Loan = {
  id: string;
  bookId: string;
  memberId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  status: LoanStatus;
  createdAt: string;
};
export type Activity = {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  fullDescription: string;
  coverPhotoId: string;
  photoIds: string[];
  createdAt: string;
};
export type Proker = {
  id: string;
  title: string;
  description: string;
  period: string;
  status: "planned" | "ongoing" | "completed";
  progress: number;
  createdAt: string;
};
export type Photo = {
  id: string;
  url: string;
  caption: string;
  relatedActivityId: string | null;
  createdAt: string;
};

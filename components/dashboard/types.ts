export type LoanStatus = "BORROWED" | "DUE_SOON" | "OVERDUE" | "RETURNED";

export type LoanRow = {
  id: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
  status: LoanStatus;
  book: { id: string; title: string; author: string; cover_url: string };
  member: { id: string; name: string; member_code: string };
};

export type MemberRow = {
  id: string;
  name: string;
  member_code: string;
  contact: string;
  address: string;
  join_date: string;
  status: "ACTIVE" | "INACTIVE";
  active_loan_count: number;
  has_overdue: boolean;
};

export type MemberDetail = MemberRow & {
  active_loans: LoanRow[];
  loan_history: (LoanRow & { book: { id: string; title: string; author: string } })[];
};

export type BookRow = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string;
  stock: number;
  available_stock: number;
  published_year: number;
  synopsis: string;
  category: { id: string; name: string; slug: string } | null;
};

export type CategoryRow = { id: string; name: string; slug: string; sort_order: number };

export type ActivityRow = {
  id: string;
  title: string;
  slug: string;
  date: string;
  description: string;
  full_description: string;
  cover_photo_id: string | null;
};

export type WorkProgramRow = {
  id: string;
  title: string;
  description: string;
  period: string;
  start_date: string | null;
  end_date: string | null;
  status: "PLANNED" | "ONGOING" | "COMPLETED";
  progress: number;
};

export type PhotoRow = {
  id: string;
  url: string;
  caption: string;
  related_activity_id: string | null;
  activity: { id: string; slug: string; title: string } | null;
};

export type Summary = {
  books_total: number;
  loans_active: number;
  loans_overdue: number;
  loans_due_soon: number;
  members_active: number;
  activities_upcoming: number;
  work_programs_active: number;
};

export type Meta = { page: number; page_size: number; total: number; total_pages: number };
export type Page<T> = { data: T[]; meta: Meta };

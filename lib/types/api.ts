export type Paginated<T> = {
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

export type CatalogBook = {
  id: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string;
  stock: number;
  available_stock: number;
  published_year: number;
  category: { id: string; name: string; slug: string } | null;
};

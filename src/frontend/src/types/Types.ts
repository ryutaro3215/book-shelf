export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserAuth = {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
};

export type Book = {
  book_id: string;
  title: string;
  authors: string[];
  publisher: string;
  isbn: { type: string; identifier: string }[];
  published_at: string;
  image_url: string;
};

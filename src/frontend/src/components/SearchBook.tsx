import "@/base.css";
import { useState } from "react";
import { Search } from "lucide-react";
import type { Book } from "@/types/Types";
import { BookCard } from "@/components/BookCard";

export const SearchBook: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [isInput, setIsInput] = useState<boolean>(false);
  const [isNoResults, setIsNoResults] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    const res = await fetch(
      `http://localhost:8787/books/fetch-books?q=${encodeURIComponent(query)}&startIndex=${startIndex}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch books");
    }
    const books: Book[] = await res.json();
    if (books.length === 0) {
      setIsNoResults(true);
    } else {
      setIsNoResults(false);
      setStartIndex(startIndex + books.length);
    }
    return books;
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() === "") {
      setIsInput(true);
      return;
    }

    // Reset state for a new search
    setBooks([]);
    setStartIndex(0);
    setIsNoResults(false);

    try {
      setIsLoading(true);
      const books = await fetchBooks();
      setIsNoResults(false);
      setBooks(books);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setIsNoResults(true);
      setIsLoading(false);
    }
  };

  const handleSearchClick = async () => {
    if (query.trim() === "") {
      setIsInput(true);
      return;
    }

    try {
      setIsLoading(true);
      const books = await fetchBooks();
      setIsNoResults(false);
      setBooks((prevBooks) => [...prevBooks, ...books]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching more books:", error);
      setIsNoResults(true);
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsInput(false);
  };

  return (
    <div className="px-4 sm:px-0 py-6">
      {isNoResults && (
        <p className="text-red-500 text-sm mt-4 text-center">
          No results found for "{query}"
        </p>
      )}
      <form
        onSubmit={handleSearch}
        className="flex items-center border rounded-full px-4 py-2 bg-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-300 max-w-lg w-full mx-auto"
      >
        <Search className="text-gray-500" size={24} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search books"
          className="ml-2 bg-transparent outline-none text-sm w-full"
        />
        {isInput && (
          <p className="text-red-500 text-sm ml-2">Input some word</p>
        )}
      </form>
      <div className="mt-6 px-4 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book, index) => (
          <BookCard key={`${book.book_id}_${index}`} book={book} />
        ))}
      </div>
      {isLoading && (
        <div className="flex justify-center mt-4">
          <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {books.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleSearchClick}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition"
          >
            Search more
          </button>
        </div>
      )}
    </div>
  );
};

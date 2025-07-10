import React from "react";
import type { Book } from "@/types/Types";
import "@/base.css";
import { useState } from "react";

type Props = {
  book: Book;
};

export const BookCard: React.FC<Props> = ({ book }) => {
  const onClickAdd = async (book: Book) => {
    try {
      const res = await fetch("http://localhost:8787/books/add-book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add book");
      }
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book. Please try again.");
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row h-full">
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={`${book.title} cover`}
            className="w-full h-48 sm:w-32 sm:h-auto object-cover"
          />
        ) : (
          <div className="w-full h-48 sm:w-32 sm:h-auto bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Image
          </div>
        )}
        <div className="p-4 flex flex-col justify-between flex-1">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {book.title}
              </h2>
              <p className="text-sm text-gray-700 mt-1 line-clamp-1">
                {book.authors.join(", ")}
              </p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                {book.publisher}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-400">
                発行日: {book.published_at}
              </p>
              <div className="mt-3 flex justify-between">
                <button className="px-4 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-500 transition">
                  Add
                </button>
                <button className="px-4 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-500 transition">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

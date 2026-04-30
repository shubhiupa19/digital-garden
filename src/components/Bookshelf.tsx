"use client";

import { useState } from "react";

type Book = {
  title: string;
  author: string;
  isbn: string;
  gradient: string;
  note?: string;
};

const BOOKS: Book[] = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    isbn: "9780525559474",
    gradient: "linear-gradient(135deg, #5C4033, #8B6914)",
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    isbn: "9780807014295",
    gradient: "linear-gradient(135deg, #2C3E50, #4A6FA5)",
  },
  {
    title: "And the Mountains Echoed",
    author: "Khaled Hosseini",
    isbn: "9781594632389",
    gradient: "linear-gradient(135deg, #6B3A5D, #A0527E)",
  },
  {
    title: "East of Eden",
    author: "John Steinbeck",
    isbn: "9780140186390",
    gradient: "linear-gradient(135deg, #3D5A3E, #6B8F6B)",
  },
  {
    title: "Everything I Know About Love",
    author: "Dolly Alderton",
    isbn: "9780062968791",
    gradient: "linear-gradient(135deg, #8B4513, #CD853F)",
  },
];

type TooltipState = { note: string; x: number; y: number } | null;

export default function Bookshelf() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [tapped, setTapped] = useState<number | null>(null);

  function openTooltip(e: React.MouseEvent | React.TouchEvent, note: string) {
    const cover = (e.currentTarget as HTMLElement).querySelector(
      ".book-cover",
    ) as HTMLElement;
    if (!cover) return;
    const rect = cover.getBoundingClientRect();
    setTooltip({ note, x: rect.left + rect.width / 2, y: rect.top });
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-12 py-16">
      <div className="flex items-center gap-4 mb-8">
        <h2
          className="font-serif font-medium italic"
          style={{ fontSize: "1.8rem", color: "var(--color-text-primary)" }}
        >
          Bookshelf
        </h2>
        <span className="washi olive">Books that shaped how I think</span>
      </div>

      <div className="bookshelf-scroll">
        {BOOKS.map((book, i) => (
          <div
            key={book.title}
            className="book-item"
            onMouseEnter={
              book.note ? (e) => openTooltip(e, book.note!) : undefined
            }
            onMouseLeave={() => setTooltip(null)}
            onClick={(e) => {
              if (!book.note) return;
              if (tapped === i) {
                setTapped(null);
                setTooltip(null);
              } else {
                setTapped(i);
                openTooltip(e, book.note);
              }
            }}
          >
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div className="book-cover" style={{ background: book.gradient }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                alt={book.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <p
              className="font-sans text-xs font-semibold leading-tight mt-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {book.title}
            </p>
            <p
              className="font-serif italic text-xs mt-0.5"
              style={{ color: "var(--color-text-muted)" }}
            >
              {book.author}
            </p>
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            left: Math.max(8, tooltip.x - 110),
            top: tooltip.y - 12,
            transform: "translateY(-100%)",
            width: 220,
            background: "var(--color-text-primary)",
            color: "var(--color-surface)",
            padding: "14px 16px",
            borderRadius: "10px",
            fontSize: "0.78rem",
            lineHeight: 1.55,
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          {tooltip.note}
        </div>
      )}
    </section>
  );
}

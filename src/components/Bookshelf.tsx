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
    title: "The Brothers Karamazov",
    author: "Dostoevsky",
    isbn: "9780374528379",
    gradient: "linear-gradient(135deg, #5C4033, #8B6914)",
    note: "The book that changed how I think about love, faith, and what it means to show up for people. Alyosha's \"active love\" is the closest thing I have to a life philosophy.",
  },
  {
    title: "Man's Search for Meaning",
    author: "Viktor Frankl",
    isbn: "9780807014295",
    gradient: "linear-gradient(135deg, #2C3E50, #4A6FA5)",
    note: "Read this during a really hard time. Frankl's idea that we can't avoid suffering but can choose how we respond to it genuinely rewired something in my brain.",
  },
  {
    title: "Fear and Trembling",
    author: "Kierkegaard",
    isbn: "9780140444490",
    gradient: "linear-gradient(135deg, #6B3A5D, #A0527E)",
    note: "Kierkegaard's leap of faith as devotion, not irrationality. This book made me rethink what commitment actually looks like — in faith, in love, in everything.",
  },
  {
    title: "Crime and Punishment",
    author: "Dostoevsky",
    isbn: "9780486415871",
    gradient: "linear-gradient(135deg, #3D5A3E, #6B8F6B)",
    note: "Suffering as transformation, not punishment. Raskolnikov's journey from total isolation to genuine human connection is the most honest arc in all of literature.",
  },
  {
    title: "The Idiot",
    author: "Dostoevsky",
    isbn: "9780140447927",
    gradient: "linear-gradient(135deg, #8B4513, #CD853F)",
  },
  {
    title: "Notes from Underground",
    author: "Dostoevsky",
    isbn: "9780679734529",
    gradient: "linear-gradient(135deg, #4A3728, #7A5C48)",
  },
  {
    title: "The Stranger",
    author: "Camus",
    isbn: "9780679720201",
    gradient: "linear-gradient(135deg, #2E4057, #5D7EA0)",
    note: "The book that first made me realize philosophy could feel urgent. Meursault's detachment is unsettling because it's more relatable than we want to admit.",
  },
  {
    title: "Devotions",
    author: "Mary Oliver",
    isbn: "9780807068861",
    gradient: "linear-gradient(135deg, #6B4226, #B87333)",
    note: "Mary Oliver's poetry is medicine. \"Tell me, what is it you plan to do with your one wild and precious life?\" — I come back to that line constantly.",
  },
];

type TooltipState = { note: string; x: number; y: number } | null;

export default function Bookshelf() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [tapped, setTapped] = useState<number | null>(null);

  function openTooltip(e: React.MouseEvent | React.TouchEvent, note: string) {
    const cover = (e.currentTarget as HTMLElement).querySelector(".book-cover") as HTMLElement;
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
            onMouseEnter={book.note ? (e) => openTooltip(e, book.note!) : undefined}
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
            <div
              className="book-cover"
              style={{ background: book.gradient }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`}
                alt={book.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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

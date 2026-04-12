import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="text-center"
      style={{
        borderTop: "2px solid var(--color-border)",
        background: "var(--color-surface)",
        padding: "48px",
      }}
    >
      <p
        className="font-serif italic text-xl mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        a digital garden — growing ideas in public 🌿
      </p>
      <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
        Built with Next.js + MDX
      </p>
      <div className="flex justify-center gap-2 flex-wrap">
        {[
          { href: "/notes", label: "Notes" },
          { href: "/graph", label: "Graph" },
          { href: "/changelog", label: "Changelog" },
          { href: "/tags", label: "Tags" },
        ].map((link) => (
          <Link key={link.href} href={link.href} className="garden-btn">
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}

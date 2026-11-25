"use client";

// Last-resort page if the root layout itself fails. It replaces the whole document,
// so it carries its own minimal styling.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#060908",
          color: "#e9f0ea",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>Something went wrong</h1>
          <p style={{ color: "#8c9a91", marginBottom: "24px" }}>Please try again in a moment.</p>
          <button
            onClick={reset}
            style={{ background: "#2f7d50", color: "#fff", border: 0, borderRadius: 999, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

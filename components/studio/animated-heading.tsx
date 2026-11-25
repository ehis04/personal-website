import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  /** Wrap a word in *asterisks* to set it in the italic serif accent face. */
  text: string;
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  /** Classes for each ordinary word (e.g. a gradient or 3D shadow). */
  wordClassName?: string;
  /** Seconds to wait before the first word rises. */
  delay?: number;
}

/**
 * A heading whose words rise in one after another. Pure CSS (see `.words` in
 * studio.css): on a normal page it plays on load, inside a home-page section it
 * plays each time that section becomes active. No client JavaScript is shipped.
 * Effects sit on each word, not the parent, because gradient text and
 * transforms don't mix on a parent element.
 */
export function AnimatedHeading({
  text,
  as: Tag = "h2",
  className,
  wordClassName,
  delay = 0,
}: AnimatedHeadingProps) {
  const words = text.split(" ");
  // On real headings the words are hidden from screen readers and the whole text is
  // announced once; a plain <p> may not carry aria-label, so its words are read as normal text.
  const isHeading = Tag !== "p";
  return (
    <Tag
      aria-label={isHeading ? text.replace(/\*/g, "") : undefined}
      className={cn("words", className)}
      style={{ ["--delay" as string]: `${delay}s` }}
    >
      {words.map((word, i) => {
        const accent = word.startsWith("*") && word.endsWith("*") && word.length > 2;
        return (
          <span
            key={`${word}-${i}`}
            aria-hidden={isHeading ? "true" : undefined}
            className={cn("word", accent ? "font-accent text-accent-glow pr-[0.08em]" : wordClassName)}
            style={{ ["--i" as string]: i }}
          >
            {accent ? word.slice(1, -1) : word}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </Tag>
  );
}

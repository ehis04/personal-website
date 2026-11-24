import { cn } from "@/lib/utils";

/** A stylised document page, used as a placeholder preview for papers and the résumé. */
export function DocPreview({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "mx-auto w-[min(72%,250px)] rotate-[-3deg] rounded-md bg-[#eef2ee] p-4 shadow-2xl shadow-black/70",
        className
      )}
    >
      <div className="h-3 w-4/5 rounded bg-black/70" />
      <div className="mt-2 h-2 w-1/2 rounded bg-black/30" />
      <div className="mt-4 space-y-1.5">
        {Array.from({ length: compact ? 4 : 8 }).map((_, i) => (
          <div key={i} className="h-1.5 rounded bg-black/15" style={{ width: `${72 + ((i * 37) % 28)}%` }} />
        ))}
      </div>
      {!compact && (
        <>
          <div className="mt-4 h-16 rounded bg-[#2f7d50]/35" />
          <div className="mt-4 space-y-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-1.5 rounded bg-black/15" style={{ width: `${65 + ((i * 29) % 35)}%` }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

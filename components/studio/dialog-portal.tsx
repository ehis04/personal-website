"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

/**
 * Renders a dialog at the end of the site wrapper (.studio) instead of inside the page.
 * The page content has its own stacking context (a fade-in animation), which let the footer
 * paint on top of an open card. Out here the dialog sits above everything, footer included,
 * and still inherits the site's colour variables, which are scoped to .studio.
 * (Nothing renders on the server: the target only exists in the browser.)
 */
export function DialogPortal({ children }: { children: React.ReactNode }) {
  const target = useSyncExternalStore(
    subscribe,
    () => document.querySelector(".studio"),
    () => null
  );
  return target ? createPortal(children, target) : null;
}

/**
 * Keeps keyboard focus inside the open dialog: Tab and Shift+Tab loop through its controls
 * instead of escaping to the page hidden behind it. Call it from the dialog's key handler.
 */
export function trapTab(e: KeyboardEvent) {
  if (e.key !== "Tab") return;
  const dialog = document.querySelector<HTMLElement>('[role="dialog"]');
  if (!dialog) return;

  const focusable = Array.from(
    dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => el.offsetParent !== null);
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement as HTMLElement | null;

  if (!active || !dialog.contains(active)) {
    e.preventDefault();
    first.focus();
  } else if (e.shiftKey && active === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && active === last) {
    e.preventDefault();
    first.focus();
  }
}

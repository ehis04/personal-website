// A template re-mounts on every navigation, so the fade replays on each page
// change. It is plain CSS (see .page-in in studio.css): no client JavaScript,
// and the page is never hidden while waiting for scripts to load.
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <main id="main" tabIndex={-1} className="page-in outline-none">{children}</main>;
}

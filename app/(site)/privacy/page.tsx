import { AnimatedHeading } from "@/components/studio/animated-heading";
import { EmailLink, EmailText } from "@/components/studio/email-link";
import { contactEmailEncoded, contactEmailFallback } from "@/config/site";

export const metadata = {
  title: "Privacy",
  description: "How this website handles data: no cookies or trackers, and how the Ask assistant uses your questions.",
  alternates: { canonical: "/privacy" },
};

// Describes how the site works today. If analytics, a contact form, or any tracking is
// added later, update this page (and the "Last updated" date) at the same time.
const updated = "25 November 2026";

const sections: { title: string; body: React.ReactNode }[] = [
  {
    title: "The short version",
    body: (
      <p>
        This site sets no cookies and runs no analytics, advertising or tracking scripts. The only time anything you
        type leaves the page is when you use the Ask assistant or email me.
      </p>
    ),
  },
  {
    title: "The Ask assistant",
    body: (
      <>
        <p>
          When you send a message on the Ask page, your question (and the last few messages of the conversation, so the
          assistant has context) is sent to my server and on to Anthropic, the AI provider, to produce a reply. This
          site does not save your messages or the replies. Anthropic handles the text under its own{" "}
          <a href="https://www.anthropic.com/legal/privacy" target="_blank" rel="noopener noreferrer">
            privacy policy
          </a>
          . Please don&apos;t enter personal or sensitive information.
        </p>
        <p>
          If you use the microphone, dictation is done by your browser&apos;s built-in speech recognition. Depending on
          your browser, that audio may be processed by the browser&apos;s vendor, not by this site. The assistant can
          also read replies aloud using your browser&apos;s speech voice.
        </p>
      </>
    ),
  },
  {
    title: "Abuse prevention",
    body: (
      <p>
        To stop the assistant being overused, the number of messages is limited per visitor, using your IP address in
        a short-lived counter. It is not stored with the content of your messages.
      </p>
    ),
  },
  {
    title: "Hosting",
    body: (
      <p>
        The site is hosted on Cloudflare, which processes each request and keeps standard technical logs (such as IP
        address, browser type and the page requested) to run and secure the service. Fonts are served from this site
        and not from a third party. If a page shows an embedded video, it only loads from YouTube after you click play.
      </p>
    ),
  },
  {
    title: "Email",
    body: (
      <p>
        If you email {contactEmailEncoded ? (
          <EmailLink encoded={contactEmailEncoded}>
            <EmailText encoded={contactEmailEncoded} fallback={contactEmailFallback} />
          </EmailLink>
        ) : (
          "me"
        )}, it is forwarded
        through Cloudflare Email Routing to my inbox. I use your address only to reply.
      </p>
    ),
  },
  {
    title: "Links to other sites",
    body: (
      <p>
        This site links to my profiles on other platforms and to code and papers hosted elsewhere. Those sites have their
        own privacy practices.
      </p>
    ),
  },
  {
    title: "Questions or removal requests",
    body: (
      <p>
        If you want to ask what I hold about you, or to have an email you sent me deleted, write to{" "}
        {contactEmailEncoded ? (
          <EmailLink encoded={contactEmailEncoded}>
            <EmailText encoded={contactEmailEncoded} fallback={contactEmailFallback} />
          </EmailLink>
        ) : (
          "me"
        )}.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 pb-6 pt-24">
      <div className="px-2 pb-6">
        <p className="legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]">Privacy</p>
        <AnimatedHeading
          as="h1"
          text="How this site *handles* data"
          wordClassName="text-extrude"
          className="font-display mt-2 text-4xl leading-[0.95] md:text-6xl"
        />
        <p className="mt-4 text-sm text-[var(--ink-dim)]">Last updated {updated}</p>
      </div>

      <div className="recess space-y-8 bg-[#0c110f] p-6 md:p-10" style={{ borderRadius: 26 }}>
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="font-display text-2xl">{s.title}</h2>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-white/80 [&_a]:text-[#46b07a] [&_a]:underline [&_a]:underline-offset-2">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

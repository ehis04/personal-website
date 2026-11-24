import { AnimatedHeading } from "@/components/studio/animated-heading";
import { Chat } from "@/components/studio/chat";

export const metadata = { title: "Ask", alternates: { canonical: "/ask" } };

export default function AskPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-3 pb-8 pt-[4.5rem]">
      <div className="px-2 pb-4">
        <p className="legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]">Ask</p>
        <AnimatedHeading
          as="h1"
          text="Ask me *anything*"
          wordClassName="text-extrude"
          className="font-display mt-2 text-4xl leading-[0.95] md:text-7xl"
        />
      </div>
      <Chat />
    </div>
  );
}

"use client";

import { ArrowUp, Mic, Square, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { profile } from "@/config/studio";
import { cn } from "@/lib/utils";

import { Tile } from "./tile";

// ───────── Browser speech APIs (not in the TypeScript DOM lib everywhere) ─────────
interface RecognitionEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
type RecognitionCtor = new () => Recognition;

function recognitionCtor(): RecognitionCtor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

const never = () => () => {};

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const prompts = [
  "What are you working on now?",
  "What is xgGaffer?",
  "Which roles have you held?",
  "What did you study?",
  "What are you researching at Birmingham?",
];

const eyebrow = "legible text-[11px] uppercase tracking-[0.22em] text-[#46b07a]";

export function Chat() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const recRef = useRef<Recognition | null>(null);
  const heardRef = useRef("");
  const speakNextRef = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Feature detection that is safe for server rendering (false until hydrated).
  const canListen = useSyncExternalStore(never, () => !!recognitionCtor(), () => false);
  const canSpeak = useSyncExternalStore(never, () => "speechSynthesis" in window, () => false);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // Stop everything if the visitor leaves the page.
  useEffect(
    () => () => {
      abortRef.current?.abort();
      recRef.current?.abort();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    []
  );

  const stopSpeaking = useCallback(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((raw: string) => {
    if (!("speechSynthesis" in window) || !raw.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(raw.replace(/[*_#`]/g, ""));
    u.lang = navigator.language || "en-GB";
    u.rate = 1.02;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, []);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text || busy) return;
      stopSpeaking();
      setError(null);
      setInput("");

      const history: Msg[] = [...messages, { role: "user", content: text }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const aloud = speakReplies || speakNextRef.current;
      speakNextRef.current = false;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ messages: history.slice(-8) }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const j = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(j?.error ?? "Something went wrong.");
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((m) => {
            const copy = [...m];
            copy[copy.length - 1] = { role: "assistant", content: acc };
            return copy;
          });
        }
        if (aloud) speak(acc);
      } catch (e) {
        if (ctrl.signal.aborted) return;
        setMessages((m) => m.slice(0, -1)); // drop the empty assistant bubble
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, speak, speakReplies, stopSpeaking]
  );

  const stop = () => {
    abortRef.current?.abort();
    setBusy(false);
  };

  const toggleListening = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = recognitionCtor();
    if (!Ctor) return;
    stopSpeaking();
    const rec = new Ctor();
    rec.lang = navigator.language || "en-GB";
    rec.interimResults = true;
    rec.continuous = false;
    heardRef.current = "";
    rec.onresult = (e) => {
      let transcript = "";
      for (let i = 0; i < e.results.length; i++) transcript += e.results[i][0].transcript;
      heardRef.current = transcript;
      setInput(transcript);
    };
    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setError("Microphone access was blocked. Allow it in your browser to use voice.");
      }
    };
    rec.onend = () => {
      setListening(false);
      const heard = heardRef.current.trim();
      heardRef.current = "";
      if (heard) {
        speakNextRef.current = true; // spoke a question, so answer out loud
        void send(heard);
      }
    };
    recRef.current = rec;
    setError(null);
    setListening(true);
    rec.start();
  };

  return (
    <div className="grid grid-cols-12 gap-3">
      {/* Conversation */}
      <Tile className="col-span-12 bg-[#121a16] lg:col-span-8">
        <div className="flex h-[min(68svh,700px)] min-h-[440px] flex-col p-4 md:p-5">
          <div ref={listRef} className="studio-scroll-hide flex-1 space-y-3 overflow-y-auto pr-1">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col justify-center">
                <p className={eyebrow}>AI assistant</p>
                <p className="font-display text-extrude mt-2 text-3xl leading-[1.02] md:text-5xl">
                  Ask about {profile.name.split(" ")[0]}&apos;s work
                </p>
                <p className="mt-3 max-w-lg text-[15px] text-white/75">
                  I&apos;m an AI that answers questions about {profile.name}: background, roles, projects and
                  interests. Type, or press the mic and just speak.
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-fit max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
                    m.role === "user"
                      ? "ml-auto rounded-br-sm bg-[#2f7d50] text-white"
                      : "rounded-bl-sm bg-black/40 text-white/90 ring-1 ring-white/10"
                  )}
                >
                  {m.content || (
                    <span className="inline-flex gap-1" aria-label="Thinking">
                      {[0, 1, 2].map((d) => (
                        <span key={d} className="wave-dot h-1.5 w-1.5 rounded-full bg-[#46b07a]" style={{ ["--d" as string]: d }} />
                      ))}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-red-950/40 px-4 py-2 text-sm text-red-200 ring-1 ring-red-400/20">
              {error}
            </p>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="mt-3 flex items-center gap-2 rounded-full bg-black/45 p-1.5 pl-5 ring-1 ring-white/10 focus-within:ring-[#46b07a]/60"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              placeholder={listening ? "Listening…" : "Type a question, or press the mic…"}
              aria-label="Your question"
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[#8c9a91]"
            />
            {canListen && (
              <button
                type="button"
                onClick={toggleListening}
                aria-label={listening ? "Stop listening" : "Speak your question"}
                aria-pressed={listening}
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-full ring-1 transition-colors",
                  listening ? "animate-pulse bg-[#2f7d50] ring-[#46b07a]" : "ring-white/15 hover:bg-white/10"
                )}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
            {busy ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2f7d50] transition-colors enabled:hover:bg-[#46b07a] disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            )}
          </form>
          <p className="mt-2 px-2 text-[11px] text-[#8c9a91]">
            Answers come from an AI (Claude Haiku) and may be wrong. Voice input uses your browser&apos;s speech
            service. Nothing is saved.
          </p>
        </div>
      </Tile>

      {/* Side tiles */}
      <div className="col-span-12 grid gap-3 lg:col-span-4">
        <Tile className="bg-gradient-to-br from-[#123a26]/70 to-[#121a16]">
          <div className="flex h-full flex-col p-5">
            <div className="flex items-center justify-between">
              <p className={eyebrow}>Hear the answers</p>
              {canSpeak ? (
                <button
                  type="button"
                  onClick={() => {
                    if (speakReplies) stopSpeaking();
                    setSpeakReplies((v) => !v);
                  }}
                  aria-pressed={speakReplies}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs ring-1 transition-colors",
                    speakReplies ? "bg-[#2f7d50] ring-[#46b07a]" : "ring-white/20 hover:bg-white/10"
                  )}
                >
                  {speakReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {speakReplies ? "On" : "Off"}
                </button>
              ) : (
                <span className="text-xs text-[#8c9a91]">Not supported in this browser</span>
              )}
            </div>
            <div
              className={cn("my-4 flex h-24 items-center gap-1", !speaking && "wave-paused")}
              aria-hidden="true"
            >
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="wave-bar h-full flex-1 rounded-full bg-[#2f7d50]/80"
                  style={{ ["--d" as string]: i % 12 }}
                />
              ))}
            </div>
            <p className="text-xs text-[#8c9a91]">
              Speak a question and the answer is read back to you. Turn this on to hear typed questions too.
            </p>
          </div>
        </Tile>

        <Tile className="bg-[#121a16]">
          <div className="p-5">
            <p className={eyebrow}>Try asking</p>
            <ul className="mt-3 space-y-2">
              {prompts.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => void send(q)}
                    disabled={busy}
                    className="w-full rounded-xl bg-black/30 px-4 py-3 text-left text-[15px] ring-1 ring-white/5 transition-colors hover:bg-black/50 hover:ring-[#46b07a]/40 disabled:opacity-50"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Tile>
      </div>
    </div>
  );
}

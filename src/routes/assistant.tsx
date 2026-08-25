import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Send, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useWorkspaceStore } from "@/lib/use-workspace-store";
import {
  seedEmails,
  seedMeetings,
  seedTasks,
  type Email,
  type Meeting,
  type Task,
} from "@/lib/workspace-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Workspace Briefings" },
      {
        name: "description",
        content:
          "Ask the workspace assistant to summarise your day, inbox, meetings and tasks. Runs locally with no account or exposed API keys.",
      },
      { property: "og:title", content: "AI Assistant — Workspace Briefings" },
      { property: "og:description", content: "Summaries of your day, inbox, meetings and tasks." },
    ],
  }),
  component: Assistant,
});

type Message = { role: "user" | "assistant"; text: string };

// Local, deterministic assistant over workspace data.
// No provider keys anywhere in the client. When a hosted model is added it
// must be called from a server function, never from this component.
function answer(input: string, ctx: { tasks: Task[]; emails: Email[]; meetings: Meeting[] }) {
  const q = input.toLowerCase();
  const open = ctx.tasks.filter((t) => !t.done);
  const unread = ctx.emails.filter((e) => !e.read);
  const today = new Date().toDateString();
  const todayMeetings = ctx.meetings.filter((m) => new Date(m.start).toDateString() === today);

  if (q.includes("task") || q.includes("todo") || q.includes("to-do")) {
    return open.length
      ? `You have ${open.length} open task(s):\n` +
          open.map((t) => `• ${t.title} (${t.priority}${t.due ? `, due ${new Date(t.due).toLocaleDateString()}` : ""})`).join("\n")
      : "No open tasks — the board is clear.";
  }
  if (q.includes("email") || q.includes("inbox")) {
    return unread.length
      ? `${unread.length} unread message(s):\n` + unread.map((e) => `• ${e.from} — ${e.subject}`).join("\n")
      : "Inbox zero. Nothing unread.";
  }
  if (q.includes("meeting") || q.includes("calendar") || q.includes("schedule")) {
    return todayMeetings.length
      ? "Today's meetings:\n" +
          todayMeetings
            .map((m) => `• ${new Date(m.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${m.title} (${m.durationMin} min)`)
            .join("\n")
      : "No meetings on the calendar today.";
  }
  return (
    `Here's your brief: ${todayMeetings.length} meeting(s) today, ${unread.length} unread email(s), ` +
    `and ${open.length} open task(s). ` +
    (open[0] ? `Top priority: "${open[0].title}".` : "Nothing outstanding.")
  );
}

const prompts = [
  "Summarise my day",
  "What tasks are open?",
  "Anything unread in my inbox?",
  "What meetings do I have today?",
];

function Assistant() {
  const [tasks] = useWorkspaceStore<Task[]>("tasks", seedTasks);
  const [emails] = useWorkspaceStore<Email[]>("emails", seedEmails);
  const [meetings] = useWorkspaceStore<Meeting[]>("meetings", seedMeetings);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi. Ask me about your tasks, inbox or calendar." },
  ]);
  const [input, setInput] = useState("");

  const send = (raw?: string) => {
    const text = (raw ?? input).trim().slice(0, 1000);
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      { role: "assistant", text: answer(text, { tasks, emails, meetings }) },
    ]);
    setInput("");
  };

  return (
    <AppShell title="AI Assistant" description="Briefings drawn from your workspace data.">
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
        <section className="panel flex min-h-[28rem] flex-col p-5">
          <div className="flex-1 space-y-4 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex gap-3", m.role === "user" && "flex-row-reverse text-right")}
              >
                {m.role === "assistant" && (
                  <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                    <Sparkles className="size-4" />
                  </span>
                )}
                <p
                  className={cn(
                    "max-w-[85%] whitespace-pre-line rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-end gap-2 border-t border-border pt-4">
            <Textarea
              value={input}
              maxLength={1000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about your day…"
              className="min-h-11 resize-none"
            />
            <Button onClick={() => send()} aria-label="Send">
              <Send className="size-4" />
            </Button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="panel p-5">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Try asking
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="panel p-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2 font-medium text-foreground">
              <ShieldCheck className="size-4 text-success" /> Key-safe by design
            </p>
            <p className="mt-2 leading-relaxed">
              Replies are generated locally from your workspace data. Any hosted model added later
              is called server-side only — no provider keys ever reach the browser.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

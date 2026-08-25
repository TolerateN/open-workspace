import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Star, MailOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useWorkspaceStore } from "@/lib/use-workspace-store";
import { seedEmails, type Email } from "@/lib/workspace-data";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/emails")({
  head: () => ({
    meta: [
      { title: "Emails — Workspace Inbox" },
      {
        name: "description",
        content: "Read, star and triage your workspace inbox. No sign-in, no accounts required.",
      },
      { property: "og:title", content: "Emails — Workspace Inbox" },
      { property: "og:description", content: "Triage your inbox in the single-user workspace." },
    ],
  }),
  component: Emails,
});

function Emails() {
  const [emails, setEmails] = useWorkspaceStore<Email[]>("emails", seedEmails);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const filtered = emails.filter(
    (e) => !q || e.subject.toLowerCase().includes(q) || e.from.toLowerCase().includes(q),
  );
  const selected = filtered.find((e) => e.id === selectedId) ?? filtered[0] ?? null;

  const open = (id: string) => {
    setSelectedId(id);
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, read: true } : e)));
  };

  const toggleStar = (id: string) =>
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e)));

  return (
    <AppShell
      title="Emails"
      description={`${emails.filter((e) => !e.read).length} unread`}
      actions={
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value.slice(0, 120))}
          placeholder="Search inbox"
          className="w-48 md:w-64"
        />
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <ul className="panel divide-y divide-border overflow-hidden">
          {filtered.map((email) => (
            <li key={email.id}>
              <button
                onClick={() => open(email.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                  selected?.id === email.id && "bg-muted",
                )}
              >
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(email.id);
                  }}
                  role="button"
                  aria-label="Star email"
                  className="mt-0.5"
                >
                  <Star
                    className={cn(
                      "size-4",
                      email.starred ? "fill-accent text-accent" : "text-muted-foreground",
                    )}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className={cn("truncate text-sm", !email.read && "font-semibold")}>
                      {email.from}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(email.receivedAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-sm">{email.subject}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                    {email.preview}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-muted-foreground">No matches.</li>
          )}
        </ul>

        <section className="panel p-6">
          {selected ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-xl font-semibold">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {selected.from} ·{" "}
                    {new Date(selected.receivedAt).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <Badge variant="secondary">{selected.label}</Badge>
              </div>
              <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">{selected.body}</p>
            </>
          ) : (
            <div className="flex h-full min-h-40 flex-col items-center justify-center text-muted-foreground">
              <MailOpen className="size-6" />
              <p className="mt-2 text-sm">Select an email to read it.</p>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}

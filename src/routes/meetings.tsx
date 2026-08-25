import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Users, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useWorkspaceStore } from "@/lib/use-workspace-store";
import { seedMeetings, type Meeting } from "@/lib/workspace-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings — Workspace Calendar" },
      {
        name: "description",
        content: "Plan and review your meetings, agendas and attendees. Opens instantly, no login.",
      },
      { property: "og:title", content: "Meetings — Workspace Calendar" },
      { property: "og:description", content: "Your upcoming meetings, agendas and attendees." },
    ],
  }),
  component: Meetings,
});

function Meetings() {
  const [meetings, setMeetings] = useWorkspaceStore<Meeting[]>("meetings", seedMeetings);
  const [title, setTitle] = useState("");
  const [when, setWhen] = useState("");

  const add = () => {
    const clean = title.trim().slice(0, 120);
    if (!clean || !when) {
      toast.error("Add a title and a date/time.");
      return;
    }
    const start = new Date(when);
    if (Number.isNaN(start.getTime())) {
      toast.error("That date doesn't look valid.");
      return;
    }
    setMeetings((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: clean,
        start: start.toISOString(),
        durationMin: 30,
        attendees: ["You"],
        location: "Video call",
        agenda: "",
      },
    ]);
    setTitle("");
    setWhen("");
    toast.success("Meeting scheduled");
  };

  const sorted = [...meetings].sort((a, b) => +new Date(a.start) - +new Date(b.start));
  const groups = sorted.reduce<Record<string, Meeting[]>>((acc, m) => {
    const key = new Date(m.start).toLocaleDateString([], {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
    (acc[key] ||= []).push(m);
    return acc;
  }, {});

  return (
    <AppShell title="Meetings" description={`${meetings.length} scheduled`}>
      <div className="panel mb-6 flex flex-wrap items-center gap-3 p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 120))}
          placeholder="Meeting title"
          className="min-w-48 flex-1"
        />
        <Input
          type="datetime-local"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          className="w-56"
        />
        <Button onClick={add}>
          <Plus className="size-4" /> Schedule
        </Button>
      </div>

      <div className="space-y-6">
        {Object.entries(groups).map(([label, items]) => (
          <section key={label}>
            <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {label}
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((m) => (
                <article key={m.id} className="panel p-5">
                  <h3 className="font-display text-base font-semibold">{m.title}</h3>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="size-4" />
                      {new Date(m.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ·{" "}
                      {m.durationMin} min
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="size-4" />
                      {m.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Users className="size-4" />
                      {m.attendees.join(", ")}
                    </p>
                  </div>
                  {m.agenda ? (
                    <p className="mt-4 border-t border-border pt-3 text-sm">{m.agenda}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}

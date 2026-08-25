import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckSquare, Mail, CalendarDays, Sparkles, ArrowRight } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Single-User Productivity Workspace" },
      {
        name: "description",
        content:
          "An open workspace dashboard with emails, meetings, tasks and an AI assistant. No login, no accounts — opens straight to your work.",
      },
      { property: "og:title", content: "Dashboard — Single-User Productivity Workspace" },
      {
        property: "og:description",
        content: "Emails, meetings, tasks and an AI assistant in one no-login workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="panel p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const [tasks] = useWorkspaceStore<Task[]>("tasks", seedTasks);
  const [emails] = useWorkspaceStore<Email[]>("emails", seedEmails);
  const [meetings] = useWorkspaceStore<Meeting[]>("meetings", seedMeetings);

  const openTasks = tasks.filter((t) => !t.done);
  const unread = emails.filter((e) => !e.read);
  const today = new Date().toDateString();
  const todayMeetings = meetings.filter((m) => new Date(m.start).toDateString() === today);

  return (
    <AppShell
      title="Dashboard"
      description="Everything on your plate today, in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={CheckSquare} label="Open tasks" value={String(openTasks.length)} hint={`${tasks.length - openTasks.length} completed`} />
        <Stat icon={Mail} label="Unread email" value={String(unread.length)} hint={`${emails.length} in inbox`} />
        <Stat icon={CalendarDays} label="Meetings today" value={String(todayMeetings.length)} hint={`${meetings.length} scheduled this week`} />
        <Stat icon={Sparkles} label="Focus" value="3h" hint="Protected block this morning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section className="panel p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Priority tasks</h2>
            <Link to="/tasks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              All tasks <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border">
            {openTasks.slice(0, 5).map((task) => (
              <li key={task.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">{task.project}</p>
                </div>
                <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
                  {task.priority}
                </Badge>
              </li>
            ))}
            {openTasks.length === 0 && (
              <li className="py-6 text-sm text-muted-foreground">Nothing open. Nice.</li>
            )}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Today's schedule</h2>
              <Link to="/meetings" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Calendar <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {todayMeetings.map((m) => (
                <li key={m.id} className="flex gap-3">
                  <span className="w-14 shrink-0 font-display text-sm font-semibold text-accent">
                    {new Date(m.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.location} · {m.durationMin} min</p>
                  </div>
                </li>
              ))}
              {todayMeetings.length === 0 && (
                <li className="text-sm text-muted-foreground">No meetings today.</li>
              )}
            </ul>
          </section>

          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Unread email</h2>
              <Link to="/emails" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                Inbox <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {unread.slice(0, 3).map((e) => (
                <li key={e.id} className="min-w-0">
                  <p className="truncate text-sm font-medium">{e.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.from}</p>
                </li>
              ))}
              {unread.length === 0 && (
                <li className="text-sm text-muted-foreground">Inbox zero.</li>
              )}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

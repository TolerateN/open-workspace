import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { useWorkspaceStore } from "@/lib/use-workspace-store";
import { seedTasks, type Task } from "@/lib/workspace-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — Workspace To-Do Board" },
      {
        name: "description",
        content: "Capture, prioritise and complete tasks in your single-user workspace. No account needed.",
      },
      { property: "og:title", content: "Tasks — Workspace To-Do Board" },
      { property: "og:description", content: "Capture and complete tasks without signing in." },
    ],
  }),
  component: Tasks,
});

const filters = ["all", "open", "done"] as const;

function Tasks() {
  const [tasks, setTasks] = useWorkspaceStore<Task[]>("tasks", seedTasks);
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("open");

  const add = () => {
    const clean = draft.trim().slice(0, 160);
    if (!clean) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: clean, done: false, priority: "medium", project: "Inbox" },
      ...prev,
    ]);
    setDraft("");
  };

  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const remove = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task removed");
  };

  const visible = tasks.filter((t) =>
    filter === "all" ? true : filter === "open" ? !t.done : t.done,
  );

  return (
    <AppShell
      title="Tasks"
      description={`${tasks.filter((t) => !t.done).length} open · ${tasks.filter((t) => t.done).length} done`}
    >
      <div className="panel mb-6 flex items-center gap-3 p-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 160))}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a task and press Enter"
          className="flex-1"
        />
        <Button onClick={add}>
          <Plus className="size-4" /> Add
        </Button>
      </div>

      <div className="mb-4 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full border border-border px-3 py-1 text-sm capitalize transition-colors",
              filter === f
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="panel divide-y divide-border">
        {visible.map((task) => (
          <li key={task.id} className="flex items-center gap-3 px-4 py-3">
            <Checkbox checked={task.done} onCheckedChange={() => toggle(task.id)} />
            <div className="min-w-0 flex-1">
              <p className={cn("truncate text-sm font-medium", task.done && "text-muted-foreground line-through")}>
                {task.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {task.project}
                {task.due
                  ? ` · due ${new Date(task.due).toLocaleDateString([], { month: "short", day: "numeric" })}`
                  : ""}
              </p>
            </div>
            <Badge variant={task.priority === "high" ? "destructive" : "secondary"}>
              {task.priority}
            </Badge>
            <button
              onClick={() => remove(task.id)}
              aria-label="Delete task"
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-muted-foreground">Nothing here.</li>
        )}
      </ul>
    </AppShell>
  );
}

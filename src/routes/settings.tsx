import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useWorkspaceStore } from "@/lib/use-workspace-store";
import { defaultSettings, type Settings } from "@/lib/workspace-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workspace Preferences" },
      {
        name: "description",
        content: "Configure workspace name, timezone, focus hours and assistant tone. No accounts, no sign-in.",
      },
      { property: "og:title", content: "Settings — Workspace Preferences" },
      { property: "og:description", content: "Workspace name, timezone, notifications and assistant tone." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [settings, setSettings] = useWorkspaceStore<Settings>("settings", defaultSettings);

  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <AppShell title="Settings" description="Preferences for this workspace.">
      <div className="grid max-w-3xl gap-6">
        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Workspace</h2>
          <div className="grid gap-2">
            <Label htmlFor="name">Workspace name</Label>
            <Input
              id="name"
              value={settings.workspaceName}
              maxLength={60}
              onChange={(e) => set("workspaceName", e.target.value.slice(0, 60))}
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="tz">Timezone</Label>
              <Input
                id="tz"
                value={settings.timezone}
                maxLength={60}
                onChange={(e) => set("timezone", e.target.value.slice(0, 60))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="focus">Focus hours</Label>
              <Input
                id="focus"
                value={settings.focusHours}
                maxLength={40}
                onChange={(e) => set("focusHours", e.target.value.slice(0, 40))}
              />
            </div>
          </div>
        </section>

        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Notifications</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Daily email digest</p>
              <p className="text-sm text-muted-foreground">A morning summary of unread mail.</p>
            </div>
            <Switch
              checked={settings.emailDigest}
              onCheckedChange={(v) => set("emailDigest", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Meeting reminders</p>
              <p className="text-sm text-muted-foreground">Ping me 10 minutes before.</p>
            </div>
            <Switch
              checked={settings.meetingReminders}
              onCheckedChange={(v) => set("meetingReminders", v)}
            />
          </div>
        </section>

        <section className="panel space-y-4 p-6">
          <h2 className="font-display text-lg font-semibold">Assistant</h2>
          <div className="grid max-w-xs gap-2">
            <Label>Reply tone</Label>
            <Select
              value={settings.aiTone}
              onValueChange={(v) => set("aiTone", v as Settings["aiTone"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise</SelectItem>
                <SelectItem value="friendly">Friendly</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            This workspace has no accounts or sign-in. Data stays on this device until a database is
            connected.
          </p>
        </section>

        <div>
          <Button
            variant="outline"
            onClick={() => {
              setSettings(defaultSettings);
              toast.success("Settings reset");
            }}
          >
            Reset to defaults
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

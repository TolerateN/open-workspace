import { Link } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  CalendarDays,
  CheckSquare,
  Sparkles,
  Settings as SettingsIcon,
  Menu,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/emails", label: "Emails", icon: Mail },
  { to: "/meetings", label: "Meetings", icon: CalendarDays },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
        >
          <Icon className="size-4 shrink-0 opacity-80 group-data-[status=active]:text-sidebar-primary" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

export function AppShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 lg:sticky lg:top-0 lg:flex lg:h-screen",
          open ? "flex" : "hidden",
        )}
      >
        <div className="flex items-center gap-2 px-2 pt-2">
          <span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary font-display text-sm font-bold text-sidebar-primary-foreground">
            W
          </span>
          <span className="font-display text-base font-semibold text-sidebar-foreground">
            Workspace
          </span>
        </div>
        <NavList onNavigate={() => setOpen(false)} />
        <p className="mt-auto rounded-lg bg-sidebar-accent/60 px-3 py-2 text-xs leading-relaxed text-sidebar-foreground/70">
          Single-user workspace. No sign-in required.
        </p>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex items-start gap-4 border-b border-border bg-background/85 px-5 py-4 backdrop-blur md:px-8">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            className="mt-1 rounded-md border border-border p-2 text-muted-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-2xl font-semibold">{title}</h1>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </header>
        <main className="flex-1 px-5 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}

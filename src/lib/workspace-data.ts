// Single-user workspace data. No auth, no user IDs, no accounts.
// Persistence layer is intentionally modular: swap `storage` for a database
// adapter later without touching any UI code.

export type Task = {
  id: string;
  title: string;
  notes?: string;
  done: boolean;
  priority: "low" | "medium" | "high";
  due?: string;
  project: string;
};

export type Email = {
  id: string;
  from: string;
  subject: string;
  preview: string;
  body: string;
  receivedAt: string;
  read: boolean;
  starred: boolean;
  label: "inbox" | "updates" | "clients";
};

export type Meeting = {
  id: string;
  title: string;
  start: string;
  durationMin: number;
  attendees: string[];
  location: string;
  agenda: string;
};

export type Settings = {
  workspaceName: string;
  timezone: string;
  focusHours: string;
  emailDigest: boolean;
  meetingReminders: boolean;
  aiTone: "concise" | "friendly" | "formal";
};

export const defaultSettings: Settings = {
  workspaceName: "My Workspace",
  timezone: "Africa/Johannesburg",
  focusHours: "09:00 – 12:00",
  emailDigest: true,
  meetingReminders: true,
  aiTone: "concise",
};

const day = (offset: number, hour: number, min = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

export const seedTasks: Task[] = [
  { id: "t1", title: "Draft Q3 workspace roadmap", done: false, priority: "high", due: day(0, 17), project: "Planning", notes: "Include AI assistant milestones." },
  { id: "t2", title: "Reply to Nadia about the invoice", done: false, priority: "medium", due: day(1, 10), project: "Finance" },
  { id: "t3", title: "Prep agenda for design sync", done: true, priority: "medium", due: day(-1, 9), project: "Design" },
  { id: "t4", title: "Archive last quarter's meeting notes", done: false, priority: "low", project: "Admin" },
  { id: "t5", title: "Review analytics dashboard copy", done: false, priority: "medium", due: day(2, 14), project: "Product" },
];

export const seedEmails: Email[] = [
  {
    id: "e1",
    from: "Nadia Petersen",
    subject: "Invoice #2291 — ready for your review",
    preview: "Hi, attaching the revised invoice with the updated line items…",
    body: "Hi,\n\nAttaching the revised invoice with the updated line items for the June retainer. Let me know if the hours look right and I'll send it through to accounts.\n\nThanks,\nNadia",
    receivedAt: day(0, 8, 12),
    read: false,
    starred: true,
    label: "clients",
  },
  {
    id: "e2",
    from: "Product Digest",
    subject: "5 workflow changes shipping this week",
    preview: "Calendar sync, faster search, and a new task board layout…",
    body: "This week: calendar sync improvements, faster global search, and a new compact task board layout.",
    receivedAt: day(0, 7, 3),
    read: false,
    starred: false,
    label: "updates",
  },
  {
    id: "e3",
    from: "Thabo Mokoena",
    subject: "Design sync moved to Thursday",
    preview: "Quick heads-up — I moved our sync to Thursday 11:00…",
    body: "Quick heads-up — I moved our sync to Thursday 11:00 so the research readout can land first. Same link.",
    receivedAt: day(-1, 16, 40),
    read: true,
    starred: false,
    label: "inbox",
  },
  {
    id: "e4",
    from: "Aisha Khan",
    subject: "Notes from the client workshop",
    preview: "Summarised the three priorities we agreed on…",
    body: "Summarised the three priorities we agreed on: onboarding clarity, reporting depth, and faster exports.",
    receivedAt: day(-2, 12, 5),
    read: true,
    starred: true,
    label: "clients",
  },
];

export const seedMeetings: Meeting[] = [
  { id: "m1", title: "Design sync", start: day(0, 11), durationMin: 45, attendees: ["Thabo", "Aisha"], location: "Video call", agenda: "Research readout, component review." },
  { id: "m2", title: "Client check-in — Northwind", start: day(0, 15, 30), durationMin: 30, attendees: ["Nadia", "Sam"], location: "Video call", agenda: "Invoice, next milestone." },
  { id: "m3", title: "Roadmap planning", start: day(1, 9), durationMin: 60, attendees: ["Team"], location: "Room 2B", agenda: "Q3 themes and sequencing." },
  { id: "m4", title: "Retro", start: day(3, 16), durationMin: 45, attendees: ["Team"], location: "Video call", agenda: "What to stop, start, continue." },
];

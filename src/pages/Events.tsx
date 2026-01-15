import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/events.css";

/**
 * Events page - robust parsing of events.json, upcoming events list, and clear handling
 * of fields so a non-technical client can edit a single file at /public/events.json.
 *
 * Supported fields in events.json (examples):
 *  - title (string) [required]
 *  - start (ISO date or date-time string, e.g. "2026-02-10" or "2026-02-10T09:00:00") [required]
 *  - end   (ISO date or date-time string) [optional]
 *  - description (string) [optional]
 *  - location (string) [optional]
 *  - url (string) [optional] - link to a document or registration page
 *  - instructor (string) [optional]
 *  - capacity (number or string) [optional]
 *  - allDay (boolean) [optional] - if true, event will be treated as an all-day event
 *
 * Notes about fields and parsing:
 *  - If a field is "N/A" (case-insensitive) or empty string, it will be treated as missing.
 *  - Date-only strings like "2026-02-10" are treated as all-day events by default.
 *  - If `end` is missing and the event is timed, `end` defaults to start + 1 hour.
 *  - If `end` is missing and the event is all-day/date-only, `end` equals start (single day).
 *
 * Editing:
 *  - Edit the single file at /public/events.json (or the hosted equivalent). The page reads it
 *    at runtime and will show events without code changes.
 */

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type RawEvent = {
  title?: unknown;
  start?: unknown;
  end?: unknown;
  description?: unknown;
  location?: unknown;
  url?: unknown;
  instructor?: unknown;
  capacity?: unknown;
  allDay?: unknown;
};

type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  url?: string;
  instructor?: string;
  capacity?: string | number;
  allDay?: boolean;
};

/* ---------- Parsing helpers ---------- */

function isDateOnlyString(s: string) {
  // Matches YYYY-MM-DD (strict)
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function isNullOrNA(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  if (/^n\/?a$/i.test(trimmed)) return true; // matches 'N/A' or 'NA' (case-insensitive)
  return false;
}

function toSafeString(value: unknown): string | undefined {
  if (isNullOrNA(value)) return undefined;
  return String(value).trim();
}

function toNumberOrString(value: unknown): string | number | undefined {
  if (isNullOrNA(value)) return undefined;
  // If it's numeric, return number, otherwise return string
  if (typeof value === "number") return value;
  const s = String(value).trim();
  if (s === "") return undefined;
  const n = Number(s);
  if (!Number.isNaN(n) && String(n) === s) return n;
  return s;
}

function parseDateInput(value?: unknown): {
  date: Date | null;
  isDateOnly: boolean;
} {
  if (value === undefined || value === null)
    return { date: null, isDateOnly: false };
  const s = String(value).trim();
  if (s.length === 0) return { date: null, isDateOnly: false };
  if (isDateOnlyString(s)) {
    // date-only; parse with Date constructor which will create a midnight local date
    // We'll mark it as date-only so we can treat it as all-day.
    const d = new Date(s + "T00:00:00");
    if (Number.isFinite(d.getTime())) return { date: d, isDateOnly: true };
    return { date: null, isDateOnly: false };
  }
  // Try Date parse for date-time strings (ISO)
  const d = new Date(s);
  if (Number.isFinite(d.getTime())) return { date: d, isDateOnly: false };
  // Fallback: try parsing common formats with date-fns parse
  try {
    const parsed = parse(s, "yyyy-MM-dd'T'HH:mm:ss", new Date());
    if (Number.isFinite(parsed.getTime()))
      return { date: parsed, isDateOnly: false };
  } catch {
    // ignore
  }
  return { date: null, isDateOnly: false };
}

/* ---------- Mapping function ---------- */

function mapRawToCalendarEvents(raw: RawEvent[]): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  for (const r of raw) {
    const title = toSafeString(r.title) ?? "Untitled event";
    const parsedStart = parseDateInput(r.start);
    if (!parsedStart.date) {
      // skip invalid entries without a start date
      console.warn("Skipping event due to invalid or missing start:", r);
      continue;
    }

    const parsedEnd = parseDateInput(r.end);
    // Determine allDay: explicit boolean true OR date-only start/end
    const explicitAllDay =
      typeof r.allDay === "boolean" ? (r.allDay as boolean) : undefined;
    const allDay =
      (explicitAllDay ?? parsedStart.isDateOnly) || parsedEnd.isDateOnly;

    let start = parsedStart.date as Date;
    let end: Date;

    if (parsedEnd.date) {
      end = parsedEnd.date;
    } else {
      // End missing: default behavior
      if (allDay) {
        // single all-day - set end = start (react-big-calendar handles allDay)
        end = new Date(start.getTime());
      } else {
        // timed event - default to 1 hour duration
        end = new Date(start.getTime() + 1000 * 60 * 60);
      }
    }

    // If both start/end are date-only, ensure times reflect all-day semantics.
    if (allDay) {
      // Normalize start to date-only midnight and end to same day (many calendars want end exclusive,
      // but react-big-calendar will respect the allDay flag; keep end equal to start to represent single day).
      start = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      end = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    }

    const ev: CalendarEvent = {
      title,
      start,
      end,
      description: toSafeString(r.description),
      location: toSafeString(r.location),
      url: toSafeString(r.url),
      instructor: toSafeString(r.instructor),
      capacity: toNumberOrString(r.capacity),
      allDay,
    };

    events.push(ev);
  }

  return events;
}

/* ---------- Simple ICS generator (basic) ---------- */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toICSDatetimeUTC(d: Date) {
  // returns YYYYMMDDTHHMMSSZ
  return (
    d.getUTCFullYear().toString() +
    pad2(d.getUTCMonth() + 1) +
    pad2(d.getUTCDate()) +
    "T" +
    pad2(d.getUTCHours()) +
    pad2(d.getUTCMinutes()) +
    pad2(d.getUTCSeconds()) +
    "Z"
  );
}

function escapeICSText(s?: string) {
  if (!s) return "";
  return s.replace(/\r\n|\n|\r/g, "\\n").replace(/,/g, "\\,");
}

function generateICS(events: CalendarEvent[]) {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//prestige-strategies//TrainingCalendar//EN",
  ];
  for (const e of events) {
    lines.push("BEGIN:VEVENT");
    // a simple UID using timestamp + random suffix (generated at export time)
    lines.push(
      `UID:${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}@prestige-strategies`,
    );
    lines.push(`DTSTAMP:${toICSDatetimeUTC(new Date())}`);
    lines.push(`DTSTART:${toICSDatetimeUTC(e.start)}`);
    lines.push(`DTEND:${toICSDatetimeUTC(e.end)}`);
    lines.push(`SUMMARY:${escapeICSText(e.title)}`);
    if (e.description)
      lines.push(`DESCRIPTION:${escapeICSText(e.description)}`);
    if (e.location) lines.push(`LOCATION:${escapeICSText(e.location)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/* ---------- Component ---------- */

export function EventsPage(): React.ReactElement {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/events.json", { cache: "no-cache" });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = (await res.json()) as unknown;
        if (!Array.isArray(json)) {
          throw new Error("events.json must be an array");
        }
        const mapped = mapRawToCalendarEvents(json as RawEvent[]);
        if (!cancelled) setEvents(mapped);
      } catch (err) {
        console.error("Could not load /events.json:", err);
        // fallback sample event (created on demand)
        const now = new Date();
        const fallbackRaw: RawEvent[] = [
          {
            title: "Sample - Edit /public/events.json to add events",
            start: now.toISOString(),
            end: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
            description:
              "This is a fallback example event. Replace events.json with your items.",
          },
        ];
        if (!cancelled) {
          setEvents(mapRawToCalendarEvents(fallbackRaw));
          setError("Could not load /events.json — displaying a sample event.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function onDownloadICS() {
    try {
      const ics = generateICS(events);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "training-calendar.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate ICS", err);
      setError("Failed to generate .ics file.");
    }
  }

  // Upcoming events (end >= now), sorted by start
  const now = new Date();
  const upcoming = events
    .filter((e) => e.end.getTime() >= now.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 6);

  // Calendar control state: make the calendar controlled so the toolbar/navigation reliably update the UI.
  // Default the calendar date to the next upcoming event (if any) so users land on relevant items.
  const [calDate, setCalDate] = useState<Date>(
    upcoming.length ? upcoming[0].start : new Date(),
  );
  // Narrow the calView to the specific view strings used by react-big-calendar.
  type CalView = "month" | "week" | "work_week" | "day" | "agenda";
  const [calView, setCalView] = useState<CalView>(Views.MONTH as CalView);

  // Helper: safely map arbitrary view strings into our CalView union.
  // This avoids assigning raw strings directly to state and prevents type errors.
  function normalizeView(v: string): CalView {
    if (
      v === "month" ||
      v === "week" ||
      v === "work_week" ||
      v === "day" ||
      v === "agenda"
    ) {
      return v;
    }
    // default fallback
    return "month";
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Event Calendar</h1>

          {error ? (
            <div className="mt-3 text-sm text-yellow-600">{error}</div>
          ) : null}
          <div className="mt-4 flex gap-2">
            <button
              onClick={onDownloadICS}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Download calendar as .ics"
            >
              Download .ics
            </button>
            <a
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm"
              href="/events.json"
              target="_blank"
              rel="noreferrer"
              title="Open events.json"
            >
              Open events.json
            </a>
          </div>
        </div>
      </div>

      <div style={{ height: 680 }}>
        {!loading && (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
            popup
            showMultiDayTimes
            // controlled props so toolbar and navigation update our state and remain responsive
            date={calDate}
            view={calView}
            onNavigate={(date) => {
              setCalDate(date as Date);
            }}
            onView={(view) => {
              // normalize the incoming view value to our CalView type
              const nv = normalizeView(view as string);

              // When switching to Agenda, keep the agenda focused on the currently selected month.
              // This keeps Month/Week/Day/Agenda in sync with the same month context.
              if (nv === "agenda") {
                setCalDate(
                  new Date(calDate.getFullYear(), calDate.getMonth(), 1),
                );
              }

              setCalView(nv);
            }}
          />
        )}
        {loading && <div>Loading events...</div>}
      </div>
    </div>
  );
}

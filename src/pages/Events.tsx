import React, { useEffect, useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../styles/events.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon, MapPin, Clock } from "lucide-react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type RawEvent = { [key: string]: unknown };
type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  url?: string;
  allDay?: boolean;
};

const mapRawToCalendarEvents = (raw: RawEvent[]): CalendarEvent[] => {
  return raw
    .map((r) => {
      // Handle API response format - events have date and time fields
      const dateStr = String(r.date ?? '');
      const timeStr = String(r.time ?? '00:00');
      
      // Combine date and time
      const startDate = dateStr ? new Date(`${dateStr}T${timeStr}`) : new Date();
      // End date is 1 hour after start by default
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      
      return {
        title: String(r.title ?? "Untitled Event"),
        start: startDate,
        end: endDate,
        description: String(r.description ?? ""),
        location: String(r.location ?? ""),
        url: String(r.registration_url ?? ""),
        allDay: false,
      };
    })
    .filter((e) => e.start && e.end && !isNaN(e.start.getTime()));
};

export function EventsPage(): React.ReactElement {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<(typeof Views)[keyof typeof Views]>(
    Views.MONTH,
  );
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/events/list.php?status=active", { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const apiResponse = await res.json();
        // API returns {success: true, data: [...]}
        const json = (apiResponse.data || []) as RawEvent[];
        if (!cancelled) setEvents(mapRawToCalendarEvents(json));
      } catch (err) {
        console.error("Could not load events from API:", err);
        if (!cancelled)
          setError("Could not load events. Please try again later.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.start > now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 3);
  }, [events]);

  return (
    <>
      <section className="bg-background text-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
              Events
            </h1>
            <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
              Join our workshops, webinars, and training sessions.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center text-muted-foreground">
            Loading events...
          </div>
        )}
        {error && <div className="text-center text-red-500">{error}</div>}

        {!loading && !error && (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Upcoming Events
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{event.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(event.start, "PPP")}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm mb-2">
                        <Clock className="mr-2 h-4 w-4" />
                        {format(event.start, "p")} - {format(event.end, "p")}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-muted-foreground text-sm mb-4">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      <p className="text-sm mb-4">{event.description}</p>
                      {event.url && (
                        <Button asChild>
                          <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Register Now
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-8">
              Full Calendar
            </h2>
            <Card className="p-4">
              <div style={{ height: 600 }}>
                <Calendar
                  localizer={localizer}
                  events={events}
                  selectable={true}
                  onSelectEvent={(event) => {
                    console.log("Selected event:", event);
                  }}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: "100%" }}
                  views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                  view={view}
                  onView={(view) => setView(view)}
                  date={date}
                  onNavigate={(newDate) => setDate(newDate)}
                  popup
                  showMultiDayTimes
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </>
  );
}

export default EventsPage;

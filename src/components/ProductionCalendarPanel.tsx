import { AlertTriangle, CalendarDays, CalendarPlus, CheckCircle2, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { localOutlookCalendarAdapter } from "../calendar/outlookCalendarAdapter";
import { getOutlookCalendarUrl, getOutlookComposeUrl } from "../calendar/outlookLinks";
import { findCalendarConflicts, generateProductionFlowEvents, getUpcomingShoots } from "../calendar/productionFlowScheduler";
import type { CalendarEvent, ProjectInput, TimelineResult } from "../types";

interface ProductionCalendarPanelProps {
  input: ProjectInput;
  timeline: TimelineResult;
}

const typeStyles: Record<CalendarEvent["type"], string> = {
  Shoot: "border-critical/40 bg-critical/10 text-critical",
  "Pre-Production": "border-white/15 bg-white/10 text-bone",
  Production: "border-clear/40 bg-clear/10 text-clear",
  "Post-Production": "border-elevated/40 bg-elevated/10 text-elevated",
  Review: "border-attention/40 bg-attention/10 text-attention",
  Delivery: "border-clear/40 bg-clear/10 text-clear",
  Hold: "border-white/15 bg-white/10 text-muted",
};

export function ProductionCalendarPanel({ input, timeline }: ProductionCalendarPanelProps) {
  const existingEvents = localOutlookCalendarAdapter.listEvents();
  const recommendedEvents = generateProductionFlowEvents(input, timeline);
  const conflicts = findCalendarConflicts(recommendedEvents, existingEvents);
  const upcomingShoots = getUpcomingShoots(existingEvents);

  return (
    <section className="rounded-lg border border-white/10 bg-panel/85 p-5">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Calendar + Scheduling Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-bone">Outlook Production Flow</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-muted">
            {localOutlookCalendarAdapter.name}
          </span>
          <a
            href={getOutlookCalendarUrl()}
            className="inline-flex items-center gap-2 rounded-md border border-clear/30 bg-clear/10 px-3 py-2 text-xs font-semibold text-clear transition hover:border-clear/60"
          >
            <CalendarDays size={14} />
            Open Outlook
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[minmax(0,1fr)_410px]">
        <div className="space-y-4">
          <CalendarSubsection title="Live Calendar Preview" detail={`${existingEvents.length} visible events`}>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {existingEvents.slice(0, 4).map((event) => (
                <CalendarEventCard key={event.id} event={event} compact />
              ))}
            </div>
          </CalendarSubsection>

          <CalendarSubsection title="Recommended Holds" detail="Generated from current scope">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {recommendedEvents.map((event) => (
                <CalendarEventCard key={event.id} event={event} />
              ))}
            </div>
            <div className="mt-4 rounded-md border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-bone">
                <CalendarPlus size={16} className="text-clear" />
                Draft Outlook Actions
              </div>
              <p className="text-sm leading-6 text-muted">
                These links open pre-filled Outlook event drafts now. With Microsoft Graph auth later, the same event payloads
                can be written automatically after confirmation.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {recommendedEvents.slice(0, 3).map((event) => (
                  <a
                    key={event.id}
                    href={getOutlookComposeUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs font-semibold text-bone transition hover:border-clear/40 hover:text-clear"
                  >
                    Add {event.type}
                    <ExternalLink size={12} />
                  </a>
                ))}
              </div>
            </div>
          </CalendarSubsection>
        </div>

        <div className="space-y-4">
          <CalendarSubsection title="Scheduled Shoots" detail={`${upcomingShoots.length} visible`}>
            <div className="space-y-3">
              {upcomingShoots.map((event) => (
                <CalendarEventCard key={event.id} event={event} compact />
              ))}
            </div>
          </CalendarSubsection>

          <CalendarSubsection title="Conflict Check" detail={conflicts.length ? `${conflicts.length} conflicts` : "Clear"}>
            {conflicts.length ? (
              <div className="space-y-3">
                {conflicts.slice(0, 4).map((conflict) => (
                  <article key={`${conflict.eventId}-${conflict.date}`} className="rounded-md border border-elevated/30 bg-elevated/10 p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="mt-0.5 text-elevated" />
                      <div>
                        <h4 className="text-sm font-semibold text-bone">{conflict.title}</h4>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          {conflict.date}, {conflict.overlapHours} hrs overlap. {conflict.note}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-clear/30 bg-clear/10 p-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 text-clear" />
                  <p className="text-sm leading-6 text-clear">No overlaps detected against visible Outlook-style events.</p>
                </div>
              </div>
            )}
          </CalendarSubsection>
        </div>
      </div>
    </section>
  );
}

function CalendarSubsection({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-bone">{title}</h3>
        <span className="text-xs text-muted">{detail}</span>
      </div>
      {children}
    </div>
  );
}

function CalendarEventCard({ event, compact = false }: { event: CalendarEvent; compact?: boolean }) {
  return (
    <article className="rounded-md border border-white/10 bg-panel/80 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-semibold text-bone">{event.title}</h4>
          <p className="mt-1 text-xs leading-5 text-muted">{formatRange(event.start, event.end)}</p>
        </div>
        <span className={`rounded-full border px-2.5 py-1 text-xs ${typeStyles[event.type]}`}>{event.type}</span>
      </div>
      {!compact ? (
        <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-muted sm:grid-cols-2">
          <span>{event.location || "Location TBD"}</span>
          <span>{event.status}</span>
          <span className="sm:col-span-2">{event.attendees?.join(", ") || "Attendees TBD"}</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
          <span>{event.location || "Location TBD"}</span>
          <a href={getOutlookComposeUrl(event)} target="_blank" rel="noreferrer" className="text-clear hover:underline">
            Open
          </a>
        </div>
      )}
    </article>
  );
}

function formatRange(start: string, end: string) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const date = startDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const startTime = startDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  const endTime = endDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${date}, ${startTime} - ${endTime}`;
}

import type { CalendarConflict, CalendarEvent, ProjectInput, TimelineResult } from "../types";

const dayMs = 86_400_000;
const workdayStartHour = 9;
const workdayEndHour = 17;

const phaseTypeMap: Record<string, CalendarEvent["type"]> = {
  "Pre-Production": "Pre-Production",
  Production: "Production",
  "Post-Production": "Post-Production",
  "Review / Revision": "Review",
  Delivery: "Delivery",
};

export function generateProductionFlowEvents(input: ProjectInput, timeline: TimelineResult): CalendarEvent[] {
  const start = parseDate(input.projectStartDate);
  if (!start) return [];

  let cursor = start;
  return timeline.phaseBreakdown.map((phase, index) => {
    const phaseDays = Math.max(1, Math.round(phase.days));
    const phaseStart = setHour(cursor, workdayStartHour);
    const phaseEnd = setHour(addDays(cursor, phaseDays - 1), workdayEndHour);
    cursor = addDays(cursor, phaseDays);

    return {
      id: `REC-${index + 1}`,
      title: `${phase.phase}: ${input.projectName}`,
      projectName: input.projectName,
      type: phaseTypeMap[phase.phase] ?? "Hold",
      start: toLocalIso(phaseStart),
      end: toLocalIso(phaseEnd),
      location: phase.phase === "Production" ? input.productionEnvironment : "Production calendar hold",
      attendees: [input.projectOwner, input.requestingTeam].filter(Boolean),
      status: "Tentative",
      source: "Generated recommendation",
    };
  });
}

export function findCalendarConflicts(recommendations: CalendarEvent[], existingEvents: CalendarEvent[]): CalendarConflict[] {
  return recommendations.flatMap((recommendation) =>
    existingEvents
      .filter((event) => event.status !== "Free" && datesOverlap(recommendation.start, recommendation.end, event.start, event.end))
      .map((event) => ({
        eventId: event.id,
        title: event.title,
        date: formatDate(event.start),
        overlapHours: getOverlapHours(recommendation.start, recommendation.end, event.start, event.end),
        severity: event.status === "Busy" ? "High" : "Moderate",
        note: `${recommendation.type} recommendation overlaps with ${event.status.toLowerCase()} calendar time.`,
      })),
  );
}

export function getUpcomingShoots(events: CalendarEvent[]) {
  return [...events]
    .filter((event) => event.type === "Shoot" || event.type === "Production")
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 5);
}

function datesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const startA = new Date(aStart).getTime();
  const endA = new Date(aEnd).getTime();
  const startB = new Date(bStart).getTime();
  const endB = new Date(bEnd).getTime();
  return startA < endB && startB < endA;
}

function getOverlapHours(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const overlapStart = Math.max(new Date(aStart).getTime(), new Date(bStart).getTime());
  const overlapEnd = Math.min(new Date(aEnd).getTime(), new Date(bEnd).getTime());
  return Math.round(((overlapEnd - overlapStart) / 3_600_000) * 10) / 10;
}

function parseDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function setHour(date: Date, hour: number) {
  const next = new Date(date);
  next.setHours(hour, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * dayMs);
}

function toLocalIso(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:00`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

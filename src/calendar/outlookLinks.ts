import type { CalendarEvent } from "../types";

const outlookBaseUrl = "https://outlook.office.com/calendar/view/workweek";

export function getOutlookCalendarUrl() {
  return outlookBaseUrl;
}

export function getOutlookComposeUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: event.title,
    startdt: event.start,
    enddt: event.end,
    location: event.location ?? "",
    body: buildBody(event),
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

function buildBody(event: CalendarEvent) {
  return [
    `Project: ${event.projectName}`,
    `Production phase: ${event.type}`,
    `Status: ${event.status}`,
    `Source: ${event.source}`,
    event.attendees?.length ? `Suggested attendees: ${event.attendees.join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

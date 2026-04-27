import { sampleCalendarEvents } from "./sampleCalendarEvents";
import type { CalendarEvent } from "../types";

export interface CalendarAdapter {
  name: string;
  listEvents: () => CalendarEvent[];
}

export const localOutlookCalendarAdapter: CalendarAdapter = {
  name: "Local Outlook-style sample adapter",
  listEvents: () => sampleCalendarEvents,
};

// Future production implementation:
// - replace listEvents with Microsoft Graph calendarView reads
// - add createEvent/updateEvent methods only after auth and write confirmation UX exist
// - preserve this CalendarEvent shape so dashboard components do not need to change

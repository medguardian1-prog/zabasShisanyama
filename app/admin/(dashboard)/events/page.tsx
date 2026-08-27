import { adminEvents } from "@/app/admin/queries";
import EventsManager from "./EventsManager";

export default async function AdminEventsPage() {
  const events = await adminEvents();

  return (
    <div>
      <h1 className="text-xl font-semibold text-bone">Events</h1>
      <p className="mt-1 text-sm text-ash">
        What&rsquo;s on at Zaba&rsquo;s — shows on the homepage and the events
        page.
      </p>
      <EventsManager events={events} />
    </div>
  );
}

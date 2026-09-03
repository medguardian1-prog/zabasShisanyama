import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminEvents } from "@/app/admin/queries";
import EventsManager from "./EventsManager";

export default async function AdminEventsPage() {
  const events = await adminEvents();

  return (
    <div>
      <ScreenHelp
        title="Events"
        blurb={
          <>
            What&rsquo;s on at Zaba&rsquo;s — shows on the homepage and the
            events page.
          </>
        }
        help={ADMIN_HELP.events}
      />
      <EventsManager events={events} />
    </div>
  );
}

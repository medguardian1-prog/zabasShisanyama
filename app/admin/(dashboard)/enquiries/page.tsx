import { adminEnquiries } from "@/app/admin/queries";
import EnquiriesInbox from "./EnquiriesInbox";

export default async function AdminEnquiriesPage() {
  const enquiries = await adminEnquiries();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-bone">Inbox</h1>
      <p className="mt-1 text-sm text-ash">
        Bookings and messages from the website, newest first.
      </p>
      <EnquiriesInbox enquiries={enquiries} />
    </div>
  );
}

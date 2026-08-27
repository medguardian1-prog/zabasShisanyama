import { adminOpeningHours, adminSiteSettings } from "@/app/admin/queries";
import HoursManager from "./HoursManager";

export default async function AdminHoursPage() {
  const [hours, settings] = await Promise.all([
    adminOpeningHours(),
    adminSiteSettings(),
  ]);

  return (
    <div>
      <h1 className="text-base font-semibold text-bone">Hours & announcement</h1>
      <p className="mt-1 text-xs leading-relaxed text-ash">
        Set each day&rsquo;s times, or flip &ldquo;Closed&rdquo; for the whole
        day.
      </p>
      <HoursManager hours={hours} settings={settings} />
    </div>
  );
}

import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminOpeningHours, adminSiteSettings } from "@/app/admin/queries";
import HoursManager from "./HoursManager";

export default async function AdminHoursPage() {
  const [hours, settings] = await Promise.all([
    adminOpeningHours(),
    adminSiteSettings(),
  ]);

  return (
    <div>
      <ScreenHelp
        title="Hours & announcement"
        blurb={
          <>
            Set each day&rsquo;s times, or flip &ldquo;Closed&rdquo; for the
            whole day.
          </>
        }
        help={ADMIN_HELP.hours}
      />
      <HoursManager hours={hours} settings={settings} />
    </div>
  );
}

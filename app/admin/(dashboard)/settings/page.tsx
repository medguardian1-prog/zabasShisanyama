import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminSiteSettings } from "@/app/admin/queries";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await adminSiteSettings();

  return (
    <div>
      <ScreenHelp
        title="Settings"
        blurb={<>Contact details and social links shown across the site.</>}
        help={ADMIN_HELP.settings}
      />
      <SettingsForm settings={settings} />
    </div>
  );
}

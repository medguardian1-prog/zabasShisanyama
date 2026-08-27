import { adminSiteSettings } from "@/app/admin/queries";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await adminSiteSettings();

  return (
    <div>
      <h1 className="text-xl font-semibold text-bone">Settings</h1>
      <p className="mt-1 text-sm text-ash">
        Contact details and social links shown across the site.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}

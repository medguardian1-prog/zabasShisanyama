import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminCategories, adminMenuItems } from "@/app/admin/queries";
import MenuManager from "./MenuManager";

export default async function AdminMenuPage() {
  const [categories, items] = await Promise.all([
    adminCategories(),
    adminMenuItems(),
  ]);

  return (
    <div>
      <ScreenHelp
        title="Menu"
        blurb={
          <>
            Tap the toggle to mark something sold out. Changes go live straight
            away.
          </>
        }
        help={ADMIN_HELP.menu}
      />
      <MenuManager categories={categories} items={items} />
    </div>
  );
}

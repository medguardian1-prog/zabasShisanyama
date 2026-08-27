import { adminCategories, adminMenuItems } from "@/app/admin/queries";
import MenuManager from "./MenuManager";

export default async function AdminMenuPage() {
  const [categories, items] = await Promise.all([
    adminCategories(),
    adminMenuItems(),
  ]);

  return (
    <div>
      <h1 className="text-base font-semibold text-bone">Menu</h1>
      <p className="mt-1 text-xs leading-relaxed text-ash">
        Tap the toggle to mark something sold out. Changes go live straight
        away.
      </p>
      <MenuManager categories={categories} items={items} />
    </div>
  );
}

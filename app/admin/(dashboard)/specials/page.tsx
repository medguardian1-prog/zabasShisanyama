import { adminSpecials } from "@/app/admin/queries";
import SpecialsManager from "./SpecialsManager";

export default async function AdminSpecialsPage() {
  const specials = await adminSpecials();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-bone">Specials</h1>
      <p className="mt-1 text-sm text-ash">
        &ldquo;Set as today&rsquo;s special&rdquo; switches the others off
        automatically.
      </p>
      <SpecialsManager specials={specials} />
    </div>
  );
}

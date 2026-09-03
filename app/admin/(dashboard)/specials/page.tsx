import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminSpecials } from "@/app/admin/queries";
import SpecialsManager from "./SpecialsManager";

export default async function AdminSpecialsPage() {
  const specials = await adminSpecials();

  return (
    <div>
      <ScreenHelp
        title="Specials"
        blurb={
          <>
            &ldquo;Set as today&rsquo;s special&rdquo; switches the others off
            automatically.
          </>
        }
        help={ADMIN_HELP.specials}
      />
      <SpecialsManager specials={specials} />
    </div>
  );
}

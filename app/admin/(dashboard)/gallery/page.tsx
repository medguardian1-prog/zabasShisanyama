import ScreenHelp from "@/components/admin/ScreenHelp";
import { ADMIN_HELP } from "@/lib/admin-help";
import { adminGalleryImages } from "@/app/admin/queries";
import GalleryManager from "./GalleryManager";

export default async function AdminGalleryPage() {
  const images = await adminGalleryImages();

  return (
    <div>
      <ScreenHelp
        title="Gallery"
        blurb={
          <>
            Photos are squeezed down automatically before upload — snap straight
            from your phone.
          </>
        }
        help={ADMIN_HELP.gallery}
      />
      <GalleryManager images={images} />
    </div>
  );
}

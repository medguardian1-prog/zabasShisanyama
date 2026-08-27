import { adminGalleryImages } from "@/app/admin/queries";
import GalleryManager from "./GalleryManager";

export default async function AdminGalleryPage() {
  const images = await adminGalleryImages();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-wide text-bone">Gallery</h1>
      <p className="mt-1 text-sm text-ash">
        Photos are squeezed down automatically before upload — snap straight
        from your phone.
      </p>
      <GalleryManager images={images} />
    </div>
  );
}

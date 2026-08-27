import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BookingForm from "@/components/BookingForm";
import HoursWidget from "@/components/HoursWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getOpeningHours, getSiteSettings } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact & Bookings",
  description:
    "Book a table at Zaba's Shisanyama, place a large order, or just get in touch.",
  openGraph: {
    title: "Contact & Bookings · Zaba's Shisanyama",
    images: ["/images/logo.jpg"],
  },
};

export default async function ContactPage() {
  const [hours, settings] = await Promise.all([
    getOpeningHours(),
    getSiteSettings(),
  ]);

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading
          eyebrow="Contact & Bookings"
          title="Save yourself a seat at the fire"
        />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BookingForm />
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="eyebrow mb-5">Prefer to talk?</p>
              <div className="space-y-4 text-sm text-ash">
                {settings?.phone && settings.phone !== "TODO" ? (
                  <p>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-bone transition-colors hover:text-flame"
                    >
                      {settings.phone}
                    </a>
                  </p>
                ) : (
                  <p>Phone: TODO</p>
                )}
                <WhatsAppButton number={settings?.whatsapp} />
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5">Hours</p>
              <HoursWidget hours={hours} />
            </div>
            <div>
              <p className="eyebrow mb-5">Find Us</p>
              <p className="text-sm text-ash">
                {settings?.address && settings.address !== "TODO"
                  ? settings.address
                  : "Address: TODO"}
              </p>
              {settings?.mapLink && settings.mapLink !== "TODO" && (
                <a
                  href={settings.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
                >
                  Open in Maps
                </a>
              )}
            </div>
          </aside>
        </div>
      </Section>
    </div>
  );
}

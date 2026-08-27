import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BookingForm from "@/components/BookingForm";
import ContactForm from "@/components/ContactForm";
import HoursWidget from "@/components/HoursWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getOpeningHours, getSiteSettings } from "@/lib/queries";
import SocialLinks from "@/components/SocialLinks";
import {
  DEFAULT_ADDRESS,
  DEFAULT_FACEBOOK,
  DEFAULT_INSTAGRAM,
  DEFAULT_MAP_LINK,
  DEFAULT_PHONE,
  DEFAULT_TIKTOK,
  withDefault,
} from "@/lib/site-defaults";

export const metadata: Metadata = {
  title: "Contact & Bookings",
  description:
    "Book a table at Zaba's Shisanyama on WhatsApp, place a large order, or get in touch.",
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

  const phone = withDefault(settings?.phone, DEFAULT_PHONE);

  return (
    <div className="pt-16 sm:pt-20">
      <Section tone="char">
        <SectionHeading
          eyebrow="Contact & Bookings"
          title="Save yourself a seat at the fire"
        />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BookingForm whatsappSetting={settings?.whatsapp} />
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="eyebrow mb-5">Prefer to talk?</p>
              <div className="space-y-4 text-sm text-ash">
                <p>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="text-bone transition-colors hover:text-flame"
                  >
                    {phone}
                  </a>
                </p>
                <WhatsAppButton number={settings?.whatsapp} />
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5">Hours</p>
              <HoursWidget hours={hours} />
            </div>
            <div>
              <p className="eyebrow mb-5">Follow the fire</p>
              <SocialLinks
                links={[
                  {
                    platform: "instagram",
                    href: withDefault(settings?.instagram, DEFAULT_INSTAGRAM),
                  },
                  {
                    platform: "facebook",
                    href: withDefault(settings?.facebook, DEFAULT_FACEBOOK),
                  },
                  {
                    platform: "tiktok",
                    href: withDefault(settings?.tiktok, DEFAULT_TIKTOK),
                  },
                ]}
              />
            </div>
            <div>
              <p className="eyebrow mb-5">Find Us</p>
              <p className="text-sm text-ash">
                {withDefault(settings?.address, DEFAULT_ADDRESS)}
              </p>
              <a
                href={withDefault(settings?.mapLink, DEFAULT_MAP_LINK)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
              >
                Open in Maps
              </a>
            </div>
          </aside>
        </div>
      </Section>

      <Section tone="smoke">
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="Something else?"
            title="Send us a message"
          />
          <p className="-mt-8 mb-10 text-sm leading-relaxed text-ash sm:text-base">
            Not a booking — feedback, questions, anything. This one comes
            through to our inbox and we&rsquo;ll get back to you.
          </p>
          <ContactForm />
        </div>
      </Section>
    </div>
  );
}

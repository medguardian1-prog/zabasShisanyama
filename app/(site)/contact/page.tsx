import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import EnquiryForm from "@/components/EnquiryForm";
import HoursWidget from "@/components/HoursWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getOpeningHours, getSiteSettings } from "@/lib/queries";
import SocialLinks from "@/components/SocialLinks";
import { withDefaultHours } from "@/lib/hours";
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
  title: "Contact",
  description:
    "Get in touch with Zaba's Shisanyama in Cato Manor, Durban. WhatsApp us with any question, or find our hours and directions.",
  openGraph: {
    title: "Contact · Zaba's Shisanyama",
    images: ["/images/logo.png"],
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
          eyebrow="Contact"
          title="Come talk to us"
        />
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <EnquiryForm whatsappSetting={settings?.whatsapp} />
          </div>
          <aside className="space-y-10 lg:col-span-4 lg:col-start-9">
            <div>
              <p className="eyebrow mb-5">Prefer to talk?</p>
              <div className="space-y-4 text-sm text-ash">
                <p>
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="tap-target text-bone transition-colors hover:text-flame"
                  >
                    {phone}
                  </a>
                </p>
                <WhatsAppButton number={settings?.whatsapp} />
              </div>
            </div>
            <div>
              <p className="eyebrow mb-5">Hours</p>
              <HoursWidget hours={withDefaultHours(hours)} />
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
                className="tap-target mt-3 inline-block text-sm text-bone underline decoration-gold underline-offset-4 transition-colors hover:text-flame"
              >
                Open in Maps
              </a>
            </div>
          </aside>
        </div>
      </Section>

      {/* The "Send us a message" form was removed on 2026-09-03 together with
          the staff Inbox. It wrote into an `enquiries` table that no longer has
          a screen to read it, so every message would have gone into a black
          hole. Contact now funnels to WhatsApp and the phone number above,
          which is where the restaurant actually answers. */}
    </div>
  );
}

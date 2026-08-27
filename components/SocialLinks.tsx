import { cn } from "@/lib/utils";

type Platform = "instagram" | "facebook" | "tiktok";

const ICONS: Record<Platform, React.ReactNode> = {
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle
        cx="12"
        cy="12"
        r="4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"
    />
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M16.7 2.8h-2.9v12.4a2.4 2.4 0 1 1-2.4-2.4c.26 0 .5.04.74.11v-3a5.6 5.6 0 0 0-.74-.05 5.4 5.4 0 1 0 5.4 5.4V9.4a6.9 6.9 0 0 0 4 1.28V7.7c-2.2-.1-3.9-1.9-4.1-4.9Z"
    />
  ),
};

const LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
};

export default function SocialLinks({
  links,
  className,
}: {
  links: { platform: Platform; href: string }[];
  className?: string;
}) {
  if (!links.length) return null;

  return (
    <ul className={cn("flex gap-3", className)}>
      {links.map(({ platform, href }) => (
        <li key={platform}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Zaba's Shisanyama on ${LABELS[platform]}`}
            className="group flex h-11 w-11 items-center justify-center border border-hair text-ash transition-all duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-ember hover:bg-ember hover:text-bone"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px]"
              aria-hidden="true"
            >
              {ICONS[platform]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}

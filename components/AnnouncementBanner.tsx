export default function AnnouncementBanner({ text }: { text: string }) {
  return (
    <aside
      aria-label="Announcement"
      className="bg-ember px-5 py-3 text-center text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-bone"
    >
      {text}
    </aside>
  );
}

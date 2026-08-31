import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center bg-char px-5 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="display-xl text-5xl text-bone sm:text-7xl">
        This plate is empty
      </h1>
      <p className="mt-5 max-w-sm text-ash">
        The page you&rsquo;re looking for isn&rsquo;t on the menu. Head back to
        the fire.
      </p>
      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-ember px-8 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-bone transition-colors duration-300 hover:bg-flame"
      >
        Back Home
      </Link>
    </main>
  );
}

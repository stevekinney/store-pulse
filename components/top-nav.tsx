import Link from "next/link";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/stores", label: "Stores" },
  { href: "/products", label: "Products" },
  { href: "/tasks", label: "Tasks" },
];

export function TopNav() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
          <span aria-hidden className="inline-block h-6 w-6 rounded bg-emerald-500" />
          <span>StorePulse</span>
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
            Demo
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

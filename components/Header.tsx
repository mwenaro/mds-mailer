import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b py-4">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <h1 className="text-lg font-medium">MDS Mailer</h1>
        <nav>
          <Link href="/register">Register</Link>
        </nav>
      </div>
    </header>
  );
}

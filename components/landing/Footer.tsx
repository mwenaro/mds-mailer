export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 py-8 dark:border-zinc-800">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} MDS Mailer. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

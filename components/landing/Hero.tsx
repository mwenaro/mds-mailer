import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-900">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:flex lg:items-center lg:gap-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:flex-auto lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            MDS Mailer — fast, secure email for power users
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Register, add mailboxes (SMTP/IMAP), and manage your emails from a slick dashboard.
            Compose, send, and track messages with speed and privacy.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
            <a
              href="/register"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm hover:opacity-95"
            >
              Create account
            </a>
            <a href="#features" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Learn more <span aria-hidden>→</span>
            </a>
          </div>
        </div>

        <div className="mt-16 lg:mt-0 lg:flex-shrink-0 lg:pl-8">
          <div className="mx-auto max-w-xs sm:max-w-md lg:mx-0">
            <div className="rounded-2xl bg-white/70 p-6 shadow-lg backdrop-blur dark:bg-zinc-800/60">
              <Image src="/public/icons/icon-192.png" alt="MDS Mailer" width={192} height={192} />
              <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">Compact inbox preview</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

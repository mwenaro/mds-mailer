export default function CTA() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
          Ready to try MDS Mailer?
        </h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Sign up now and connect your first mailbox — free trial included.
        </p>
        <div className="mt-6">
          <a
            href="/register"
            className="inline-flex rounded-md bg-foreground px-4 py-2 text-sm font-semibold text-background"
          >
            Start free trial
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Features() {
  const items = [
    {
      title: 'Multiple mailboxes',
      desc: 'Add email addresses with SMTP/IMAP settings and switch between accounts.',
    },
    {
      title: 'Unified inbox',
      desc: 'Read emails from all your addresses in one place with filters and search.',
    },
    { title: 'Compose & send', desc: 'Rich composer with templates, attachments, and scheduling.' },
    { title: 'Privacy-first', desc: 'Local-first preferences and encrypted storage options.' },
  ];

  return (
    <section id="features" className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">Features</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300 max-w-2xl">
          All the tools you need to manage email efficiently.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <article
              key={it.title}
              className="rounded-xl border border-zinc-100 p-6 dark:border-zinc-700"
            >
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{it.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HowItWorks() {
  const steps = [
    { title: 'Sign up', desc: 'Create an account with email and password.' },
    { title: 'Add mailbox', desc: 'Provide SMTP/IMAP settings for sending and receiving.' },
    { title: 'Use dashboard', desc: 'Access your inbox, compose messages, and manage templates.' },
  ];

  return (
    <section id="how" className="py-16 bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-white">How it works</h2>
        <p className="mt-2 text-zinc-600 dark:text-zinc-300">
          Get started in minutes — we guide you through adding mailboxes and composing mails.
        </p>

        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.title}
              className="rounded-lg border border-zinc-100 p-6 dark:border-zinc-700"
            >
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

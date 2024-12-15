export default function FAQPage() {
  return (
    <main className="pt-24 pb-10 px-10 lg:px-12 max-w-3xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-10">
        FAQ
      </h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">What is Invitator?</h2>
          <p className="text-muted-foreground">
            Invitator is an enhanced party management tool built on the foundations of birthdaiii.
            It helps hosts manage their events more effectively with features like guest tracking,
            customizable invitations, and detailed event management.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How is this different from birthdaiii?</h2>
          <p className="text-muted-foreground">
            While birthdaiii provided excellent core functionality, Invitator extends these capabilities
            with additional features and improvements. We maintain compatibility with the original
            concept while adding more advanced management options and customization features.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">How do I get access?</h2>
          <p className="text-muted-foreground">
            Invitator is invitation-only. You&apos;ll need a specific link from an event host to access
            any party details. This ensures privacy and security for all events.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">I&apos;m a host, how do I create an event?</h2>
          <p className="text-muted-foreground">
            If you&apos;re interested in hosting an event with Invitator, you&apos;ll need to set up your own
            instance. Check out our GitHub repository for detailed installation and setup instructions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Is my data secure?</h2>
          <p className="text-muted-foreground">
            Yes! We take privacy seriously. Each event is protected by unique access tokens, and we
            don&apos;t share any guest information or event details with unauthorized users. All data is
            stored securely and is only accessible to the event host and invited guests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Can I contribute to the project?</h2>
          <p className="text-muted-foreground">
            Absolutely! Invitator is open-source, and we welcome contributions. Visit our GitHub
            repository to learn more about contributing, reporting issues, or suggesting new features.
          </p>
        </section>
      </div>
    </main>
  );
}

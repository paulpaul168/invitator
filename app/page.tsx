import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"

export default function Home() {
  return (
    <main className="pt-24 pb-10 px-10 lg:px-12 max-w-3xl mx-auto">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pb-6">
        Invitator 🎉
      </h1>

      <div className="space-y-6">
        <p className="text-lg leading-7">
          Welcome to Invitator - a powerful party management tool inspired by
          <a
            href="https://github.com/flofriday/birthdaiii"
            className="text-primary hover:underline mx-1"
          >
            birthdaiii
          </a>
          by flofriday. While birthdaiii provided excellent fundamentals, Invitator extends
          the functionality with additional features for more comprehensive event management.
        </p>

        <div className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Enhanced Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Dark mode support</li>
            <li>All original birthdaiii capabilities</li>
            <li>Extended guest management system</li>
            <li>More customization options</li>
            <li>Additional WhatsApp and Telegram sending</li>
          </ul>
        </div>

        <p>
          If you haven&apos;t received an invite link, you won&apos;t be able to access most features.
          However, you can check out both projects on GitHub to learn more.
        </p>

        <div className="flex gap-4">
          <Button asChild>
            <a href="https://github.com/paulpaul168/invitator" className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              Invitator
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://github.com/flofriday/birthdaiii" className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              birthdaiii
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "invitator 🎂",
  description: "Let's celebrate!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + " min-h-screen flex flex-col justify-between"}>
        {children}
        <Toaster />
        <div>
          <Separator />
          <footer className="mx-auto w-full px-10 lg:px-12 max-w-2xl text-slate-600 text-sm py-3 flex justify-between">
            <span>
              Built for
              <span className="max-[450px]:hidden"> world domination</span>
              <span> 😈</span>
            </span>
            <span>
              <a className="underline" href="https://github.com/paulpaul168/invitator">GitHub</a> · <Link className="underline" href="/faq">FAQ</Link>
            </span>
          </footer>
        </div>
      </body>
    </html>
  );
}

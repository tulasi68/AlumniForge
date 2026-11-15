import type { Metadata } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { institutionConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: institutionConfig.name,
  description: institutionConfig.tagline,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-lg min-h-screen bg-white shadow-sm relative pb-20">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
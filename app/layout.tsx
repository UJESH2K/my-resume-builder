import type { Metadata } from "next";
import { DbProvider } from "@/components/DbProvider";
import { TopBar } from "@/components/TopBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Studio",
  description: "Local resume library and LaTeX builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DbProvider>
          <TopBar />
          {children}
        </DbProvider>
      </body>
    </html>
  );
}

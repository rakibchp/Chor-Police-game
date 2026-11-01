import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chor Police — চোর পুলিশ",
  description:
    "Play the classic Bangladeshi Chor Police paper-slip guessing game. Follow the clue, catch the Chor, and earn points.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

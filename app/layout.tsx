import type { Metadata } from "next";
import "./globals.css";
import { BookmarkProvider } from "@/contexts/BookmarkContext";

export const metadata: Metadata = {
  title: "Hadoop Exam Prep",
  description: "Master Hadoop with interactive practice questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <BookmarkProvider>
          {children}
        </BookmarkProvider>
      </body>
    </html>
  );
}
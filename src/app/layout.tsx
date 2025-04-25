import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Designer",
  description: "Design your school life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

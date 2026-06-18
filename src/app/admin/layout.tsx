import type { Metadata } from "next";

// The admin studio is private — keep it out of search engines.
export const metadata: Metadata = {
  title: "Lullaby studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

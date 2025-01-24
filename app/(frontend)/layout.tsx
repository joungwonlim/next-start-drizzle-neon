import type { Metadata } from "next";

export const metadata: Metadata = {
  // Configure metadata for this layout.
  title: "Frontend Layout",
  description: "Layout for the (frontend) route group",
};

interface FrontendLayoutProps {
  children: React.ReactNode;
}

export default function FrontendLayout({
  children,
}: FrontendLayoutProps) {
  // Define the layout component.
  return (
    <>
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>
    </>
  );
}

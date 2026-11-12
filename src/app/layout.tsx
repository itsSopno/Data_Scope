import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "DataScope – Enterprise Data Discovery & Intelligence Platform",
  description:
    "Explore, search, filter, analyze, and manage large volumes of structured business data with sub-second performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <StoreProvider>
          {children}
          <Toaster richColors position="bottom-right" />
        </StoreProvider>
      </body>
    </html>
  );
}

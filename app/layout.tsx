import type { Metadata } from "next";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/NavBar";
import { ThemeProvider } from "@/components/theme-provider";
import Container from "@/components/container";
import { Toaster } from "@/components/ui/toaster";
import LocationFilter from "@/components/LocationFilter";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Stay Savvy",
  description: "Book a hotel of your choice",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="">
          <Suspense fallback={<div>Loading...</div>}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <main className="flex flex-col min-h-screen bg-secondary">
                <NavBar />

                <LocationFilter />
                <section className="flex-grow">
                  <Container>{children}</Container>
                </section>
              </main>
            </ThemeProvider>
          </Suspense>
        </body>
      </html>
    </ClerkProvider>
  );
}

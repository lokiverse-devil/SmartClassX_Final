import type { Metadata } from "next";
import "./globals.css";

import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "SmartClassX - Recorded Lectures",
  description: "IoT-enabled smart classroom system with recorded lectures, smart attendance, and document digitalization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
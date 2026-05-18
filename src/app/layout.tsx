import type { Metadata } from "next";
import { CyberBackground } from "@/components/effects/cyber-background";
import { APP_NAME, APP_TAGLINE, PORTAL_URL } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_TAGLINE,
  metadataBase: new URL(PORTAL_URL),
  openGraph: {
    title: APP_NAME,
    description: APP_TAGLINE,
    url: PORTAL_URL,
    siteName: APP_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        <CyberBackground />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

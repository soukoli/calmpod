import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalmPod — Deep Work Pods",
  description:
    "Místo, kam si jdeš na pár hodin opravdu něco vytvořit. Klidné pracovní prostory v přírodě i ve městě.",
  metadataBase: new URL("https://calmpod.cz"),
  openGraph: {
    title: "CalmPod — Deep Work Pods",
    description: "Klidné pracovní prostory v přírodě i ve městě, blízko tebe.",
    images: ["/CP_logo_big.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@4/dist/maplibre-gl.css"
        />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import "@repo/ui/styles.css";

import type { Metadata } from "next";
import PlausibleProvider from "next-plausible";


import "./globals.css";

export const metadata: Metadata = {
  title: "Monorepo Template",
  description: "A starter template for building something great",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  

  return (
    
        <html lang="en">
          <head>
            <PlausibleProvider
              domain={process.env.PLAUSIBLE_DOMAIN}
              trackOutboundLinks
              trackFileDownloads
            />
          </head>
          <body>{children}</body>
        </html>
  );
};

export default RootLayout;

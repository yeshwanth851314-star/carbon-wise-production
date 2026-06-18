import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "CarbonWise AI",
  description:
    "Understand Your Impact. Reduce Your Footprint. AI Personal Climate Coach.",
};

import VideoBackground from "@/components/VideoBackground";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50`}
      >
        <VideoBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

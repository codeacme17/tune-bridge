import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/provider/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import type { Metadata } from "next";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Tune Bridge",
  description:
    "TuneBridge seamlessly transfers your playlists across streaming platforms. No more track hunting—just smooth transitions so you can keep enjoying the music you love",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased dark:bg-slate-900`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}

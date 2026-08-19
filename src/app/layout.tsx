import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { BlogProvider } from "@/context/BlogContext";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "heycoderz - Geliştiriciler İçin Her Şey Burada",
  description: "heycoderz, geliştiricilerin üretkenliğini artıran araçlar, kaynaklar ve topluluk desteği sunar.",
  keywords: ["geliştirici", "yazılım", "developer tools", "heycoderz", "kodlama", "topluluk"],
  authors: [{ name: "heycoderz Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${jakarta.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <body className="bg-[#030303] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-purple-500/30 selection:text-white antialiased">
        <AuthProvider>
          <CommunityProvider>
            <BlogProvider>
              {children}
            </BlogProvider>
          </CommunityProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

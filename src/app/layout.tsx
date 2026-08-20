import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CommunityProvider } from "@/context/CommunityContext";
import { BlogProvider } from "@/context/BlogContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { RepoProvider } from "@/context/RepoContext";

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
  title: "Hey! Coder'z",
  description: "Hey! Coder'z, geliştiricilerin üretkenliğini artıran araçlar, kaynaklar ve topluluk desteği sunar.",
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                try {
                  if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement({
                      pageLanguage: 'tr',
                      includedLanguages: 'tr,en,de,es,fr,it,ru,ar,zh-CN,ja,ko,pt,az,nl',
                      autoDisplay: false,
                      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                  }
                } catch(e) {}
              }
            `,
          }}
        />
        <script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          async
          defer
        />
      </head>
      <body className="bg-[#030303] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-purple-500/30 selection:text-white antialiased">
        <div
          id="google_translate_element"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <LanguageProvider>
          <AuthProvider>
            <RepoProvider>
              <CommunityProvider>
                <BlogProvider>
                  {children}
                </BlogProvider>
              </CommunityProvider>
            </RepoProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

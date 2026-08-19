import React from "react";
import { BackgroundEffects } from "@/components/BackgroundEffects";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030303] text-gray-100 flex flex-col font-sans overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* Background Ambience & Technical Grid */}
      <BackgroundEffects />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-1">
          <Hero />
          <TrustBar />
        </main>

        <Footer />
      </div>
    </div>
  );
}

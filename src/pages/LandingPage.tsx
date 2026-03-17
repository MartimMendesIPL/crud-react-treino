import { lazy, Suspense } from "react";
import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";

// Lazy load below-the-fold components to reduce initial JavaScript bundle size
const LogosMarquee = lazy(() => import("../components/landing/LogosMarquee").then(m => ({ default: m.LogosMarquee })));
const Features = lazy(() => import("../components/landing/Features").then(m => ({ default: m.Features })));
const Pricing = lazy(() => import("../components/landing/Pricing").then(m => ({ default: m.Pricing })));
const Architecture = lazy(() => import("../components/landing/Architecture").then(m => ({ default: m.Architecture })));
const Faq = lazy(() => import("../components/landing/Faq").then(m => ({ default: m.Faq })));
const Cta = lazy(() => import("../components/landing/Cta").then(m => ({ default: m.Cta })));
const Footer = lazy(() => import("../components/landing/Footer").then(m => ({ default: m.Footer })));

// Brutalist loading fallback matching the design system
function BrutalistLoader() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] bg-black border-y border-white/5 py-12">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 bg-cyan-500 animate-[bounce_1s_infinite_0ms]" />
        <div className="w-3 h-3 bg-cyan-500 animate-[bounce_1s_infinite_100ms]" />
        <div className="w-3 h-3 bg-cyan-500 animate-[bounce_1s_infinite_200ms]" />
      </div>
      <span className="font-tech text-cyan-500/50 uppercase tracking-[0.3em] text-[10px] sm:text-xs mt-6">
        Initializing Modules...
      </span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen font-mono selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
        .font-editorial { font-family: 'Playfair Display', serif; }
        .font-tech { font-family: 'JetBrains Mono', monospace; }
        .brutal-border { border: 1px solid rgba(255,255,255,0.15); }
      `}</style>

      {/* Synchronous execution for Above-The-Fold elements */}
      <Navbar />
      <main>
        <Hero />
        
        {/* Asynchronous execution for Below-The-Fold elements */}
        <Suspense fallback={<BrutalistLoader />}>
          <LogosMarquee />
          <Features />
          <Pricing />
          <Architecture />
          <Faq />
          <Cta />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
}

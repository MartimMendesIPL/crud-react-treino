import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { TextMarquee } from "../components/landing/TextMarquee";
import { Features } from "../components/landing/Features";
import { Pricing } from "../components/landing/Pricing";
import { Architecture } from "../components/landing/Architecture";
import { Cta } from "../components/landing/Cta";
import { Footer } from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-black text-white min-h-screen font-mono selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,900;1,400&family=JetBrains+Mono:wght@400;700&display=swap');
                .font-editorial { font-family: 'Playfair Display', serif; }
                .font-tech { font-family: 'JetBrains Mono', monospace; }
                .brutal-border { border: 1px solid rgba(255,255,255,0.15); }
            `}</style>
      <Navbar />
      <main>
        <Hero />
        <TextMarquee />
        <Features />
        <Pricing />
        <Architecture />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}

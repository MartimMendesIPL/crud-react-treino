"use client";

import { motion } from "motion/react";

const LOGOS = [
  { name: "Sony", url: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
  { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
  { name: "Uber", url: "https://upload.wikimedia.org/wikipedia/commons/5/58/Uber_logo_2018.svg" },
  { name: "Slack", url: "https://upload.wikimedia.org/wikipedia/commons/b/b9/Slack_Technologies_Logo.svg" },
  { name: "Stripe", url: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" },
  { name: "Spotify", url: "https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" },
  { name: "Disney", url: "https://upload.wikimedia.org/wikipedia/commons/5/55/Walt_Disney_wordmark.svg" },
  { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Airbnb", url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg" },
];

export function LogosMarquee() {
  return (
    <section className="w-full py-16 overflow-hidden flex items-center relative z-20 bg-black">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
      
      <div className="flex whitespace-nowrap overflow-hidden w-full relative">
        {/* 
            To achieve a perfect seamless loop:
            1. We place exactly two sets of logos side-by-side.
            2. We animate the container from 0 to -50%.
            3. Since the second half is identical to the first, the reset is invisible.
        */}
        <div className="flex flex-nowrap shrink-0 items-center animate-marquee">
          {/* First set */}
          {LOGOS.map((logo, idx) => (
            <div key={`set1-${idx}`} className="flex items-center justify-center shrink-0 px-10 md:px-16">
              <img
                src={logo.url}
                alt={logo.name}
                className="h-8 md:h-10 w-auto max-w-[180px] object-contain opacity-40 brightness-0 invert"
              />
            </div>
          ))}
          {/* Duplicate set for seamless looping */}
          {LOGOS.map((logo, idx) => (
            <div key={`set2-${idx}`} className="flex items-center justify-center shrink-0 px-10 md:px-16">
              <img
                src={logo.url}
                alt={logo.name}
                className="h-8 md:h-10 w-auto max-w-[180px] object-contain opacity-40 brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative Gradient Fades */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-black via-black/80 to-transparent z-30 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-black via-black/80 to-transparent z-30 pointer-events-none" />
    </section>
  );
}

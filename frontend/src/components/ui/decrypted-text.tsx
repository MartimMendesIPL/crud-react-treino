"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * DecryptedText component that scrambles text and then progressively reveals it.
 */
export function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+",
  className,
  parentClassName,
  animateOn = "view",
}: {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: "start" | "end" | "center";
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  animateOn?: "view" | "hover";
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const hasAnimatedRef = useRef(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const totalChars = text.length;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let iteration = 0;
    const revealedIndices = new Set<number>();

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      setIsAnimating(true);
      iteration = 0;
      revealedIndices.clear();

      interval = setInterval(() => {
        let currentText = "";
        let allRevealed = true;

        for (let i = 0; i < totalChars; i++) {
          if (revealedIndices.has(i)) {
            currentText += text[i];
          } else {
            allRevealed = false;
            // Scramble
            if (useOriginalCharsOnly) {
              const randomChar = text[Math.floor(Math.random() * text.length)];
              currentText += randomChar;
            } else {
              const randomChar = characters[Math.floor(Math.random() * characters.length)];
              currentText += randomChar;
            }

            // Logic to reveal
            if (sequential) {
              if (revealDirection === "start" && i <= Math.floor(iteration / maxIterations)) {
                revealedIndices.add(i);
              } else if (revealDirection === "end" && i >= totalChars - 1 - Math.floor(iteration / maxIterations)) {
                revealedIndices.add(i);
              } else if (revealDirection === "center") {
                const mid = Math.floor(totalChars / 2);
                const offset = Math.floor(iteration / maxIterations);
                if (i >= mid - offset && i <= mid + offset) {
                  revealedIndices.add(i);
                }
              }
            } else {
              if (Math.random() < 0.1 || iteration > maxIterations * totalChars) {
                revealedIndices.add(i);
              }
            }
          }
        }

        setDisplayText(currentText);
        iteration++;

        if (allRevealed || iteration > 1000) {
          clearInterval(interval);
          setDisplayText(text);
          setIsAnimating(false);
        }
      }, speed);
    };

    if (animateOn === "view") {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !isAnimating && !hasAnimatedRef.current) {
            startAnimation();
          }
        },
        { threshold: 0.1 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
        clearInterval(interval);
      };
    }

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly, animateOn]);

  return (
    <span
      ref={containerRef}
      className={cn("inline-block whitespace-pre", parentClassName)}
      onMouseEnter={() => {
        if (animateOn === "hover" && !isAnimating) {
          // Trigger logic would go here if we wanted hover support
        }
      }}
    >
      {displayText.split("").map((char, i) => (
        <span
          key={i}
          className={cn(
            className,
            // Add a flashing effect to the scrambled characters
            !isAnimating || displayText[i] === text[i] ? "" : "text-cyan-500/50 animate-pulse"
          )}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

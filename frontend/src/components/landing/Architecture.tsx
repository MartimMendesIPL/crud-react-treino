import { motion, useScroll } from "motion/react";
import { useRef } from "react";

export function Architecture() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const stack = [
    {
      name: "PostgreSQL",
      role: "Database",
      desc: "Relational data persistence with full ACID compliance.",
    },
    {
      name: "Node.js",
      role: "Runtime",
      desc: "High-performance JavaScript execution environment.",
    },
    {
      name: "Express",
      role: "Framework",
      desc: "Minimalist and extensible backend architecture.",
    },
    {
      name: "React",
      role: "Interface",
      desc: "Component-based declarative UI rendering.",
    },
    {
      name: "Docker",
      role: "Container",
      desc: "Isolated and reproducible deployment environments.",
    },
  ];

  return (
    <section
      id="architecture"
      className="py-32 px-6 bg-black relative"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <h2 className="text-5xl md:text-7xl font-editorial italic text-white mb-6">
            Stack
          </h2>
          <p className="font-tech text-gray-500 uppercase tracking-widest max-w-xl">
            Industrial-grade infrastructure. No compromises.
          </p>
        </div>

        <div className="relative border-l border-white/20 pl-8 md:pl-16">
          <motion.div
            className="absolute left-[-1px] top-0 w-[2px] bg-cyan-500 origin-top"
            style={{ height: "100%", scaleY: scrollYProgress }}
          />

          {stack.map((item, index) => (
            <div key={index} className="mb-16 relative">
              <div className="absolute -left-[37px] md:-left-[69px] top-1 w-2 h-2 bg-black border border-cyan-500 rounded-none z-10" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 mb-4">
                <h3 className="text-3xl font-editorial text-white">
                  {item.name}
                </h3>
                <span className="font-tech text-cyan-400 text-sm tracking-widest uppercase">
                  // {item.role}
                </span>
              </div>
              <p className="text-gray-400 font-tech text-base max-w-2xl leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 z-0 pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>
    </section>
  );
}

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { Database, Zap, RefreshCw, Shield, LayoutDashboard, ArrowRight } from "lucide-react";
import type { MouseEvent } from "react";

const STACK = [
  {
    name: "Centralized Vault",
    role: "Data Foundation",
    icon: Database,
    desc: "The immutable source of truth for your entire business. Every order, invoice, and asset mapped perfectly with zero risk of duplication or loss. Say goodbye to scattered spreadsheets and siloed information. Our foundation actively deduplicates entries, enforces strict referential integrity, and automatically maintains an unalterable audit trail of every financial and operational event in real-time.",
    color: "#336791",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    name: "High-Speed Processor",
    role: "Core Engine",
    icon: Zap,
    desc: "Built for true scale. Processes thousands of transactions, operational updates, and automated workflows instantly without breaking a sweat.",
    color: "#00ADD8",
    className: "md:col-span-2",
  },
  {
    name: "Real-Time Sync",
    role: "Network Flow",
    icon: RefreshCw,
    desc: "Instantaneous feedback loops across departments. When inventory drops, sales knows immediately.",
    color: "#10b981",
    className: "md:col-span-1",
  },
  {
    name: "Fortified Core",
    role: "Security",
    icon: Shield,
    desc: "Bank-grade isolation and encryption keeping your proprietary operations safe from external threats.",
    color: "#f59e0b",
    className: "md:col-span-1",
  },
  {
    name: "Command Terminal",
    role: "User Experience",
    icon: LayoutDashboard,
    desc: "A declarative, lightning-fast dashboard that immediately reacts to operator input. Complex workflows reduced to single clicks.",
    color: "#61DAFB",
    className: "md:col-span-4",
  },
];

function TechCard({ item, index }: { item: typeof STACK[0]; index: number }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm p-6 md:p-8 transition-all duration-500 hover:border-cyan-500/50 hover:bg-black/80 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(6,182,212,0.1)] ${item.className || ""}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${item.color}15,
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 flex flex-col h-full justify-between transform transition-transform duration-500 group-hover:-translate-y-1">
        <div>
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-cyan-500/50 group-hover:bg-cyan-500/10 group-hover:scale-110">
                <item.icon className="h-6 w-6 text-white transition-colors group-hover:text-cyan-400" strokeWidth={1.5} />
              </div>
              <div className="transform transition-transform duration-500 group-hover:translate-x-1">
                <div className="font-tech text-xs font-bold uppercase tracking-[0.2em] text-cyan-500 mb-1">
                  {item.role}
                </div>
                <h3 className="font-editorial text-2xl text-white md:text-3xl transition-colors duration-300 group-hover:text-white">
                  {item.name}
                </h3>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-white/20 transition-all duration-500 group-hover:-rotate-45 group-hover:text-cyan-400 group-hover:scale-125 hidden sm:block delay-75" />
          </div>
          <p className="font-tech text-sm md:text-base leading-relaxed text-gray-400 transition-colors duration-500 group-hover:text-white/95 max-w-lg">
            {item.desc}
          </p>
        </div>
      </div>

      {/* Decorative Index */}
      <div className="pointer-events-none absolute bottom-0 right-0 p-4 opacity-10 transition-all duration-700 group-hover:opacity-30 group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 font-tech text-5xl md:text-7xl font-bold text-white leading-none">
        0{index + 1}
      </div>
      
      {/* Decorative Grid overlays within card, visible on hover */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0 pointer-events-none" />
    </motion.div>
  );
}

export function Architecture() {
  return (
    <section
      id="architecture"
      className="relative min-h-screen bg-black py-32 border-y-2 border-white/10 overflow-hidden flex flex-col justify-center"
    >
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      {/* Sharp Brutalist Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_20%,#000_80%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 px-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-6"
            >
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl lg:text-8xl font-editorial italic text-white tracking-tight leading-none"
            >
              Absolute Clarity.<br />
              <span className="not-italic font-bold">Zero Chaos.</span>
            </motion.h2>
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-tech text-gray-400 max-w-sm text-sm uppercase tracking-wide leading-relaxed"
          >
            A unified ecosystem engineered to streamline operations, eliminate redundancies, and guarantee absolute data integrity.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STACK.map((item, idx) => (
            <TechCard key={item.name} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

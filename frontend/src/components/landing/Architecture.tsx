import { motion } from "motion/react";
import { Database, Zap, RefreshCw, Shield, LayoutDashboard, ArrowRight } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "./3d-card";

const STACK = [
  {
    name: "Centralized Vault",
    role: "Data Foundation",
    icon: Database,
    desc: "The immutable source of truth for your entire business. Every order, invoice, and asset mapped perfectly with zero risk of duplication or loss.",
    color: "#336791",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    name: "High-Speed Processor",
    role: "Core Engine",
    icon: Zap,
    desc: "Built for true scale. Processes thousands of transactions and automated workflows instantly.",
    color: "#00ADD8",
    className: "md:col-span-2",
  },
  {
    name: "Real-Time Sync",
    role: "Network Flow",
    icon: RefreshCw,
    desc: "Instantaneous feedback loops across departments. Real-time operational updates.",
    color: "#10b981",
    className: "md:col-span-1",
  },
  {
    name: "Fortified Core",
    role: "Security",
    icon: Shield,
    desc: "Bank-grade isolation and encryption keeping your proprietary operations safe.",
    color: "#f59e0b",
    className: "md:col-span-1",
  },
  {
    name: "Command Terminal",
    role: "User Experience",
    icon: LayoutDashboard,
    desc: "A declarative, fast dashboard that reacts to operator input instantly.",
    color: "#61DAFB",
    className: "md:col-span-4",
  },
];

function TechCard({ item, index }: { item: typeof STACK[0]; index: number }) {
  return (
    <CardContainer containerClassName={`h-full ${item.className || ""}`}>
      <CardBody className="group/card relative flex h-full w-full flex-col justify-between border border-white/10 bg-black p-6 md:p-8 transition-colors duration-500 hover:border-cyan-500/50 hover:bg-white/[0.02] [transform-style:preserve-3d]">
        
        {/* Everything inside here needs to preserve 3D */}
        <div className="flex flex-col h-full justify-between [transform-style:preserve-3d]">
          <div className="[transform-style:preserve-3d]">
            <div className="mb-8 flex items-start justify-between [transform-style:preserve-3d]">
              <div className="flex items-center gap-6 [transform-style:preserve-3d]">
                <CardItem 
                  translateZ="100" 
                  className="flex h-14 w-14 shrink-0 items-center justify-center border border-white/10 bg-white/5 shadow-2xl transition-all duration-500 group-hover/card:border-cyan-500/50 group-hover/card:bg-cyan-500/10"
                >
                  <item.icon className="h-7 w-7 text-white transition-colors group-hover/card:text-cyan-400" strokeWidth={1.5} />
                </CardItem>
                
                <div className="flex flex-col [transform-style:preserve-3d]">
                  <CardItem translateZ="60" className="font-tech text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 mb-2">
                    {item.role}
                  </CardItem>
                  <CardItem translateZ="80" className="font-editorial text-3xl text-white tracking-tight">
                    {item.name}
                  </CardItem>
                </div>
              </div>
              
              <CardItem translateZ="120">
                <ArrowRight className="h-6 w-6 text-white/20 transition-all duration-500 group-hover/card:-rotate-45 group-hover/card:text-cyan-400" />
              </CardItem>
            </div>
            
            <CardItem translateZ="140" className="font-tech text-sm md:text-base leading-relaxed text-gray-400 transition-colors duration-500 group-hover/card:text-white/95 max-w-lg">
              {item.desc}
            </CardItem>
          </div>
        </div>

        {/* Massive Popping Index */}
        <CardItem 
          translateZ="200" 
          className="pointer-events-none absolute bottom-0 right-0 p-4 opacity-5 transition-all duration-700 group-hover/card:opacity-30 font-tech text-7xl md:text-9xl font-black text-white leading-none select-none z-0"
        >
          0{index + 1}
        </CardItem>

        {/* Glow Detail (Non-3D) */}
        <div 
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover/card:opacity-100 z-[-1]"
          style={{
            background: `radial-gradient(400px circle at 50% 50%, ${item.color}15, transparent 80%)`
          }}
        />
        
        {/* Grid Background (Non-3D) */}
        <div className="absolute inset-0 z-[-1] bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] opacity-0 group-hover/card:opacity-100 transition-all duration-700 pointer-events-none" />
      </CardBody>
    </CardContainer>
  );
}

export function Architecture() {
  return (
    <section
      id="architecture"
      className="relative min-h-screen bg-black py-32 border-y-2 border-white/10 flex flex-col justify-center"
    >
      <div className="max-w-7xl mx-auto relative z-10 px-6 w-full">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8 text-center md:text-left">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl font-editorial italic text-white tracking-tighter leading-none"
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
            className="font-tech text-gray-500 max-w-sm text-xs md:text-sm uppercase tracking-[0.2em] leading-relaxed mx-auto md:mx-0"
          >
            A unified ecosystem engineered to eliminate redundancies and guarantee absolute data integrity.
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

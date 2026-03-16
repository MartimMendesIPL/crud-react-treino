import { motion } from "motion/react";
import { Terminal, ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col justify-center bg-cyan-500 border-t-2 border-white/10 overflow-hidden py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-6 relative z-10 flex flex-col items-center">
        
        {/* Massive Headline */}
        <div className="w-full flex flex-col items-center text-center select-none mb-20 md:mb-32">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            className="w-[2px] h-24 bg-black/50 mb-8 origin-top"
          />
          <h2 className="text-[15vw] md:text-[12vw] xl:text-[14rem] font-editorial italic text-black leading-[0.8] tracking-tighter mix-blend-color-burn">
            Stop the
            <br />
            <span className="not-italic font-bold lg:uppercase text-white mix-blend-normal drop-shadow-[5px_5px_0px_#000] lg:drop-shadow-[10px_10px_0px_#000] tracking-tight ml-4 lg:ml-24">
              Chaos.
            </span>
          </h2>
        </div>

        {/* Brutalist Action Panel */}
        <div className="w-full bg-black text-white p-6 md:p-12 lg:p-16 border border-black/20 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] lg:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 group transition-transform duration-500 hover:translate-x-[-5px] hover:translate-y-[-5px]">
          
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-4 mb-6 md:mb-8">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/5 transition-colors group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50">
                <Terminal size={24} className="text-cyan-400" />
              </div>
              <span className="font-tech text-xs md:text-sm font-bold uppercase tracking-[0.3em] text-cyan-400">
                System Awaiting Authorization
              </span>
            </div>
            <p className="font-tech text-base md:text-xl leading-relaxed tracking-tight text-gray-400 group-hover:text-gray-200 transition-colors duration-500">
              Ready to replace scattered spreadsheets and fragile workflows with a highly-structured, uncompromising data foundation?
            </p>
          </div>

          <a
            href="/admin"
            className="relative z-10 flex items-center justify-between w-full lg:w-auto shrink-0 bg-white text-black p-4 pr-6 md:p-6 md:pr-8 transition-colors duration-500 hover:bg-cyan-400 group/btn"
          >
            <div className="flex flex-col mr-8 md:mr-16">
              <span className="font-tech text-[10px] md:text-xs font-bold text-black/50 uppercase tracking-[0.2em] mb-1">
                Execute Deployment
              </span>
              <span className="font-editorial text-2xl md:text-4xl font-bold tracking-tight">
                Instantiate ERP.
              </span>
            </div>
            
            <div className="w-12 h-12 md:w-16 md:h-16 flex shrink-0 items-center justify-center bg-black text-white transition-transform duration-500 group-hover/btn:-rotate-45 group-hover/btn:scale-110">
              <ArrowRight strokeWidth={1} size={28} />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

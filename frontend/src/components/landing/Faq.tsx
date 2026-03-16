import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "How long does implementation take?",
    answer: "Standard deployments are completed within 14 days. Complex organizational structures may require up to 45 days. We don't do endless consulting loops. We map, deploy, and execute.",
  },
  {
    question: "Is my legacy data secure?",
    answer: "Absolute containment. We utilize bank-grade encryption algorithms and strict schema validations during migration. Your data is isolated, sanitized, and injected without zero risk of external leakage.",
  },
  {
    question: "Do you offer custom module development?",
    answer: "No. Bespoke development creates technical debt and fragile ecosystems. Our platform is strictly standardized but universally configurable. If a workflow exists, our system can handle it through configuration, not custom code.",
  },
  {
    question: "What happens during system downtime?",
    answer: "We guarantee 99.99% uptime. In the event of a catastrophic core failure, our automated failover protocols immediately reroute traffic to redundant clusters. You won't even notice the blip.",
  },
  {
    question: "Can I extract my data if I leave?",
    answer: "Yes. Raw data dumps are available via terminal commands immediately. We don't hold your business hostage. Your data remains yours, strictly formatted and fully exportable.",
  },
];

function FaqItem({
  faq,
  index,
  isOpen,
  onClick,
}: {
  faq: typeof FAQS[0];
  index: number;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-white/10 group">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 md:py-8 text-left transition-colors duration-300 hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-6 md:gap-8 px-6">
          <span className="font-tech text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity">
            0{index + 1}
          </span>
          <span
            className={`font-editorial text-2xl md:text-4xl transition-colors duration-300 ${
              isOpen ? "text-cyan-400" : "text-white group-hover:text-gray-300"
            }`}
          >
            {faq.question}
          </span>
        </div>
        <div className="pr-6 shrink-0">
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex h-12 w-12 items-center justify-center border transition-colors duration-300 ${
              isOpen
                ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                : "border-white/10 bg-transparent text-white group-hover:border-white/30"
            }`}
          >
            <Plus strokeWidth={1} size={24} />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8 px-6 md:px-24">
              <div className="border-l border-cyan-500/30 pl-6 md:pl-8">
                <p className="font-tech text-gray-400 text-sm md:text-base leading-relaxed tracking-wide max-w-3xl">
                  {faq.answer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-black py-32 border-b-2 border-white/10">


      <div className="max-w-5xl mx-auto relative z-10 w-full px-6 md:px-0">
        <div className="mb-20">
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
            className="text-5xl md:text-7xl lg:text-8xl font-editorial text-white tracking-tight leading-none"
          >
            <span className="italic">Systems</span> Interrogation.
          </motion.h2>
        </div>

        <div className="border-t border-white/10">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

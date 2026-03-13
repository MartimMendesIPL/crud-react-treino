import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

export function TextMarquee() {
  const { t } = useTranslation();
  const items = [
    t("landing.stats.traceability", "100% Traceability"),
    t("landing.stats.roles", "5+ Default Roles"),
    t("landing.stats.tracking", "Real-time Tracking"),
    "RAW DATA",
    "NO SLOP",
    "ABSOLUTE CONTROL",
    "ENTERPRISE GRADE",
  ];

  return (
    <section className="w-full bg-cyan-500 py-6 overflow-hidden flex items-center border-y-2 border-black relative z-20">
      <div className="flex whitespace-nowrap overflow-hidden">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 60, // <------ Text Velocity
          }}
          className="flex flex-nowrap shrink-0"
        >
          {[...items, ...items, ...items, ...items].map((item, idx) => (
            <div key={idx} className="flex items-center mx-8">
              <span className="text-black font-editorial text-4xl italic tracking-tight uppercase">
                {item}
              </span>
              <span className="mx-8 text-black text-2xl font-tech" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

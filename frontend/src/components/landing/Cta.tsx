import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

export function Cta() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center bg-cyan-500 overflow-hidden px-6">
      <motion.div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center text-center">
        <h2 className="text-6xl md:text-[8rem] lg:text-[10rem] font-editorial italic text-black leading-none mb-8">
          {t("landing.cta.title", "Execute")}
        </h2>

        <p className="font-tech text-black/80 uppercase tracking-[0.3em] mb-12 max-w-2xl">
          {t(
            "landing.cta.description",
            "Deploy the infrastructure. Take command of your resources.",
          )}
        </p>

        <a
          href="/admin"
          className="group relative inline-flex items-center justify-center px-12 py-6 bg-black text-white font-tech uppercase tracking-widest overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-cyan-400 transition-colors duration-300">
            {t("landing.cta.button", "Access Terminal")}
          </span>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 transition-all duration-300" />
          <motion.div
            className="absolute inset-0 bg-white mix-blend-difference"
            initial={{ y: "100%" }}
            whileHover={{ y: "0%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </a>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-black" />
    </section>
  );
}

import { useTranslation } from "react-i18next";
import RotatingText from "./RotatingText";
import TopographyBackground from "./topography";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <TopographyBackground />
      </div>

      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-editorial italic tracking-tight text-white mb-8 mt-12">
          {" "}
          {t("landing.hero.title", "Orchestrate")} <br />
          <span className="font-editorial not-italic font-bold tracking-wider text-cyan-500">
            <RotatingText
              texts={[
                t("landing.hero.titleRotate1", "The Chaos"),
                t("landing.hero.titleRotate2", "Your Data"),
                t("landing.hero.titleRotate3", "The Future"),
                t("landing.hero.titleRotate4", "Everything"),
              ]}
              mainClassName="rotating-text-main justify-center"
              staggerFrom={"last"}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="rotating-text-word"
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
              }}
              rotationInterval={2000}
            />
          </span>
        </h1>

        <p className="max-w-xl text-gray-400 font-tech text-sm md:text-base mb-12 uppercase tracking-wide leading-relaxed">
          {t(
            "landing.hero.description",
            "A brutalist approach to enterprise resource planning. No fluff. Just raw, unfiltered data and control.",
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#features"
            className="brutal-border px-8 py-4 text-white hover:bg-white/5 font-tech uppercase tracking-widest transition-colors"
          >
            {t("landing.hero.viewFeatures", "View Specs")}
          </a>
        </div>
      </div>
    </section>
  );
}

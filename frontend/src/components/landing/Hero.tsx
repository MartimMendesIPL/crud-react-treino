import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import RotatingText from "../RotatingText";

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const count = 5000;

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#06b6d4"
          size={0.015}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Starfield />
        </Canvas>
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
          <Link
            to="/admin"
            className="relative group brutal-border px-8 py-4 overflow-hidden bg-white text-black font-tech font-bold uppercase tracking-widest"
          >
            <span className="relative z-10 group-hover:text-white transition-colors duration-300">
              {t("landing.hero.openDashboard", "Launch Terminal")}
            </span>
            <div className="absolute inset-0 bg-cyan-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0" />
          </Link>
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

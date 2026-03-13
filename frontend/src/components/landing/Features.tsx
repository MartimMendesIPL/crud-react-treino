import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent } from "react";
import { useTranslation } from "react-i18next";

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="group relative flex flex-col p-8 brutal-border bg-black hover:bg-black/50 transition-colors duration-500 overflow-hidden"
      onMouseMove={onMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
                        radial-gradient(
                            350px circle at ${mouseX}px ${mouseY}px,
                            rgba(6, 182, 212, 0.15),
                            transparent 80%
                        )
                    `,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <i className={`${icon} text-cyan-400 text-3xl mb-6`} />
        <h3 className="text-xl font-editorial italic text-white mb-4">
          {title}
        </h3>
        <p className="text-gray-400 font-tech text-sm leading-relaxed mt-auto">
          {desc}
        </p>
      </div>
    </div>
  );
}

export function Features() {
  const { t } = useTranslation();

  const FEATURES = [
    {
      id: 1,
      title: t("landing.features.proposalManagement.title", "Proposals"),
      icon: "fa-solid fa-file-lines",
      desc: t(
        "landing.features.proposalManagement.description",
        "Manage proposals",
      ),
    },
    {
      id: 2,
      title: t("landing.features.productionTracking.title", "Production"),
      icon: "fa-solid fa-industry",
      desc: t(
        "landing.features.productionTracking.description",
        "Track production",
      ),
    },
    {
      id: 3,
      title: t("landing.features.auditLogging.title", "Audit"),
      icon: "fa-solid fa-clock-rotate-left",
      desc: t("landing.features.auditLogging.description", "Audit logs"),
    },
    {
      id: 4,
      title: t("landing.features.roleBasedAccess.title", "RBAC"),
      icon: "fa-solid fa-shield-halved",
      desc: t("landing.features.roleBasedAccess.description", "Role access"),
    },
    {
      id: 5,
      title: t("landing.features.clientDatabase.title", "Clients"),
      icon: "fa-solid fa-users",
      desc: t("landing.features.clientDatabase.description", "Client database"),
    },
    {
      id: 6,
      title: t("landing.features.productCatalogue.title", "Products"),
      icon: "fa-solid fa-boxes-stacked",
      desc: t(
        "landing.features.productCatalogue.description",
        "Product catalogue",
      ),
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-5xl md:text-7xl font-editorial italic text-white mb-6">
            Capabilities
          </h2>
          <p className="font-tech text-gray-500 uppercase tracking-widest max-w-xl">
            Unleash the full potential of your operations with uncompromising
            precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {FEATURES.map((feat) => (
            <FeatureCard
              key={feat.id}
              title={feat.title}
              desc={feat.desc}
              icon={feat.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

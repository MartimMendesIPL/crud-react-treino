import { useTranslation } from "react-i18next";
import { CardContainer, CardBody, CardItem } from "./3d-card";

function FeatureCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <CardContainer containerClassName="w-full">
      <CardBody className="bg-black relative group/card brutal-border w-full h-auto min-h-[350px] p-8 flex flex-col justify-between transition-colors duration-500 hover:bg-white/[0.02]">
        <div>
          <CardItem
            translateZ="50"
            className="text-cyan-400 text-4xl mb-8"
          >
            <i className={icon} />
          </CardItem>
          
          <CardItem
            translateZ="60"
            className="text-2xl font-editorial italic text-white mb-4"
          >
            {title}
          </CardItem>
          
          <CardItem
            as="p"
            translateZ="100"
            className="text-gray-400 font-tech text-sm leading-relaxed max-w-sm mt-2"
          >
            {desc}
          </CardItem>
        </div>

        <CardItem
          translateZ="40"
          className="mt-8"
        >
          <div className="h-0.5 w-12 bg-cyan-500/30 group-hover/card:w-20 transition-all duration-500" />
        </CardItem>

        {/* Static Background Detail (Non-3D to avoid clipping) */}
        <div className="absolute top-0 right-0 p-4 opacity-5 text-white font-tech text-[100px] pointer-events-none select-none overflow-hidden h-32 flex items-center">
            <i className={`${icon} translate-x-12 translate-y-12`} />
        </div>
      </CardBody>
    </CardContainer>
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
        "Orchestrate complex commercial agreements with algorithmic precision and real-time validation."
      ),
    },
    {
      id: 2,
      title: t("landing.features.productionTracking.title", "Production"),
      icon: "fa-solid fa-industry",
      desc: t(
        "landing.features.productionTracking.description",
        "Monitor supply chain throughput with granular telemetry and automated bottleneck detection."
      ),
    },
    {
      id: 3,
      title: t("landing.features.auditLogging.title", "Audit Core"),
      icon: "fa-solid fa-clock-rotate-left",
      desc: t(
        "landing.features.auditLogging.description",
        "Immutable transaction ledger ensuring absolute accountability across every organizational node."
      ),
    },
    {
      id: 4,
      title: t("landing.features.roleBasedAccess.title", "Secure RBAC"),
      icon: "fa-solid fa-shield-halved",
      desc: t(
        "landing.features.roleBasedAccess.description",
        "Military-grade access controls utilizing strictly defined hierarchical permission structures."
      ),
    },
    {
      id: 5,
      title: t("landing.features.clientDatabase.title", "Client Intel"),
      icon: "fa-solid fa-users",
      desc: t(
        "landing.features.clientDatabase.description",
        "Centralized entity management system for high-fidelity client relationship monitoring."
      ),
    },
    {
      id: 6,
      title: t("landing.features.productCatalogue.title", "Inventory"),
      icon: "fa-solid fa-boxes-stacked",
      desc: t(
        "landing.features.productCatalogue.description",
        "Dynamic SKU indexing with automated reorder protocols and real-time logistics mapping."
      ),
    },
  ];

  return (
    <section id="features" className="py-32 px-6 bg-black relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24">
          <h2 className="text-6xl md:text-8xl font-editorial italic text-white mb-8 tracking-tighter">
            Capabilities<span className="text-cyan-500 not-italic">.</span>
          </h2>
          <p className="font-tech text-gray-500 uppercase tracking-[0.3em] max-w-2xl text-xs md:text-sm">
            [ SYSTEM COMMAND: UNLEASH OPERATIONAL PRECISION ]
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
          {FEATURES.map((feat) => (
            <div key={feat.id} className="bg-black">
               <FeatureCard
                title={feat.title}
                desc={feat.desc}
                icon={feat.icon}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

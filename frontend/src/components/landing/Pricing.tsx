import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

interface Plan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    isPopular?: boolean;
}

function PricingCard({ plan, isPopular }: { plan: Plan; isPopular?: boolean }) {
    return (
        <div className={`relative flex flex-col p-8 brutal-border bg-black h-full ${isPopular ? "scale-105 z-10" : "scale-100 opacity-80 hover:opacity-100"}`}>
            {isPopular && (
                <motion.div
                    className="absolute -inset-[2px] z-[-1] opacity-50"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                    style={{
                        backgroundSize: "200% 200%",
                        backgroundImage: "linear-gradient(90deg, #06b6d4, #10b981, #06b6d4)"
                    }}
                />
            )}

            <div className="flex-1 bg-black p-6 z-10 flex flex-col h-full">
                <h3 className="text-3xl font-editorial italic text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-tech font-bold text-white">{plan.price}</span>
                    <span className="text-sm font-tech text-gray-500">{plan.period}</span>
                </div>

                <p className="text-gray-400 font-tech text-sm mb-8 line-clamp-2">
                    {plan.description}
                </p>

                <ul className="space-y-4 mb-8 flex-1 font-tech text-sm">
                    {plan.features.map((f: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                            <span className="text-cyan-400 mt-0.5">❖</span>
                            <span>{f}</span>
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-4 font-tech uppercase tracking-widest transition-colors ${isPopular ? "bg-cyan-500 text-black hover:bg-cyan-400" : "brutal-border text-white hover:bg-white/10"}`}>
                    {plan.cta}
                </button>
            </div>
        </div>
    );
}

export function Pricing() {
    const { t } = useTranslation();

    const PLANS = [
        { name: t("landing.pricing.starter.name", "Starter"), price: t("landing.pricing.starter.price", "Free"), period: "", description: t("landing.pricing.starter.description", "Basic features"), features: t("landing.pricing.starter.features", { returnObjects: true }) as string[] || ["Basic Analytics", "1 User"], cta: t("landing.pricing.starter.cta", "Start Free") },
        { name: t("landing.pricing.professional.name", "Pro"), price: t("landing.pricing.professional.price", "$49"), period: "/mo", description: t("landing.pricing.professional.description", "For teams"), features: t("landing.pricing.professional.features", { returnObjects: true }) as string[] || ["Advanced Analytics", "5 Users", "Priority Support"], cta: t("landing.pricing.professional.cta", "Get Pro"), isPopular: true },
        { name: t("landing.pricing.enterprise.name", "Enterprise"), price: t("landing.pricing.enterprise.price", "Custom"), period: "", description: t("landing.pricing.enterprise.description", "Unlimited scale"), features: t("landing.pricing.enterprise.features", { returnObjects: true }) as string[] || ["Unlimited Users", "Custom Integrations", "24/7 Support"], cta: t("landing.pricing.enterprise.cta", "Contact Sales") },
    ];

    return (
        <section id="pricing" className="py-32 px-6 bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                    <div>
                        <h2 className="text-5xl md:text-7xl font-editorial italic text-white mb-6">Investment</h2>
                        <p className="font-tech text-gray-500 uppercase tracking-widest max-w-xl">
                            Transparent pricing for unparalleled control.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center">
                    {PLANS.map((plan: Plan, i) => (
                        <PricingCard key={i} plan={plan} isPopular={plan.isPopular} />
                    ))}
                </div>
            </div>
        </section>
    );
}

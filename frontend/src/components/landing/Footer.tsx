import { useTranslation } from "react-i18next";

export function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="bg-black text-white border-t border-white/20 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 font-tech text-sm">

                <div className="md:col-span-1 flex flex-col justify-between">
                    <div>
                        <div className="text-3xl font-editorial italic text-cyan-400 mb-6">
                            ❖ AURA
                        </div>
                        <p className="text-gray-500 max-w-xs leading-relaxed uppercase tracking-wide">
                            {t("landing.footer.description", "Industrial-grade enterprise resource planning.")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-white uppercase tracking-[0.2em] mb-4">
                        {t("landing.footer.product", "System")}
                    </h4>
                    <a href="#features" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.nav.features", "Features")}
                    </a>
                    <a href="#pricing" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.nav.pricing", "Pricing")}
                    </a>
                    <a href="#architecture" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.nav.stack", "Stack")}
                    </a>
                    <a href="/admin" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.nav.adminPanel", "Admin Terminal")}
                    </a>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-white uppercase tracking-[0.2em] mb-4">
                        {t("landing.footer.resources", "Docs")}
                    </h4>
                    <a href="https://react.dev/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.footer.reactDocs", "React Runtime")}
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.footer.github", "Repository")}
                    </a>
                    <a href="#architecture" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        {t("landing.footer.apiReference", "API Spec")}
                    </a>
                </div>

                <div className="flex flex-col gap-4">
                    <h4 className="text-white uppercase tracking-[0.2em] mb-4">
                        {t("landing.footer.contact", "Comms")}
                    </h4>
                    <a href="mailto:hello@aura-erp.com" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        sys@aura-erp.com
                    </a>
                    <a href="tel:+351910000000" className="text-gray-500 hover:text-cyan-400 transition-colors uppercase">
                        +351 910 000 000
                    </a>
                    <span className="text-gray-700 uppercase mt-4 block">
                        {t("landing.footer.address", "Lisbon, PT")}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 font-tech text-xs text-gray-600 uppercase tracking-widest">
                <span>{t("landing.footer.copyright", "© 2026 AURA ERP")}</span>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-cyan-400 transition-colors">{t("landing.footer.privacy", "Privacy")}</a>
                    <a href="#" className="hover:text-cyan-400 transition-colors">{t("landing.footer.terms", "Terms")}</a>
                </div>
            </div>
        </footer>
    );
}

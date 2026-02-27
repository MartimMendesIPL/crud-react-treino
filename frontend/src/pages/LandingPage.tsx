import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import RotatingText from "../components/RotatingText";
import AuraLogo from "../components/AuraLogo";
import DashboardDemo from "../components/DashboardDemo";
import SpotlightCard from "../components/SpotlightCard";
import LanguageToggle from "../components/LanguageToggle";
import { THEME_COLORS } from "../constants/theme";

export default function LandingPage() {
    const { t } = useTranslation();
    const [darkMode, setDarkMode] = useState(true);
    const [accentColor, setAccentColor] = useState(THEME_COLORS[0].value);
    const [scrolled, setScrolled] = useState(false);

    const FEATURES = [
        {
            id: 1,
            title: t("landing.features.proposalManagement.title"),
            icon: "fa-solid fa-file-lines",
            description: t("landing.features.proposalManagement.description"),
        },
        {
            id: 2,
            title: t("landing.features.productionTracking.title"),
            icon: "fa-solid fa-industry",
            description: t("landing.features.productionTracking.description"),
        },
        {
            id: 3,
            title: t("landing.features.auditLogging.title"),
            icon: "fa-solid fa-clock-rotate-left",
            description: t("landing.features.auditLogging.description"),
        },
        {
            id: 4,
            title: t("landing.features.roleBasedAccess.title"),
            icon: "fa-solid fa-shield-halved",
            description: t("landing.features.roleBasedAccess.description"),
        },
        {
            id: 5,
            title: t("landing.features.clientDatabase.title"),
            icon: "fa-solid fa-users",
            description: t("landing.features.clientDatabase.description"),
        },
        {
            id: 6,
            title: t("landing.features.productCatalogue.title"),
            icon: "fa-solid fa-boxes-stacked",
            description: t("landing.features.productCatalogue.description"),
        },
    ];

    const PLANS = [
        {
            name: t("landing.pricing.starter.name"),
            price: t("landing.pricing.starter.price"),
            period: "",
            description: t("landing.pricing.starter.description"),
            features: t("landing.pricing.starter.features", {
                returnObjects: true,
            }) as string[],
            cta: t("landing.pricing.starter.cta"),
            highlighted: false,
        },
        {
            name: t("landing.pricing.professional.name"),
            price: t("landing.pricing.professional.price"),
            period: t("landing.pricing.professional.period"),
            description: t("landing.pricing.professional.description"),
            features: t("landing.pricing.professional.features", {
                returnObjects: true,
            }) as string[],
            cta: t("landing.pricing.professional.cta"),
            highlighted: true,
        },
        {
            name: t("landing.pricing.enterprise.name"),
            price: t("landing.pricing.enterprise.price"),
            period: "",
            description: t("landing.pricing.enterprise.description"),
            features: t("landing.pricing.enterprise.features", {
                returnObjects: true,
            }) as string[],
            cta: t("landing.pricing.enterprise.cta"),
            highlighted: false,
        },
    ];

    const applyTheme = useCallback(() => {
        const root = document.documentElement;
        root.setAttribute("data-theme", darkMode ? "dark" : "light");
        root.style.setProperty("--accent", accentColor);
        root.style.setProperty("--accent-hover", accentColor);
    }, [darkMode, accentColor]);

    useEffect(() => {
        applyTheme();
    }, [applyTheme]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="app-container">
            {/* ── Navbar ── */}
            <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
                <a href="#" className="navbar-brand">
                    <AuraLogo size={30} />
                    <span className="navbar-brand-text">Aura</span>
                </a>

                <div className="navbar-links">
                    <a href="#features">{t("landing.nav.features")}</a>
                    <a href="#pricing">{t("landing.nav.pricing")}</a>
                    <a href="#architecture">{t("landing.nav.stack")}</a>
                </div>

                <div className="navbar-right">
                    <div className="navbar-swatches">
                        {THEME_COLORS.map((c) => (
                            <button
                                key={c.name}
                                className={`navbar-swatch ${accentColor === c.value ? "active" : ""}`}
                                style={{ backgroundColor: c.value }}
                                onClick={() => setAccentColor(c.value)}
                                aria-label={c.name}
                                title={c.name}
                            />
                        ))}
                    </div>
                    <div className="navbar-divider" />
                    <LanguageToggle />
                    <div className="navbar-divider" />
                    <button
                        className="navbar-theme-toggle"
                        onClick={() => setDarkMode(!darkMode)}
                        aria-label="Toggle dark mode"
                        title={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        <i
                            className={
                                darkMode
                                    ? "fa-solid fa-sun"
                                    : "fa-solid fa-moon"
                            }
                        />
                    </button>
                    <a href="/admin" className="navbar-admin-btn">
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                        {t("landing.nav.adminPanel")}
                    </a>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero-grid-pattern" />
                <div className="hero-bg-orb-1 animate-float" />
                <div className="hero-bg-orb-2 animate-float delay-200" />

                <div className="hero-split">
                    {/* Left: text content */}
                    <div className="hero-left animate-fade-up">
                        <div className="hero-badge">
                            {t("landing.hero.badge")}
                        </div>
                        <h1 className="hero-title">
                            {t("landing.hero.title")} <br />
                            <span className="hero-title-rotating">
                                <RotatingText
                                    texts={[
                                        t("landing.hero.titleRotate1"),
                                        t("landing.hero.titleRotate2"),
                                        t("landing.hero.titleRotate3"),
                                        t("landing.hero.titleRotate4"),
                                    ]}
                                    mainClassName="rotating-text-main"
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
                        <p className="hero-desc">
                            {t("landing.hero.description")}
                        </p>
                        <div className="hero-actions">
                            <a href="/admin" style={{ textDecoration: "none" }}>
                                <button className="btn-primary">
                                    {t("landing.hero.openDashboard")}
                                </button>
                            </a>
                            <a
                                href="#features"
                                style={{ textDecoration: "none" }}
                            >
                                <button className="btn-glass glass-dark">
                                    {t("landing.hero.viewFeatures")}
                                </button>
                            </a>
                        </div>
                    </div>

                    {/* Right: dashboard preview */}
                    <div
                        className="hero-right animate-fade-up"
                        style={{ animationDelay: "200ms" }}
                    >
                        <div className="hero-demo-wrapper">
                            <DashboardDemo />
                        </div>
                    </div>
                </div>

                <a href="#features" className="hero-scroll-down">
                    <i className="fa-solid fa-chevron-down" />
                </a>
            </section>
            <section className="stats-grid">
                {[
                    {
                        value: t("landing.stats.traceability"),
                        label: t("landing.stats.traceabilityLabel"),
                    },
                    {
                        value: t("landing.stats.roles"),
                        label: t("landing.stats.rolesLabel"),
                    },
                    {
                        value: t("landing.stats.tracking"),
                        label: t("landing.stats.trackingLabel"),
                    },
                ].map((s) => (
                    <div key={s.label} className="stat-item">
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                    </div>
                ))}
            </section>

            {/* ── Features ── */}
            <section id="features" className="section-padding">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {t("landing.features.title")}
                        </h2>
                        <p className="section-desc">
                            {t("landing.features.subtitle")}
                        </p>
                    </div>

                    <div className="features-grid">
                        {FEATURES.map((feature, index) => (
                            <SpotlightCard
                                key={feature.id}
                                className="custom-spotlight-card"
                                spotlightColor={`color-mix(in srgb, ${accentColor} 25%, transparent)`}
                            >
                                <div
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <div className="feature-icon">
                                        <i className={feature.icon} />
                                    </div>
                                    <h3 className="feature-title">
                                        {feature.title}
                                    </h3>
                                    <p className="feature-desc">
                                        {feature.description}
                                    </p>
                                </div>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section id="pricing" className="pricing-section">
                <div className="section-container">
                    <div className="section-header">
                        <h2 className="section-title">
                            {t("landing.pricing.title")}
                        </h2>
                        <p className="section-desc">
                            {t("landing.pricing.subtitle")}
                        </p>
                    </div>

                    <div className="pricing-grid">
                        {PLANS.map((plan) => (
                            <div
                                key={plan.name}
                                className={`pricing-card ${plan.highlighted ? "pricing-card-highlighted" : ""}`}
                            >
                                {plan.highlighted && (
                                    <div className="pricing-popular">
                                        {t("landing.pricing.mostPopular")}
                                    </div>
                                )}
                                <h3 className="pricing-name">{plan.name}</h3>
                                <p className="pricing-desc">
                                    {plan.description}
                                </p>
                                <div className="pricing-price">
                                    <span className="pricing-amount">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="pricing-period">
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <ul className="pricing-features">
                                    {plan.features.map((f) => (
                                        <li
                                            key={f}
                                            className="pricing-feature-item"
                                        >
                                            <span className="pricing-check">
                                                <i className="fa-solid fa-check" />
                                            </span>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    className={
                                        plan.highlighted
                                            ? "btn-primary pricing-btn"
                                            : "btn-outline pricing-btn"
                                    }
                                >
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Architecture ── */}
            <section id="architecture" className="architecture-section">
                <div className="architecture-container">
                    <h2 className="section-title">
                        {t("landing.architecture.title")}
                    </h2>
                    <p className="architecture-desc">
                        {t("landing.architecture.description")}
                    </p>

                    <div className="tech-stack">
                        {[
                            { name: "PostgreSQL", color: "#336791" },
                            { name: "Node.js", color: "#339933" },
                            { name: "Express" },
                            { name: "React", color: "#61DAFB" },
                            { name: "Docker", color: "#2496ED" },
                        ].map((tech) => (
                            <div key={tech.name} className="tech-item">
                                <div
                                    className="tech-dot"
                                    style={{
                                        backgroundColor:
                                            tech.color ?? "var(--accent)",
                                    }}
                                />
                                {tech.name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="section-padding">
                <div className="cta-card">
                    <div className="cta-bg" />
                    <div className="cta-content">
                        <h2 className="cta-title">{t("landing.cta.title")}</h2>
                        <p className="cta-desc">
                            {t("landing.cta.description")}
                        </p>
                        <a href="/admin" style={{ textDecoration: "none" }}>
                            <button className="btn-cta">
                                {t("landing.cta.button")}
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-grid">
                        {/* Brand column */}
                        <div className="footer-brand-col">
                            <div className="footer-logo">
                                <AuraLogo size={24} />
                                <span>Aura</span>
                            </div>
                            <p className="footer-brand-desc">
                                {t("landing.footer.description")}
                            </p>
                        </div>

                        {/* Product links */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t("landing.footer.product")}
                            </h4>
                            <a href="#features">{t("landing.nav.features")}</a>
                            <a href="#pricing">{t("landing.nav.pricing")}</a>
                            <a href="#architecture">{t("landing.nav.stack")}</a>
                            <a href="/admin">{t("landing.nav.adminPanel")}</a>
                        </div>

                        {/* Resources */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t("landing.footer.resources")}
                            </h4>
                            <a
                                href="https://react.dev/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("landing.footer.reactDocs")}
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t("landing.footer.github")}
                            </a>
                            <a href="#architecture">
                                {t("landing.footer.apiReference")}
                            </a>
                            <a href="#features">
                                {t("landing.footer.changelog")}
                            </a>
                        </div>

                        {/* Contact */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">
                                {t("landing.footer.contact")}
                            </h4>
                            <a href="mailto:hello@aura-erp.com">
                                hello@aura-erp.com
                            </a>
                            <a href="tel:+351910000000">+351 910 000 000</a>
                            <span className="footer-address">
                                {t("landing.footer.address")}
                            </span>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>{t("landing.footer.copyright")}</span>
                        <div className="footer-bottom-links">
                            <a href="#">{t("landing.footer.privacy")}</a>
                            <a href="#">{t("landing.footer.terms")}</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

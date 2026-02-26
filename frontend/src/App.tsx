import { useState, useEffect, useCallback } from "react";
import RotatingText from "./components/RotatingText";
import AuraLogo from "./components/AuraLogo";
import DashboardDemo from "./components/DashboardDemo";
import SpotlightCard from "./components/SpotlightCard";

const FEATURES = [
    {
        id: 1,
        title: "Proposal Management",
        icon: "fa-solid fa-file-lines",
        description:
            "Create, track, and convert client proposals into actionable manufacturing orders with full version history.",
    },
    {
        id: 2,
        title: "Production Tracking",
        icon: "fa-solid fa-industry",
        description:
            "Monitor orders across different sections (Metalwork, Painting, Assembly) in real-time.",
    },
    {
        id: 3,
        title: "Audit Logging",
        icon: "fa-solid fa-clock-rotate-left",
        description:
            "Every status change, edit, and conversion is logged. Know exactly who did what and when.",
    },
    {
        id: 4,
        title: "Role-Based Access",
        icon: "fa-solid fa-shield-halved",
        description:
            "Secure your data with Admin, Sales, Production, and Viewer permission levels.",
    },
    {
        id: 5,
        title: "Client Database",
        icon: "fa-solid fa-users",
        description:
            "Maintain a centralized registry of all your clients, their contact info, and VAT details.",
    },
    {
        id: 6,
        title: "Product Catalogue",
        icon: "fa-solid fa-boxes-stacked",
        description:
            "Manage your raw materials and finished goods with standardized units and pricing.",
    },
];

const THEME_COLORS = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Rose", value: "#f43f5e" },
    { name: "Emerald", value: "#10b981" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Cyan", value: "#06b6d4" },
    { name: "Purple", value: "#a855f7" },
];

const PLANS = [
    {
        name: "Starter",
        price: "Free",
        period: "",
        description:
            "For small teams getting started with production tracking.",
        features: [
            "Up to 5 users",
            "Basic proposal management",
            "Single workspace",
            "Community support",
            "7-day audit history",
        ],
        cta: "Get Started",
        highlighted: false,
    },
    {
        name: "Professional",
        price: "$49",
        period: "/mo",
        description: "For growing teams that need full visibility and control.",
        features: [
            "Up to 25 users",
            "Advanced production tracking",
            "Role-based access control",
            "Priority support",
            "Unlimited audit history",
            "Custom workflows",
        ],
        cta: "Start Free Trial",
        highlighted: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "",
        description: "For large organizations with complex requirements.",
        features: [
            "Unlimited users",
            "Dedicated account manager",
            "SSO & advanced security",
            "Custom integrations",
            "On-premise deployment",
            "24/7 phone support",
            "SLA guarantee",
        ],
        cta: "Contact Sales",
        highlighted: false,
    },
];

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const [accentColor, setAccentColor] = useState(THEME_COLORS[0].value);
    const [scrolled, setScrolled] = useState(false);

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
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#architecture">Stack</a>
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
                    <a
                        href="http://localhost:5000/admin"
                        target="_blank"
                        rel="noreferrer"
                        className="navbar-admin-btn"
                    >
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                        Admin Panel
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
                            Enterprise Resource Planning
                        </div>
                        <h1 className="hero-title">
                            Control your <br />
                            <span className="hero-title-rotating">
                                <RotatingText
                                    texts={[
                                        "Warehouse",
                                        "Office",
                                        "Business",
                                        "Profits",
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
                            Track proposals, manage production orders, and audit
                            every change — powered by AdminJS.
                        </p>
                        <div className="hero-actions">
                            <a
                                href="http://localhost:5000/admin"
                                target="_blank"
                                rel="noreferrer"
                                style={{ textDecoration: "none" }}
                            >
                                <button className="btn-primary">
                                    Open Dashboard
                                </button>
                            </a>
                            <a
                                href="#features"
                                style={{ textDecoration: "none" }}
                            >
                                <button className="btn-glass glass-dark">
                                    View Features
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
                    { value: "100%", label: "Audit Traceability" },
                    { value: "4", label: "Permission Roles" },
                    { value: "Real-time", label: "Order Tracking" },
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
                        <h2 className="section-title">System Capabilities.</h2>
                        <p className="section-desc">
                            Everything you need to run your industrial
                            operations.
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
                            Simple, transparent pricing.
                        </h2>
                        <p className="section-desc">
                            Choose the plan that fits your team. Upgrade
                            anytime.
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
                                        Most Popular
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
                    <h2 className="section-title">Built on a modern stack.</h2>
                    <p className="architecture-desc">
                        Fully containerized with Docker, powered by a robust
                        PostgreSQL database, and managed through an intuitive
                        AdminJS interface.
                    </p>

                    <div className="tech-stack">
                        {[
                            { name: "PostgreSQL", color: "#336791" },
                            { name: "Node.js", color: "#339933" },
                            { name: "Express" },
                            { name: "AdminJS", color: "#FF4B4B" },
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
                        <h2 className="cta-title">Access the System</h2>
                        <p className="cta-desc">
                            Log in to the AdminJS dashboard to manage users,
                            clients, proposals, and production orders.
                        </p>
                        <a
                            href="http://localhost:5000/admin"
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <button className="btn-cta">
                                Launch Admin Panel
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
                                Open-source ERP for industrial teams. Track
                                proposals, orders, and production — all from one
                                dashboard.
                            </p>
                        </div>

                        {/* Product links */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#architecture">Tech Stack</a>
                            <a
                                href="http://localhost:5000/admin"
                                target="_blank"
                                rel="noreferrer"
                            >
                                Admin Panel
                            </a>
                        </div>

                        {/* Resources */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Resources</h4>
                            <a
                                href="https://docs.adminjs.co/"
                                target="_blank"
                                rel="noreferrer"
                            >
                                AdminJS Docs
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                GitHub
                            </a>
                            <a href="#architecture">API Reference</a>
                            <a href="#features">Changelog</a>
                        </div>

                        {/* Contact */}
                        <div className="footer-col">
                            <h4 className="footer-col-title">Contact</h4>
                            <a href="mailto:hello@aura-erp.com">
                                hello@aura-erp.com
                            </a>
                            <a href="tel:+351910000000">+351 910 000 000</a>
                            <span className="footer-address">
                                Rua da Inovação 42
                                <br />
                                4000-001 Porto, Portugal
                            </span>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>© 2026 Aura Systems. All rights reserved.</span>
                        <div className="footer-bottom-links">
                            <a href="#">Privacy Policy</a>
                            <a href="#">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;

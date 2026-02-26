import { useState, useEffect } from "react";
import RotatingText from './RotatingText';

const FEATURES = [
    {
        id: 1,
        title: "Proposal Management",
        icon: "📋",
        description:
            "Create, track, and convert client proposals into actionable manufacturing orders with full version history.",
    },
    {
        id: 2,
        title: "Production Tracking",
        icon: "🏭",
        description:
            "Monitor orders across different sections (Metalwork, Painting, Assembly) in real-time.",
    },
    {
        id: 3,
        title: "Audit Logging",
        icon: "📜",
        description:
            "Every status change, edit, and conversion is logged. Know exactly who did what and when.",
    },
    {
        id: 4,
        title: "Role-Based Access",
        icon: "🔐",
        description:
            "Secure your data with Admin, Sales, Production, and Viewer permission levels.",
    },
    {
        id: 5,
        title: "Client Database",
        icon: "👥",
        description:
            "Maintain a centralized registry of all your clients, their contact info, and VAT details.",
    },
    {
        id: 6,
        title: "Product Catalogue",
        icon: "📦",
        description:
            "Manage your raw materials and finished goods with standardized units and pricing.",
    },
];

function App() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="app-container">
            {/* ── Navbar ── */}
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="nav-logo">
                    Forge<span style={{ color: "var(--accent)" }}>OS.</span>
                </div>
                <div className="nav-links">
                    <a href="#features">Features</a>
                    <a href="#architecture">Architecture</a>
                </div>
                <a
                    href="http://localhost:5000/admin"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                >
                    <button className="btn-nav">Access Admin Panel ↗</button>
                </a>
            </nav>

            {/* ── Hero ── */}
            <section className="hero">
                {/* Abstract Background Elements */}
                <div className="hero-bg-orb-1 animate-float" />
                <div className="hero-bg-orb-2 animate-float delay-200" />
                <div className="hero-bg-image" />

                <div className="hero-content animate-fade-up">
                    <div className="hero-badge">
                        Enterprise Resource Planning
                    </div>
                    <h1 className="hero-title">
                        Control your <br />
                        <span className="hero-title-gradient">
                            manufacturing floor.
                        </span>
                    </h1>
                    <p className="hero-desc">
                        A complete backend solution for tracking proposals,
                        managing orders, and auditing production workflows in
                        real-time.
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
                        <a href="#features" style={{ textDecoration: "none" }}>
                            <button className="btn-glass glass-dark">
                                View Features
                            </button>
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Stats ── */}
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
                            <div
                                key={feature.id}
                                className="feature-card animate-fade-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <h3 className="feature-title">
                                    {feature.title}
                                </h3>
                                <p className="feature-desc">
                                    {feature.description}
                                </p>
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
                            { name: "Express", color: "#000000" },
                            { name: "AdminJS", color: "#FF4B4B" },
                            { name: "Docker", color: "#2496ED" },
                        ].map((tech) => (
                            <div
                                key={tech.name}
                                className="tech-item"
                                style={{ color: tech.color }}
                            >
                                <div
                                    className="tech-dot"
                                    style={{ backgroundColor: tech.color }}
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
                <div className="footer-logo">
                    Forge<span style={{ color: "var(--accent)" }}>OS.</span>
                </div>
                <span>© 2024 ForgeWorks Industrial Systems.</span>
            </footer>
        </div>
    );
}

export default App;

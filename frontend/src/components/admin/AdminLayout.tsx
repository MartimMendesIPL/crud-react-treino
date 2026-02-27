import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    LayoutDashboard,
    Users,
    UserCircle,
    Layers,
    Package,
    FileText,
    CalendarDays,
    ClipboardList,
    History,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";
import LanguageToggle from "../LanguageToggle";
import "../../admin.css";

export default function AdminLayout() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const NAV = [
        {
            label: t("admin.nav.dashboard"),
            to: "/admin",
            icon: LayoutDashboard,
        },
        {
            label: t("admin.nav.calendar"),
            to: "/admin/proposals/calendar",
            icon: CalendarDays,
        },
        { label: t("admin.nav.users"), to: "/admin/users", icon: Users },
        {
            label: t("admin.nav.clients"),
            to: "/admin/clients",
            icon: UserCircle,
        },
        { label: t("admin.nav.sections"), to: "/admin/sections", icon: Layers },
        {
            label: t("admin.nav.products"),
            to: "/admin/products",
            icon: Package,
        },
        {
            label: t("admin.nav.proposals"),
            to: "/admin/proposals",
            icon: FileText,
        },
        {
            label: t("admin.nav.orders"),
            to: "/admin/orders",
            icon: ClipboardList,
        },
        {
            label: t("admin.nav.auditLog"),
            to: "/admin/audit-log",
            icon: History,
        },
    ];

    const isActive = (to: string) =>
        to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);

    return (
        <div className="admin-layout">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="admin-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="admin-sidebar-header">
                    <Link to="/" className="admin-sidebar-brand">
                        <span className="admin-sidebar-logo">A</span>
                        <span className="admin-sidebar-brand-text">
                            Aura Admin
                        </span>
                    </Link>
                    <button
                        className="admin-sidebar-close"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="admin-sidebar-nav">
                    {NAV.map(({ label, to, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`admin-nav-item ${isActive(to) ? "active" : ""}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                            {isActive(to) && (
                                <ChevronRight
                                    size={14}
                                    className="admin-nav-arrow"
                                />
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <Link to="/" className="admin-nav-item">
                        {t("admin.nav.backToSite")}
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <button
                        className="admin-menu-btn"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={20} />
                    </button>
                    <div className="admin-topbar-breadcrumb">
                        {NAV.find((n) => isActive(n.to))?.label ?? "Admin"}
                    </div>
                    <LanguageToggle />
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

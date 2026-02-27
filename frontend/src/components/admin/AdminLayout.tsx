import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
import "../../admin.css";

const NAV = [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Calendar", to: "/admin/proposals/calendar", icon: CalendarDays },
    { label: "Users", to: "/admin/users", icon: Users },
    { label: "Clients", to: "/admin/clients", icon: UserCircle },
    { label: "Sections", to: "/admin/sections", icon: Layers },
    { label: "Products", to: "/admin/products", icon: Package },
    { label: "Proposals", to: "/admin/proposals", icon: FileText },
    { label: "Orders", to: "/admin/orders", icon: ClipboardList },
    { label: "Audit Log", to: "/admin/audit-log", icon: History },
];

export default function AdminLayout() {
    const { pathname } = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                        ← Back to Site
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
                </header>

                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

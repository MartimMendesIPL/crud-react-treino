import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Package,
  FileText,
  CalendarDays,
  ClipboardList,
  History,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sun,
  Moon,
  Settings,
  LogOut,
  Check,
  Palette,
  ShieldCheck,
} from "lucide-react";
import AuraLogo from "../AuraLogo";
import LanguageToggle from "../LanguageToggle";
import "../../admin.css";

/* ── Nav type definitions ── */

type NavItem = {
  labelKey: string;
  to: string;
  icon: React.ComponentType<{ size?: number }>;
};

type NavGroup = {
  labelKey: string;
  icon: React.ComponentType<{ size?: number }>;
  children: NavItem[];
};

type NavSeparator = { separator: string };

type NavEntry = NavItem | NavGroup | NavSeparator;

function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

function isSeparator(entry: NavEntry): entry is NavSeparator {
  return "separator" in entry;
}

/* ── Nav structure ── */

const NAV: NavEntry[] = [
  {
    labelKey: "admin.nav.calendar",
    to: "/admin/proposals/calendar",
    icon: CalendarDays,
  },
  {
    labelKey: "admin.nav.dashboard",
    to: "/admin",
    icon: LayoutDashboard,
  },
  {
    labelKey: "admin.nav.proposals",
    to: "/admin/proposals",
    icon: FileText,
  },
  {
    labelKey: "admin.nav.orders",
    icon: ClipboardList,
    children: [
      {
        labelKey: "admin.nav.orders",
        to: "/admin/orders",
        icon: ClipboardList,
      },
      {
        labelKey: "admin.nav.products",
        to: "/admin/products",
        icon: Package,
      },
    ],
  },
  {
    labelKey: "admin.nav.clients",
    to: "/admin/clients",
    icon: UserCircle,
  },
  {
    labelKey: "admin.nav.auditLog",
    to: "/admin/audit-log",
    icon: History,
  },
  { separator: "Admin" },
  {
    labelKey: "admin.nav.users",
    to: "/admin/users",
    icon: Users,
  },
];

/* ── Color helpers ── */

const ACCENT_COLORS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Purple", value: "#a855f7" },
];

type Theme = "dark" | "light";

function lightenHex(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);

  const lighten = (c: number) =>
    Math.min(255, Math.round(c + (255 - c) * (amount / 100)));

  const rr = lighten(r).toString(16).padStart(2, "0");
  const gg = lighten(g).toString(16).padStart(2, "0");
  const bb = lighten(b).toString(16).padStart(2, "0");

  return `#${rr}${gg}${bb}`;
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.style.setProperty("--admin-bg", "#f1f5f9");
    root.style.setProperty("--admin-sidebar-bg", "#ffffff");
    root.style.setProperty("--admin-surface", "#ffffff");
    root.style.setProperty("--admin-surface-hover", "#f8fafc");
    root.style.setProperty("--admin-border", "#e2e8f0");
    root.style.setProperty("--admin-text", "#0f172a");
    root.style.setProperty("--admin-text-muted", "#64748b");
  } else {
    root.style.setProperty("--admin-bg", "#0b0f1a");
    root.style.setProperty("--admin-sidebar-bg", "#0f1320");
    root.style.setProperty("--admin-surface", "#141926");
    root.style.setProperty("--admin-surface-hover", "#1a2035");
    root.style.setProperty("--admin-border", "#1e293b");
    root.style.setProperty("--admin-text", "#e2e8f0");
    root.style.setProperty("--admin-text-muted", "#64748b");
  }
}

function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--admin-accent", hex);
  root.style.setProperty("--admin-accent-hover", lightenHex(hex, 25));
  root.style.setProperty("--admin-accent-rgb-15", hexToRgba(hex, 0.15));
  root.style.setProperty("--admin-accent-rgb-10", hexToRgba(hex, 0.1));
  root.style.setProperty("--admin-accent-rgb-04", hexToRgba(hex, 0.04));
}

/* ── Component ── */

export default function AdminLayout() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [colorSubmenuOpen, setColorSubmenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("admin-theme") as Theme) || "dark";
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("admin-accent") || "#6366f1";
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ── Helpers ── */

  const isActive = (to: string) =>
    to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);

  const isGroupActive = (group: NavGroup) =>
    group.children.some((child) => isActive(child.to));

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Flatten nav for breadcrumb lookup
  const flatNav: NavItem[] = NAV.flatMap((entry) =>
    isNavGroup(entry) ? entry.children : isSeparator(entry) ? [] : [entry],
  );

  const currentPageLabel =
    flatNav.find((n) => isActive(n.to))?.labelKey ?? "Admin";

  /* ── Effects ── */

  // Auto-expand groups whose children are active
  useEffect(() => {
    NAV.forEach((entry) => {
      if (isNavGroup(entry) && isGroupActive(entry)) {
        setExpandedGroups((prev) => ({ ...prev, [entry.labelKey]: true }));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Apply theme on mount and change
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("admin-theme", theme);
  }, [theme]);

  // Apply accent on mount and change
  useEffect(() => {
    applyAccent(accentColor);
    localStorage.setItem("admin-accent", accentColor);
  }, [accentColor]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setColorSubmenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Handlers ── */

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    navigate("/");
  };

  const handleSettings = () => {
    setDropdownOpen(false);
    navigate("/admin");
  };

  const handleAccentSelect = (color: string) => {
    setAccentColor(color);
    setColorSubmenuOpen(false);
  };

  /* ── Render ── */

  return (
    <div className="admin-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-brand">
            <AuraLogo size={32} color="var(--admin-accent)" />
            <span className="admin-sidebar-brand-text">Aura</span>
          </Link>
          <button
            className="admin-sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV.map((entry, idx) => {
            /* ── Separator ── */
            if (isSeparator(entry)) {
              return (
                <div key={`sep-${idx}`} className="admin-nav-separator">
                  <span className="admin-nav-separator-text">
                    <ShieldCheck size={12} />
                    {entry.separator}
                  </span>
                </div>
              );
            }

            /* ── Collapsible group ── */
            if (isNavGroup(entry)) {
              const expanded =
                expandedGroups[entry.labelKey] ?? isGroupActive(entry);
              const Icon = entry.icon;
              return (
                <div key={entry.labelKey} className="admin-nav-group">
                  <button
                    className={`admin-nav-item admin-nav-group-toggle ${isGroupActive(entry) ? "group-active" : ""}`}
                    onClick={() => toggleGroup(entry.labelKey)}
                  >
                    <Icon size={18} />
                    <span>{t(entry.labelKey)}</span>
                    <ChevronDown
                      size={14}
                      className={`admin-nav-group-chevron ${expanded ? "open" : ""}`}
                    />
                  </button>
                  {expanded && (
                    <div className="admin-nav-group-children">
                      {entry.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            className={`admin-nav-item admin-nav-child ${isActive(child.to) ? "active" : ""}`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            <ChildIcon size={16} />
                            <span>{t(child.labelKey)}</span>
                            {isActive(child.to) && (
                              <ChevronRight
                                size={14}
                                className="admin-nav-arrow"
                              />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            /* ── Normal link ── */
            const Icon = entry.icon;
            return (
              <Link
                key={entry.to}
                to={entry.to}
                className={`admin-nav-item ${isActive(entry.to) ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{t(entry.labelKey)}</span>
                {isActive(entry.to) && (
                  <ChevronRight size={14} className="admin-nav-arrow" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User footer with dropdown */}
        <div className="admin-sidebar-footer" ref={dropdownRef}>
          <button
            className="admin-user-btn"
            onClick={() => {
              setDropdownOpen((prev) => !prev);
              if (dropdownOpen) setColorSubmenuOpen(false);
            }}
          >
            <div className="admin-user-avatar">
              <UserCircle size={20} />
            </div>
            <div className="admin-user-info">
              <span className="admin-user-name">Admin User</span>
              <span className="admin-user-role">Administrator</span>
            </div>
            <ChevronDown
              size={14}
              className={`admin-user-chevron ${dropdownOpen ? "open" : ""}`}
            />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="admin-user-dropdown">
              {/* Theme toggle */}
              <button className="admin-dropdown-item" onClick={toggleTheme}>
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                <span className="admin-dropdown-hint">
                  {theme === "dark" ? "☀" : "🌙"}
                </span>
              </button>

              {/* Accent color picker */}
              <div className="admin-dropdown-item-wrap">
                <button
                  className="admin-dropdown-item"
                  onClick={() => {
                    setColorSubmenuOpen((p) => !p);
                  }}
                >
                  <Palette size={15} />
                  <span>
                    {ACCENT_COLORS.find((c) => c.value === accentColor)?.name ??
                      "Custom"}
                  </span>
                  <span
                    className="admin-dropdown-color-preview"
                    style={{ backgroundColor: accentColor }}
                  />
                  <ChevronRight
                    size={13}
                    className={`admin-dropdown-sub-arrow ${colorSubmenuOpen ? "open" : ""}`}
                  />
                </button>

                {colorSubmenuOpen && (
                  <div className="admin-dropdown-submenu admin-color-submenu">
                    <div className="admin-color-swatches">
                      {ACCENT_COLORS.map((color) => (
                        <button
                          key={color.value}
                          className={`admin-color-swatch ${accentColor === color.value ? "active" : ""}`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => handleAccentSelect(color.value)}
                          title={color.name}
                        >
                          {accentColor === color.value && (
                            <Check size={12} strokeWidth={3} />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="admin-color-labels">
                      {ACCENT_COLORS.map((color) => (
                        <span
                          key={color.value}
                          className={`admin-color-label ${accentColor === color.value ? "active" : ""}`}
                        >
                          {color.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Language toggle */}
              <div className="admin-dropdown-item-wrap">
                <LanguageToggle />
              </div>

              <div className="admin-dropdown-divider" />

              {/* Settings */}
              <button className="admin-dropdown-item" onClick={handleSettings}>
                <Settings size={15} />
                <span>Settings</span>
              </button>

              <div className="admin-dropdown-divider" />

              {/* Logout */}
              <button
                className="admin-dropdown-item admin-dropdown-danger"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span>Logout</span>
              </button>
            </div>
          )}
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
            {currentPageLabel === "Admin" ? "Admin" : t(currentPageLabel)}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

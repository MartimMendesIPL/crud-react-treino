import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
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
  Globe,
  Check,
  Palette,
  ShieldCheck,
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
              );
            }

            if (isNavGroup(entry)) {
              const expanded =
                expandedGroups[entry.label] ?? isGroupActive(entry);
              const Icon = entry.icon;
              return (
                <div key={entry.label} className="admin-nav-group">
                  <button
                    className={`admin-nav-item admin-nav-group-toggle ${isGroupActive(entry) ? "group-active" : ""}`}
                    onClick={() => toggleGroup(entry.label)}
                  >
                    <Icon size={18} />
                    <span>{entry.label}</span>
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
                            <span>{child.label}</span>
                            {isActive(child.to) && (
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
              );
            }

            const Icon = entry.icon;
            return (
              <Link
                key={entry.to}
                to={entry.to}
                className={`admin-nav-item ${isActive(entry.to) ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{entry.label}</span>
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
              if (dropdownOpen) closeAllSubmenus();
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
                    setLangSubmenuOpen(false);
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
                    <LanguageToggle />
                </header>

              {/* Language */}
              <div className="admin-dropdown-item-wrap">
                <button
                  className="admin-dropdown-item"
                  onClick={() => {
                    setLangSubmenuOpen((p) => !p);
                    setColorSubmenuOpen(false);
                  }}
                >
                  <Globe size={15} />
                  <span>
                    {LANGUAGES.find((l) => l.code === language)?.label ??
                      "Language"}
                  </span>
                  <ChevronRight
                    size={13}
                    className={`admin-dropdown-sub-arrow ${langSubmenuOpen ? "open" : ""}`}
                  />
                </button>

                {langSubmenuOpen && (
                  <div className="admin-dropdown-submenu">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        className={`admin-dropdown-item ${language === lang.code ? "active" : ""}`}
                        onClick={() => handleLanguageSelect(lang.code)}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                )}
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
          <div className="admin-topbar-breadcrumb">{currentPageLabel}</div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import {
  Users,
  UserCircle,
  Package,
  FileText,
  ClipboardList,
  History,
} from "lucide-react";

interface CountCard {
  label: string;
  count: number;
  icon: any;
  color: string;
}
export default function DashboardPage() {
  const { t } = useTranslation();
  const [cards, setCards] = useState<CountCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [users, clients, products, proposals, orders, audit] =
          await Promise.all([
            api.get<unknown[]>("/users"),
            api.get<unknown[]>("/clients"),
            api.get<unknown[]>("/products"),
            api.get<unknown[]>("/proposals"),
            api.get<unknown[]>("/orders"),
            api.get<unknown[]>("/audit-log"),
          ]);

        setCards([
          {
            label: t("admin.dashboard.users"),
            count: users.length,
            icon: Users,
            color: "#6366f1",
          },
          {
            label: t("admin.dashboard.clients"),
            count: clients.length,
            icon: UserCircle,
            color: "#10b981",
          },
          {
            label: t("admin.dashboard.products"),
            count: products.length,
            icon: Package,
            color: "#f59e0b",
          },
          {
            label: t("admin.dashboard.proposals"),
            count: proposals.length,
            icon: FileText,
            color: "#3b82f6",
          },
          {
            label: t("admin.dashboard.orders"),
            count: orders.length,
            icon: ClipboardList,
            color: "#ec4899",
          },
          {
            label: t("admin.dashboard.auditEntries"),
            count: audit.length,
            icon: History,
            color: "#8b5cf6",
          },
        ]);
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, [t]);

  return (
    <div className="dashboard-page">
      <h1 className="crud-title">{t("admin.dashboard.title")}</h1>
      <p className="dashboard-subtitle">{t("admin.dashboard.subtitle")}</p>

      <div className="dashboard-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="dashboard-card dashboard-card-skeleton" />
            ))
          : cards.map((c) => (
              <div key={c.label} className="dashboard-card">
                <div
                  className="dashboard-card-icon"
                  style={{
                    backgroundColor: `${c.color}18`,
                    color: c.color,
                  }}
                >
                  <c.icon size={22} />
                </div>
                <div className="dashboard-card-info">
                  <span className="dashboard-card-count">{c.count}</span>
                  <span className="dashboard-card-label">{c.label}</span>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Package,
  FileText,
  ClipboardList,
  UserCircle,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

/* ── Types ─────────────────────────────────────────── */

interface Proposal {
  id: number;
  reference: string;
  client_id: number;
  section_id: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

interface Order {
  id: number;
  reference: string;
  proposal_id: number | null;
  client_id: number;
  section_id: number | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface Client {
  id: number;
  name: string;
  email: string | null;
  created_at: string;
}

interface Product {
  id: number;
  name: string;
  unit_price: number;
  unit: string;
}

interface Section {
  id: number;
  name: string;
}

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface ProposalItem {
  id: number;
  proposal_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

/* ── Helpers ───────────────────────────────────────── */

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
];

const STATUS_COLORS: Record<string, string> = {
  draft: "#64748b",
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  in_production: "#3b82f6",
  completed: "#10b981",
  delivered: "#8b5cf6",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function getMonthLabel(date: Date): string {
  return date.toLocaleDateString("pt-PT", { month: "short" });
}

/* ── Small Chart Components (pure SVG) ──────────── */

function DonutChart({
  data,
  size = 180,
}: {
  data: { label: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--admin-text-muted)",
          fontSize: 13,
        }}
      >
        Sem dados
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.6;
  const filteredData = data.filter((d) => d.value > 0);
  const cumulativeValues = filteredData.reduce<
    { start: number; end: number }[]
  >((acc, d) => {
    const prev = acc.length > 0 ? acc[acc.length - 1].end : 0;
    acc.push({ start: prev, end: prev + d.value });
    return acc;
  }, []);

  const arcs = filteredData.map((d, idx) => {
    const startAngle =
      (cumulativeValues[idx].start / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle =
      (cumulativeValues[idx].end / total) * 2 * Math.PI - Math.PI / 2;
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    const x1 = cx + outerR * Math.cos(startAngle);
    const y1 = cy + outerR * Math.sin(startAngle);
    const x2 = cx + outerR * Math.cos(endAngle);
    const y2 = cy + outerR * Math.sin(endAngle);
    const x3 = cx + innerR * Math.cos(endAngle);
    const y3 = cy + innerR * Math.sin(endAngle);
    const x4 = cx + innerR * Math.cos(startAngle);
    const y4 = cy + innerR * Math.sin(startAngle);

    const path = [
      `M ${x1} ${y1}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}`,
      `Z`,
    ].join(" ");

    return { path, color: d.color, label: d.label, value: d.value };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible" }}
    >
      {arcs.map((arc, i) => (
        <path key={i} d={arc.path} fill={arc.color} opacity={0.9}>
          <title>
            {arc.label}: {arc.value} ({((arc.value / total) * 100).toFixed(1)}%)
          </title>
        </path>
      ))}
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="var(--admin-text)"
        fontSize={22}
        fontWeight={700}
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fill="var(--admin-text-muted)"
        fontSize={11}
      >
        total
      </text>
    </svg>
  );
}

function BarChartHorizontal({
  data,
  maxBarWidth = 260,
}: {
  data: { label: string; value: number; color: string }[];
  maxBarWidth?: number;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
      }}
    >
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              width: 90,
              fontSize: 12,
              color: "var(--admin-text-muted)",
              textAlign: "right",
              flexShrink: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={d.label}
          >
            {d.label}
          </span>
          <div
            style={{
              flex: 1,
              maxWidth: maxBarWidth,
              height: 22,
              background: "var(--admin-surface-hover)",
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${(d.value / maxVal) * 100}%`,
                height: "100%",
                background: d.color,
                borderRadius: 6,
                transition: "width 0.6s ease",
                minWidth: d.value > 0 ? 4 : 0,
              }}
            />
          </div>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "var(--admin-text)",
              width: 36,
            }}
          >
            {d.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function BarChartVertical({
  data,
  height = 200,
}: {
  data: { label: string; value: number; color: string }[];
  height?: number;
}) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 6,
        height,
        width: "100%",
        paddingTop: 20,
      }}
    >
      {data.map((d, i) => {
        const barH = Math.max(
          (d.value / maxVal) * (height - 40),
          d.value > 0 ? 4 : 0,
        );
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "var(--admin-text)",
              }}
            >
              {d.value > 0 ? d.value : ""}
            </span>
            <div
              style={{
                width: "70%",
                maxWidth: 40,
                height: barH,
                background: d.color,
                borderRadius: "6px 6px 2px 2px",
                transition: "height 0.6s ease",
              }}
              title={`${d.label}: ${d.value}`}
            />
            <span
              style={{
                fontSize: 10,
                color: "var(--admin-text-muted)",
                textAlign: "center",
                lineHeight: 1.2,
              }}
            >
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MiniSparkline({
  data,
  color = "#6366f1",
  width = 120,
  height = 36,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Legend({
  items,
}: {
  items: { label: string; color: string; value?: number }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 16px",
        marginTop: 12,
      }}
    >
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: item.color,
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
            {item.label}
            {item.value !== undefined && (
              <span
                style={{
                  fontWeight: 600,
                  color: "var(--admin-text)",
                  marginLeft: 4,
                }}
              >
                {item.value}
              </span>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── KPI Card ──────────────────────────────────────── */

function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendLabel,
  color,
  sparkData,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  color: string;
  sparkData?: number[];
}) {
  return (
    <div className="stat-kpi-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          className="stat-kpi-icon"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon size={20} />
        </div>
        {sparkData && sparkData.length > 1 && (
          <MiniSparkline data={sparkData} color={color} />
        )}
      </div>
      <div className="stat-kpi-value">{value}</div>
      <div className="stat-kpi-label">{label}</div>
      {(subtitle || trendLabel) && (
        <div className="stat-kpi-footer">
          {trend && trendLabel && (
            <span
              className={`stat-kpi-trend ${
                trend === "up"
                  ? "stat-kpi-trend-up"
                  : trend === "down"
                    ? "stat-kpi-trend-down"
                    : ""
              }`}
            >
              {trend === "up" ? (
                <ArrowUpRight size={13} />
              ) : trend === "down" ? (
                <ArrowDownRight size={13} />
              ) : null}
              {trendLabel}
            </span>
          )}
          {subtitle && (
            <span style={{ fontSize: 12, color: "var(--admin-text-muted)" }}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Chart Card Wrapper ────────────────────────────── */

function ChartCard({
  title,
  icon: Icon,
  children,
  span,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <div
      className="stat-chart-card"
      style={span ? { gridColumn: `span ${span}` } : {}}
    >
      <div className="stat-chart-header">
        <Icon size={16} style={{ color: "var(--admin-text-muted)" }} />
        <h3 className="stat-chart-title">{title}</h3>
      </div>
      <div className="stat-chart-body">{children}</div>
    </div>
  );
}

/* ── Main Page Component ───────────────────────────── */

export default function StatisticsPage() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [orderItemsMap, setOrderItemsMap] = useState<
    Record<number, OrderItem[]>
  >({});
  const [proposalItemsMap, setProposalItemsMap] = useState<
    Record<number, ProposalItem[]>
  >({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          proposalsData,
          ordersData,
          clientsData,
          productsData,
          sectionsData,
        ] = await Promise.all([
          api.get<Proposal[]>("/proposals"),
          api.get<Order[]>("/orders"),
          api.get<Client[]>("/clients"),
          api.get<Product[]>("/products"),
          api.get<Section[]>("/sections"),
        ]);

        setProposals(proposalsData);
        setOrders(ordersData);
        setClients(clientsData);
        setProducts(productsData);
        setSections(sectionsData);

        // Fetch items for all orders
        const orderItemsResults = await Promise.all(
          ordersData.map((o) =>
            api
              .get<OrderItem[]>(`/orders/${o.id}/items`)
              .catch(() => [] as OrderItem[]),
          ),
        );
        const oiMap: Record<number, OrderItem[]> = {};
        ordersData.forEach((o, i) => {
          oiMap[o.id] = orderItemsResults[i];
        });
        setOrderItemsMap(oiMap);

        // Fetch items for all proposals
        const proposalItemsResults = await Promise.all(
          proposalsData.map((p) =>
            api
              .get<ProposalItem[]>(`/proposals/${p.id}/items`)
              .catch(() => [] as ProposalItem[]),
          ),
        );
        const piMap: Record<number, ProposalItem[]> = {};
        proposalsData.forEach((p, i) => {
          piMap[p.id] = proposalItemsResults[i];
        });
        setProposalItemsMap(piMap);
      } catch {
        /* silently fail */
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ── Computed Statistics ── */

  // Total revenue from orders
  const totalOrderRevenue = Object.values(orderItemsMap)
    .flat()
    .reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0,
    );

  const totalProposalValue = Object.values(proposalItemsMap)
    .flat()
    .reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
      0,
    );

  // Proposal statuses
  const proposalStatusCounts = proposals.reduce<Record<string, number>>(
    (acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    },
    {},
  );

  // Order statuses
  const orderStatusCounts = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Conversion rate
  const approvedProposals = proposalStatusCounts["approved"] || 0;
  const conversionRate =
    proposals.length > 0 ? (approvedProposals / proposals.length) * 100 : 0;

  // Orders per month (last 6 months)
  const now = new Date();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return d;
  });

  const ordersPerMonth = last6Months.map((monthDate) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const count = orders.filter((o) => {
      const d = new Date(o.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    return { label: getMonthLabel(monthDate), value: count, color: "#6366f1" };
  });

  const proposalsPerMonth = last6Months.map((monthDate) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const count = proposals.filter((p) => {
      const d = new Date(p.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    return { label: getMonthLabel(monthDate), value: count, color: "#10b981" };
  });

  // Revenue per client
  const clientMap = new Map(clients.map((c) => [c.id, c.name]));
  const revenueByClient: Record<number, number> = {};
  orders.forEach((o) => {
    const items = orderItemsMap[o.id] || [];
    const rev = items.reduce(
      (s, it) => s + Number(it.quantity) * Number(it.unit_price),
      0,
    );
    revenueByClient[o.client_id] = (revenueByClient[o.client_id] || 0) + rev;
  });

  const topClients = Object.entries(revenueByClient)
    .map(([clientId, revenue]) => ({
      label: clientMap.get(Number(clientId)) || `Client #${clientId}`,
      value: revenue,
      color: COLORS[Number(clientId) % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Orders by section
  const ordersBySection = sections.map((s, i) => ({
    label: s.name,
    value: orders.filter((o) => o.section_id === s.id).length,
    color: COLORS[i % COLORS.length],
  }));

  // Top products by quantity ordered
  const productQuantityMap: Record<number, number> = {};
  Object.values(orderItemsMap)
    .flat()
    .forEach((item) => {
      productQuantityMap[item.product_id] =
        (productQuantityMap[item.product_id] || 0) + Number(item.quantity);
    });

  const productMap = new Map(products.map((p) => [p.id, p.name]));
  const topProducts = Object.entries(productQuantityMap)
    .map(([pid, qty]) => ({
      label: productMap.get(Number(pid)) || `Product #${pid}`,
      value: qty,
      color: COLORS[Number(pid) % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Average order value
  const avgOrderValue =
    orders.length > 0 ? totalOrderRevenue / orders.length : 0;

  // Sparkline data for orders
  const orderSparkData = ordersPerMonth.map((m) => m.value);
  const proposalSparkData = proposalsPerMonth.map((m) => m.value);

  // Proposals by section for donut
  const proposalsBySection = sections.map((s, i) => ({
    label: s.name,
    value: proposals.filter((p) => p.section_id === s.id).length,
    color: COLORS[i % COLORS.length],
  }));
  // Add "no section"
  const noSectionProposals = proposals.filter((p) => !p.section_id).length;
  if (noSectionProposals > 0) {
    proposalsBySection.push({
      label: t("admin.calendar.noSection"),
      value: noSectionProposals,
      color: "#64748b",
    });
  }

  // Clients per month (last 6 months)
  const clientsPerMonth = last6Months.map((monthDate) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    const count = clients.filter((c) => {
      const d = new Date(c.created_at);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length;
    return { label: getMonthLabel(monthDate), value: count, color: "#f59e0b" };
  });

  /* ── Render ── */

  if (loading) {
    return (
      <div className="stat-loading">
        <Loader2
          size={32}
          className="crud-spin"
          style={{ color: "var(--admin-accent)" }}
        />
        <span>{t("common.loading")}</span>
      </div>
    );
  }

  return (
    <div className="stat-page">
      <div className="stat-page-header">
        <div>
          <h1 className="crud-title">{t("admin.statistics.title")}</h1>
          <p className="dashboard-subtitle">{t("admin.statistics.subtitle")}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-kpi-grid">
        <KPICard
          icon={DollarSign}
          label={t("admin.statistics.totalRevenue")}
          value={formatCurrency(totalOrderRevenue)}
          subtitle={t("admin.statistics.fromOrders", { count: orders.length })}
          trend={totalOrderRevenue > 0 ? "up" : "neutral"}
          trendLabel={
            totalOrderRevenue > 0
              ? formatCurrency(avgOrderValue) + " " + t("admin.statistics.avg")
              : undefined
          }
          color="#10b981"
          sparkData={orderSparkData}
        />
        <KPICard
          icon={FileText}
          label={t("admin.statistics.proposalValue")}
          value={formatCurrency(totalProposalValue)}
          subtitle={`${proposals.length} ${t("admin.statistics.totalProposals")}`}
          trend={
            conversionRate >= 50
              ? "up"
              : conversionRate > 0
                ? "down"
                : "neutral"
          }
          trendLabel={`${conversionRate.toFixed(0)}% ${t("admin.statistics.conversionRate")}`}
          color="#6366f1"
          sparkData={proposalSparkData}
        />
        <KPICard
          icon={ClipboardList}
          label={t("admin.statistics.activeOrders")}
          value={
            orders.filter(
              (o) => o.status === "in_production" || o.status === "pending",
            ).length
          }
          subtitle={`${orders.filter((o) => o.status === "completed" || o.status === "delivered").length} ${t("admin.statistics.completed")}`}
          trend="up"
          trendLabel={`${orders.length} ${t("admin.statistics.total")}`}
          color="#3b82f6"
          sparkData={orderSparkData}
        />
        <KPICard
          icon={UserCircle}
          label={t("admin.statistics.totalClients")}
          value={clients.length}
          subtitle={`${products.length} ${t("admin.statistics.products")}`}
          color="#f59e0b"
          sparkData={clientsPerMonth.map((m) => m.value)}
        />
      </div>

      {/* Charts Grid */}
      <div className="stat-charts-grid">
        {/* Orders per Month */}
        <ChartCard
          title={t("admin.statistics.ordersPerMonth")}
          icon={BarChart3}
        >
          <BarChartVertical data={ordersPerMonth} height={180} />
        </ChartCard>

        {/* Proposals per Month */}
        <ChartCard
          title={t("admin.statistics.proposalsPerMonth")}
          icon={TrendingUp}
        >
          <BarChartVertical data={proposalsPerMonth} height={180} />
        </ChartCard>

        {/* Order Status Distribution */}
        <ChartCard title={t("admin.statistics.ordersByStatus")} icon={PieChart}>
          <div className="stat-donut-wrap">
            <DonutChart
              data={Object.entries(orderStatusCounts).map(
                ([status, count]) => ({
                  label: t(`status.${status}`),
                  value: count,
                  color: STATUS_COLORS[status] || "#64748b",
                }),
              )}
            />
            <Legend
              items={Object.entries(orderStatusCounts).map(
                ([status, count]) => ({
                  label: t(`status.${status}`),
                  value: count,
                  color: STATUS_COLORS[status] || "#64748b",
                }),
              )}
            />
          </div>
        </ChartCard>

        {/* Proposal Status Distribution */}
        <ChartCard
          title={t("admin.statistics.proposalsByStatus")}
          icon={PieChart}
        >
          <div className="stat-donut-wrap">
            <DonutChart
              data={Object.entries(proposalStatusCounts).map(
                ([status, count]) => ({
                  label: t(`status.${status}`),
                  value: count,
                  color: STATUS_COLORS[status] || "#64748b",
                }),
              )}
            />
            <Legend
              items={Object.entries(proposalStatusCounts).map(
                ([status, count]) => ({
                  label: t(`status.${status}`),
                  value: count,
                  color: STATUS_COLORS[status] || "#64748b",
                }),
              )}
            />
          </div>
        </ChartCard>

        {/* Top Clients by Revenue */}
        <ChartCard
          title={t("admin.statistics.topClientsByRevenue")}
          icon={TrendingUp}
          span={2}
        >
          {topClients.length > 0 ? (
            <div>
              <BarChartHorizontal
                data={topClients.map((c) => ({
                  label: c.label,
                  value: Math.round(c.value * 100) / 100,
                  color: c.color,
                }))}
              />
              <div style={{ marginTop: 12 }}>
                {topClients.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: "1px solid var(--admin-border)",
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: "var(--admin-text-muted)" }}>
                      {c.label}
                    </span>
                    <span
                      style={{ color: "var(--admin-text)", fontWeight: 600 }}
                    >
                      {formatCurrency(c.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="stat-empty">{t("admin.statistics.noData")}</div>
          )}
        </ChartCard>

        {/* Orders by Section */}
        <ChartCard
          title={t("admin.statistics.ordersBySection")}
          icon={Activity}
        >
          <div className="stat-donut-wrap">
            <DonutChart data={ordersBySection} />
            <Legend
              items={ordersBySection.map((s) => ({
                label: s.label,
                value: s.value,
                color: s.color,
              }))}
            />
          </div>
        </ChartCard>

        {/* Proposals by Section */}
        <ChartCard
          title={t("admin.statistics.proposalsBySection")}
          icon={PieChart}
        >
          <div className="stat-donut-wrap">
            <DonutChart data={proposalsBySection} />
            <Legend
              items={proposalsBySection.map((s) => ({
                label: s.label,
                value: s.value,
                color: s.color,
              }))}
            />
          </div>
        </ChartCard>

        {/* Top Products */}
        <ChartCard
          title={t("admin.statistics.topProducts")}
          icon={Package}
          span={2}
        >
          {topProducts.length > 0 ? (
            <BarChartHorizontal
              data={topProducts.map((p) => ({
                label: p.label,
                value: p.value,
                color: p.color,
              }))}
            />
          ) : (
            <div className="stat-empty">{t("admin.statistics.noData")}</div>
          )}
        </ChartCard>

        {/* New Clients per Month */}
        <ChartCard
          title={t("admin.statistics.newClientsPerMonth")}
          icon={UserCircle}
        >
          <BarChartVertical data={clientsPerMonth} height={180} />
        </ChartCard>

        {/* Summary Table */}
        <ChartCard title={t("admin.statistics.summary")} icon={BarChart3}>
          <div className="stat-summary-table">
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.avgOrderValue")}
              </span>
              <span className="stat-summary-value">
                {formatCurrency(avgOrderValue)}
              </span>
            </div>
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.conversionRate")}
              </span>
              <span className="stat-summary-value">
                {conversionRate.toFixed(1)}%
              </span>
            </div>
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.totalProducts")}
              </span>
              <span className="stat-summary-value">{products.length}</span>
            </div>
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.totalSections")}
              </span>
              <span className="stat-summary-value">{sections.length}</span>
            </div>
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.pendingOrders")}
              </span>
              <span className="stat-summary-value">
                {orderStatusCounts["pending"] || 0}
              </span>
            </div>
            <div className="stat-summary-row">
              <span className="stat-summary-label">
                {t("admin.statistics.inProduction")}
              </span>
              <span className="stat-summary-value">
                {orderStatusCounts["in_production"] || 0}
              </span>
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

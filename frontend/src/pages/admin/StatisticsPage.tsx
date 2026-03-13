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
  Loader2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart as RechartsPie,
  Pie,
  LineChart,
  Line,
} from "recharts";

/* ─── Types ─── */
interface StatusCount {
  status: string;
  count: number;
}
interface LabelCount {
  label: string;
  count: number;
}
interface MonthCount {
  year: number;
  month: number;
  count: number;
}
interface ClientRevenue {
  client_id: number;
  client_name: string;
  revenue: number;
}
interface ProductQty {
  product_id: number;
  product_name: string;
  total_qty: number;
}

interface StatsResponse {
  total_orders: number;
  total_proposals: number;
  total_clients: number;
  total_products: number;
  total_sections: number;
  active_orders: number;
  completed_orders: number;
  total_order_revenue: number;
  total_proposal_value: number;
  avg_order_value: number;
  conversion_rate: number;
  orders_by_status: StatusCount[];
  proposals_by_status: StatusCount[];
  orders_by_section: LabelCount[];
  proposals_by_section: LabelCount[];
  orders_per_month: MonthCount[];
  proposals_per_month: MonthCount[];
  clients_per_month: MonthCount[];
  top_clients_by_revenue: ClientRevenue[];
  top_products_by_qty: ProductQty[];
}

/* ─── Constants ─── */
const PALETTE = [
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
const STATUS_COLOR: Record<string, string> = {
  draft: "#64748b",
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#ef4444",
  in_production: "#3b82f6",
  completed: "#10b981",
  delivered: "#8b5cf6",
};

/* ─── Helpers ─── */
const fmtCurrency = (v: number) =>
  new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(v);

function fillMonths(data: MonthCount[]) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const found = data.find(
      (r) => r.year === d.getFullYear() && r.month === d.getMonth() + 1,
    );
    return {
      label: d.toLocaleDateString("pt-PT", { month: "short" }),
      value: found?.count ?? 0,
    };
  });
}

const tooltipStyle = {
  backgroundColor: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--admin-text)",
};
const tooltipLabelStyle = { color: "var(--admin-text)" };
const tooltipItemStyle = { color: "var(--admin-text-muted)" };
const tooltipCursor = { fill: "var(--admin-surface-hover)" };

/* ─── KPI Card ─── */
function KPICard({
  icon: Icon,
  label,
  value,
  subtitle,
  trendLabel,
  color,
  sparkData,
}: {
  icon: any;
  label: string;
  value: string | number;
  subtitle?: string;
  trendLabel?: string;
  color: string;
  sparkData?: number[];
}) {
  return (
    <div className="stat-kpi-card">
      <div className="stat-kpi-card-top">
        <div
          className="stat-kpi-icon"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon size={20} />
        </div>
        {sparkData && sparkData.length > 1 && (
          <LineChart
            width={110}
            height={34}
            data={sparkData.map((v) => ({ v }))}
          >
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        )}
      </div>
      <div className="stat-kpi-value">{value}</div>
      <div className="stat-kpi-label">{label}</div>
      {(subtitle || trendLabel) && (
        <div className="stat-kpi-footer">
          {trendLabel && (
            <span className="stat-kpi-trend stat-kpi-trend-up">
              <ArrowUpRight size={13} />
              {trendLabel}
            </span>
          )}
          {subtitle && <span className="stat-kpi-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}

/* ─── Chart Card ─── */
function ChartCard({
  title,
  icon: Icon,
  children,
  span,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
  span?: number;
}) {
  return (
    <div className="stat-chart-card" data-span={span}>
      <div className="stat-chart-header">
        <Icon size={16} className="stat-chart-icon" />
        <h3 className="stat-chart-title">{title}</h3>
      </div>
      <div className="stat-chart-body">{children}</div>
    </div>
  );
}

/* ─── Page ─── */
export default function StatisticsPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    api
      .get<StatsResponse>("/statistics")
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
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

  if (!stats)
    return (
      <div className="stat-loading">
        <span>{t("admin.crud.loadFailed")}</span>
      </div>
    );

  const ordersMonthly = fillMonths(stats.orders_per_month);
  const proposalsMonthly = fillMonths(stats.proposals_per_month);
  const clientsMonthly = fillMonths(stats.clients_per_month);

  const ordersByStatus = stats.orders_by_status.map((s) => ({
    name: t(`status.${s.status}`),
    value: s.count,
    color: STATUS_COLOR[s.status] ?? "#64748b",
  }));
  const proposalsByStatus = stats.proposals_by_status.map((s) => ({
    name: t(`status.${s.status}`),
    value: s.count,
    color: STATUS_COLOR[s.status] ?? "#64748b",
  }));
  const ordersBySection = stats.orders_by_section.map((s, i) => ({
    name: s.label,
    value: s.count,
    color: PALETTE[i % PALETTE.length],
  }));
  const proposalsBySection = stats.proposals_by_section.map((s, i) => ({
    name: s.label,
    value: s.count,
    color: PALETTE[i % PALETTE.length],
  }));
  const topClients = stats.top_clients_by_revenue.map((c, i) => ({
    name: c.client_name,
    value: c.revenue,
    color: PALETTE[i % PALETTE.length],
  }));
  const topProducts = stats.top_products_by_qty.map((p, i) => ({
    name: p.product_name,
    value: p.total_qty,
    color: PALETTE[i % PALETTE.length],
  }));

  const summaryRows = [
    {
      label: t("admin.statistics.avgOrderValue"),
      value: fmtCurrency(stats.avg_order_value),
    },
    {
      label: t("admin.statistics.conversionRate"),
      value: `${stats.conversion_rate.toFixed(1)}%`,
    },
    {
      label: t("admin.statistics.totalProducts"),
      value: stats.total_products,
    },
    {
      label: t("admin.statistics.totalSections"),
      value: stats.total_sections,
    },
    {
      label: t("admin.statistics.pendingOrders"),
      value:
        stats.orders_by_status.find((s) => s.status === "pending")?.count ?? 0,
    },
    {
      label: t("admin.statistics.inProduction"),
      value:
        stats.orders_by_status.find((s) => s.status === "in_production")
          ?.count ?? 0,
    },
  ];

  return (
    <div className="stat-page">
      <div className="stat-page-header">
        <h1 className="crud-title">{t("admin.statistics.title")}</h1>
        <p className="dashboard-subtitle">{t("admin.statistics.subtitle")}</p>
      </div>

      <div className="stat-kpi-grid">
        <KPICard
          icon={DollarSign}
          color="#10b981"
          sparkData={ordersMonthly.map((m) => m.value)}
          label={t("admin.statistics.totalRevenue")}
          value={fmtCurrency(stats.total_order_revenue)}
          subtitle={t("admin.statistics.fromOrders", {
            count: stats.total_orders,
          })}
          trendLabel={
            stats.avg_order_value > 0
              ? `${fmtCurrency(stats.avg_order_value)} ${t("admin.statistics.avg")}`
              : undefined
          }
        />
        <KPICard
          icon={FileText}
          color="#6366f1"
          sparkData={proposalsMonthly.map((m) => m.value)}
          label={t("admin.statistics.proposalValue")}
          value={fmtCurrency(stats.total_proposal_value)}
          subtitle={`${stats.total_proposals} ${t("admin.statistics.totalProposals")}`}
          trendLabel={`${stats.conversion_rate.toFixed(0)}% ${t("admin.statistics.conversionRate")}`}
        />
        <KPICard
          icon={ClipboardList}
          color="#3b82f6"
          sparkData={ordersMonthly.map((m) => m.value)}
          label={t("admin.statistics.activeOrders")}
          value={stats.active_orders}
          subtitle={`${stats.completed_orders} ${t("admin.statistics.completed")}`}
          trendLabel={`${stats.total_orders} ${t("admin.statistics.total")}`}
        />
        <KPICard
          icon={UserCircle}
          color="#f59e0b"
          sparkData={clientsMonthly.map((m) => m.value)}
          label={t("admin.statistics.totalClients")}
          value={stats.total_clients}
          subtitle={`${stats.total_products} ${t("admin.statistics.products")}`}
        />
      </div>

      <div className="stat-charts-grid">
        <ChartCard
          title={t("admin.statistics.ordersPerMonth")}
          icon={BarChart3}
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={ordersMonthly}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                cursor={tooltipCursor}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.proposalsPerMonth")}
          icon={TrendingUp}
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={proposalsMonthly}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                cursor={tooltipCursor}
              />
              <Bar dataKey="value" fill="#10b981" radius={[4, 4, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("admin.statistics.ordersByStatus")} icon={PieChart}>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={ordersByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
              >
                {ordersByStatus.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.proposalsByStatus")}
          icon={PieChart}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={proposalsByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
              >
                {proposalsByStatus.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.topClientsByRevenue")}
          icon={TrendingUp}
          span={2}
        >
          {topClients.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={Math.max(160, topClients.length * 36)}
            >
              <BarChart
                layout="vertical"
                data={topClients}
                margin={{
                  top: 4,
                  right: 60,
                  left: 8,
                  bottom: 4,
                }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 10,
                    fill: "var(--admin-text-muted)",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => fmtCurrency(v)}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{
                    fontSize: 11,
                    fill: "var(--admin-text-muted)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  cursor={tooltipCursor}
                  formatter={(v: number | undefined) =>
                    v != null ? fmtCurrency(v) : ""
                  }
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topClients.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="stat-empty">{t("admin.statistics.noData")}</div>
          )}
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.ordersBySection")}
          icon={Activity}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={ordersBySection}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
              >
                {ordersBySection.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.proposalsBySection")}
          icon={PieChart}
        >
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPie>
              <Pie
                data={proposalsBySection}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
              >
                {proposalsBySection.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
              />
            </RechartsPie>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.topProducts")}
          icon={Package}
          span={2}
        >
          {topProducts.length > 0 ? (
            <ResponsiveContainer
              width="100%"
              height={Math.max(160, topProducts.length * 36)}
            >
              <BarChart
                layout="vertical"
                data={topProducts}
                margin={{
                  top: 4,
                  right: 40,
                  left: 8,
                  bottom: 4,
                }}
              >
                <XAxis
                  type="number"
                  tick={{
                    fontSize: 10,
                    fill: "var(--admin-text-muted)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{
                    fontSize: 11,
                    fill: "var(--admin-text-muted)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  itemStyle={tooltipItemStyle}
                  cursor={tooltipCursor}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {topProducts.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="stat-empty">{t("admin.statistics.noData")}</div>
          )}
        </ChartCard>

        <ChartCard
          title={t("admin.statistics.newClientsPerMonth")}
          icon={UserCircle}
        >
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={clientsMonthly}
              margin={{ top: 10, right: 4, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="label"
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 10,
                  fill: "var(--admin-text-muted)",
                }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={tooltipLabelStyle}
                itemStyle={tooltipItemStyle}
                cursor={tooltipCursor}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t("admin.statistics.summary")} icon={BarChart3}>
          <div className="stat-summary-table">
            {summaryRows.map((row) => (
              <div key={row.label} className="stat-summary-row">
                <span className="stat-summary-label">{row.label}</span>
                <span className="stat-summary-value">{row.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

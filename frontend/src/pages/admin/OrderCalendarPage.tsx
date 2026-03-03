import { useState, useEffect, useCallback, useRef } from "react";
import {
    Loader2,
    ChevronLeft,
    ChevronRight,
    X,
    Calendar,
    User,
    Package,
    ClipboardList,
    Truck,
    Hash,
    FileText,
    Clock,
    MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

/* ── Types ── */

interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name: string;
    unit: string;
    quantity: number;
    unit_price: number;
    notes: string | null;
}

interface Order {
    id: number;
    reference: string;
    proposal_id: number | null;
    client_id: number;
    client_name?: string;
    section_id: number | null;
    section_name?: string;
    proposal_reference?: string;
    status: string;
    due_date: string | null;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
}

interface Client {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    vat_number?: string;
}

interface Section {
    id: number;
    name: string;
    description?: string;
}

interface Product {
    id: number;
    name: string;
    description?: string;
    unit_price: number;
    unit: string;
}

/* ── Helpers ── */

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

function getMonday(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function addDays(date: Date, n: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
}

function dateKey(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateLabel(d: Date) {
    return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;
}

function formatFullDate(dateStr: string | null | undefined) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

/* Section color palette — consistent hues for each section id */
const SECTION_COLORS: string[] = [
    "#6366f1", // indigo
    "#f59e0b", // amber
    "#10b981", // emerald
    "#ef4444", // red
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#ec4899", // pink
    "#f97316", // orange
    "#14b8a6", // teal
    "#a855f7", // purple
    "#84cc16", // lime
    "#e11d48", // rose
];

function getSectionColor(sectionId: number | null): string {
    if (sectionId == null) return "#94a3b8"; // slate for no section
    return SECTION_COLORS[(sectionId - 1) % SECTION_COLORS.length];
}

function hexToRgba(hex: string, alpha: number): string {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const STATUS_COLOR: Record<string, string> = {
    draft: "#6b7280",
    pending: "#f59e0b",
    approved: "#10b981",
    in_production: "#3b82f6",
    completed: "#10b981",
    delivered: "#06b6d4",
    rejected: "#ef4444",
};

const ORDER_STATUSES = [
    "all",
    "draft",
    "pending",
    "approved",
    "in_production",
    "completed",
    "delivered",
    "rejected",
];

/* ── Order Calendar Page ── */

export default function OrderCalendarPage() {
    const { t } = useTranslation();
    const today = new Date();
    const [weekStart, setWeekStart] = useState(() => getMonday(today));
    const [orders, setOrders] = useState<Order[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    /* Side panel state */
    const [panelOrder, setPanelOrder] = useState<Order | null>(null);
    const [panelLoading, setPanelLoading] = useState(false);
    const [panelClosing, setPanelClosing] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ignore = false;
        // Fetch all base data + all order items in 5 parallel requests (no N+1)
        Promise.all([
            api.get<Order[]>("/orders"),
            api.get<Client[]>("/clients"),
            api.get<Section[]>("/sections"),
            api.get<Product[]>("/products"),
            api.get<OrderItem[]>("/order-items"),
        ])
            .then(([o, c, s, p, allItems]) => {
                if (ignore) return;
                setClients(c);
                setSections(s);
                setProducts(p);

                // Group all items by order_id in a single JS pass
                const itemsByOrder = new Map<number, OrderItem[]>();
                for (const item of allItems) {
                    if (!itemsByOrder.has(item.order_id)) {
                        itemsByOrder.set(item.order_id, []);
                    }
                    itemsByOrder.get(item.order_id)!.push(item);
                }

                const withItems = o.map((order) => ({
                    ...order,
                    items: itemsByOrder.get(order.id) ?? [],
                }));
                setOrders(withItems);
            })
            .catch(console.error)
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const clientMap = new Map(clients.map((c) => [c.id, c]));
    const sectionMap = new Map(sections.map((s) => [s.id, s]));
    const productMap = new Map(products.map((p) => [p.id, p]));

    const clientName = (id: number) => clientMap.get(id)?.name ?? `#${id}`;
    const sectionName = (id: number | null) =>
        id ? (sectionMap.get(id)?.name ?? `#${id}`) : "—";
    const productCode = (id: number) => `P${String(id).padStart(3, "0")}`;

    /* ── Build the 7 days of the week ── */
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const weekEnd = weekDays[6];

    const filtered = orders.filter(
        (o) => filter === "all" || o.status === filter,
    );

    /* Place orders on their due_date; if no due_date, use created_at */
    const ordersByDate = new Map<string, Order[]>();
    for (const o of filtered) {
        const dateStr = o.due_date ?? o.created_at;
        const key = dateKey(new Date(dateStr));
        if (!ordersByDate.has(key)) ordersByDate.set(key, []);
        ordersByDate.get(key)!.push(o);
    }

    const prevWeek = () => setWeekStart(addDays(weekStart, -7));
    const nextWeek = () => setWeekStart(addDays(weekStart, 7));
    const goToday = () => setWeekStart(getMonday(today));

    /* ── Week range label ── */
    const rangeLabel =
        weekStart.getMonth() === weekEnd.getMonth()
            ? `${weekStart.getDate()} – ${weekEnd.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
            : `${formatDateLabel(weekStart)} – ${formatDateLabel(weekEnd)} ${weekEnd.getFullYear()}`;

    /* ── Open side panel ── */
    const openPanel = useCallback(async (order: Order) => {
        setPanelClosing(false);
        setPanelLoading(true);
        setPanelOrder(order);

        try {
            const full = await api.get<Order>(`/orders/${order.id}`);
            setPanelOrder(full);
        } catch {
            // keep partial data
        } finally {
            setPanelLoading(false);
        }
    }, []);

    const closePanel = useCallback(() => {
        setPanelClosing(true);
        setTimeout(() => {
            setPanelOrder(null);
            setPanelClosing(false);
        }, 300);
    }, []);

    /* Close on click outside */
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                panelOrder &&
                panelRef.current &&
                !panelRef.current.contains(e.target as Node)
            ) {
                closePanel();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [panelOrder, closePanel]);

    /* Close on Escape */
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape" && panelOrder) closePanel();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [panelOrder, closePanel]);

    /* ── Build order items summary for card display ── */
    const getOrderItemsSummary = (order: Order) => {
        if (!order.items || order.items.length === 0) return null;
        return order.items.slice(0, 3).map((item) => ({
            qty: Number(item.quantity),
            code: productCode(item.product_id),
            name:
                item.product_name ??
                productMap.get(item.product_id)?.name ??
                `Product #${item.product_id}`,
        }));
    };

    if (loading) {
        return (
            <div className="crud-loading">
                <Loader2 size={24} className="crud-spin" />{" "}
                {t("admin.calendar.loadingCalendar", "Loading calendar...")}
            </div>
        );
    }

    return (
        <div className="cal-page" style={{ position: "relative" }}>
            {/* Header */}
            <div className="cal-header">
                <div className="cal-header-left">
                    <h1 className="crud-title">
                        {t("admin.calendar.ordersTitle", "Orders Calendar")}
                    </h1>
                    <div className="cal-nav">
                        <button className="cal-nav-btn" onClick={prevWeek}>
                            <ChevronLeft size={18} />
                        </button>
                        <span className="cal-week-label">{rangeLabel}</span>
                        <button className="cal-nav-btn" onClick={nextWeek}>
                            <ChevronRight size={18} />
                        </button>
                        <button className="cal-today-btn" onClick={goToday}>
                            {t("admin.calendar.thisWeek", "This Week")}
                        </button>
                    </div>
                </div>
                <div className="cal-filters">
                    {ORDER_STATUSES.map((s) => (
                        <button
                            key={s}
                            className={`cal-filter-btn ${filter === s ? "active" : ""}`}
                            onClick={() => setFilter(s)}
                            style={
                                filter === s && s !== "all"
                                    ? {
                                          borderColor: STATUS_COLOR[s],
                                          color: STATUS_COLOR[s],
                                      }
                                    : undefined
                            }
                        >
                            {s === "all"
                                ? t("common.all", "All")
                                : t(`status.${s}`, s)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Section Legend */}
            <div className="cal-section-legend">
                {sections.map((s) => (
                    <div key={s.id} className="cal-section-legend-item">
                        <span
                            className="cal-legend-dot"
                            style={{ backgroundColor: getSectionColor(s.id) }}
                        />
                        {s.name}
                    </div>
                ))}
                <div className="cal-section-legend-item">
                    <span
                        className="cal-legend-dot"
                        style={{ backgroundColor: getSectionColor(null) }}
                    />
                    {t("admin.calendar.noSection", "No Section")}
                </div>
            </div>

            {/* Week Grid */}
            <div className="cal-week-grid">
                {weekDays.map((day, i) => {
                    const key = dateKey(day);
                    const items = ordersByDate.get(key) ?? [];
                    const isToday = isSameDay(day, today);

                    return (
                        <div
                            key={key}
                            className={`cal-week-col ${isToday ? "cal-week-col-today" : ""}`}
                        >
                            {/* Day header */}
                            <div className="cal-week-day-header">
                                <span className="cal-week-day-name">
                                    {DAY_NAMES[i]}
                                </span>
                                <span
                                    className={`cal-week-day-num ${isToday ? "today" : ""}`}
                                >
                                    {day.getDate()}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="cal-week-items">
                                {items.length === 0 && (
                                    <div className="cal-week-empty">—</div>
                                )}
                                {items.map((o) => {
                                    const secColor = getSectionColor(
                                        o.section_id,
                                    );
                                    const itemsSummary =
                                        getOrderItemsSummary(o);

                                    return (
                                        <button
                                            key={o.id}
                                            className="cal-order-card"
                                            style={{
                                                backgroundColor: hexToRgba(
                                                    secColor,
                                                    0.15,
                                                ),
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openPanel(o);
                                            }}
                                            title={`${o.reference} — ${clientName(o.client_id)}`}
                                        >
                                            {/* Client name */}
                                            <div className="cal-card-client">
                                                {clientName(o.client_id)}
                                            </div>

                                            {/* Product lines */}
                                            {itemsSummary ? (
                                                <div className="cal-card-products">
                                                    {itemsSummary.map(
                                                        (p, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="cal-card-product-line"
                                                            >
                                                                <span className="cal-card-qty">
                                                                    {p.qty}x
                                                                </span>{" "}
                                                                <span className="cal-card-pcode">
                                                                    {p.code}
                                                                </span>
                                                                {" - "}
                                                                <span className="cal-card-pname">
                                                                    {p.name}
                                                                </span>
                                                            </div>
                                                        ),
                                                    )}
                                                    {o.items &&
                                                        o.items.length > 3 && (
                                                            <div className="cal-card-more">
                                                                +
                                                                {o.items
                                                                    .length -
                                                                    3}{" "}
                                                                {t(
                                                                    "admin.calendar.more",
                                                                    "more",
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            ) : (
                                                <div className="cal-card-products cal-card-no-items">
                                                    {t(
                                                        "admin.calendar.noItems",
                                                        "No items",
                                                    )}
                                                </div>
                                            )}

                                            {/* Due date */}
                                            <div className="cal-card-due">
                                                <Calendar size={10} />
                                                {formatFullDate(o.due_date)}
                                            </div>

                                            {/* Status badge */}
                                            <span
                                                className="cal-card-status"
                                                style={{
                                                    color: STATUS_COLOR[
                                                        o.status
                                                    ],
                                                }}
                                            >
                                                {t(
                                                    `status.${o.status}`,
                                                    o.status,
                                                )}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Status Legend */}
            <div className="cal-legend">
                {Object.entries(STATUS_COLOR).map(([status, color]) => (
                    <div key={status} className="cal-legend-item">
                        <span
                            className="cal-legend-dot"
                            style={{ backgroundColor: color }}
                        />
                        {t(`status.${status}`, status)}
                    </div>
                ))}
            </div>

            {/* ── Slide-in Side Panel ── */}
            {panelOrder && (
                <>
                    {/* Backdrop */}
                    <div
                        className={`cal-panel-backdrop ${panelClosing ? "cal-panel-backdrop-closing" : "cal-panel-backdrop-opening"}`}
                    />

                    {/* Panel */}
                    <div
                        ref={panelRef}
                        className={`cal-side-panel ${panelClosing ? "cal-panel-closing" : "cal-panel-opening"}`}
                    >
                        {/* Panel header */}
                        <div className="cal-panel-header">
                            <div className="cal-panel-header-left">
                                <div
                                    className="cal-panel-section-indicator"
                                    style={{
                                        backgroundColor: getSectionColor(
                                            panelOrder.section_id,
                                        ),
                                    }}
                                />
                                <div>
                                    <h2 className="cal-panel-title">
                                        {panelOrder.reference}
                                    </h2>
                                    <span className="cal-panel-subtitle">
                                        {clientName(panelOrder.client_id)}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="cal-panel-close"
                                onClick={closePanel}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {panelLoading ? (
                            <div className="cal-panel-loading">
                                <Loader2 size={20} className="crud-spin" />
                                <span>{t("common.loading", "Loading...")}</span>
                            </div>
                        ) : (
                            <div className="cal-panel-body">
                                {/* ── General Info ── */}
                                <div className="cal-panel-section">
                                    <h3 className="cal-panel-section-title">
                                        <ClipboardList size={16} />
                                        {t(
                                            "admin.calendar.generalInfo",
                                            "General Information",
                                        )}
                                    </h3>

                                    <div className="cal-panel-info-grid">
                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <Hash size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.reference",
                                                        "Reference",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    {panelOrder.reference}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <User size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.client",
                                                        "Client",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    {panelOrder.client_name ??
                                                        clientName(
                                                            panelOrder.client_id,
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <Package size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.section",
                                                        "Section",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    <span
                                                        className="cal-panel-section-dot"
                                                        style={{
                                                            backgroundColor:
                                                                getSectionColor(
                                                                    panelOrder.section_id,
                                                                ),
                                                        }}
                                                    />
                                                    {panelOrder.section_name ??
                                                        sectionName(
                                                            panelOrder.section_id,
                                                        )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <Truck size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.status",
                                                        "Status",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    <span
                                                        className="cal-panel-status-badge"
                                                        style={{
                                                            backgroundColor:
                                                                hexToRgba(
                                                                    STATUS_COLOR[
                                                                        panelOrder
                                                                            .status
                                                                    ] ??
                                                                        "#6b7280",
                                                                    0.12,
                                                                ),
                                                            color:
                                                                STATUS_COLOR[
                                                                    panelOrder
                                                                        .status
                                                                ] ?? "#6b7280",
                                                        }}
                                                    >
                                                        {t(
                                                            `status.${panelOrder.status}`,
                                                            panelOrder.status,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <Calendar size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.dueDate",
                                                        "Due Date",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    {formatFullDate(
                                                        panelOrder.due_date,
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cal-panel-info-item">
                                            <span className="cal-panel-info-icon">
                                                <Clock size={14} />
                                            </span>
                                            <div>
                                                <div className="cal-panel-info-label">
                                                    {t(
                                                        "admin.orders.created",
                                                        "Created",
                                                    )}
                                                </div>
                                                <div className="cal-panel-info-value">
                                                    {formatFullDate(
                                                        panelOrder.created_at,
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {panelOrder.proposal_reference && (
                                            <div className="cal-panel-info-item">
                                                <span className="cal-panel-info-icon">
                                                    <FileText size={14} />
                                                </span>
                                                <div>
                                                    <div className="cal-panel-info-label">
                                                        {t(
                                                            "admin.orders.proposal",
                                                            "Proposal",
                                                        )}
                                                    </div>
                                                    <div className="cal-panel-info-value">
                                                        {
                                                            panelOrder.proposal_reference
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {clientMap.get(panelOrder.client_id)
                                            ?.address && (
                                            <div className="cal-panel-info-item cal-panel-info-full">
                                                <span className="cal-panel-info-icon">
                                                    <MapPin size={14} />
                                                </span>
                                                <div>
                                                    <div className="cal-panel-info-label">
                                                        {t(
                                                            "admin.calendar.address",
                                                            "Address",
                                                        )}
                                                    </div>
                                                    <div className="cal-panel-info-value">
                                                        {
                                                            clientMap.get(
                                                                panelOrder.client_id,
                                                            )?.address
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* ── Order Lines ── */}
                                <div className="cal-panel-section">
                                    <h3 className="cal-panel-section-title">
                                        <Package size={16} />
                                        {t(
                                            "admin.calendar.orderLines",
                                            "Order Lines",
                                        )}
                                        {panelOrder.items && (
                                            <span className="cal-panel-count">
                                                {panelOrder.items.length}
                                            </span>
                                        )}
                                    </h3>

                                    {panelOrder.items &&
                                    panelOrder.items.length > 0 ? (
                                        <div className="cal-panel-items">
                                            {panelOrder.items.map(
                                                (item, idx) => {
                                                    const prod = productMap.get(
                                                        item.product_id,
                                                    );
                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="cal-panel-item-card"
                                                        >
                                                            <div className="cal-panel-item-header">
                                                                <div className="cal-panel-item-num">
                                                                    {String(
                                                                        idx + 1,
                                                                    ).padStart(
                                                                        2,
                                                                        "0",
                                                                    )}
                                                                </div>
                                                                <div className="cal-panel-item-name">
                                                                    <span className="cal-panel-item-code">
                                                                        {productCode(
                                                                            item.product_id,
                                                                        )}
                                                                    </span>
                                                                    {item.product_name ??
                                                                        prod?.name ??
                                                                        `Product #${item.product_id}`}
                                                                </div>
                                                            </div>
                                                            <div className="cal-panel-item-details">
                                                                <div className="cal-panel-item-detail">
                                                                    <span className="cal-panel-item-detail-label">
                                                                        {t(
                                                                            "admin.orders.quantity",
                                                                            "Qty",
                                                                        )}
                                                                    </span>
                                                                    <span className="cal-panel-item-detail-value">
                                                                        {Number(
                                                                            item.quantity,
                                                                        )}{" "}
                                                                        {item.unit ??
                                                                            prod?.unit ??
                                                                            ""}
                                                                    </span>
                                                                </div>
                                                                <div className="cal-panel-item-detail">
                                                                    <span className="cal-panel-item-detail-label">
                                                                        {t(
                                                                            "admin.orders.unitPrice",
                                                                            "Unit Price",
                                                                        )}
                                                                    </span>
                                                                    <span className="cal-panel-item-detail-value">
                                                                        €
                                                                        {Number(
                                                                            item.unit_price,
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="cal-panel-item-detail">
                                                                    <span className="cal-panel-item-detail-label">
                                                                        {t(
                                                                            "admin.orders.subtotal",
                                                                            "Subtotal",
                                                                        )}
                                                                    </span>
                                                                    <span className="cal-panel-item-detail-value cal-panel-item-subtotal">
                                                                        €
                                                                        {(
                                                                            Number(
                                                                                item.quantity,
                                                                            ) *
                                                                            Number(
                                                                                item.unit_price,
                                                                            )
                                                                        ).toFixed(
                                                                            2,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {item.notes && (
                                                                <div className="cal-panel-item-notes">
                                                                    <FileText
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                    {item.notes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                },
                                            )}

                                            {/* Total */}
                                            <div className="cal-panel-total">
                                                <span className="cal-panel-total-label">
                                                    {t(
                                                        "admin.calendar.total",
                                                        "Total",
                                                    )}
                                                </span>
                                                <span className="cal-panel-total-value">
                                                    €
                                                    {panelOrder.items
                                                        .reduce(
                                                            (sum, it) =>
                                                                sum +
                                                                Number(
                                                                    it.quantity,
                                                                ) *
                                                                    Number(
                                                                        it.unit_price,
                                                                    ),
                                                            0,
                                                        )
                                                        .toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="cal-panel-empty">
                                            {t(
                                                "admin.orders.noItems",
                                                "No items yet.",
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ── Inline Styles ── */}
            <style>{`
        /* ── Calendar Order Card (replaces cal-week-item) ── */
        .cal-order-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 8px 10px;
          background: var(--admin-bg);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.18s ease;
          text-align: left;
          color: var(--admin-text);
          font-family: inherit;
          min-height: 72px;
          width: 100%;
        }
        .cal-order-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
          filter: brightness(0.96);
        }
        .cal-card-client {
          font-size: 12.5px;
          font-weight: 700;
          line-height: 1.3;
          color: var(--admin-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cal-card-products {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .cal-card-product-line {
          font-size: 10.5px;
          line-height: 1.4;
          color: var(--admin-text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .cal-card-qty {
          font-weight: 700;
          color: var(--admin-text);
        }
        .cal-card-pcode {
          font-weight: 600;
          font-family: monospace;
          font-size: 10px;
          color: var(--admin-text);
          opacity: 0.7;
        }
        .cal-card-pname {
          color: var(--admin-text-muted);
        }
        .cal-card-more {
          font-size: 10px;
          color: var(--admin-text-muted);
          font-style: italic;
        }
        .cal-card-no-items {
          font-size: 10px;
          color: var(--admin-text-muted);
          font-style: italic;
        }
        .cal-card-due {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--admin-text-muted);
          margin-top: 2px;
        }
        .cal-card-status {
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* ── Section Legend ── */
        .cal-section-legend {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .cal-section-legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--admin-text-muted);
          font-weight: 500;
        }

        /* ── Side Panel Backdrop ── */
        .cal-panel-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(4px);
          z-index: 999;
        }
        .cal-panel-backdrop-opening {
          animation: calPanelBackdropIn 0.3s ease forwards;
        }
        .cal-panel-backdrop-closing {
          animation: calPanelBackdropOut 0.25s ease forwards;
        }
        @keyframes calPanelBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes calPanelBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* ── Side Panel ── */
        .cal-side-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 520px;
          max-width: 100vw;
          background: var(--admin-surface, #fff);
          box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .cal-panel-opening {
          animation: calPanelSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .cal-panel-closing {
          animation: calPanelSlideOut 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes calPanelSlideIn {
          from { transform: translateX(100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes calPanelSlideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0.5; }
        }

        /* Panel Header */
        .cal-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid var(--admin-border, #e2e8f0);
          gap: 12px;
          flex-shrink: 0;
        }
        .cal-panel-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .cal-panel-section-indicator {
          width: 5px;
          height: 40px;
          border-radius: 3px;
          flex-shrink: 0;
        }
        .cal-panel-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          color: var(--admin-text, #0f172a);
        }
        .cal-panel-subtitle {
          font-size: 13px;
          color: var(--admin-text-muted, #64748b);
        }
        .cal-panel-close {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: 1px solid var(--admin-border, #e2e8f0);
          border-radius: 8px;
          background: transparent;
          color: var(--admin-text-muted, #64748b);
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
        }
        .cal-panel-close:hover {
          background: var(--admin-surface-hover, #f8fafc);
          color: var(--admin-text, #0f172a);
          border-color: var(--admin-text-muted, #64748b);
        }

        /* Panel Loading */
        .cal-panel-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 48px 24px;
          color: var(--admin-text-muted, #64748b);
          font-size: 14px;
        }

        /* Panel Body */
        .cal-panel-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 28px;
        }
        .cal-panel-body::-webkit-scrollbar {
          width: 6px;
        }
        .cal-panel-body::-webkit-scrollbar-thumb {
          background: var(--admin-border, #e2e8f0);
          border-radius: 3px;
        }

        /* Panel Sections */
        .cal-panel-section {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .cal-panel-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--admin-text, #0f172a);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin: 0;
        }
        .cal-panel-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 22px;
          height: 22px;
          padding: 0 6px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 11px;
          background: var(--admin-accent, #6366f1);
          color: #fff;
        }

        /* Panel Info Grid */
        .cal-panel-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .cal-panel-info-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          background: var(--admin-bg, #f1f5f9);
          border: 1px solid var(--admin-border, #e2e8f0);
          border-radius: 10px;
          transition: background 0.15s;
        }
        .cal-panel-info-item:hover {
          background: var(--admin-surface-hover, #f8fafc);
        }
        .cal-panel-info-full {
          grid-column: 1 / -1;
        }
        .cal-panel-info-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: var(--admin-surface, #fff);
          border: 1px solid var(--admin-border, #e2e8f0);
          color: var(--admin-text-muted, #64748b);
          flex-shrink: 0;
        }
        .cal-panel-info-label {
          font-size: 10.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted, #64748b);
          margin-bottom: 2px;
        }
        .cal-panel-info-value {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--admin-text, #0f172a);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cal-panel-section-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cal-panel-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 10px;
          font-size: 11.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          border-radius: 6px;
        }

        /* Panel Items */
        .cal-panel-items {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cal-panel-item-card {
          padding: 14px;
          background: var(--admin-bg, #f1f5f9);
          border: 1px solid var(--admin-border, #e2e8f0);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.15s;
        }
        .cal-panel-item-card:hover {
          background: var(--admin-surface-hover, #f8fafc);
          border-color: var(--admin-accent, #6366f1);
        }
        .cal-panel-item-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .cal-panel-item-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: var(--admin-surface, #fff);
          border: 1px solid var(--admin-border, #e2e8f0);
          font-size: 11px;
          font-weight: 700;
          color: var(--admin-text-muted, #64748b);
          flex-shrink: 0;
        }
        .cal-panel-item-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--admin-text, #0f172a);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cal-panel-item-code {
          font-size: 11px;
          font-weight: 700;
          font-family: monospace;
          padding: 1px 6px;
          border-radius: 4px;
          background: var(--admin-surface, #fff);
          border: 1px solid var(--admin-border, #e2e8f0);
          color: var(--admin-text-muted, #64748b);
        }
        .cal-panel-item-details {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
        }
        .cal-panel-item-detail {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .cal-panel-item-detail-label {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--admin-text-muted, #64748b);
        }
        .cal-panel-item-detail-value {
          font-size: 13px;
          font-weight: 600;
          color: var(--admin-text, #0f172a);
        }
        .cal-panel-item-subtotal {
          color: var(--admin-accent, #6366f1);
        }
        .cal-panel-item-notes {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          font-size: 12px;
          color: var(--admin-text-muted, #64748b);
          padding: 8px 10px;
          background: var(--admin-surface, #fff);
          border-radius: 6px;
          border: 1px solid var(--admin-border, #e2e8f0);
          line-height: 1.4;
        }
        .cal-panel-item-notes svg {
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Panel Total */
        .cal-panel-total {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--admin-accent, #6366f1);
          border-radius: 10px;
          color: #fff;
        }
        .cal-panel-total-label {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .cal-panel-total-value {
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        /* Panel Empty */
        .cal-panel-empty {
          padding: 24px;
          text-align: center;
          color: var(--admin-text-muted, #64748b);
          font-size: 13px;
          font-style: italic;
          border: 1px dashed var(--admin-border, #e2e8f0);
          border-radius: 10px;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .cal-side-panel {
            width: 100vw;
          }
          .cal-panel-info-grid {
            grid-template-columns: 1fr;
          }
          .cal-panel-item-details {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
        </div>
    );
}

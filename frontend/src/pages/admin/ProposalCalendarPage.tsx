import { useState, useEffect } from "react";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";

/* ── types ── */

interface Proposal {
    id: number;
    reference: string;
    client_id: number;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Client {
    id: number;
    name: string;
}

/* ── helpers ── */

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
    const diff = day === 0 ? -6 : 1 - day; // Monday = 1
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

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

const STATUS_COLOR: Record<string, string> = {
    draft: "#6b7280",
    pending: "#f59e0b",
    approved: "#10b981",
    rejected: "#ef4444",
};

/* ── Popup Modal Component ── */

export default function ProposalCalendarPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const today = new Date();
    const [weekStart, setWeekStart] = useState(() => getMonday(today));
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        let ignore = false;
        Promise.all([
            api.get<Proposal[]>("/proposals"),
            api.get<Client[]>("/clients"),
        ])
            .then(([p, c]) => {
                if (!ignore) {
                    setProposals(p);
                    setClients(c);
                }
            })
            .catch(() => {})
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, []);

    const clientName = (id: number) =>
        clients.find((c) => c.id === id)?.name ?? `#${id}`;

    /* ── Build the 7 days of the week ── */
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const weekEnd = weekDays[6];

    const filtered = proposals.filter(
        (p) => filter === "all" || p.status === filter,
    );

    const proposalsByDate = new Map<string, Proposal[]>();
    for (const p of filtered) {
        const key = dateKey(new Date(p.created_at));
        if (!proposalsByDate.has(key)) proposalsByDate.set(key, []);
        proposalsByDate.get(key)!.push(p);
    }

    const prevWeek = () => setWeekStart(addDays(weekStart, -7));
    const nextWeek = () => setWeekStart(addDays(weekStart, 7));
    const goToday = () => setWeekStart(getMonday(today));

    /* ── Week range label ── */
    const rangeLabel =
        weekStart.getMonth() === weekEnd.getMonth()
            ? `${weekStart.getDate()} – ${weekEnd.getDate()} ${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
            : `${formatDateLabel(weekStart)} – ${formatDateLabel(weekEnd)} ${weekEnd.getFullYear()}`;

    if (loading) {
        return (
            <div className="crud-loading">
                <Loader2 size={24} className="crud-spin" />{" "}
                {t("admin.calendar.loadingCalendar")}
            </div>
        );
    }

    return (
        <div className="cal-page">
            {/* Header */}
            <div className="cal-header">
                <div className="cal-header-left">
                    <h1 className="crud-title">{t("admin.calendar.title")}</h1>
                    <div className="cal-nav">
                        <button className="cal-nav-btn" onClick={prevWeek}>
                            <ChevronLeft size={18} />
                        </button>
                        <span className="cal-week-label">{rangeLabel}</span>
                        <button className="cal-nav-btn" onClick={nextWeek}>
                            <ChevronRight size={18} />
                        </button>
                        <button className="cal-today-btn" onClick={goToday}>
                            {t("admin.calendar.thisWeek")}
                        </button>
                    </div>
                </div>
                <div className="cal-filters">
                    {["all", "draft", "pending", "approved", "rejected"].map(
                        (s) => (
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
                                    ? t("common.all")
                                    : t(`status.${s}`)}
                            </button>
                        ),
                    )}
                </div>
            </div>

            {/* Week Grid */}
            <div className="cal-week-grid">
                {weekDays.map((day, i) => {
                    const key = dateKey(day);
                    const items = proposalsByDate.get(key) ?? [];
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
                                {items.map((p) => (
                                    <button
                                        key={p.id}
                                        className="cal-week-item"
                                        style={{
                                            borderLeftColor:
                                                STATUS_COLOR[p.status] ??
                                                "#6366f1",
                                        }}
                                        onClick={() =>
                                            navigate(
                                                `/admin/proposals/${p.id}/items`,
                                            )
                                        }
                                        title={`${p.reference} — ${clientName(p.client_id)} (${p.status})`}
                                    >
                                        <span className="cal-week-item-ref">
                                            {p.reference}
                                        </span>
                                        <span className="cal-week-item-client">
                                            {clientName(p.client_id)}
                                        </span>
                                        <span
                                            className="cal-week-item-status"
                                            style={{
                                                color: STATUS_COLOR[p.status],
                                            }}
                                        >
                                            {t(`status.${p.status}`)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="cal-legend">
                {Object.entries(STATUS_COLOR).map(([status, color]) => (
                    <div key={status} className="cal-legend-item">
                        <span
                            className="cal-legend-dot"
                            style={{ backgroundColor: color }}
                        />
                        {t(`status.${status}`)}
                    </div>
                ))}
            </div>
        </div>
    );
}

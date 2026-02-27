import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

/* ── types ── */

interface Proposal {
  id: number;
  reference: string;
  client_id: number;
  section_id: number | null;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface ProposalItem {
  id: number;
  proposal_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  notes: string;
}

interface Client {
  id: number;
  name: string;
}

interface Section {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  unit_price: number;
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

function ProposalPopup({
  proposal,
  onClose,
  clients,
  sections,
}: {
  proposal: Proposal;
  onClose: () => void;
  clients: Client[];
  sections: Section[];
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (closing) {
      onClose();
    }
  }, [closing, onClose]);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get<ProposalItem[]>(`/proposals/${proposal.id}/items`),
      api.get<Product[]>("/products"),
    ])
      .then(([i, p]) => {
        if (!ignore) {
          setItems(i);
          setProducts(p);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [proposal.id]);

  const clientName =
    clients.find((c) => c.id === proposal.client_id)?.name ??
    `#${proposal.client_id}`;
  const sectionName = proposal.section_id
    ? (sections.find((s) => s.id === proposal.section_id)?.name ??
      `#${proposal.section_id}`)
    : "—";
  const productName = (id: number) =>
    products.find((p) => p.id === id)?.name ?? `#${id}`;

  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unit_price),
    0,
  );

  return (
    <div
      ref={overlayRef}
      className={`crud-modal-overlay ${closing ? "cal-popup-closing" : "cal-popup-opening"}`}
      onClick={handleClose}
      onAnimationEnd={handleAnimationEnd}
    >
      <div
        className={`crud-modal cal-popup-modal ${closing ? "cal-popup-modal-closing" : "cal-popup-modal-opening"}`}
        style={{ maxWidth: 750, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="crud-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0 }}>{proposal.reference}</h2>
            <span
              className={`crud-badge crud-badge-${proposal.status}`}
              style={{ fontSize: 11 }}
            >
              {proposal.status}
            </span>
          </div>
          <button className="crud-modal-close" onClick={handleClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="crud-modal-body" style={{ gap: 20 }}>
          {/* Proposal Info Grid */}
          <div className="cal-popup-info-grid">
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Cliente</span>
              <span className="cal-popup-info-value">{clientName}</span>
            </div>
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Secção</span>
              <span className="cal-popup-info-value">{sectionName}</span>
            </div>
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Estado</span>
              <span className="cal-popup-info-value">
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor:
                        STATUS_COLOR[proposal.status] ?? "#6366f1",
                    }}
                  />
                  {proposal.status.charAt(0).toUpperCase() +
                    proposal.status.slice(1)}
                </span>
              </span>
            </div>
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Criado em</span>
              <span className="cal-popup-info-value">
                {new Date(proposal.created_at).toLocaleDateString("pt-PT")}
              </span>
            </div>
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Atualizado em</span>
              <span className="cal-popup-info-value">
                {new Date(proposal.updated_at).toLocaleDateString("pt-PT")}
              </span>
            </div>
            <div className="cal-popup-info-item">
              <span className="cal-popup-info-label">Valor Total</span>
              <span
                className="cal-popup-info-value"
                style={{ fontWeight: 700, color: "#10b981" }}
              >
                {loading ? "…" : `€${totalValue.toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Notes */}
          {proposal.notes && (
            <div className="cal-popup-notes">
              <span className="cal-popup-info-label">Notas</span>
              <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.5 }}>
                {proposal.notes}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="cal-popup-divider" />

          {/* Products section */}
          <div>
            <h3 className="cal-popup-section-title">Produtos</h3>

            {loading ? (
              <div className="crud-loading" style={{ padding: "20px 0" }}>
                <Loader2 size={20} className="crud-spin" /> A carregar produtos…
              </div>
            ) : items.length === 0 ? (
              <div className="crud-empty" style={{ padding: "16px 0" }}>
                Sem produtos nesta proposta.
              </div>
            ) : (
              <div className="cal-popup-products-table-wrap">
                <table className="crud-table" style={{ fontSize: 13 }}>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th style={{ textAlign: "right" }}>Qtd</th>
                      <th style={{ textAlign: "right" }}>Preço Unit.</th>
                      <th style={{ textAlign: "right" }}>Subtotal</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const subtotal =
                        Number(item.quantity) * Number(item.unit_price);
                      return (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 600 }}>
                            {productName(item.product_id)}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {item.quantity}
                          </td>
                          <td style={{ textAlign: "right" }}>
                            €{Number(item.unit_price).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 600 }}>
                            €{subtotal.toFixed(2)}
                          </td>
                          <td
                            style={{
                              color: "var(--admin-text-muted)",
                              fontSize: 12,
                            }}
                          >
                            {item.notes || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={3}
                        style={{
                          textAlign: "right",
                          fontWeight: 700,
                          borderTop: "2px solid var(--admin-border)",
                          paddingTop: 10,
                        }}
                      >
                        Total:
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          fontWeight: 700,
                          color: "#10b981",
                          borderTop: "2px solid var(--admin-border)",
                          paddingTop: 10,
                          fontSize: 14,
                        }}
                      >
                        €{totalValue.toFixed(2)}
                      </td>
                      <td
                        style={{
                          borderTop: "2px solid var(--admin-border)",
                          paddingTop: 10,
                        }}
                      />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="crud-modal-footer">
          <button className="crud-btn crud-btn-secondary" onClick={handleClose}>
            Fechar
          </button>
          <button
            className="crud-btn crud-btn-primary"
            onClick={() => navigate(`/admin/proposals/${proposal.id}/items`)}
            style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
          >
            <ExternalLink size={14} />
            Abrir Página Completa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Calendar Page Component ── */

export default function ProposalCalendarPage() {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(() => getMonday(today));
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  // Popup state
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );

  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get<Proposal[]>("/proposals"),
      api.get<Client[]>("/clients"),
      api.get<Section[]>("/sections"),
    ])
      .then(([p, c, s]) => {
        if (!ignore) {
          setProposals(p);
          setClients(c);
          setSections(s);
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
        <Loader2 size={24} className="crud-spin" /> Loading calendar…
      </div>
    );
  }

  return (
    <div className="cal-page">
      {/* Header */}
      <div className="cal-header">
        <div className="cal-header-left">
          <h1 className="crud-title">Proposal Calendar</h1>
          <div className="cal-nav">
            <button className="cal-nav-btn" onClick={prevWeek}>
              <ChevronLeft size={18} />
            </button>
            <span className="cal-week-label">{rangeLabel}</span>
            <button className="cal-nav-btn" onClick={nextWeek}>
              <ChevronRight size={18} />
            </button>
            <button className="cal-today-btn" onClick={goToday}>
              This Week
            </button>
          </div>
        </div>
        <div className="cal-filters">
          {["all", "draft", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              className={`cal-filter-btn ${filter === s ? "active" : ""}`}
              onClick={() => setFilter(s)}
              style={
                filter === s && s !== "all"
                  ? { borderColor: STATUS_COLOR[s], color: STATUS_COLOR[s] }
                  : undefined
              }
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
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
                <span className="cal-week-day-name">{DAY_NAMES[i]}</span>
                <span className={`cal-week-day-num ${isToday ? "today" : ""}`}>
                  {day.getDate()}
                </span>
              </div>

              {/* Items */}
              <div className="cal-week-items">
                {items.length === 0 && <div className="cal-week-empty">—</div>}
                {items.map((p) => (
                  <button
                    key={p.id}
                    className="cal-week-item"
                    style={{
                      borderLeftColor: STATUS_COLOR[p.status] ?? "#6366f1",
                    }}
                    onClick={() => setSelectedProposal(p)}
                    title={`${p.reference} — ${clientName(p.client_id)} (${p.status})`}
                  >
                    <span className="cal-week-item-ref">{p.reference}</span>
                    <span className="cal-week-item-client">
                      {clientName(p.client_id)}
                    </span>
                    <span
                      className="cal-week-item-status"
                      style={{ color: STATUS_COLOR[p.status] }}
                    >
                      {p.status}
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
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        ))}
      </div>

      {/* Proposal Detail Popup */}
      {selectedProposal && (
        <ProposalPopup
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          clients={clients}
          sections={sections}
        />
      )}
    </div>
  );
}

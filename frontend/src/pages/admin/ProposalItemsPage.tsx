import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { api } from "../../services/api";

interface ProposalItem {
  id: number;
  proposal_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  notes: string;
}

interface Product {
  id: number;
  name: string;
  unit_price: number;
}

export default function ProposalItemsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelClosing, setPanelClosing] = useState(false);
  const [editing, setEditing] = useState<ProposalItem | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteClosing, setDeleteClosing] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      api.get<ProposalItem[]>(`/proposals/${id}/items`),
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
  }, [id, refreshKey]);

  const load = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  /* ── Panel open / close ── */

  const openPanel = useCallback(() => {
    setPanelClosing(false);
    setPanelOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setPanelClosing(true);
    setTimeout(() => {
      setPanelOpen(false);
      setPanelClosing(false);
      setEditing(null);
      setFormData({});
    }, 280);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setFormData({});
    openPanel();
  };

  const openEdit = (item: ProposalItem) => {
    setEditing(item);
    setFormData({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      notes: item.notes ?? "",
    });
    openPanel();
  };

  /* ── Delete panel ── */

  const openDelete = (itemId: number) => {
    setDeleteClosing(false);
    setDeleteId(itemId);
  };

  const closeDelete = useCallback(() => {
    setDeleteClosing(true);
    setTimeout(() => {
      setDeleteId(null);
      setDeleteClosing(false);
    }, 280);
  }, []);

  /* ── CRUD actions ── */

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/proposals/items/${editing.id}`, formData);
      } else {
        await api.post(`/proposals/${id}/items`, formData);
      }
      closePanel();
      load();
    } catch {
      /* */
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    await api.del(`/proposals/items/${deleteId}`);
    closeDelete();
    load();
  };

  /* ── Click outside / Escape ── */

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelOpen &&
        !panelClosing &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        closePanel();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [panelOpen, panelClosing, closePanel]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        deleteId != null &&
        !deleteClosing &&
        deleteRef.current &&
        !deleteRef.current.contains(e.target as Node)
      ) {
        closeDelete();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [deleteId, deleteClosing, closeDelete]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (deleteId != null) closeDelete();
        else if (panelOpen) closePanel();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [panelOpen, deleteId, closePanel, closeDelete]);

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="crud-icon-btn"
            onClick={() => navigate("/admin/proposals")}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="crud-title">
            {t("admin.proposals.itemsTitle", { id })}
          </h1>
        </div>
        <button className="crud-btn crud-btn-primary" onClick={openCreate}>
          <Plus size={16} /> {t("admin.proposals.addItem")}
        </button>
      </div>

      <div className="crud-table-wrap">
        {loading ? (
          <div className="crud-loading">
            <Loader2 size={24} className="crud-spin" /> {t("common.loading")}
          </div>
        ) : items.length === 0 ? (
          <div className="crud-empty">{t("admin.proposals.noItems")}</div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{t("admin.proposals.product")}</th>
                <th>{t("admin.proposals.quantity")}</th>
                <th>{t("admin.proposals.unitPrice")}</th>
                <th>{t("admin.proposals.subtotal")}</th>
                <th>{t("admin.proposals.notes")}</th>
                <th className="crud-th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {products.find((p) => p.id === item.product_id)?.name ??
                      item.product_id}
                  </td>
                  <td>{item.quantity}</td>
                  <td>€{Number(item.unit_price).toFixed(2)}</td>
                  <td>
                    €
                    {(Number(item.quantity) * Number(item.unit_price)).toFixed(
                      2,
                    )}
                  </td>
                  <td>{item.notes ?? "—"}</td>
                  <td className="crud-td-actions">
                    <button
                      className="crud-icon-btn crud-icon-edit"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="crud-icon-btn crud-icon-delete"
                      onClick={() => openDelete(item.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Create / Edit side panel ── */}
      {panelOpen && (
        <>
          <div
            className={`crud-panel-backdrop ${panelClosing ? "crud-panel-backdrop-closing" : "crud-panel-backdrop-opening"}`}
          />
          <div
            ref={panelRef}
            className={`crud-side-panel ${panelClosing ? "crud-panel-closing" : "crud-panel-opening"}`}
          >
            {/* Header */}
            <div className="crud-panel-header">
              <h2 className="crud-panel-title">
                {editing
                  ? t("admin.proposals.editItem")
                  : t("admin.proposals.addItem")}
              </h2>
              <button className="crud-panel-close" onClick={closePanel}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="crud-panel-body">
              <div className="crud-field">
                <label className="crud-label">
                  {t("admin.proposals.product")}{" "}
                  <span className="crud-required">*</span>
                </label>
                <select
                  className="crud-input"
                  value={String(formData.product_id ?? "")}
                  onChange={(e) => {
                    const p = products.find(
                      (p) => p.id === Number(e.target.value),
                    );
                    setFormData({
                      ...formData,
                      product_id: e.target.value,
                      unit_price: p?.unit_price ?? formData.unit_price,
                    });
                  }}
                >
                  <option value="">Select…</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="crud-field">
                <label className="crud-label">
                  {t("admin.proposals.quantity")}{" "}
                  <span className="crud-required">*</span>
                </label>
                <input
                  className="crud-input"
                  type="number"
                  value={String(formData.quantity ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="crud-field">
                <label className="crud-label">
                  {t("admin.proposals.unitPrice")}{" "}
                  <span className="crud-required">*</span>
                </label>
                <input
                  className="crud-input"
                  type="number"
                  step="0.01"
                  value={String(formData.unit_price ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      unit_price: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="crud-field">
                <label className="crud-label">
                  {t("admin.proposals.notes")}
                </label>
                <textarea
                  className="crud-input crud-textarea"
                  value={String(formData.notes ?? "")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="crud-panel-footer">
              <button
                className="crud-btn crud-btn-secondary"
                onClick={closePanel}
              >
                {t("common.cancel")}
              </button>
              <button
                className="crud-btn crud-btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving && <Loader2 size={14} className="crud-spin" />}{" "}
                {editing ? t("common.update") : t("common.create")}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Delete confirmation side panel ── */}
      {deleteId != null && (
        <>
          <div
            className={`crud-panel-backdrop ${deleteClosing ? "crud-panel-backdrop-closing" : "crud-panel-backdrop-opening"}`}
          />
          <div
            ref={deleteRef}
            className={`crud-side-panel crud-side-panel-sm ${deleteClosing ? "crud-panel-closing" : "crud-panel-opening"}`}
          >
            {/* Header */}
            <div className="crud-panel-header crud-panel-header-danger">
              <h2 className="crud-panel-title">
                {t("admin.crud.confirmDelete")}
              </h2>
              <button className="crud-panel-close" onClick={closeDelete}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="crud-panel-body crud-panel-body-center">
              <div className="crud-delete-icon-wrap">
                <AlertTriangle size={36} />
              </div>
              <p className="crud-delete-message">
                {t("admin.proposals.deleteItem")}
              </p>
            </div>

            {/* Footer */}
            <div className="crud-panel-footer">
              <button
                className="crud-btn crud-btn-secondary"
                onClick={closeDelete}
              >
                {t("common.cancel")}
              </button>
              <button
                className="crud-btn crud-btn-danger"
                onClick={handleDelete}
              >
                <Trash2 size={14} />
                {t("common.delete")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

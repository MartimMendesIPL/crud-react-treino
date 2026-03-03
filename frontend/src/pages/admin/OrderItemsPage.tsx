import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { api } from "../../services/api";

interface OrderItem {
    id: number;
    order_id: number;
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

export default function OrderItemsPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [items, setItems] = useState<OrderItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<OrderItem | null>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let ignore = false;
        Promise.all([
            api.get<OrderItem[]>(`/order-items?order_id=${id}`),
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

    const openCreate = () => {
        setEditing(null);
        setFormData({});
        setModalOpen(true);
    };

    const openEdit = (item: OrderItem) => {
        setEditing(item);
        setFormData({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            notes: item.notes ?? "",
        });
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) await api.put(`/order-items/${editing.id}`, formData);
            else await api.post(`/order-items?order_id=${id}`, formData);
            setModalOpen(false);
            load();
        } catch {
            /* */
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (deleteId == null) return;
        await api.del(`/order-items/${deleteId}`);
        setDeleteId(null);
        load();
    };

    return (
        <div className="crud-page">
            <div className="crud-header">
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        className="crud-icon-btn"
                        onClick={() => navigate("/admin/orders")}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <h1 className="crud-title">
                        {t("admin.orders.itemsTitle", { id })}
                    </h1>
                </div>
                <button
                    className="crud-btn crud-btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={16} /> {t("admin.orders.addItem")}
                </button>
            </div>

            <div className="crud-table-wrap">
                {loading ? (
                    <div className="crud-loading">
                        <Loader2 size={24} className="crud-spin" />{" "}
                        {t("common.loading")}
                    </div>
                ) : items.length === 0 ? (
                    <div className="crud-empty">
                        {t("admin.orders.noItems")}
                    </div>
                ) : (
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{t("admin.orders.product")}</th>
                                <th>{t("admin.orders.quantity")}</th>
                                <th>{t("admin.orders.unitPrice")}</th>
                                <th>{t("admin.orders.subtotal")}</th>
                                <th>{t("admin.orders.notes")}</th>
                                <th className="crud-th-actions">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        {products.find(
                                            (p) => p.id === item.product_id,
                                        )?.name ?? item.product_id}
                                    </td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        €{Number(item.unit_price).toFixed(2)}
                                    </td>
                                    <td>
                                        €
                                        {(
                                            Number(item.quantity) *
                                            Number(item.unit_price)
                                        ).toFixed(2)}
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
                                            onClick={() => setDeleteId(item.id)}
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

            {modalOpen && (
                <div
                    className="crud-modal-overlay"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="crud-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="crud-modal-header">
                            <h2>
                                {editing
                                    ? t("admin.orders.editItem")
                                    : t("admin.orders.addItem")}
                            </h2>
                            <button
                                className="crud-modal-close"
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="crud-modal-body">
                            <div className="crud-field">
                                <label className="crud-label">
                                    {t("admin.orders.product")}{" "}
                                    <span className="crud-required">*</span>
                                </label>
                                <select
                                    className="crud-input"
                                    value={String(formData.product_id ?? "")}
                                    onChange={(e) => {
                                        const p = products.find(
                                            (p) =>
                                                p.id === Number(e.target.value),
                                        );
                                        setFormData({
                                            ...formData,
                                            product_id: e.target.value,
                                            unit_price:
                                                p?.unit_price ??
                                                formData.unit_price,
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
                                    {t("admin.orders.quantity")}{" "}
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
                                    {t("admin.orders.unitPrice")}{" "}
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
                                    {t("admin.orders.notes")}
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
                        <div className="crud-modal-footer">
                            <button
                                className="crud-btn crud-btn-secondary"
                                onClick={() => setModalOpen(false)}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                className="crud-btn crud-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving && (
                                    <Loader2 size={14} className="crud-spin" />
                                )}{" "}
                                {editing
                                    ? t("common.update")
                                    : t("common.create")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteId != null && (
                <div
                    className="crud-modal-overlay"
                    onClick={() => setDeleteId(null)}
                >
                    <div
                        className="crud-modal crud-modal-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="crud-modal-header">
                            <h2>{t("admin.crud.confirmDelete")}</h2>
                            <button
                                className="crud-modal-close"
                                onClick={() => setDeleteId(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="crud-modal-body">
                            <p>{t("admin.orders.deleteItem")}</p>
                        </div>
                        <div className="crud-modal-footer">
                            <button
                                className="crud-btn crud-btn-secondary"
                                onClick={() => setDeleteId(null)}
                            >
                                {t("common.cancel")}
                            </button>
                            <button
                                className="crud-btn crud-btn-danger"
                                onClick={handleDelete}
                            >
                                {t("common.delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

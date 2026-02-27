import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { api } from "../../services/api";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";

/* ── types ── */

interface Order {
    id: number;
    reference: string;
    proposal_id: number | null;
    client_id: number;
    section_id: number | null;
    status: string;
    due_date: string | null;
    created_at: string;
    updated_at: string;
}

interface OrderItem {
    id: number;
    order_id: number;
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
interface Proposal {
    id: number;
    reference: string;
}
interface Product {
    id: number;
    name: string;
    unit_price: number;
}

/* ── Orders list page ── */

export default function OrdersPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    const [proposals, setProposals] = useState<Proposal[]>([]);

    useEffect(() => {
        api.get<Client[]>("/clients")
            .then(setClients)
            .catch(() => {});
        api.get<Section[]>("/sections")
            .then(setSections)
            .catch(() => {});
        api.get<Proposal[]>("/proposals")
            .then(setProposals)
            .catch(() => {});
    }, []);

    const columns: Column<Order>[] = [
        { key: "id", label: "ID" },
        { key: "reference", label: "Reference" },
        {
            key: "client_id",
            label: "Client",
            render: (v) =>
                clients.find((c) => c.id === Number(v))?.name ?? String(v),
        },
        {
            key: "status",
            label: "Status",
            render: (v) => (
                <span className={`crud-badge crud-badge-${v}`}>
                    {String(v)}
                </span>
            ),
        },
        {
            key: "due_date",
            label: "Due Date",
            render: (v) => (v ? new Date(String(v)).toLocaleDateString() : "—"),
        },
        {
            key: "id" as keyof Order,
            label: "Items",
            render: (_v, row) => <ItemsLink id={row.id} />,
        },
    ];

    const fields: FieldDef[] = [
        { name: "reference", label: "Reference", required: true },
        {
            name: "proposal_id",
            label: "Proposal",
            type: "select",
            options: proposals.map((p) => ({
                value: String(p.id),
                label: p.reference,
            })),
        },
        {
            name: "client_id",
            label: "Client",
            type: "select",
            required: true,
            options: clients.map((c) => ({
                value: String(c.id),
                label: c.name,
            })),
        },
        {
            name: "section_id",
            label: "Section",
            type: "select",
            options: sections.map((s) => ({
                value: String(s.id),
                label: s.name,
            })),
        },
        {
            name: "status",
            label: "Status",
            type: "select",
            required: true,
            options: [
                { value: "pending", label: "Pending" },
                { value: "in_production", label: "In Production" },
                { value: "completed", label: "Completed" },
                { value: "delivered", label: "Delivered" },
            ],
        },
        { name: "due_date", label: "Due Date", type: "date" },
    ];

    return (
        <CrudPage<Order>
            title="Orders"
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<Order[]>("/orders")}
            onCreate={(data) => api.post<Order>("/orders", data)}
            onUpdate={(id, data) => api.put<Order>(`/orders/${id}`, data)}
            onDelete={(id) => api.del(`/orders/${id}`)}
        />
    );
}

function ItemsLink({ id }: { id: number }) {
    const navigate = useNavigate();
    return (
        <button
            className="crud-btn crud-btn-sm"
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/orders/${id}/items`);
            }}
        >
            View Items
        </button>
    );
}

/* ── Order Items sub-page ── */

export function OrderItemsPage() {
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
            api.get<OrderItem[]>(`/orders/${id}/items`),
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
            if (editing) await api.put(`/orders/items/${editing.id}`, formData);
            else await api.post(`/orders/${id}/items`, formData);
            setModalOpen(false);
            load();
        } catch {
            /* */
        }
        setSaving(false);
    };

    const handleDelete = async () => {
        if (deleteId == null) return;
        await api.del(`/orders/items/${deleteId}`);
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
                    <h1 className="crud-title">Order #{id} — Items</h1>
                </div>
                <button
                    className="crud-btn crud-btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={16} /> Add Item
                </button>
            </div>

            <div className="crud-table-wrap">
                {loading ? (
                    <div className="crud-loading">
                        <Loader2 size={24} className="crud-spin" /> Loading…
                    </div>
                ) : items.length === 0 ? (
                    <div className="crud-empty">No items yet.</div>
                ) : (
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Subtotal</th>
                                <th>Notes</th>
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
                            <h2>{editing ? "Edit Item" : "Add Item"}</h2>
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
                                    Product{" "}
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
                                    Quantity{" "}
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
                                    Unit Price{" "}
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
                                <label className="crud-label">Notes</label>
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
                                Cancel
                            </button>
                            <button
                                className="crud-btn crud-btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving && (
                                    <Loader2 size={14} className="crud-spin" />
                                )}{" "}
                                {editing ? "Update" : "Create"}
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
                            <h2>Confirm Delete</h2>
                            <button
                                className="crud-modal-close"
                                onClick={() => setDeleteId(null)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="crud-modal-body">
                            <p>Delete this item?</p>
                        </div>
                        <div className="crud-modal-footer">
                            <button
                                className="crud-btn crud-btn-secondary"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="crud-btn crud-btn-danger"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

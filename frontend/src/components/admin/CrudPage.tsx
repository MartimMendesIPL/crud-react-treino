import { useState, useEffect, type ReactNode } from "react";
import { Pencil, Trash2, Plus, X, Loader2 } from "lucide-react";

/* ────────────────────────────── types ────────────────────────────── */

export interface Column<T> {
    key: keyof T & string;
    label: string;
    render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface FieldDef {
    name: string;
    label: string;
    type?: "text" | "number" | "email" | "select" | "textarea" | "date";
    required?: boolean;
    options?: { value: string; label: string }[];
    placeholder?: string;
}

interface CrudPageProps<T extends { id: number | string }> {
    title: string;
    columns: Column<T>[];
    fields: FieldDef[];
    fetchAll: () => Promise<T[]>;
    onCreate: (data: Record<string, unknown>) => Promise<T>;
    onUpdate: (
        id: string | number,
        data: Record<string, unknown>,
    ) => Promise<T>;
    onDelete: (id: string | number) => Promise<unknown>;
    readOnly?: boolean;
}

/* ────────────────────────────── component ────────────────────────── */

export default function CrudPage<T extends { id: number | string }>({
    title,
    columns,
    fields,
    fetchAll,
    onCreate,
    onUpdate,
    onDelete,
    readOnly = false,
}: CrudPageProps<T>) {
    const [rows, setRows] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<T | null>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<string | number | null>(null);
    const [search, setSearch] = useState("");

    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let ignore = false;
        fetchAll()
            .then((data) => {
                if (!ignore) {
                    setRows(data);
                    setError("");
                }
            })
            .catch((e: unknown) => {
                if (!ignore)
                    setError(
                        e instanceof Error ? e.message : "Failed to load data",
                    );
            })
            .finally(() => {
                if (!ignore) setLoading(false);
            });
        return () => {
            ignore = true;
        };
    }, [refreshKey]); // eslint-disable-line react-hooks/exhaustive-deps

    const load = () => {
        setLoading(true);
        setRefreshKey((k) => k + 1);
    };

    const openCreate = () => {
        setEditing(null);
        setFormData({});
        setModalOpen(true);
    };

    const openEdit = (row: T) => {
        setEditing(row);
        const data: Record<string, unknown> = {};
        for (const f of fields) {
            data[f.name] = (row as Record<string, unknown>)[f.name] ?? "";
        }
        setFormData(data);
        setModalOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) {
                await onUpdate(editing.id, formData);
            } else {
                await onCreate(formData);
            }
            setModalOpen(false);
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deleteId == null) return;
        try {
            await onDelete(deleteId);
            setDeleteId(null);
            load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Delete failed");
        }
    };

    const filtered = rows.filter((row) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return columns.some((c) => {
            const v = (row as Record<string, unknown>)[c.key];
            return v != null && String(v).toLowerCase().includes(s);
        });
    });

    /* ── render ── */

    return (
        <div className="crud-page">
            {/* Header */}
            <div className="crud-header">
                <h1 className="crud-title">{title}</h1>
                <div className="crud-actions">
                    <input
                        type="text"
                        placeholder="Search…"
                        className="crud-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {!readOnly && (
                        <button
                            className="crud-btn crud-btn-primary"
                            onClick={openCreate}
                        >
                            <Plus size={16} /> New
                        </button>
                    )}
                </div>
            </div>

            {error && <div className="crud-error">{error}</div>}

            {/* Table */}
            <div className="crud-table-wrap">
                {loading ? (
                    <div className="crud-loading">
                        <Loader2 size={24} className="crud-spin" /> Loading…
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="crud-empty">No records found.</div>
                ) : (
                    <table className="crud-table">
                        <thead>
                            <tr>
                                {columns.map((c) => (
                                    <th key={c.key}>{c.label}</th>
                                ))}
                                {!readOnly && (
                                    <th className="crud-th-actions">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row) => (
                                <tr key={row.id}>
                                    {columns.map((c) => (
                                        <td key={c.key}>
                                            {c.render
                                                ? c.render(row[c.key], row)
                                                : String(row[c.key] ?? "—")}
                                        </td>
                                    ))}
                                    {!readOnly && (
                                        <td className="crud-td-actions">
                                            <button
                                                className="crud-icon-btn crud-icon-edit"
                                                onClick={() => openEdit(row)}
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                className="crud-icon-btn crud-icon-delete"
                                                onClick={() =>
                                                    setDeleteId(row.id)
                                                }
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Create / Edit modal */}
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
                                {editing ? `Edit ${title}` : `New ${title}`}
                            </h2>
                            <button
                                className="crud-modal-close"
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className="crud-modal-body">
                            {fields.map((f) => (
                                <div className="crud-field" key={f.name}>
                                    <label className="crud-label">
                                        {f.label}
                                        {f.required && (
                                            <span className="crud-required">
                                                *
                                            </span>
                                        )}
                                    </label>
                                    {f.type === "select" ? (
                                        <select
                                            className="crud-input"
                                            value={String(
                                                formData[f.name] ?? "",
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [f.name]: e.target.value,
                                                })
                                            }
                                        >
                                            <option value="">Select…</option>
                                            {f.options?.map((o) => (
                                                <option
                                                    key={o.value}
                                                    value={o.value}
                                                >
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : f.type === "textarea" ? (
                                        <textarea
                                            className="crud-input crud-textarea"
                                            placeholder={f.placeholder}
                                            value={String(
                                                formData[f.name] ?? "",
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [f.name]: e.target.value,
                                                })
                                            }
                                        />
                                    ) : (
                                        <input
                                            className="crud-input"
                                            type={f.type ?? "text"}
                                            placeholder={f.placeholder}
                                            value={String(
                                                formData[f.name] ?? "",
                                            )}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    [f.name]:
                                                        f.type === "number"
                                                            ? e.target.value ===
                                                              ""
                                                                ? ""
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                            : e.target.value,
                                                })
                                            }
                                        />
                                    )}
                                </div>
                            ))}
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
                                )}
                                {editing ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirmation */}
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
                            <p>
                                Are you sure you want to delete this record?
                                This action cannot be undone.
                            </p>
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

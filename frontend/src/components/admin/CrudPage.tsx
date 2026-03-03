import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash2, Plus, X, Loader2, AlertTriangle } from "lucide-react";
import { sileo } from "sileo";

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
  onUpdate: (id: string | number, data: Record<string, unknown>) => Promise<T>;
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
  const { t } = useTranslation();
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelClosing, setPanelClosing] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | number | null>(null);
  const [deleteClosing, setDeleteClosing] = useState(false);
  const [search, setSearch] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const panelRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

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
        if (!ignore) {
          const msg =
            e instanceof Error ? e.message : t("admin.crud.loadFailed");
          setError(msg);
          sileo.error({ title: t("admin.crud.loadFailed"), description: msg });
        }
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

  const openEdit = (row: T) => {
    setEditing(row);
    const data: Record<string, unknown> = {};
    for (const f of fields) {
      data[f.name] = (row as Record<string, unknown>)[f.name] ?? "";
    }
    setFormData(data);
    openPanel();
  };

  /* ── Delete panel ── */

  const openDelete = (id: string | number) => {
    setDeleteClosing(false);
    setDeleteId(id);
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
    const isEditing = !!editing;
    try {
      if (isEditing) {
        await onUpdate(editing!.id, formData);
        sileo.success({
          title: t("admin.crud.updateSuccess", { resource: title }),
          description: t("admin.crud.updateSuccessDesc", { resource: title }),
        });
      } else {
        await onCreate(formData);
        sileo.success({
          title: t("admin.crud.createSuccess", { resource: title }),
          description: t("admin.crud.createSuccessDesc", { resource: title }),
        });
      }
      closePanel();
      load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("admin.crud.saveFailed");
      sileo.error({
        title: isEditing
          ? t("admin.crud.updateFailed")
          : t("admin.crud.createFailed"),
        description: msg,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId == null) return;
    setDeleteError("");
    try {
      await onDelete(deleteId);
      sileo.success({
        title: t("admin.crud.deleteSuccess", { resource: title }),
        description: t("admin.crud.deleteSuccessDesc", { resource: title }),
      });
      closeDelete();
      load();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("admin.crud.deleteFailed");
      setDeleteError(msg);
      sileo.error({
        title: t("admin.crud.deleteFailed"),
        description: msg,
      });
    }
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

  /* ── Filter ── */

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
            placeholder={t("common.search")}
            className="crud-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {!readOnly && (
            <button className="crud-btn crud-btn-primary" onClick={openCreate}>
              <Plus size={16} /> {t("common.new")}
            </button>
          )}
        </div>
      </div>

      {error && <div className="crud-error">{error}</div>}

      {/* Table */}
      <div className="crud-table-wrap">
        {loading ? (
          <div className="crud-loading">
            <Loader2 size={24} className="crud-spin" /> {t("common.loading")}
          </div>
        ) : filtered.length === 0 ? (
          <div className="crud-empty">{t("admin.crud.noRecords")}</div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                {!readOnly && <th className="crud-th-actions">Actions</th>}
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
                        title={t("common.edit")}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className="crud-icon-btn crud-icon-delete"
                        onClick={() => openDelete(row.id)}
                        title={t("common.delete")}
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
                  ? t("admin.crud.editTitle", {
                      resource: title,
                    })
                  : t("admin.crud.newTitle", {
                      resource: title,
                    })}
              </h2>
              <button className="crud-panel-close" onClick={closePanel}>
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="crud-panel-body">
              {fields.map((f) => (
                <div className="crud-field" key={f.name}>
                  <label className="crud-label">
                    {f.label}
                    {f.required && <span className="crud-required">*</span>}
                  </label>
                  {f.type === "select" ? (
                    <select
                      className="crud-input"
                      value={String(formData[f.name] ?? "")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [f.name]: e.target.value,
                        })
                      }
                    >
                      <option value="">Select…</option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "textarea" ? (
                    <textarea
                      className="crud-input crud-textarea"
                      placeholder={f.placeholder}
                      value={String(formData[f.name] ?? "")}
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
                      value={String(formData[f.name] ?? "")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [f.name]:
                            f.type === "number"
                              ? e.target.value === ""
                                ? ""
                                : Number(e.target.value)
                              : e.target.value,
                        })
                      }
                    />
                  )}
                </div>
              ))}
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
                {saving && <Loader2 size={14} className="crud-spin" />}
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
                {t("admin.crud.deleteMessage")}
              </p>
              {deleteError && (
                <p
                  className="crud-error"
                  style={{ marginTop: "0.75rem", textAlign: "center" }}
                >
                  {deleteError}
                </p>
              )}
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

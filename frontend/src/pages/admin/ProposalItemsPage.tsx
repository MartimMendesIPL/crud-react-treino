import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, Trash2, Pencil, X, Loader2 } from "lucide-react";
import { sileo } from "sileo";
import AsyncSelect from "react-select/async";
import type { SingleValue, StylesConfig, GroupBase } from "react-select";
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

type SelectOption = { value: string; label: string };

const selectStyles: StylesConfig<
    SelectOption,
    false,
    GroupBase<SelectOption>
> = {
    control: (base, state) => ({
        ...base,
        backgroundColor: "var(--admin-bg)",
        borderColor: state.isFocused
            ? "var(--admin-accent)"
            : "var(--admin-border)",
        boxShadow: state.isFocused
            ? "0 0 0 3px var(--admin-accent-rgb-15)"
            : "none",
        borderRadius: "var(--admin-radius)",
        minHeight: "36px",
        fontSize: "13px",
        fontFamily: "inherit",
        cursor: "pointer",
        "&:hover": { borderColor: "var(--admin-accent)" },
    }),
    menu: (base) => ({
        ...base,
        backgroundColor: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        borderRadius: "var(--admin-radius)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        padding: "4px",
        maxHeight: "220px",
    }),
    option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected
            ? "var(--admin-accent)"
            : state.isFocused
              ? "var(--admin-surface-hover)"
              : "transparent",
        color: state.isSelected ? "#fff" : "var(--admin-text)",
        borderRadius: "6px",
        fontSize: "13px",
        fontFamily: "inherit",
        padding: "7px 10px",
        cursor: "pointer",
        "&:active": { backgroundColor: "var(--admin-accent-rgb-15)" },
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--admin-text)",
        fontSize: "13px",
    }),
    placeholder: (base) => ({
        ...base,
        color: "var(--admin-text-muted)",
        fontSize: "13px",
    }),
    input: (base) => ({
        ...base,
        color: "var(--admin-text)",
        fontSize: "13px",
        fontFamily: "inherit",
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "var(--admin-text-muted)",
        padding: "0 8px",
        "&:hover": { color: "var(--admin-text)" },
    }),
    clearIndicator: (base) => ({
        ...base,
        color: "var(--admin-text-muted)",
        "&:hover": { color: "var(--admin-danger)" },
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: "var(--admin-text-muted)",
        fontSize: "13px",
    }),
};

export default function ProposalItemsPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [items, setItems] = useState<ProposalItem[]>([]);
    const [productMap, setProductMap] = useState<Record<number, Product>>({});
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<ProposalItem | null>(null);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [selectedProduct, setSelectedProduct] = useState<SelectOption | null>(
        null,
    );
    const [saving, setSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let ignore = false;
        api.get<ProposalItem[]>(`/proposal-items?proposal_id=${id}`)
            .then((items) => {
                if (!ignore) setItems(items);
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

    /* ── Product async search ── */

    const loadProductOptions = useCallback(async (inputValue: string) => {
        const params = new URLSearchParams({ q: inputValue, limit: "25" });
        const results = await api.get<{ id: number; name: string }[]>(
            `/products/search?${params}`,
        );
        return results.map((p) => ({ value: String(p.id), label: p.name }));
    }, []);

    /* fetch full product (for unit_price autofill) */
    const fetchProduct = useCallback(
        async (productId: number): Promise<Product | null> => {
            if (productMap[productId]) return productMap[productId];
            try {
                const p = await api.get<Product>(`/products/${productId}`);
                setProductMap((prev) => ({ ...prev, [p.id]: p }));
                return p;
            } catch {
                return null;
            }
        },
        [productMap],
    );

    /* ── Modal open/close ── */

    const openCreate = () => {
        setEditing(null);
        setSelectedProduct(null);
        setFormData({});
        setModalOpen(true);
    };

    const openEdit = async (item: ProposalItem) => {
        setEditing(item);
        setFormData({
            product_id: item.product_id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            notes: item.notes ?? "",
        });
        // resolve label for the async select
        const p = await fetchProduct(item.product_id);
        setSelectedProduct(
            p
                ? { value: String(p.id), label: p.name }
                : {
                      value: String(item.product_id),
                      label: String(item.product_id),
                  },
        );
        setModalOpen(true);
    };

    const handleProductChange = async (opt: SingleValue<SelectOption>) => {
        if (!opt) {
            setSelectedProduct(null);
            setFormData((prev) => ({
                ...prev,
                product_id: "",
                unit_price: "",
            }));
            return;
        }
        setSelectedProduct(opt);
        setFormData((prev) => ({ ...prev, product_id: opt.value }));
        // autofill unit_price
        try {
            const p = await api.get<Product>(`/products/${opt.value}`);
            setProductMap((prev) => ({ ...prev, [p.id]: p }));
            setFormData((prev) => ({ ...prev, unit_price: p.unit_price }));
        } catch {
            /* leave unit_price as-is */
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) {
                await api.put(`/proposal-items/${editing.id}`, formData);
            } else {
                await api.post(`/proposal-items?proposal_id=${id}`, formData);
            }
            setModalOpen(false);
            load();
        } catch {
            /* */
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

    const resolveProductName = (productId: number) =>
        productMap[productId]?.name ?? String(productId);

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
                <button
                    className="crud-btn crud-btn-primary"
                    onClick={openCreate}
                >
                    <Plus size={16} /> {t("admin.proposals.addItem")}
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
                        {t("admin.proposals.noItems")}
                    </div>
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
                                        {resolveProductName(item.product_id)}
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

            {/* ── Create / Edit modal ── */}
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
                                    ? t("admin.proposals.editItem")
                                    : t("admin.proposals.addItem")}
                            </h2>
                            <button
                                className="crud-modal-close"
                                onClick={() => setModalOpen(false)}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="crud-modal-body">
                            {/* Product */}
                            <div className="crud-field">
                                <label className="crud-label">
                                    {t("admin.proposals.product")}{" "}
                                    <span className="crud-required">*</span>
                                </label>
                                <AsyncSelect<SelectOption>
                                    classNamePrefix="react-select"
                                    styles={selectStyles}
                                    loadOptions={loadProductOptions}
                                    defaultOptions
                                    cacheOptions
                                    value={selectedProduct}
                                    onChange={handleProductChange}
                                    placeholder={t(
                                        "admin.proposals.searchProduct",
                                    )}
                                    isClearable
                                    menuPortalTarget={document.body}
                                    menuPosition="fixed"
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue
                                            ? "No results"
                                            : "Type to search…"
                                    }
                                />
                            </div>

                            {/* Quantity */}
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

                            {/* Unit price */}
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

                            {/* Notes */}
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

            {/* ── Delete confirm modal ── */}
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
                            <p>{t("admin.proposals.deleteItem")}</p>
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

      {/* Modal */}
      {modalOpen && (
        <div className="crud-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="crud-modal" onClick={(e) => e.stopPropagation()}>
            <div className="crud-modal-header">
              <h2>
                {editing
                  ? t("admin.proposals.editItem")
                  : t("admin.proposals.addItem")}
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
                {saving && <Loader2 size={14} className="crud-spin" />}{" "}
                {editing ? t("common.update") : t("common.create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId != null && (
        <div className="crud-modal-overlay" onClick={() => setDeleteId(null)}>
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
              <p>{t("admin.proposals.deleteItem")}</p>
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

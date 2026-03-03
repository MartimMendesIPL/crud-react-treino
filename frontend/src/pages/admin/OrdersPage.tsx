import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

/* ── Orders list page ── */

export default function OrdersPage() {
    const { t } = useTranslation();

    const loadProposalOptions = useCallback(async (inputValue: string) => {
        const params = new URLSearchParams({ q: inputValue, limit: "25" });
        const results = await api.get<{ id: number; reference: string }[]>(
            `/proposals/search?${params}`,
        );
        return results.map((p) => ({
            value: String(p.id),
            label: p.reference,
        }));
    }, []);

    const loadSingleProposal = useCallback(async (value: string) => {
        try {
            const p = await api.get<{ id: number; reference: string }>(
                `/proposals/${value}`,
            );
            return { value: String(p.id), label: p.reference };
        } catch {
            return null;
        }
    }, []);

    const loadClientOptions = useCallback(async (inputValue: string) => {
        const params = new URLSearchParams({ q: inputValue, limit: "25" });
        const results = await api.get<{ id: number; name: string }[]>(
            `/clients/search?${params}`,
        );
        return results.map((c) => ({ value: String(c.id), label: c.name }));
    }, []);

    const loadSingleClient = useCallback(async (value: string) => {
        try {
            const c = await api.get<{ id: number; name: string }>(
                `/clients/${value}`,
            );
            return { value: String(c.id), label: c.name };
        } catch {
            return null;
        }
    }, []);

    const loadSectionOptions = useCallback(async (inputValue: string) => {
        const params = new URLSearchParams({ q: inputValue, limit: "25" });
        const results = await api.get<{ id: number; name: string }[]>(
            `/sections/search?${params}`,
        );
        return results.map((s) => ({ value: String(s.id), label: s.name }));
    }, []);

    const loadSingleSection = useCallback(async (value: string) => {
        try {
            const s = await api.get<{ id: number; name: string }>(
                `/sections/${value}`,
            );
            return { value: String(s.id), label: s.name };
        } catch {
            return null;
        }
    }, []);

    const columns: Column<Order>[] = [
        { key: "id", label: t("admin.orders.id") },
        { key: "reference", label: t("admin.orders.reference") },
        { key: "client_id", label: t("admin.orders.client") },
        {
            key: "status",
            label: t("admin.orders.status"),
            render: (v) => (
                <span className={`crud-badge crud-badge-${v}`}>
                    {String(v)}
                </span>
            ),
        },
        {
            key: "due_date",
            label: t("admin.orders.dueDate"),
            render: (v) => (v ? new Date(String(v)).toLocaleDateString() : "—"),
        },
        {
            key: "id" as keyof Order,
            label: t("admin.orders.items"),
            render: (_v, row) => <ItemsLink id={row.id} />,
        },
    ];

    const fields: FieldDef[] = [
        {
            name: "reference",
            label: t("admin.orders.reference"),
            required: true,
        },
        {
            name: "proposal_id",
            label: t("admin.orders.proposal"),
            type: "async-select",
            placeholder: t("admin.orders.searchProposal"),
            loadOptions: loadProposalOptions,
            loadSingleOption: loadSingleProposal,
        },
        {
            name: "client_id",
            label: t("admin.orders.client"),
            type: "async-select",
            required: true,
            placeholder: t("admin.orders.searchClient"),
            loadOptions: loadClientOptions,
            loadSingleOption: loadSingleClient,
        },
        {
            name: "section_id",
            label: t("admin.orders.section"),
            type: "async-select",
            placeholder: t("admin.orders.searchSection"),
            loadOptions: loadSectionOptions,
            loadSingleOption: loadSingleSection,
        },
        {
            name: "status",
            label: t("admin.orders.status"),
            type: "select",
            required: true,
            options: [
                { value: "pending", label: t("admin.orders.statusPending") },
                {
                    value: "in_production",
                    label: t("admin.orders.statusInProduction"),
                },
                {
                    value: "completed",
                    label: t("admin.orders.statusCompleted"),
                },
                {
                    value: "delivered",
                    label: t("admin.orders.statusDelivered"),
                },
            ],
        },
        { name: "due_date", label: t("admin.orders.dueDate"), type: "date" },
    ];

    return (
        <CrudPage<Order>
            title={t("admin.orders.title")}
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
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <button
            className="crud-btn crud-btn-sm"
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/admin/orders/${id}/items`);
            }}
        >
            {t("admin.orders.viewItems")}
        </button>
    );
}

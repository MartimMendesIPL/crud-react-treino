import { useState, useEffect } from "react";
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

/* ── Orders list page ── */

export default function OrdersPage() {
    const { t } = useTranslation();
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
        { key: "id", label: t("admin.orders.id") },
        { key: "reference", label: t("admin.orders.reference") },
        {
            key: "client_id",
            label: t("admin.orders.client"),
            render: (v) =>
                clients.find((c) => c.id === Number(v))?.name ?? String(v),
        },
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
            type: "select",
            options: proposals.map((p) => ({
                value: String(p.id),
                label: p.reference,
            })),
        },
        {
            name: "client_id",
            label: t("admin.orders.client"),
            type: "select",
            required: true,
            options: clients.map((c) => ({
                value: String(c.id),
                label: c.name,
            })),
        },
        {
            name: "section_id",
            label: t("admin.orders.section"),
            type: "select",
            options: sections.map((s) => ({
                value: String(s.id),
                label: s.name,
            })),
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
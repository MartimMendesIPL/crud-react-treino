import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../../services/api";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";

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

/* ── Proposals list page ── */

export default function ProposalsPage() {
    const { t } = useTranslation();

    const loadClients = useCallback(async (inputValue: string) => {
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

    const loadSections = useCallback(async (inputValue: string) => {
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

    const columns: Column<Proposal>[] = [
        { key: "id", label: t("admin.proposals.id") },
        { key: "reference", label: t("admin.proposals.reference") },
        { key: "client_id", label: t("admin.proposals.client") },
        {
            key: "status",
            label: t("admin.proposals.status"),
            render: (v) => (
                <span className={`crud-badge crud-badge-${v}`}>
                    {String(v)}
                </span>
            ),
        },
        {
            key: "created_at",
            label: t("admin.proposals.created"),
            render: (v) => new Date(String(v)).toLocaleDateString(),
        },
        {
            key: "id" as keyof Proposal,
            label: t("admin.proposals.items"),
            render: (_v, row) => <ItemsLink id={row.id} />,
        },
    ];

    const fields: FieldDef[] = [
        {
            name: "reference",
            label: t("admin.proposals.reference"),
            required: true,
        },
        {
            name: "client_id",
            label: t("admin.proposals.client"),
            type: "async-select",
            required: true,
            placeholder: t("admin.proposals.searchClient"),
            loadOptions: loadClients,
            loadSingleOption: loadSingleClient,
        },
        {
            name: "section_id",
            label: t("admin.proposals.section"),
            type: "async-select",
            placeholder: t("admin.proposals.searchSection"),
            loadOptions: loadSections,
            loadSingleOption: loadSingleSection,
        },
        {
            name: "status",
            label: t("admin.proposals.status"),
            type: "select",
            required: true,
            options: [
                { value: "draft", label: t("admin.proposals.statusDraft") },
                { value: "pending", label: t("admin.proposals.statusPending") },
                {
                    value: "approved",
                    label: t("admin.proposals.statusApproved"),
                },
                {
                    value: "rejected",
                    label: t("admin.proposals.statusRejected"),
                },
            ],
        },
        { name: "notes", label: t("admin.proposals.notes"), type: "textarea" },
    ];

    return (
        <CrudPage<Proposal>
            title={t("admin.proposals.title")}
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<Proposal[]>("/proposals")}
            onCreate={(data) => api.post<Proposal>("/proposals", data)}
            onUpdate={(id, data) => api.put<Proposal>(`/proposals/${id}`, data)}
            onDelete={(id) => api.del(`/proposals/${id}`)}
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
                navigate(`/admin/proposals/${id}/items`);
            }}
        >
            {t("admin.proposals.viewItems")}
        </button>
    );
}

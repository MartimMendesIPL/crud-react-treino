import { useTranslation } from "react-i18next";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    vat_number: string;
    notes: string;
    created_at: string;
    updated_at: string;
}

export default function ClientsPage() {
    const { t } = useTranslation();

    const columns: Column<Client>[] = [
        { key: "id", label: t("admin.clients.id") },
        { key: "name", label: t("admin.clients.name") },
        { key: "email", label: t("admin.clients.email") },
        { key: "phone", label: t("admin.clients.phone") },
        { key: "vat_number", label: t("admin.clients.vat") },
        {
            key: "created_at",
            label: t("admin.clients.created"),
            render: (v) => new Date(String(v)).toLocaleDateString(),
        },
    ];

    const fields: FieldDef[] = [
        { name: "name", label: t("admin.clients.name"), required: true },
        { name: "email", label: t("admin.clients.email"), type: "email" },
        { name: "phone", label: t("admin.clients.phone") },
        {
            name: "address",
            label: t("admin.clients.address"),
            type: "textarea",
        },
        { name: "vat_number", label: t("admin.clients.vatNumber") },
        { name: "notes", label: t("admin.clients.notes"), type: "textarea" },
    ];

    return (
        <CrudPage<Client>
            title={t("admin.clients.title")}
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<Client[]>("/clients")}
            onCreate={(data) => api.post<Client>("/clients", data)}
            onUpdate={(id, data) => api.put<Client>(`/clients/${id}`, data)}
            onDelete={(id) => api.del(`/clients/${id}`)}
        />
    );
}

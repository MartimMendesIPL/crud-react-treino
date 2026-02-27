import { useTranslation } from "react-i18next";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface Section {
    id: number;
    name: string;
    description: string;
    created_at: string;
}

export default function SectionsPage() {
    const { t } = useTranslation();

    const columns: Column<Section>[] = [
        { key: "id", label: t("admin.sections.id") },
        { key: "name", label: t("admin.sections.name") },
        { key: "description", label: t("admin.sections.description") },
        {
            key: "created_at",
            label: t("admin.sections.created"),
            render: (v) => new Date(String(v)).toLocaleDateString(),
        },
    ];

    const fields: FieldDef[] = [
        { name: "name", label: t("admin.sections.name"), required: true },
        {
            name: "description",
            label: t("admin.sections.description"),
            type: "textarea",
        },
    ];

    return (
        <CrudPage<Section>
            title={t("admin.sections.title")}
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<Section[]>("/sections")}
            onCreate={(data) => api.post<Section>("/sections", data)}
            onUpdate={(id, data) => api.put<Section>(`/sections/${id}`, data)}
            onDelete={(id) => api.del(`/sections/${id}`)}
        />
    );
}

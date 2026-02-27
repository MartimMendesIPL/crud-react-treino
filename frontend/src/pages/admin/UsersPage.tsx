import { useTranslation } from "react-i18next";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    role: string;
    created_at: string;
}

export default function UsersPage() {
    const { t } = useTranslation();

    const columns: Column<User>[] = [
        { key: "id", label: t("admin.users.id") },
        { key: "name", label: t("admin.users.name") },
        { key: "email", label: t("admin.users.email") },
        {
            key: "role",
            label: t("admin.users.role"),
            render: (v) => (
                <span className={`crud-badge crud-badge-${v}`}>
                    {String(v)}
                </span>
            ),
        },
        {
            key: "created_at",
            label: t("admin.users.created"),
            render: (v) => new Date(String(v)).toLocaleDateString(),
        },
    ];

    const fields: FieldDef[] = [
        { name: "name", label: t("admin.users.name"), required: true },
        {
            name: "email",
            label: t("admin.users.email"),
            type: "email",
            required: true,
        },
        {
            name: "password_hash",
            label: t("admin.users.password"),
            type: "text",
            required: true,
        },
        {
            name: "role",
            label: t("admin.users.role"),
            type: "select",
            required: true,
            options: [
                { value: "admin", label: t("admin.users.roleAdmin") },
                { value: "sales", label: t("admin.users.roleSales") },
                { value: "production", label: t("admin.users.roleProduction") },
                { value: "viewer", label: t("admin.users.roleViewer") },
            ],
        },
    ];

    return (
        <CrudPage<User>
            title={t("admin.users.title")}
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<User[]>("/users")}
            onCreate={(data) => api.post<User>("/users", data)}
            onUpdate={(id, data) => api.put<User>(`/users/${id}`, data)}
            onDelete={(id) => api.del(`/users/${id}`)}
        />
    );
}

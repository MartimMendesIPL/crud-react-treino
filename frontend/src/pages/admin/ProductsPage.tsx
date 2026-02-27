import { useTranslation } from "react-i18next";
import CrudPage, {
    type Column,
    type FieldDef,
} from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface Product {
    id: number;
    name: string;
    description: string;
    unit_price: number;
    unit: string;
    created_at: string;
}

export default function ProductsPage() {
    const { t } = useTranslation();

    const columns: Column<Product>[] = [
        { key: "id", label: t("admin.products.id") },
        { key: "name", label: t("admin.products.name") },
        { key: "description", label: t("admin.products.description") },
        {
            key: "unit_price",
            label: t("admin.products.unitPrice"),
            render: (v) => `€${Number(v).toFixed(2)}`,
        },
        { key: "unit", label: t("admin.products.unit") },
    ];

    const fields: FieldDef[] = [
        { name: "name", label: t("admin.products.name"), required: true },
        {
            name: "description",
            label: t("admin.products.description"),
            type: "textarea",
        },
        {
            name: "unit_price",
            label: t("admin.products.unitPrice"),
            type: "number",
            required: true,
        },
        {
            name: "unit",
            label: t("admin.products.unit"),
            required: true,
            placeholder: "e.g. m2, kg, m",
        },
    ];

    return (
        <CrudPage<Product>
            title={t("admin.products.title")}
            columns={columns}
            fields={fields}
            fetchAll={() => api.get<Product[]>("/products")}
            onCreate={(data) => api.post<Product>("/products", data)}
            onUpdate={(id, data) => api.put<Product>(`/products/${id}`, data)}
            onDelete={(id) => api.del(`/products/${id}`)}
        />
    );
}

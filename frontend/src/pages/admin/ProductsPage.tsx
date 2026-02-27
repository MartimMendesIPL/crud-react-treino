import CrudPage, { type Column, type FieldDef } from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface Product {
  id: number;
  name: string;
  description: string;
  unit_price: number;
  unit: string;
  created_at: string;
}

const columns: Column<Product>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "unit_price",
    label: "Unit Price",
    render: (v) => `€${Number(v).toFixed(2)}`,
  },
  { key: "unit", label: "Unit" },
];

const fields: FieldDef[] = [
  { name: "name", label: "Name", required: true },
  { name: "description", label: "Description", type: "textarea" },
  { name: "unit_price", label: "Unit Price", type: "number", required: true },
  { name: "unit", label: "Unit", required: true, placeholder: "e.g. m2, kg, m" },
];

export default function ProductsPage() {
  return (
    <CrudPage<Product>
      title="Products"
      columns={columns}
      fields={fields}
      fetchAll={() => api.get<Product[]>("/products")}
      onCreate={(data) => api.post<Product>("/products", data)}
      onUpdate={(id, data) => api.put<Product>(`/products/${id}`, data)}
      onDelete={(id) => api.del(`/products/${id}`)}
    />
  );
}

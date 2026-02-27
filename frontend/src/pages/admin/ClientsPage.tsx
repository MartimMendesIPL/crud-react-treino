import CrudPage, { type Column, type FieldDef } from "../../components/admin/CrudPage";
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

const columns: Column<Client>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "vat_number", label: "VAT" },
  {
    key: "created_at",
    label: "Created",
    render: (v) => new Date(String(v)).toLocaleDateString(),
  },
];

const fields: FieldDef[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "vat_number", label: "VAT Number" },
  { name: "notes", label: "Notes", type: "textarea" },
];

export default function ClientsPage() {
  return (
    <CrudPage<Client>
      title="Clients"
      columns={columns}
      fields={fields}
      fetchAll={() => api.get<Client[]>("/clients")}
      onCreate={(data) => api.post<Client>("/clients", data)}
      onUpdate={(id, data) => api.put<Client>(`/clients/${id}`, data)}
      onDelete={(id) => api.del(`/clients/${id}`)}
    />
  );
}

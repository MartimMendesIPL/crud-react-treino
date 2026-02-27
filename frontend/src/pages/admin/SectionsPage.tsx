import CrudPage, { type Column, type FieldDef } from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface Section {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const columns: Column<Section>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "description", label: "Description" },
  {
    key: "created_at",
    label: "Created",
    render: (v) => new Date(String(v)).toLocaleDateString(),
  },
];

const fields: FieldDef[] = [
  { name: "name", label: "Name", required: true },
  { name: "description", label: "Description", type: "textarea" },
];

export default function SectionsPage() {
  return (
    <CrudPage<Section>
      title="Sections"
      columns={columns}
      fields={fields}
      fetchAll={() => api.get<Section[]>("/sections")}
      onCreate={(data) => api.post<Section>("/sections", data)}
      onUpdate={(id, data) => api.put<Section>(`/sections/${id}`, data)}
      onDelete={(id) => api.del(`/sections/${id}`)}
    />
  );
}

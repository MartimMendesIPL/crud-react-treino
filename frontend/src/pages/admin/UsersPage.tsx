import CrudPage, { type Column, type FieldDef } from "../../components/admin/CrudPage";
import { api } from "../../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

const columns: Column<User>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    render: (v) => (
      <span className={`crud-badge crud-badge-${v}`}>{String(v)}</span>
    ),
  },
  {
    key: "created_at",
    label: "Created",
    render: (v) => new Date(String(v)).toLocaleDateString(),
  },
];

const fields: FieldDef[] = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "password_hash", label: "Password", type: "text", required: true },
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      { value: "admin", label: "Admin" },
      { value: "sales", label: "Sales" },
      { value: "production", label: "Production" },
      { value: "viewer", label: "Viewer" },
    ],
  },
];

export default function UsersPage() {
  return (
    <CrudPage<User>
      title="Users"
      columns={columns}
      fields={fields}
      fetchAll={() => api.get<User[]>("/users")}
      onCreate={(data) => api.post<User>("/users", data)}
      onUpdate={(id, data) => api.put<User>(`/users/${id}`, data)}
      onDelete={(id) => api.del(`/users/${id}`)}
    />
  );
}

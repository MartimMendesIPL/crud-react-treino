import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { api } from "../../services/api";

interface AuditEntry {
    id: number;
    user_id: number | null;
    entity_type: string;
    entity_id: number;
    action: string;
    old_value: unknown;
    new_value: unknown;
    created_at: string;
}

export default function AuditLogPage() {
    const { t } = useTranslation();
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        api.get<AuditEntry[]>("/audit-log?limit=200")
            .then(setEntries)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = entries.filter((e) => {
        if (!search) return true;
        const s = search.toLowerCase();
        return (
            e.entity_type.toLowerCase().includes(s) ||
            e.action.toLowerCase().includes(s) ||
            String(e.entity_id).includes(s)
        );
    });

    return (
        <div className="crud-page">
            <div className="crud-header">
                <h1 className="crud-title">{t("admin.auditLog.title")}</h1>
                <input
                    type="text"
                    placeholder={t("admin.auditLog.filter")}
                    className="crud-search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="crud-table-wrap">
                {loading ? (
                    <div className="crud-loading">
                        <Loader2 size={24} className="crud-spin" />{" "}
                        {t("common.loading")}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="crud-empty">
                        {t("admin.auditLog.noEntries")}
                    </div>
                ) : (
                    <table className="crud-table">
                        <thead>
                            <tr>
                                <th>{t("admin.auditLog.id")}</th>
                                <th>{t("admin.auditLog.userId")}</th>
                                <th>{t("admin.auditLog.entity")}</th>
                                <th>{t("admin.auditLog.entityId")}</th>
                                <th>{t("admin.auditLog.action")}</th>
                                <th>{t("admin.auditLog.oldValue")}</th>
                                <th>{t("admin.auditLog.newValue")}</th>
                                <th>{t("admin.auditLog.date")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((e) => (
                                <tr key={e.id}>
                                    <td>{e.id}</td>
                                    <td>{e.user_id ?? "—"}</td>
                                    <td>
                                        <span className="crud-badge">
                                            {e.entity_type}
                                        </span>
                                    </td>
                                    <td>{e.entity_id}</td>
                                    <td>
                                        <span
                                            className={`crud-badge crud-badge-${e.action}`}
                                        >
                                            {e.action}
                                        </span>
                                    </td>
                                    <td className="crud-td-json">
                                        {e.old_value ? (
                                            <code>
                                                {JSON.stringify(e.old_value)}
                                            </code>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="crud-td-json">
                                        {e.new_value ? (
                                            <code>
                                                {JSON.stringify(e.new_value)}
                                            </code>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td>
                                        {new Date(
                                            e.created_at,
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

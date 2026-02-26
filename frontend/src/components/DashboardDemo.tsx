import "./DashboardDemo.css";

const SIDEBAR_ITEMS = [
    { icon: "fa-solid fa-chart-pie", label: "Dashboard", active: true },
    { icon: "fa-solid fa-users", label: "Clients" },
    { icon: "fa-solid fa-file-lines", label: "Proposals" },
    { icon: "fa-solid fa-box", label: "Orders" },
    { icon: "fa-solid fa-industry", label: "Sections" },
    { icon: "fa-solid fa-wrench", label: "Products" },
    { icon: "fa-solid fa-user", label: "Users" },
    { icon: "fa-solid fa-scroll", label: "Audit Log" },
];

const TABLE_ROWS = [
    {
        ref: "ORD-2026-014",
        client: "ACME Corp",
        status: "In Production",
        statusType: "progress",
        due: "Mar 12",
    },
    {
        ref: "ORD-2026-013",
        client: "Globex Corp",
        status: "Completed",
        statusType: "success",
        due: "Mar 08",
    },
    {
        ref: "ORD-2026-012",
        client: "Initech Ltd",
        status: "Pending",
        statusType: "pending",
        due: "Mar 15",
    },
    {
        ref: "ORD-2026-011",
        client: "ACME Corp",
        status: "Delivered",
        statusType: "success",
        due: "Feb 28",
    },
    {
        ref: "ORD-2026-010",
        client: "Soylent Co",
        status: "In Production",
        statusType: "progress",
        due: "Mar 20",
    },
];

function DashboardDemo() {
    return (
        <div className="dash-demo" aria-hidden="true">
            {/* Sidebar */}
            <div className="dash-sidebar">
                <div className="dash-sidebar-brand">
                    <span className="dash-sidebar-dot" />
                    Aura
                </div>
                <nav className="dash-sidebar-nav">
                    {SIDEBAR_ITEMS.map((item) => (
                        <div
                            key={item.label}
                            className={`dash-sidebar-item ${item.active ? "active" : ""}`}
                        >
                            <span className="dash-sidebar-icon">
                                <i className={item.icon} />
                            </span>
                            <span className="dash-sidebar-label">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main content */}
            <div className="dash-main">
                {/* Top bar */}
                <div className="dash-topbar">
                    <span className="dash-topbar-title">Dashboard</span>
                    <div className="dash-topbar-user">
                        <div className="dash-avatar" />
                        <span>Admin</span>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="dash-stats">
                    <div className="dash-stat-card">
                        <span className="dash-stat-label">Active Orders</span>
                        <span className="dash-stat-value">24</span>
                        <span className="dash-stat-change up">
                            <i className="fa-solid fa-arrow-up" /> 12%
                        </span>
                    </div>
                    <div className="dash-stat-card">
                        <span className="dash-stat-label">Proposals</span>
                        <span className="dash-stat-value">18</span>
                        <span className="dash-stat-change up">
                            <i className="fa-solid fa-arrow-up" /> 8%
                        </span>
                    </div>
                    <div className="dash-stat-card">
                        <span className="dash-stat-label">Clients</span>
                        <span className="dash-stat-value">56</span>
                        <span className="dash-stat-change down">
                            <i className="fa-solid fa-arrow-down" /> 2%
                        </span>
                    </div>
                    <div className="dash-stat-card">
                        <span className="dash-stat-label">Revenue</span>
                        <span className="dash-stat-value">€47k</span>
                        <span className="dash-stat-change up">
                            <i className="fa-solid fa-arrow-up" /> 23%
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="dash-table-wrap">
                    <div className="dash-table-header">
                        <span className="dash-table-title">Recent Orders</span>
                        <span className="dash-table-action">
                            View All <i className="fa-solid fa-arrow-right" />
                        </span>
                    </div>
                    <table className="dash-table">
                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>Client</th>
                                <th>Status</th>
                                <th>Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map((row) => (
                                <tr key={row.ref}>
                                    <td className="dash-cell-ref">{row.ref}</td>
                                    <td>{row.client}</td>
                                    <td>
                                        <span
                                            className={`dash-status dash-status-${row.statusType}`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="dash-cell-date">
                                        {row.due}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default DashboardDemo;

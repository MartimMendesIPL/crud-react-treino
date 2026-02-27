import { Routes, Route } from "react-router-dom";
import AuthProvider from "./components/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import UsersPage from "./pages/admin/UsersPage";
import ClientsPage from "./pages/admin/ClientsPage";
import SectionsPage from "./pages/admin/SectionsPage";
import ProductsPage from "./pages/admin/ProductsPage";
import ProposalsPage from "./pages/admin/ProposalsPage";
import ProposalItemsPage from "./pages/admin/ProposalItemsPage";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderItemsPage from "./pages/admin/OrderItemsPage";
import AuditLogPage from "./pages/admin/AuditLogPage";
import ProposalCalendarPage from "./pages/admin/ProposalCalendarPage";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route
                        path="proposals/calendar"
                        element={<ProposalCalendarPage />}
                    />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="clients" element={<ClientsPage />} />
                    <Route path="sections" element={<SectionsPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="proposals" element={<ProposalsPage />} />
                    <Route
                        path="proposals/:id/items"
                        element={<ProposalItemsPage />}
                    />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route
                        path="orders/:id/items"
                        element={<OrderItemsPage />}
                    />
                    <Route path="audit-log" element={<AuditLogPage />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { MainLayout } from './components/layout/MainLayout';

// Auth
import { LoginPage } from './pages/auth/LoginPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Products (Epic 1)
import { ProductsListPage } from './pages/products/ProductsListPage';
import { AddProductPage } from './pages/products/AddProductPage';
import { EditProductPage } from './pages/products/EditProductPage';
import { ProductDetailsPage } from './pages/products/ProductDetailsPage';
import { CategoriesPage } from './pages/products/CategoriesPage';

// Locations
import { WarehouseManagementPage } from './pages/locations/WarehouseManagementPage';
import { StoreManagementPage } from './pages/locations/StoreManagementPage';

// Inventory (Epic 2)
import { InventoryOverviewPage } from './pages/inventory/InventoryOverviewPage';
import { StockInPage } from './pages/inventory/StockInPage';
import { StockOutPage } from './pages/inventory/StockOutPage';
import { StockTransfersPage } from './pages/inventory/StockTransfersPage';
import { InventoryHistoryPage } from './pages/inventory/InventoryHistoryPage';
import { LowStockAlertsPage } from './pages/inventory/LowStockAlertsPage';

// Orders (Epic 3)
import { OrdersListPage } from './pages/orders/OrdersListPage';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { OrderDetailsPage } from './pages/orders/OrderDetailsPage';
import { OrderFulfillmentPage } from './pages/orders/OrderFulfillmentPage';
import { ReturnsManagementPage } from './pages/orders/ReturnsManagementPage';

// Procurement (Epic 4)
import { SuppliersPage } from './pages/procurement/SuppliersPage';
import { PurchaseOrdersPage } from './pages/procurement/PurchaseOrdersPage';
import { ReceivePurchaseOrderPage } from './pages/procurement/ReceivePurchaseOrderPage';

// Barcode & RFID (Epic 5)
import { BarcodeScannerPage } from './pages/tracking/BarcodeScannerPage';
import { RfidManagementPage } from './pages/tracking/RfidManagementPage';

// Analytics & Reports (Epic 6)
import { AnalyticsDashboardPage } from './pages/analytics/AnalyticsDashboardPage';
import { ReportsPage } from './pages/reports/ReportsPage';

// Admin (Epic 7 & 8)
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { RolesPermissionsPage } from './pages/admin/RolesPermissionsPage';
import { IntegrationManagementPage } from './pages/admin/IntegrationManagementPage';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';
import { ApplicationSettingsPage } from './pages/admin/ApplicationSettingsPage';
import { UserProfilePage } from './pages/admin/UserProfilePage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-900 text-white font-mono">
        Authenticating RIMS Session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Enterprise Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />

              {/* Epic 1: Catalog */}
              <Route path="products" element={<ProductsListPage />} />
              <Route path="products/new" element={<AddProductPage />} />
              <Route path="products/edit/:id" element={<EditProductPage />} />
              <Route path="products/:id" element={<ProductDetailsPage />} />
              <Route path="categories" element={<CategoriesPage />} />

              {/* Locations */}
              <Route path="warehouses" element={<WarehouseManagementPage />} />
              <Route path="stores" element={<StoreManagementPage />} />

              {/* Epic 2: Inventory */}
              <Route path="inventory" element={<InventoryOverviewPage />} />
              <Route path="inventory/stock-in" element={<StockInPage />} />
              <Route path="inventory/stock-out" element={<StockOutPage />} />
              <Route path="inventory/transfers" element={<StockTransfersPage />} />
              <Route path="inventory/transactions" element={<InventoryHistoryPage />} />
              <Route path="inventory/low-stock" element={<LowStockAlertsPage />} />

              {/* Epic 3: Orders */}
              <Route path="orders" element={<OrdersListPage />} />
              <Route path="orders/new" element={<CreateOrderPage />} />
              <Route path="orders/fulfillment" element={<OrderFulfillmentPage />} />
              <Route path="orders/returns" element={<ReturnsManagementPage />} />
              <Route path="orders/:id" element={<OrderDetailsPage />} />

              {/* Epic 4: Procurement */}
              <Route path="suppliers" element={<SuppliersPage />} />
              <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
              <Route path="purchase-orders/receive/:id" element={<ReceivePurchaseOrderPage />} />

              {/* Epic 5: Barcode & RFID */}
              <Route path="tracking/barcode" element={<BarcodeScannerPage />} />
              <Route path="tracking/rfid" element={<RfidManagementPage />} />

              {/* Epic 6: Analytics & Reports */}
              <Route path="analytics" element={<AnalyticsDashboardPage />} />
              <Route path="reports" element={<ReportsPage />} />

              {/* Epic 7 & 8: Administration */}
              <Route path="admin/users" element={<UserManagementPage />} />
              <Route path="admin/roles" element={<RolesPermissionsPage />} />
              <Route path="admin/integrations" element={<IntegrationManagementPage />} />
              <Route path="admin/audit-logs" element={<AuditLogsPage />} />
              <Route path="admin/settings" element={<ApplicationSettingsPage />} />
              <Route path="profile" element={<UserProfilePage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;


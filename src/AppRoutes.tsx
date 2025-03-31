import { Navigate, Route, Routes } from 'react-router';
import BaseLayout from './layouts/BaseLayout';
import ListServiceOrdersPage from '@/features/orders/ListServiceOrdersPage';
import CreateServiceOrderPage from './features/orders/CreateServiceOrderPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<Navigate to="orders" />} />
        <Route path="orders">
          <Route index element={<ListServiceOrdersPage />} />
          <Route path="create" element={<CreateServiceOrderPage />} />
        </Route>

        <Route path="products" element={<p>Produtos</p>} />
        <Route path="expenses" element={<p>Despesas</p>} />

        <Route path="*" element={<p>404</p>} />
      </Route>
    </Routes>
  );
}

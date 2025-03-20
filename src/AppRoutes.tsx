import { Navigate, Route, Routes } from 'react-router';
import BaseLayout from './layouts/BaseLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}>
        <Route index element={<Navigate to="orders" />} />
        <Route path="orders" element={<p>Ordens de Serviço</p>} />
        <Route path="products" element={<p>Produtos</p>} />
        <Route path="expenses" element={<p>Despesas</p>} />

        <Route path="*" element={<p>404</p>} />
      </Route>
    </Routes>
  );
}

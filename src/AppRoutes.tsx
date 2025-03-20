import { Route, Routes } from 'react-router';
import BaseLayout from './layouts/BaseLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<BaseLayout />}></Route>
    </Routes>
  );
}

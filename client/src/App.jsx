import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ProtectedAdminRoute } from "./components/ProtectedAdminRoute";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminLoginPage } from "./pages/AdminLoginPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { ImpactPage } from "./pages/ImpactPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProgramsPage } from "./pages/ProgramsPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { StoriesPage } from "./pages/StoriesPage";

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="/programs" element={<ProgramsPage />} />
      <Route path="/impact" element={<ImpactPage />} />
      <Route path="/stories" element={<StoriesPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedAdminRoute>
          <AdminDashboardPage />
        </ProtectedAdminRoute>
      }
    />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;

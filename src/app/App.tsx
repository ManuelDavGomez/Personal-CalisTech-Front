import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage.tsx";
import ProtectedRoute from "../shared/components/ProtectedRoute.tsx";
import AdminPanelPage from "../pages/admin/AdminPage.tsx";
import LibraryPage from "../pages/Library/LibraryPage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route path="skills" element={<LibraryPage />} />
          </Route>

          <Route path="/admin" element={<AdminPanelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

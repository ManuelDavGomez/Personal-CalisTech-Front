import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import RegisterPage from "../pages/Register/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage.tsx";
import ProtectedRoute from "../shared/components/ProtectedRoute.tsx";
import AdminPanelPage from "../pages/admin/AdminPage.tsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.tsx";
import LibraryPage from "../pages/Library/LibraryPage.tsx";
import ExerciseDetailPage from "../pages/Library/ExerciseDetailPage.tsx";
import AdminLibraryPage from "../pages/admin/AdminLibraryPage.tsx";
import DashboardHomePage from "../pages/dashboard/DashboardHomePage.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="skills" element={<LibraryPage />} />
            <Route path="skills/:id" element={<ExerciseDetailPage />} />
          </Route>

          <Route path="/admin" element={<AdminPanelPage />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="library" element={<AdminLibraryPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

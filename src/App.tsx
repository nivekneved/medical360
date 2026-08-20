import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { DataProvider } from './providers/DataProvider';
import { AuthProvider, useAuth } from './providers/AuthProvider';

// Public layout components
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp/FloatingWhatsApp';

// Public pages
import { HomePage }         from './features/home/HomePage';
import { AboutPage }        from './features/about/AboutPage';
import { HospitalsPage }    from './features/hospitals/HospitalsPage';
import { SpecialtiesPage }  from './features/specialties/SpecialtiesPage';
import { DescribeNeedPage } from './features/describe-need/DescribeNeedPage';
import { ServicesPage }     from './features/services/ServicesPage';
import { CaseStudiesPage }  from './features/case-studies/CaseStudiesPage';
import { ContactPage }      from './features/contact/ContactPage';

// Admin pages
import { AdminLoginPage }      from './features/admin/AdminLoginPage';
import { AdminLayout }         from './features/admin/AdminLayout';
import { AdminDashboardPage }  from './features/admin/dashboard/AdminDashboardPage';
import { AdminInquiriesPage }  from './features/admin/inquiries/AdminInquiriesPage';
import { AdminHospitalsPage }  from './features/admin/hospitals/AdminHospitalsPage';
import { AdminSettingsPage }   from './features/admin/settings/AdminSettingsPage';

import './styles/globals.css';

// ─── Public Layout Wrapper ────────────────────────────────────────────────────
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}

// ─── Admin Auth Guard ─────────────────────────────────────────────────────────
function AdminGuard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/"             element={<HomePage />} />
              <Route path="/about"        element={<AboutPage />} />
              <Route path="/hospitals"    element={<HospitalsPage />} />
              <Route path="/specialties"  element={<SpecialtiesPage />} />
              <Route path="/describe-need" element={<DescribeNeedPage />} />
              <Route path="/services"     element={<ServicesPage />} />
              <Route path="/case-studies" element={<CaseStudiesPage />} />
              <Route path="/contact"      element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard"  element={<AdminDashboardPage />} />
              <Route path="inquiries"  element={<AdminInquiriesPage />} />
              <Route path="hospitals"  element={<AdminHospitalsPage />} />
              <Route path="settings"   element={<AdminSettingsPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DataProvider>
  );
}

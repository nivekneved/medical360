import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { DataProvider } from './providers/DataProvider';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { HelmetProvider } from 'react-helmet-async';

// Public layout components
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp/FloatingWhatsApp';

// Public pages & inside detail pages
import { HomePage }            from './features/home/HomePage';
import { AboutPage }           from './features/about/AboutPage';
import { HospitalsPage }       from './features/hospitals/HospitalsPage';
import { HospitalDetailPage }  from './features/hospitals/HospitalDetailPage';
import { SpecialtiesPage }     from './features/specialties/SpecialtiesPage';
import { SpecialtyDetailPage } from './features/specialties/SpecialtyDetailPage';
import { DoctorsPage }         from './features/doctors/DoctorsPage';
import { DescribeNeedPage }    from './features/describe-need/DescribeNeedPage';
import { ServicesPage }        from './features/services/ServicesPage';
import { CaseStudiesPage }     from './features/case-studies/CaseStudiesPage';
import { ContactPage }         from './features/contact/ContactPage';

// Admin pages
import { AdminLoginPage }        from './features/admin/AdminLoginPage';
import { AdminLayout }           from './features/admin/AdminLayout';
import { AdminDashboardPage }    from './features/admin/dashboard/AdminDashboardPage';
import { AdminInquiriesPage }    from './features/admin/inquiries/AdminInquiriesPage';
import { AdminHospitalsPage }    from './features/admin/hospitals/AdminHospitalsPage';
import { AdminSpecialtiesPage }  from './features/admin/specialties/AdminSpecialtiesPage';
import { AdminDoctorsPage }      from './features/admin/doctors/AdminDoctorsPage';
import { AdminCaseStudiesPage }  from './features/admin/case-studies/AdminCaseStudiesPage';
import { AdminSettingsPage }     from './features/admin/settings/AdminSettingsPage';
import { AdminPageEditor }       from './features/admin/pages/AdminPageEditor';

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
    <HelmetProvider>
      <ThemeProvider>
        <DataProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/"                 element={<HomePage />} />
                  <Route path="/about"            element={<AboutPage />} />
                  <Route path="/hospitals"        element={<HospitalsPage />} />
                  <Route path="/hospitals/:id"    element={<HospitalDetailPage />} />
                  <Route path="/specialties"      element={<SpecialtiesPage />} />
                  <Route path="/specialties/:id"  element={<SpecialtyDetailPage />} />
                  <Route path="/doctors"          element={<DoctorsPage />} />
                  <Route path="/describe-need"    element={<DescribeNeedPage />} />
                  <Route path="/services"         element={<ServicesPage />} />
                  <Route path="/case-studies"     element={<CaseStudiesPage />} />
                  <Route path="/contact"          element={<ContactPage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminGuard />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard"    element={<AdminDashboardPage />} />
                  <Route path="inquiries"    element={<AdminInquiriesPage />} />
                  <Route path="hospitals"    element={<AdminHospitalsPage />} />
                  <Route path="specialties"  element={<AdminSpecialtiesPage />} />
                  <Route path="doctors"      element={<AdminDoctorsPage />} />
                  <Route path="case-studies" element={<AdminCaseStudiesPage />} />
                  <Route path="settings"     element={<AdminSettingsPage />} />
                  <Route path="pages/:pageId" element={<AdminPageEditor />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </DataProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

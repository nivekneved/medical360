import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { DataProvider } from './providers/DataProvider';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';

// Public layout components (eager)
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp/FloatingWhatsApp';

// Eager primary pages
import { HomePage } from './features/home/HomePage';

import { ScrollToTop } from './components/common/ScrollToTop';
import { CookieConsentBanner } from './components/common/CookieConsentBanner';

// Lazy public pages (code-split)
const AboutPage           = lazy(() => import('./features/about/AboutPage').then(m => ({ default: m.AboutPage })));
const HospitalsPage       = lazy(() => import('./features/hospitals/HospitalsPage').then(m => ({ default: m.HospitalsPage })));
const HospitalDetailPage  = lazy(() => import('./features/hospitals/HospitalDetailPage').then(m => ({ default: m.HospitalDetailPage })));
const SpecialtiesPage     = lazy(() => import('./features/specialties/SpecialtiesPage').then(m => ({ default: m.SpecialtiesPage })));
const SpecialtyDetailPage = lazy(() => import('./features/specialties/SpecialtyDetailPage').then(m => ({ default: m.SpecialtyDetailPage })));
const DoctorsPage         = lazy(() => import('./features/doctors/DoctorsPage').then(m => ({ default: m.DoctorsPage })));
const DescribeNeedPage    = lazy(() => import('./features/describe-need/DescribeNeedPage').then(m => ({ default: m.DescribeNeedPage })));
const ServicesPage        = lazy(() => import('./features/services/ServicesPage').then(m => ({ default: m.ServicesPage })));
const CaseStudiesPage     = lazy(() => import('./features/case-studies/CaseStudiesPage').then(m => ({ default: m.CaseStudiesPage })));
const ContactPage         = lazy(() => import('./features/contact/ContactPage').then(m => ({ default: m.ContactPage })));
const CostCalculatorPage  = lazy(() => import('./features/cost-calculator/CostCalculatorPage').then(m => ({ default: m.CostCalculatorPage })));
const VisaGuidePage       = lazy(() => import('./features/visa-guide/VisaGuidePage').then(m => ({ default: m.VisaGuidePage })));
const PrivacyPolicyPage   = lazy(() => import('./features/legal/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage           = lazy(() => import('./features/legal/TermsPage').then(m => ({ default: m.TermsPage })));
const NotFoundPage        = lazy(() => import('./features/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

// Lazy admin pages
const AdminLoginPage        = lazy(() => import('./features/admin/AdminLoginPage').then(m => ({ default: m.AdminLoginPage })));
const AdminLayout           = lazy(() => import('./features/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboardPage    = lazy(() => import('./features/admin/dashboard/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminInquiriesPage    = lazy(() => import('./features/admin/inquiries/AdminInquiriesPage').then(m => ({ default: m.AdminInquiriesPage })));
const AdminHospitalsPage    = lazy(() => import('./features/admin/hospitals/AdminHospitalsPage').then(m => ({ default: m.AdminHospitalsPage })));
const AdminSpecialtiesPage  = lazy(() => import('./features/admin/specialties/AdminSpecialtiesPage').then(m => ({ default: m.AdminSpecialtiesPage })));
const AdminDoctorsPage      = lazy(() => import('./features/admin/doctors/AdminDoctorsPage').then(m => ({ default: m.AdminDoctorsPage })));
const AdminCaseStudiesPage  = lazy(() => import('./features/admin/case-studies/AdminCaseStudiesPage').then(m => ({ default: m.AdminCaseStudiesPage })));
const AdminSettingsPage     = lazy(() => import('./features/admin/settings/AdminSettingsPage').then(m => ({ default: m.AdminSettingsPage })));
const AdminPageEditor       = lazy(() => import('./features/admin/pages/AdminPageEditor').then(m => ({ default: m.AdminPageEditor })));
const AdminEmailTemplatesPage = lazy(() => import('./features/admin/email-templates/AdminEmailTemplatesPage').then(m => ({ default: m.AdminEmailTemplatesPage })));
const AdminCampaignsPage      = lazy(() => import('./features/admin/campaigns/AdminCampaignsPage').then(m => ({ default: m.AdminCampaignsPage })));

import './styles/globals.css';

// ─── Loading Fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#10b981',
      fontSize: '0.9rem',
      fontWeight: 600,
    }}>
      <div style={{
        width: 32,
        height: 32,
        border: '3px solid rgba(16, 185, 129, 0.2)',
        borderTopColor: '#10b981',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Public Layout Wrapper ────────────────────────────────────────────────────
function PublicLayout() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Footer />
      <FloatingWhatsApp />
      <CookieConsentBanner />
    </>
  );
}

// ─── Admin Auth Guard ─────────────────────────────────────────────────────────
function AdminGuard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return (
    <Suspense fallback={<PageLoader />}>
      <AdminLayout />
    </Suspense>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <DataProvider>
            <AuthProvider>
              <BrowserRouter>
                <ScrollToTop />
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
                    <Route path="/cost-calculator"  element={<CostCalculatorPage />} />
                    <Route path="/visa-guide"       element={<VisaGuidePage />} />
                    <Route path="/case-studies"     element={<CaseStudiesPage />} />
                    <Route path="/contact"          element={<ContactPage />} />
                    <Route path="/privacy"          element={<PrivacyPolicyPage />} />
                    <Route path="/terms"            element={<TermsPage />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminLoginPage />
                    </Suspense>
                  } />
                  <Route path="/admin" element={<AdminGuard />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard"    element={<AdminDashboardPage />} />
                    <Route path="inquiries"    element={<AdminInquiriesPage />} />
                    <Route path="hospitals"    element={<AdminHospitalsPage />} />
                    <Route path="specialties"  element={<AdminSpecialtiesPage />} />
                    <Route path="doctors"      element={<AdminDoctorsPage />} />
                    <Route path="case-studies" element={<AdminCaseStudiesPage />} />
                    <Route path="settings"     element={<AdminSettingsPage />} />
                    <Route path="email-templates" element={<AdminEmailTemplatesPage />} />
                    <Route path="campaigns"       element={<AdminCampaignsPage />} />
                    <Route path="pages/:pageId" element={<AdminPageEditor />} />
                  </Route>

                  {/* Fallback 404 Page */}
                  <Route path="*" element={
                    <Suspense fallback={<PageLoader />}>
                      <NotFoundPage />
                    </Suspense>
                  } />
                </Routes>
              </BrowserRouter>
            </AuthProvider>
          </DataProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

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

/**
 * Resilient lazy import helper that automatically recovers from stale deployment chunk errors
 * by reloading the window when a new production deployment replaces existing chunk hashes.
 */
function lazyWithRetry<T extends { [key: string]: any }>(
  componentImport: () => Promise<T>,
  getter?: (module: T) => any
) {
  return lazy(async () => {
    const hasAlreadyRefreshed = JSON.parse(
      window.sessionStorage.getItem('retry-lazy-refreshed') || 'false'
    );

    try {
      const module = await componentImport();
      window.sessionStorage.setItem('retry-lazy-refreshed', 'false');
      return getter ? { default: getter(module) } : module;
    } catch (error: any) {
      if (!hasAlreadyRefreshed) {
        window.sessionStorage.setItem('retry-lazy-refreshed', 'true');
        window.location.reload();
        return { default: () => null } as any;
      }
      throw error;
    }
  });
}

// Lazy public pages (code-split with deployment auto-retry)
const AboutPage           = lazyWithRetry(() => import('./features/about/AboutPage'), m => m.AboutPage);
const HospitalsPage       = lazyWithRetry(() => import('./features/hospitals/HospitalsPage'), m => m.HospitalsPage);
const HospitalDetailPage  = lazyWithRetry(() => import('./features/hospitals/HospitalDetailPage'), m => m.HospitalDetailPage);
const SpecialtiesPage     = lazyWithRetry(() => import('./features/specialties/SpecialtiesPage'), m => m.SpecialtiesPage);
const SpecialtyDetailPage = lazyWithRetry(() => import('./features/specialties/SpecialtyDetailPage'), m => m.SpecialtyDetailPage);
const DoctorsPage         = lazyWithRetry(() => import('./features/doctors/DoctorsPage'), m => m.DoctorsPage);
const DescribeNeedPage    = lazyWithRetry(() => import('./features/describe-need/DescribeNeedPage'), m => m.DescribeNeedPage);
const HowItWorksPage     = lazyWithRetry(() => import('./features/how-it-works/HowItWorksPage'), m => m.HowItWorksPage);
const ServicesPage        = lazyWithRetry(() => import('./features/services/ServicesPage'), m => m.ServicesPage);
const CaseStudiesPage     = lazyWithRetry(() => import('./features/case-studies/CaseStudiesPage'), m => m.CaseStudiesPage);
const ContactPage         = lazyWithRetry(() => import('./features/contact/ContactPage'), m => m.ContactPage);
const CostCalculatorPage  = lazyWithRetry(() => import('./features/cost-calculator/CostCalculatorPage'), m => m.CostCalculatorPage);
const VisaGuidePage       = lazyWithRetry(() => import('./features/visa-guide/VisaGuidePage'), m => m.VisaGuidePage);
const PrivacyPolicyPage   = lazyWithRetry(() => import('./features/legal/PrivacyPolicyPage'), m => m.PrivacyPolicyPage);
const TermsPage           = lazyWithRetry(() => import('./features/legal/TermsPage'), m => m.TermsPage);
const NotFoundPage        = lazyWithRetry(() => import('./features/not-found/NotFoundPage'), m => m.NotFoundPage);

// Lazy admin pages (code-split with deployment auto-retry)
const AdminLoginPage        = lazyWithRetry(() => import('./features/admin/AdminLoginPage'), m => m.AdminLoginPage);
const AdminLockoutNoticePage = lazyWithRetry(() => import('./features/admin/AdminLockoutNoticePage'), m => m.AdminLockoutNoticePage);
const AdminLayout           = lazyWithRetry(() => import('./features/admin/AdminLayout'), m => m.AdminLayout);
const AdminDashboardPage    = lazyWithRetry(() => import('./features/admin/dashboard/AdminDashboardPage'), m => m.AdminDashboardPage);
const AdminInquiriesPage    = lazyWithRetry(() => import('./features/admin/inquiries/AdminInquiriesPage'), m => m.AdminInquiriesPage);
const AdminHospitalsPage    = lazyWithRetry(() => import('./features/admin/hospitals/AdminHospitalsPage'), m => m.AdminHospitalsPage);
const AdminSpecialtiesPage  = lazyWithRetry(() => import('./features/admin/specialties/AdminSpecialtiesPage'), m => m.AdminSpecialtiesPage);
const AdminDoctorsPage      = lazyWithRetry(() => import('./features/admin/doctors/AdminDoctorsPage'), m => m.AdminDoctorsPage);
const AdminCaseStudiesPage  = lazyWithRetry(() => import('./features/admin/case-studies/AdminCaseStudiesPage'), m => m.AdminCaseStudiesPage);
const AdminSettingsPage     = lazyWithRetry(() => import('./features/admin/settings/AdminSettingsPage'), m => m.AdminSettingsPage);
const AdminPageEditor       = lazyWithRetry(() => import('./features/admin/pages/AdminPageEditor'), m => m.AdminPageEditor);
const AdminEmailTemplatesPage = lazyWithRetry(() => import('./features/admin/email-templates/AdminEmailTemplatesPage'), m => m.AdminEmailTemplatesPage);
const AdminCampaignsPage      = lazyWithRetry(() => import('./features/admin/campaigns/AdminCampaignsPage'), m => m.AdminCampaignsPage);
const AdminMarqueePage        = lazyWithRetry(() => import('./features/admin/marquee/AdminMarqueePage'), m => m.AdminMarqueePage);

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
                    <Route path="/how-it-works"     element={<HowItWorksPage />} />
                    <Route path="/services"         element={<Navigate to="/how-it-works" replace />} />
                    <Route path="/cost-calculator"  element={<CostCalculatorPage />} />
                    <Route path="/visa-guide"       element={<Navigate to="/how-it-works" replace />} />
                    <Route path="/case-studies"     element={<CaseStudiesPage />} />
                    <Route path="/contact"          element={<ContactPage />} />
                    <Route path="/privacy"          element={<PrivacyPolicyPage />} />
                    <Route path="/terms"            element={<TermsPage />} />
                  </Route>

                  {/* Secret Admin Login Gateway */}
                  <Route path="/deven" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminLoginPage />
                    </Suspense>
                  } />

                  {/* Public Decoy / Restricted Notice for /admin/login */}
                  <Route path="/admin/login" element={
                    <Suspense fallback={<PageLoader />}>
                      <AdminLockoutNoticePage />
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
                    <Route path="marquee"         element={<AdminMarqueePage />} />
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

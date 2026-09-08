import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { CurrencyProvider } from './providers/CurrencyProvider';
import { DataProvider } from './providers/DataProvider';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { ToastProvider } from './providers/ToastProvider';
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
import { PageLoader } from './components/common/Loader';
import { IS_MAINTENANCE_MODE, isMaintenanceModeActive } from './core/config/site';
import { MaintenancePage } from './features/maintenance/MaintenancePage';


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
const DescribeNeedPage    = lazyWithRetry(() => import('./features/describe-need/DescribeNeedPage'), m => m.DescribeNeedPage);
const HowItWorksPage     = lazyWithRetry(() => import('./features/how-it-works/HowItWorksPage'), m => m.HowItWorksPage);
const ServicesPage        = lazyWithRetry(() => import('./features/services/ServicesPage'), m => m.ServicesPage);
const CaseStudiesPage     = lazyWithRetry(() => import('./features/case-studies/CaseStudiesPage'), m => m.CaseStudiesPage);
const ContactPage         = lazyWithRetry(() => import('./features/contact/ContactPage'), m => m.ContactPage);
const CostCalculatorPage  = lazyWithRetry(() => import('./features/cost-calculator/CostCalculatorPage'), m => m.CostCalculatorPage);
const VisaGuidePage       = lazyWithRetry(() => import('./features/visa-guide/VisaGuidePage'), m => m.VisaGuidePage);
const PrivacyPolicyPage   = lazyWithRetry(() => import('./features/legal/PrivacyPolicyPage'), m => m.PrivacyPolicyPage);
const TermsPage           = lazyWithRetry(() => import('./features/legal/TermsPage'), m => m.TermsPage);
const CookiePolicyPage    = lazyWithRetry(() => import('./features/legal/CookiePolicyPage'), m => m.CookiePolicyPage);
const MedicalDisclaimerPage = lazyWithRetry(() => import('./features/legal/MedicalDisclaimerPage'), m => m.MedicalDisclaimerPage);
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
const AdminSEOPage          = lazyWithRetry(() => import('./features/admin/seo/AdminSEOPage'), m => m.AdminSEOPage);
const AdminMediaPage        = lazyWithRetry(() => import('./features/admin/media/AdminMediaPage'), m => m.AdminMediaPage);
const AdminAuditPage        = lazyWithRetry(() => import('./features/admin/audit/AdminAuditPage'), m => m.AdminAuditPage);
const AdminAnalyticsPage    = lazyWithRetry(() => import('./features/admin/analytics/AdminAnalyticsPage'), m => m.AdminAnalyticsPage);
const AdminPageEditor       = lazyWithRetry(() => import('./features/admin/pages/AdminPageEditor'), m => m.AdminPageEditor);
const AdminEmailTemplatesPage = lazyWithRetry(() => import('./features/admin/email-templates/AdminEmailTemplatesPage'), m => m.AdminEmailTemplatesPage);
const AdminCampaignsPage      = lazyWithRetry(() => import('./features/admin/campaigns/AdminCampaignsPage'), m => m.AdminCampaignsPage);
const AdminMarqueePage        = lazyWithRetry(() => import('./features/admin/marquee/AdminMarqueePage'), m => m.AdminMarqueePage);

import './styles/globals.css';

function isClientPreviewActive(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('preview') === 'med360' || params.get('preview') === 'true' || params.get('bypass') === 'true') {
      localStorage.setItem('med360_client_preview', 'true');
      return true;
    }
    return localStorage.getItem('med360_client_preview') === 'true';
  } catch {
    return false;
  }
}

function ClientPreviewActivator() {
  try {
    localStorage.setItem('med360_client_preview', 'true');
  } catch {}
  return <Navigate to="/" replace />;
}

// ─── Public Layout Wrapper ────────────────────────────────────────────────────
function PublicLayout() {
  const isPreview = isClientPreviewActive();
  const maintenanceActive = isMaintenanceModeActive();

  if (maintenanceActive && !isPreview) {
    return <MaintenancePage />;
  }

  return (
    <>
      {maintenanceActive && isPreview && (
        <div style={{
          position: 'fixed',
          bottom: '16px',
          left: '16px',
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '8px 14px',
          borderRadius: '9999px',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>👁️ Client Preview Mode</span>
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.removeItem('med360_client_preview');
              } catch {}
              window.location.href = '/';
            }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              borderRadius: '9999px',
              padding: '2px 8px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            Exit
          </button>
        </div>
      )}
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
          <CurrencyProvider>
            <ToastProvider>
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
                      <Route path="/describe-need"    element={<DescribeNeedPage />} />
                      <Route path="/how-it-works"     element={<HowItWorksPage />} />
                      <Route path="/services"         element={<Navigate to="/how-it-works" replace />} />
                      <Route path="/cost-calculator"  element={<CostCalculatorPage />} />
                      <Route path="/visa-guide"       element={<Navigate to="/how-it-works" replace />} />
                      <Route path="/case-studies"     element={<CaseStudiesPage />} />
                      <Route path="/contact"          element={<ContactPage />} />
                      <Route path="/privacy"          element={<PrivacyPolicyPage />} />
                      <Route path="/terms"            element={<TermsPage />} />
                      <Route path="/cookies"          element={<CookiePolicyPage />} />
                      <Route path="/medical-disclaimer" element={<MedicalDisclaimerPage />} />
                    </Route>

                    {/* Client Preview Activation Gateway */}
                    <Route path="/preview" element={<ClientPreviewActivator />} />

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
                      <Route path="analytics"    element={<AdminAnalyticsPage />} />
                      <Route path="seo"          element={<AdminSEOPage />} />
                      <Route path="media"        element={<AdminMediaPage />} />
                      <Route path="audit-logs"   element={<AdminAuditPage />} />
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
          </ToastProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </HelmetProvider>
  </ErrorBoundary>
);
}

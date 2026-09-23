import {
  LayoutDashboard,
  Inbox,
  Building2,
  Stethoscope,
  Award,
  Settings,
  Mail,
  Megaphone,
  Home,
  HelpCircle,
  Info,
  ClipboardList,
  PhoneCall,
  ShieldCheck,
  PanelTop,
  PanelBottom,
  HardDriveDownload,
  Sliders,
  FileText,
  TrendingUp,
  Plane,
  Calculator,
  Send,
  Globe,
  Image as ImageIcon,
  Languages,
  Activity,
  Palette,
  Layers,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// ─── 1. Overview & Inquiries (Direct Front Leads) ───────────────────────────
export const CORE_NAV: NavItem[] = [
  { to: '/admin/dashboard', label: 'Command Overview', icon: LayoutDashboard },
  { to: '/admin/inquiries', label: 'Patient Leads & Inquiries', icon: Inbox },
];

// ─── 2. Medical Directory (Powers Frontend Directory) ───────────────────────
export const DIRECTORY_NAV: NavItem[] = [
  { to: '/admin/hospitals', label: 'Partner Hospitals (15)', icon: Building2 },
  { to: '/admin/specialties', label: 'Specialties & Procedures (15)', icon: Stethoscope },
  { to: '/admin/case-studies', label: 'Patient Stories', icon: Award },
];

// ─── 3. Website Content (CMS) (Powers Frontend Pages & Banners) ──────────────
export const CMS_NAV: NavItem[] = [
  { to: '/admin/pages/home', label: 'Page Copy Editor', icon: Home },
  { to: '/admin/marquee', label: 'Mission Announcement Bar', icon: Megaphone },
  { to: '/admin/email-templates', label: 'Lead Email Notifications', icon: Mail },
];

// ─── 4. Editable Pages Drawer ────────────────────────────────────────────────
export const CMS_PAGES_NAV: NavItem[] = [
  { to: '/admin/pages/home', label: 'Home Page', icon: Home },
  { to: '/admin/pages/about', label: 'About Med360', icon: Info },
  { to: '/admin/pages/how-it-works', label: 'How It Works', icon: HelpCircle },
  { to: '/admin/pages/specialties', label: 'Specialties Page', icon: Stethoscope },
  { to: '/admin/pages/hospitals', label: 'Hospitals Page', icon: Building2 },
  { to: '/admin/pages/case-studies', label: 'Case Studies Page', icon: Award },
  { to: '/admin/pages/describe-need', label: 'Describe Need Wizard', icon: ClipboardList },
  { to: '/admin/pages/contact', label: 'Contact Page', icon: PhoneCall },
  { to: '/admin/pages/header', label: 'Header Navigation', icon: PanelTop },
  { to: '/admin/pages/footer', label: 'Footer & Legal', icon: PanelBottom },
  { to: '/admin/pages/privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { to: '/admin/pages/terms', label: 'Terms of Service', icon: FileText },
];

// ─── 5. Platform Settings (Hotline, Backups, Security) ───────────────────────
export const SETTINGS_NAV: NavItem[] = [
  { to: '/admin/settings?tab=general', label: 'Hotline & Platform', icon: Sliders },
  { to: '/admin/settings?tab=backups', label: 'Database & Backups', icon: HardDriveDownload },
  { to: '/admin/settings?tab=security', label: 'Admin Security', icon: ShieldCheck },
];

// ─── 6. Extended Modules (Preserved for Future Use) ──────────────────────────
export const EXTENDED_NAV: NavItem[] = [
  { to: '/admin/analytics', label: 'Analytics & Funnel', icon: TrendingUp },
  { to: '/admin/concierge', label: 'Visa & Travel Concierge', icon: Plane },
  { to: '/admin/pricing', label: 'Procedure Pricing Matrix', icon: Calculator },
  { to: '/admin/campaigns', label: 'Email Campaigns (Nexus)', icon: Send },
  { to: '/admin/seo', label: 'SEO & Social Meta', icon: Globe },
  { to: '/admin/media', label: 'Media Asset Gallery', icon: ImageIcon },
  { to: '/admin/translations', label: 'Multi-Lingual Dictionary', icon: Languages },
  { to: '/admin/audit-logs', label: 'Activity Audit Trail', icon: Activity },
  { to: '/admin/settings?tab=themes', label: 'Themes & Branding', icon: Palette },
];

export type MenuSection = 'directory' | 'cms' | 'settings' | 'extended';

export function getSectionForPath(path: string): MenuSection | null {
  if (
    path.startsWith('/admin/hospitals') ||
    path.startsWith('/admin/specialties') ||
    path.startsWith('/admin/case-studies')
  ) {
    return 'directory';
  }
  if (
    path.startsWith('/admin/pages') ||
    path.startsWith('/admin/marquee') ||
    path.startsWith('/admin/email-templates')
  ) {
    return 'cms';
  }
  if (
    path.startsWith('/admin/analytics') ||
    path.startsWith('/admin/concierge') ||
    path.startsWith('/admin/pricing') ||
    path.startsWith('/admin/campaigns') ||
    path.startsWith('/admin/seo') ||
    path.startsWith('/admin/media') ||
    path.startsWith('/admin/translations') ||
    path.startsWith('/admin/audit-logs') ||
    path.includes('tab=themes')
  ) {
    return 'extended';
  }
  if (path.startsWith('/admin/settings')) {
    return 'settings';
  }
  return null;
}

export function getCurrentPageTitle(path: string, search: string): string {
  if (path === '/admin/dashboard') return 'Command Overview';
  if (path === '/admin/inquiries') return 'Patient Leads & Inquiries';
  if (path === '/admin/hospitals') return 'Partner Hospitals';
  if (path === '/admin/specialties') return 'Medical Specialties & Procedures';
  if (path === '/admin/case-studies') return 'Patient Stories';
  if (path === '/admin/marquee') return 'Mission Announcement Bar';
  if (path === '/admin/email-templates') return 'Lead Email Notification Templates';

  // Extended modules
  if (path === '/admin/analytics') return 'Analytics & Funnel (Extended)';
  if (path === '/admin/concierge') return 'Visa & Travel Concierge (Extended)';
  if (path === '/admin/pricing') return 'Procedure Pricing Matrix (Extended)';
  if (path === '/admin/campaigns') return 'Email Campaigns Nexus (Extended)';
  if (path === '/admin/seo') return 'SEO & Social Meta (Extended)';
  if (path === '/admin/media') return 'Media Asset Gallery (Extended)';
  if (path === '/admin/translations') return 'Multi-Lingual Dictionary (Extended)';
  if (path === '/admin/audit-logs') return 'Activity Audit Trail (Extended)';

  if (path === '/admin/settings') {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    if (tab === 'backups') return 'Settings: Database & Backups';
    if (tab === 'security') return 'Settings: Admin Security';
    if (tab === 'themes') return 'Settings: Themes & Branding (Extended)';
    return 'Settings: Hotline & Platform';
  }

  if (path.startsWith('/admin/pages/')) {
    const found = CMS_PAGES_NAV.find((p) => p.to === path);
    return found ? `CMS: ${found.label}` : 'CMS Page Copy Editor';
  }

  return 'Admin Backoffice';
}

import {
  LayoutDashboard,
  Inbox,
  Building2,
  Stethoscope,
  UserCheck,
  Award,
  Settings,
  FileText,
  PanelTop,
  PanelBottom,
  FileCode2,
  Mail,
  Send,
  HardDriveDownload,
  Palette,
  Megaphone,
  Home,
  HelpCircle,
  Info,
  Calculator,
  ClipboardList,
  PhoneCall,
  ShieldCheck,
  Globe,
  TrendingUp,
  Image as ImageIcon,
  Activity,
  Sliders,
  Power,
  Plane,
  Languages,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

// ─── 1. Top-Level Core Operations ──────────────────────────────────────────
export const CORE_NAV: NavItem[] = [
  { to: '/admin/dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
  { to: '/admin/analytics', label: 'Analytics & Funnel', icon: TrendingUp },
  { to: '/admin/inquiries', label: 'Patient Requests', icon: Inbox },
  { to: '/admin/concierge', label: 'Visa & Travel Concierge', icon: Plane },
];

// ─── 2. Medical Directory ──────────────────────────────────────────────────
export const DIRECTORY_NAV: NavItem[] = [
  { to: '/admin/hospitals', label: 'Partner Hospitals', icon: Building2 },
  { to: '/admin/specialties', label: 'Medical Specialties', icon: Stethoscope },
  { to: '/admin/doctors', label: 'Specialists & Doctors', icon: UserCheck },
  { to: '/admin/case-studies', label: 'Patient Stories', icon: Award },
  { to: '/admin/pricing', label: 'Procedure Pricing Matrix', icon: Calculator },
];

// ─── 3. Marketing & Communications ─────────────────────────────────────────
export const MARKETING_NAV: NavItem[] = [
  { to: '/admin/campaigns', label: 'Email Campaigns (Nexus)', icon: Send },
  { to: '/admin/email-templates', label: 'Email Templates', icon: Mail },
  { to: '/admin/marquee', label: 'Mission Ticker', icon: Megaphone },
];

// ─── 4. Content & Visual Assets ────────────────────────────────────────────
export const CMS_MEDIA_NAV: NavItem[] = [
  { to: '/admin/seo', label: 'SEO & Social Sharing', icon: Globe },
  { to: '/admin/media', label: 'Media & Asset Gallery', icon: ImageIcon },
  { to: '/admin/translations', label: 'Multi-Lingual Dictionary', icon: Languages },
];

// ─── 5. Pages CMS ──────────────────────────────────────────────────────────
export const CMS_PAGES_NAV: NavItem[] = [
  { to: '/admin/pages/home', label: 'Home Page', icon: Home },
  { to: '/admin/pages/about', label: 'About Med360', icon: Info },
  { to: '/admin/pages/how-it-works', label: 'How It Works', icon: HelpCircle },
  { to: '/admin/pages/specialties', label: 'Specialties Page', icon: Stethoscope },
  { to: '/admin/pages/doctors', label: 'Doctors Page', icon: UserCheck },
  { to: '/admin/pages/hospitals', label: 'Hospitals Page', icon: Building2 },
  { to: '/admin/pages/case-studies', label: 'Case Studies Page', icon: Award },
  { to: '/admin/pages/cost-calculator', label: 'Cost Calculator', icon: Calculator },
  { to: '/admin/pages/describe-need', label: 'Describe Need Wizard', icon: ClipboardList },
  { to: '/admin/pages/contact', label: 'Contact Page', icon: PhoneCall },
  { to: '/admin/pages/header', label: 'Header Navigation', icon: PanelTop },
  { to: '/admin/pages/footer', label: 'Footer & Legal', icon: PanelBottom },
  { to: '/admin/pages/privacy', label: 'Privacy Policy', icon: ShieldCheck },
  { to: '/admin/pages/terms', label: 'Terms of Service', icon: FileText },
];

// ─── 6. System & Settings Submenu ──────────────────────────────────────────
export const SETTINGS_NAV: NavItem[] = [
  { to: '/admin/settings?tab=general', label: 'General & Platform', icon: Sliders },
  { to: '/admin/settings?tab=maintenance', label: 'Maintenance & Hotline', icon: Power },
  { to: '/admin/settings?tab=themes', label: 'Themes & Branding', icon: Palette },
  { to: '/admin/settings?tab=backups', label: 'Database & Backups', icon: HardDriveDownload },
  { to: '/admin/settings?tab=security', label: 'Security & Defenses', icon: ShieldCheck },
  { to: '/admin/audit-logs', label: 'Activity Audit Trail', icon: Activity },
];

export type MenuSection = 'directory' | 'marketing' | 'cms' | 'settings';

export function getSectionForPath(path: string): MenuSection | null {
  if (
    path.startsWith('/admin/hospitals') ||
    path.startsWith('/admin/specialties') ||
    path.startsWith('/admin/doctors') ||
    path.startsWith('/admin/case-studies') ||
    path.startsWith('/admin/pricing')
  ) {
    return 'directory';
  }
  if (
    path.startsWith('/admin/campaigns') ||
    path.startsWith('/admin/email-templates') ||
    path.startsWith('/admin/marquee')
  ) {
    return 'marketing';
  }
  if (
    path.startsWith('/admin/seo') ||
    path.startsWith('/admin/media') ||
    path.startsWith('/admin/translations') ||
    path.startsWith('/admin/pages/')
  ) {
    return 'cms';
  }
  if (path.startsWith('/admin/settings') || path.startsWith('/admin/audit-logs')) {
    return 'settings';
  }
  return null;
}

export function getCurrentPageTitle(path: string, search: string): string {
  if (path === '/admin/dashboard') return 'Executive Dashboard';
  if (path === '/admin/analytics') return 'Analytics & Lead Funnel';
  if (path === '/admin/inquiries') return 'Patient Requests & Inquiries';
  if (path === '/admin/concierge') return 'Medical Visa & Travel Concierge';
  if (path === '/admin/hospitals') return 'Partner Hospitals';
  if (path === '/admin/specialties') return 'Medical Specialties';
  if (path === '/admin/doctors') return 'Specialists & Doctors';
  if (path === '/admin/case-studies') return 'Patient Stories & Clinical Outcomes';
  if (path === '/admin/pricing') return 'Procedure Pricing & Cost Matrix';
  if (path === '/admin/campaigns') return 'Email Campaigns (Nexus)';
  if (path === '/admin/email-templates') return 'Email Templates';
  if (path === '/admin/marquee') return 'Scrolling Mission Ticker';
  if (path === '/admin/seo') return 'SEO & Social Sharing';
  if (path === '/admin/media') return 'Media & Visual Asset Gallery';
  if (path === '/admin/translations') return 'Live Multi-Lingual Dictionary';
  if (path === '/admin/audit-logs') return 'Security & Activity Audit Trail';

  if (path === '/admin/settings') {
    const params = new URLSearchParams(search);
    const tab = params.get('tab');
    if (tab === 'maintenance') return 'Settings: Maintenance & Hotline';
    if (tab === 'themes') return 'Settings: Themes & Branding';
    if (tab === 'backups') return 'Settings: Database & Backups';
    if (tab === 'security') return 'Settings: Security & API Keys';
    return 'Settings: General Platform';
  }

  if (path.startsWith('/admin/pages/')) {
    const found = CMS_PAGES_NAV.find((p) => p.to === path);
    return found ? `CMS: ${found.label}` : 'CMS Page Editor';
  }

  return 'Admin Backoffice';
}

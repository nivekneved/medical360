import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import './PageHeader.css';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  badgeIcon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  badgeIcon,
  breadcrumbs,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`page-header-unified ${className}`.trim()}>
      <div className="page-header-unified__inner">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="page-header-unified__breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight size={14} />}
                  {crumb.href && !isLast ? (
                    <Link to={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span aria-current={isLast ? 'page' : undefined}>{crumb.label}</span>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        )}

        {badge && (
          <div className="page-header-unified__badge">
            {badgeIcon}
            <span>{badge}</span>
          </div>
        )}

        <div className="page-header-unified__title-row">
          <div>
            <h1 className="page-header-unified__title">{title}</h1>
            {subtitle && <p className="page-header-unified__subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="page-header-unified__actions">{actions}</div>}
        </div>
      </div>
    </header>
  );
}

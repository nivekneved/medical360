import React from 'react';
import { sanitizeInput } from '../../core/services/security.service';

export interface RichContentRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Safely renders rich HTML or Markdown text with sanitization against XSS attacks.
 */
export function RichContentRenderer({ content, className = '', style }: RichContentRendererProps) {
  if (!content) return null;

  // Basic safe sanitization
  const safeContent = sanitizeInput(content);

  return (
    <div
      className={`rich-content ${className}`.trim()}
      style={{ lineHeight: 1.6, ...style }}
      dangerouslySetInnerHTML={{ __html: safeContent }}
    />
  );
}

import React from 'react';

interface HoneypotProps {
  value: string;
  onChange: (val: string) => void;
  name?: string;
  id?: string;
}

/**
 * Reusable, inaccessible Honeypot field for anti-bot protection.
 * Invisible to human users (off-screen, zero opacity, tabindex -1),
 * but automatically filled by spambots traversing DOM input tags.
 */
export const Honeypot: React.FC<HoneypotProps> = ({
  value,
  onChange,
  name = 'website_contact_verification_hp',
  id = 'website_contact_verification_hp',
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      <label htmlFor={id} style={{ display: 'none' }}>
        Leave this field empty (Anti-spam verification)
      </label>
      <input
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none' }}
      />
    </div>
  );
};

import React, { useState } from 'react';

export type ImageFallbackCategory = 'hospital' | 'doctor' | 'specialty' | 'general';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackCategory?: ImageFallbackCategory;
  customFallbackSrc?: string;
  wrapperClassName?: string;
}

const FALLBACK_IMAGES: Record<ImageFallbackCategory, string> = {
  hospital: '/assets/hero-banner.jpg',
  doctor: '/assets/doctor-placeholder.jpg',
  specialty: '/assets/hero-banner.jpg',
  general: '/assets/hero-banner.jpg',
};

export function ImageWithFallback({
  src,
  alt,
  fallbackCategory = 'general',
  customFallbackSrc,
  className = '',
  wrapperClassName = '',
  loading = 'lazy',
  ...rest
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fallbackSrc = customFallbackSrc || FALLBACK_IMAGES[fallbackCategory] || FALLBACK_IMAGES.general;
  const imageSource = hasError || !src ? fallbackSrc : src;

  return (
    <img
      src={imageSource}
      alt={alt || ''}
      loading={loading}
      className={`${className} ${isLoaded ? 'img-loaded' : 'img-loading'}`.trim()}
      onError={() => {
        if (!hasError) {
          setHasError(true);
        }
      }}
      onLoad={() => {
        setIsLoaded(true);
      }}
      {...rest}
    />
  );
}

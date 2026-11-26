import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  category,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-100 dark:bg-slate-800 ${className}`}>
      {/* Loading Skeleton */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      )}

      {/* Styled Fallback if image fails */}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-500 dark:text-slate-400">
          <div className="w-12 h-12 mb-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium line-clamp-1">{alt || category || 'AURA Luxury'}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Authentic Item</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}
    </div>
  );
};

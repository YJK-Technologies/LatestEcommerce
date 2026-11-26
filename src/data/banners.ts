export interface BannerSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  ctaText: string;
  categoryLink: string;
  image: string;
  theme: 'dark' | 'light';
  accentColor: string;
}

export const heroBanners: BannerSlide[] = [
  {
    id: 'banner-tech',
    badge: 'GRAND TECH FESTIVAL 2026',
    title: 'Titanium Silicon. Zero Latency.',
    subtitle: 'Save up to ₹25,000 on flagship smartphones, M3 MacBooks, and high-fidelity spatial audio systems.',
    ctaText: 'Explore Tech Flagships',
    categoryLink: 'mobiles-tablets',
    image: '/assets/images/hero_tech_ecosystem_1793956751447.jpg',
    theme: 'dark',
    accentColor: '#38bdf8',
  },
  {
    id: 'banner-fashion',
    badge: 'AUTUMN / WINTER COUTURE',
    title: 'Architectural Silhouettes & Pure Cashmere',
    subtitle: 'Curated international designer runways featuring Massimo Dutti, Hugo Boss, and Mulberry silk editions.',
    ctaText: 'Shop Runway Collection',
    categoryLink: 'womens-clothing',
    image: '/assets/images/hero_luxury_fashion_1793956751196.jpg',
    theme: 'light',
    accentColor: '#4f46e5',
  },
  {
    id: 'banner-living',
    badge: 'INTERIOR ATELIER',
    title: 'Minimalist Scandinavian Craftsmanship',
    subtitle: 'Elevate your sanctuary with solid European oak, Herman Miller seating, and hand-thrown ceramic art.',
    ctaText: 'Discover Home Atelier',
    categoryLink: 'furniture',
    image: '/assets/images/hero_modern_living_1793956752667.jpg',
    theme: 'light',
    accentColor: '#d97706',
  },
  {
    id: 'banner-beauty',
    badge: 'BOTANICAL PURITY',
    title: 'Cold-Pressed Cellular Elixirs',
    subtitle: 'Nourish skin barriers with rare botanical actives from Aesop, Le Labo, and award-winning organic apothecaries.',
    ctaText: 'Explore Botanical Skincare',
    categoryLink: 'beauty-personal-care',
    image: '/assets/images/hero_beauty_wellness_1793956752417.jpg',
    theme: 'light',
    accentColor: '#059669',
  },
];

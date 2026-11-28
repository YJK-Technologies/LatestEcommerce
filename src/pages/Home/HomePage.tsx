import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/Product/ProductCard';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';


const DepartmentCategoryCard: React.FC<{
  cat: Category;
  onSelect: (cat: Category) => void;
}> = ({ cat, onSelect }) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <div
      key={cat.id}
      onClick={() => onSelect(cat)}
      className="group p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 hover:shadow-lg transition-all duration-300 text-center cursor-pointer flex flex-col items-center"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden mb-2.5 relative bg-slate-100 dark:bg-slate-800 shadow-inner group-hover:scale-105 transition-transform duration-300">
        {!isImgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse backdrop-blur-md" />
        )}
        {cat.image && (
          <img
            src={cat.image}
            alt={cat.name}
            referrerPolicy="no-referrer"
            onLoad={() => setIsImgLoaded(true)}
            onError={() => setIsImgLoaded(false)}
            className={`w-full h-full object-cover transition-all duration-500 ${isImgLoaded ? 'blur-0 opacity-100' : 'blur-md scale-110 opacity-0'
              }`}
          />
        )}
      </div>
      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
        {cat.name}
      </h3>
      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
        {(cat.productCount ?? 25)}+ Products
      </span>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const { allProducts, bannersList, categoriesList, categoriesLoading, navigate, setSelectedCategorySlug, formatPrice } = useShop();

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto rotate banner every 6 seconds
  useEffect(() => {
    if (bannersList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannersList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bannersList.length]);

  // Flash Sale Countdown simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const featuredBestSellers = allProducts.filter((p) => p.isBestSeller).slice(0, 8);
  const newArrivals = allProducts.filter((p) => p.isNewArrival || p.rating >= 4.9).slice(0, 8);
  const flashSaleItems = allProducts.filter((p) => p.discount >= 15).slice(0, 4);

  const activeBanner = bannersList[currentSlide] || bannersList[0];

  //Category Data
  const handleSelectCategory = (cat: (typeof categoriesList)[number]) => {
    setSelectedCategorySlug(cat.slug);
    navigate('products', { cat: cat.name });
  };

  const renderDepartmentCard = (cat: Category) => (
    <DepartmentCategoryCard key={cat.id} cat={cat} onSelect={handleSelectCategory} />
  );

  const renderDepartmentGridItems = () => {
    if (categoriesLoading) {
      return Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={`dept-blur-${idx}`}
          className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl mb-2.5 bg-slate-200 dark:bg-slate-800 animate-pulse blur-sm" />
          <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-800 animate-pulse mb-1" />
          <div className="h-2.5 w-14 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </div>
      ));
    }

    return categoriesList
      .filter((c) => c.status !== 'Hidden')
      .slice(0, 12)
      .map(renderDepartmentCard);
  };

  const visibleCategoriesCount = categoriesList.filter((c) => c.status !== 'Hidden').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Promotional Carousel */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="relative h-[440px] sm:h-[500px] lg:h-[560px] w-full">
          {bannersList.map((banner, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
              >
                {/* Background Hero Image with measured scrim */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/20" />

                {/* Hero Slide Content */}
                <div className="absolute inset-0 max-w-7xl mx-auto px-6 sm:px-12 flex items-center">
                  <div className="max-w-2xl text-left space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-amber-300 backdrop-blur-md text-xs font-bold uppercase tracking-widest border border-white/10">
                      <Sparkles className="w-3.5 h-3.5" />
                      {banner.badge}
                    </span>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-display text-balance">
                      {banner.title}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                      {banner.subtitle}
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedCategorySlug(banner.categoryLink);
                          navigate('products');
                        }}
                        className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer group"
                      >
                        <span>{banner.ctaText}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => navigate('offers')}
                        className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors backdrop-blur-md border border-white/20 cursor-pointer"
                      >
                        Explore Gala Offers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Slide Indicators & Arrows */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <div className="flex gap-2">
            {bannersList.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/40'
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-1.5 ml-2">
            <button
              onClick={() =>
                setCurrentSlide((prev) => (prev - 1 + bannersList.length) % bannersList.length)
              }
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 cursor-pointer transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % bannersList.length)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 cursor-pointer transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Featured Department Story Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Curated Ateliers
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Shop by Department
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>
              {categoriesLoading
                ? 'View All Categories'
                : `View All ${visibleCategoriesCount} Categories`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {renderDepartmentGridItems()}
        </div>
      </section>

      {/* Flash Sale Deal Strip with Real-Time Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-indigo-800/40 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" /> Lightning Deal
                </span>
                <span className="text-xs text-amber-300 font-semibold">Ends In:</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Today&apos;s Exclusive Flash Deals
              </h2>
              <p className="text-xs text-slate-300">
                Guaranteed lowest prices of the season on limited stock inventory.
              </p>
            </div>

            {/* Countdown Digits */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md min-w-[56px] border border-white/10">
                <span className="text-2xl font-black tabular-nums text-white">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">
                  Hours
                </span>
              </div>
              <span className="text-xl font-bold text-slate-400">:</span>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md min-w-[56px] border border-white/10">
                <span className="text-2xl font-black tabular-nums text-white">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">
                  Mins
                </span>
              </div>
              <span className="text-xl font-bold text-slate-400">:</span>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-white/10 backdrop-blur-md min-w-[56px] border border-white/10">
                <span className="text-2xl font-black tabular-nums text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">
                  Secs
                </span>
              </div>
            </div>
          </div>

          {/* Flash Sale Product Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {flashSaleItems.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Best Sellers Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Most Desired
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              Best Sellers in South Asia
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredBestSellers.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Luxury Brand Atelier Strip */}
      <section className="bg-slate-100 dark:bg-slate-900/60 py-12 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Authorized Brand Boutiques
            </span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
              Direct-Sourced Authenticity
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Every creation is backed by original international certificates, manufacturer warranty, and certified provenance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'Apple Flagship', desc: 'Authorized Reseller', count: '18 Items' },
              { name: 'Sony Bravia', desc: 'Official Electronics', count: '14 Items' },
              { name: 'Herman Miller', desc: 'Architectural Seating', count: '8 Items' },
              { name: 'Tissot Swiss', desc: 'Official Horology', count: '12 Items' },
              { name: 'Breville Atelier', desc: 'Artisanal Espresso', count: '6 Items' },
              { name: 'Tiffany & Co.', desc: 'High Jewelry', count: '5 Items' },
            ].map((brand, i) => (
              <div
                key={i}
                onClick={() => navigate('products', { q: brand.name.split(' ')[0] })}
                className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {brand.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {brand.desc}
                </div>
                <span className="inline-block mt-2 text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {brand.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Latest Releases
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display">
              New Arrivals & Special Editions
            </h2>
          </div>
          <button
            onClick={() => navigate('products')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>See New Collection</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>
    </div>
  );
};

import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductCard } from '../../components/Product/ProductCard';
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  Star,
  RotateCcw,
  Search,
  Check,
} from 'lucide-react';

export const ProductListingPage: React.FC = () => {
  const {
    allProducts,
    categoriesList,
    routeParams,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
    formatPrice,
  } = useShop();

  // View Mode: Grid or List
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<
    'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest'
  >('recommended');

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (routeParams.cat) return routeParams.cat;
    if (selectedCategorySlug) {
      const match = categoriesList.find((c) => c.slug === selectedCategorySlug);
      return match ? match.name : 'All';
    }
    return 'All';
  });

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(0);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState<boolean>(false);

  // Update selectedCategory if routeParams changed
  useEffect(() => {
    if (routeParams.cat) {
      setSelectedCategory(routeParams.cat);
    }
  }, [routeParams.cat]);

  // Extract all unique brands from products
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    allProducts.forEach((p) => brandSet.add(p.brand));
    return Array.from(brandSet).sort();
  }, [allProducts]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedCategorySlug(null);
    setSelectedBrands([]);
    setMinPrice(0);
    setMaxPrice(350000);
    setMinRating(0);
    setMinDiscount(0);
    setOnlyInStock(false);
    setOnlyFreeDelivery(false);
    setSearchQuery('');
  };

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      const q = (routeParams.q || searchQuery).trim().toLowerCase();
      if (q) {
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCat = product.category.toLowerCase().includes(q);
        const matchesTag = product.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesCat && !matchesTag) {
          return false;
        }
      }

      // Subcategory filter from routeParams
      if (routeParams.sub && product.subcategory !== routeParams.sub) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && product.rating < minRating) {
        return false;
      }

      // Discount filter
      if (minDiscount > 0 && product.discount < minDiscount) {
        return false;
      }

      // In Stock filter
      if (onlyInStock && !product.inStock) {
        return false;
      }

      // Free Delivery filter
      if (onlyFreeDelivery && !product.freeDelivery) {
        return false;
      }

      return true;
    });
  }, [
    allProducts,
    selectedCategory,
    routeParams.q,
    routeParams.sub,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    onlyInStock,
    onlyFreeDelivery,
  ]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      case 'recommended':
      default:
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
  }, [filteredProducts, sortBy]);

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedBrands.length +
    (minPrice > 0 || maxPrice < 350000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyFreeDelivery ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Render Filter Sidebar Content
  const FilterContent = (
    <div className="space-y-6 text-xs text-slate-700 dark:text-slate-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" /> Filters
          {activeFiltersCount > 0 && (
            <span className="bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </span>
        {activeFiltersCount > 0 && (
          <button
            onClick={handleClearFilters}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> Reset All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Department
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedCategorySlug(null);
            }}
            className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Departments</span>
            <span className="text-slate-400 text-[10px]">{allProducts.length}</span>
          </button>
          {categoriesList.filter((c) => c.status !== 'Hidden').map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.name);
                setSelectedCategorySlug(c.slug);
              }}
              className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                selectedCategory === c.name
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="truncate pr-1">{c.name}</span>
              <span className="text-slate-400 text-[10px] shrink-0">{c.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Price Range Slider */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Price Range
        </h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold tabular-nums text-slate-600 dark:text-slate-400">
            <span>{formatPrice(minPrice)}</span>
            <span>{formatPrice(maxPrice)}</span>
          </div>

          <input
            type="range"
            min="0"
            max="350000"
            step="5000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          {/* Quick Price Range Presets */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            {[
              { label: 'Under ₹25,000', min: 0, max: 25000 },
              { label: '₹25K - ₹75K', min: 25000, max: 75000 },
              { label: '₹75K - ₹1.5L', min: 75000, max: 150000 },
              { label: 'Above ₹1.5L', min: 150000, max: 350000 },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  setMinPrice(preset.min);
                  setMaxPrice(preset.max);
                }}
                className={`py-1 px-2 rounded-md border text-center transition-colors cursor-pointer ${
                  minPrice === preset.min && maxPrice === preset.max
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Checkboxes */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Brand Atelier
        </h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const isChecked = selectedBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="truncate">{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Customer Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((star) => (
            <button
              key={star}
              onClick={() => setMinRating(minRating === star ? 0 : star)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                minRating === star
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 font-bold'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{star}★ & above</span>
              </span>
              {minRating === star && <Check className="w-3.5 h-3.5 text-indigo-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Discount Percentage */}
      <div>
        <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
          Discount Percentage
        </h4>
        <div className="space-y-1">
          {[10, 15, 20].map((disc) => (
            <button
              key={disc}
              onClick={() => setMinDiscount(minDiscount === disc ? 0 : disc)}
              className={`w-full flex items-center justify-between px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                minDiscount === disc
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{disc}% or more</span>
              {minDiscount === disc && <Check className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles: In Stock & Free Delivery */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={onlyInStock}
            onChange={(e) => setOnlyInStock(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span>Free Express Delivery</span>
          <input
            type="checkbox"
            checked={onlyFreeDelivery}
            onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header bar: Title, Query breadcrumbs, View toggle, Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Store</span>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {selectedCategory}
            </span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  &quot;{searchQuery}&quot;
                </span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white font-display mt-1">
            {selectedCategory === 'All' ? 'Catalog Directory' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{sortedProducts.length}</strong> authenticated items
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <span>Filters ({activeFiltersCount})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 cursor-pointer"
            >
              <option value="recommended">Recommended & Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Biggest Discount %</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sticky top-28 shadow-xs">
            {FilterContent}
          </div>
        </div>

        {/* Product Cards Grid / List */}
        <div className="lg:col-span-3">
          {sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No products match your criteria
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-6">
                Try widening your price range, clearing brand selections, or searching for alternative keywords.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} viewMode="list" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  Filter Catalog
                </span>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {FilterContent}
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Apply Filters ({sortedProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

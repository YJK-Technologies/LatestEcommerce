import React from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  SlidersHorizontal,
  Trash2,
  ShoppingBag,
  Star,
  Check,
  X,
  ArrowRight,
} from 'lucide-react';

export const ComparePage: React.FC = () => {
  const {
    comparedProducts,
    removeFromCompare,
    clearCompare,
    addToCart,
    formatPrice,
    navigate,
    showToast,
  } = useShop();

  if (comparedProducts.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <SlidersHorizontal className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
          No Products Selected for Comparison
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-6">
          Compare up to 4 products across technical specifications, materials, battery endurance, and pricing.
        </p>
        <button
          onClick={() => navigate('products')}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          Explore Catalog & Compare
        </button>
      </div>
    );
  }

  // Collect all unique spec keys across compared items
  const allSpecKeys = Array.from(
    new Set(
      comparedProducts.flatMap((p) => Object.keys(p.specs || {}))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Side-by-Side Product Comparison
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Comparing {comparedProducts.length} items with technical breakdown.
          </p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
        >
          Clear All Items
        </button>
      </div>

      {/* Comparison Matrix Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
              <th className="p-4 w-44 font-bold text-slate-400 uppercase tracking-wider">
                Product Details
              </th>
              {comparedProducts.map((prod) => (
                <th key={prod.id} className="p-4 min-w-[240px] align-top">
                  <div className="space-y-3">
                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ProductImage
                        src={prod.image}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFromCompare(prod.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                        title="Remove from Compare"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                        {prod.brand}
                      </span>
                      <h4
                        onClick={() => navigate('product-detail', { id: prod.id })}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 cursor-pointer line-clamp-2"
                      >
                        {prod.title}
                      </h4>
                    </div>

                    <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {formatPrice(prod.price)}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(prod);
                        showToast('Added to Cart', `${prod.title.slice(0, 20)}... added to bag`, 'success');
                      }}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {/* Rating */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                Customer Rating
              </td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} className="p-4 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{prod.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({prod.reviewsCount.toLocaleString()})
                    </span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Department */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                Department
              </td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {prod.category} · {prod.subcategory}
                </td>
              ))}
            </tr>

            {/* Availability */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                Stock Status
              </td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} className="p-4">
                  {prod.inStock ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <Check className="w-4 h-4" /> Available ({prod.stockCount} in stock)
                    </span>
                  ) : (
                    <span className="text-rose-500 font-semibold">Out of Stock</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Delivery Estimate */}
            <tr>
              <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                Delivery Schedule
              </td>
              {comparedProducts.map((prod) => (
                <td key={prod.id} className="p-4 text-slate-700 dark:text-slate-300">
                  {prod.deliveryEstimate}
                </td>
              ))}
            </tr>

            {/* Dynamic Specs Rows */}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 font-semibold text-slate-500 bg-slate-50/50 dark:bg-slate-800/30">
                  {key}
                </td>
                {comparedProducts.map((prod) => (
                  <td key={prod.id} className="p-4 text-slate-800 dark:text-slate-200">
                    {prod.specs?.[key] || '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

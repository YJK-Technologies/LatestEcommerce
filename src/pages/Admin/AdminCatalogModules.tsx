import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Product, Category } from '../../types';
import { ProductImage } from '../../components/Common/ProductImage';
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Award,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const PRODUCTS_PER_PAGE = 10;

export const AdminProductsModule: React.FC = () => {
  const {
    allProducts,
    categoriesList,
    brandsList,
    adminAddProduct,
    adminUpdateProduct,
    adminDeleteProduct,
    formatPrice,
    showToast,
  } = useShop();

  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all');
  const [page, setPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newBrand, setNewBrand] = useState('Apple');
  const [newCategory, setNewCategory] = useState(categoriesList[0]?.name || 'Mobiles & Tablets');
  const [newSubcategory, setNewSubcategory] = useState('Flagships');
  const [newPrice, setNewPrice] = useState(49990);
  const [newOriginalPrice, setNewOriginalPrice] = useState(59990);
  const [newStock, setNewStock] = useState(18);
  const [newImage, setNewImage] = useState(
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80'
  );
  const [newDesc, setNewDesc] = useState(
    'Flagship edition crafted with aerospace-grade materials and international warranty.'
  );

  const filtered = allProducts.filter((p) => {
    if (catFilter !== 'All' && p.category !== catFilter) return false;
    if (stockFilter === 'in' && p.stockCount <= 0) return false;
    if (stockFilter === 'low' && (p.stockCount <= 0 || p.stockCount >= 10)) return false;
    if (stockFilter === 'out' && p.stockCount > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PRODUCTS_PER_PAGE,
    safePage * PRODUCTS_PER_PAGE
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const orig = Math.max(Number(newOriginalPrice), Number(newPrice));
    adminAddProduct({
      title: newTitle.trim(),
      brand: newBrand,
      category: newCategory,
      subcategory: newSubcategory || 'Premium Collection',
      price: Number(newPrice),
      originalPrice: orig,
      discount: orig > 0 ? Math.round(((orig - Number(newPrice)) / orig) * 100) : 0,
      rating: 4.8,
      reviewsCount: 1,
      inStock: Number(newStock) > 0,
      stockCount: Number(newStock),
      isNewArrival: true,
      freeDelivery: true,
      deliveryEstimate: 'Tomorrow by 1:00 PM',
      image: newImage,
      gallery: [newImage],
      description: newDesc,
      highlights: ['Certified Authentic', 'Official International Warranty', 'Insured Priority Dispatch'],
      specs: { Origin: 'Global Atelier', Warranty: '1 Year Official' },
      tags: ['Luxury', 'New Arrival', newBrand],
    });
    setIsAddOpen(false);
    setNewTitle('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const orig = Math.max(editingProduct.originalPrice, editingProduct.price);
    adminUpdateProduct({
      ...editingProduct,
      originalPrice: orig,
      discount: orig > 0 ? Math.round(((orig - editingProduct.price) / orig) * 100) : 0,
      inStock: editingProduct.stockCount > 0,
    });
    setEditingProduct(null);
  };

  const exportProductsCsv = () => {
    const header = 'ID,Title,Brand,Category,Price,OriginalPrice,Stock,Rating\n';
    const rows = filtered
      .map(
        (p) =>
          `"${p.id}","${p.title.replace(/"/g, '""')}","${p.brand}","${p.category}",${p.price},${p.originalPrice},${p.stockCount},${p.rating}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aura_catalog_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Catalog Exported', `${filtered.length} products exported to CSV`, 'success');
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search SKU, product title, brand..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            <option value="All">All Categories ({allProducts.length})</option>
            {categoriesList.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value as 'all' | 'in' | 'low' | 'out');
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium"
          >
            <option value="all">All Stock Levels</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock (&lt; 10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportProductsCsv}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No matching products found in catalog.
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                          <ProductImage
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                            {p.title}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.brand} · <span className="font-mono">{p.id}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatPrice(p.price)}
                      </div>
                      {p.discount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          -{p.discount}% off MRP
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      {p.stockCount === 0 ? (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 font-bold text-[11px]">
                          Out of Stock
                        </span>
                      ) : p.stockCount < 10 ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 font-bold text-[11px]">
                          Low ({p.stockCount})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                          {p.stockCount} units
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 tabular-nums font-semibold text-slate-700 dark:text-slate-300">
                      ★ {p.rating} ({p.reviewsCount})
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewingProduct(p)}
                          title="Inspect Details"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingProduct(p)}
                          title="Edit Product"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-600 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => adminDeleteProduct(p.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(safePage - 1) * PRODUCTS_PER_PAGE + 1}–
            {Math.min(safePage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} SKUs
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-slate-800 dark:text-slate-200 tabular-nums">
              {safePage} / {totalPages}
            </span>
            <button
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add New Catalog Product
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sony Bravia XR OLED 65-inch 4K TV"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Brand</label>
                  <select
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {brandsList.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Department / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newOriginalPrice}
                    onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Publish to Live Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Edit SKU: {editingProduct.id}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Stock Count</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingProduct.stockCount}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Category</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                  <ProductImage src={viewingProduct.image} alt={viewingProduct.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                    {viewingProduct.brand} · {viewingProduct.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {viewingProduct.title}
                  </h3>
                </div>
              </div>
              <button onClick={() => setViewingProduct(null)} className="p-1 text-slate-400 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {viewingProduct.description}
            </p>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
              <div>
                <span className="text-slate-400 block">Selling Price</span>
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  {formatPrice(viewingProduct.price)}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Inventory</span>
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  {viewingProduct.stockCount} units
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Rating</span>
                <strong className="text-slate-900 dark:text-white tabular-nums">
                  ★ {viewingProduct.rating} ({viewingProduct.reviewsCount})
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminCategoriesModule: React.FC = () => {
  const {
    categoriesList,
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,
  } = useShop();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [subcategoriesInput, setSubcategoriesInput] = useState('Flagships, Accessories, Limited');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  );

  const filtered = categoriesList.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    adminAddCategory({
      name: name.trim(),
      slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      iconName: 'Layers',
      image,
      subcategories: subcategoriesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      productCount: 0,
      status: 'Active',
    });
    setIsAddOpen(false);
    setName('');
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;
    adminUpdateCategory(editingCat);
    setEditingCat(null);
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter departments..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
          />
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((cat) => {
          const isHidden = cat.status === 'Hidden';
          return (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex gap-4 items-start"
            >
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                <ProductImage src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {cat.name}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isHidden
                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                    }`}
                  >
                    {cat.status || 'Active'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                  {cat.productCount} items · {cat.subcategories.length} subcategories
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub}
                      className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <button
                    onClick={() => setEditingCat(cat)}
                    className="font-semibold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      adminUpdateCategory({ ...cat, status: isHidden ? 'Active' : 'Hidden' })
                    }
                    className="font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
                  >
                    {isHidden ? 'Activate' : 'Hide'}
                  </button>
                  <button
                    onClick={() => adminDeleteCategory(cat.id)}
                    className="font-semibold text-rose-600 hover:underline ml-auto cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Create New Category
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smart Home & Robotics"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Subcategories (comma-separated)</label>
                <input
                  type="text"
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCat && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Edit Category
            </h3>
            <form onSubmit={handleEditSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={editingCat.name}
                  onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Subcategories (comma-separated)</label>
                <input
                  type="text"
                  value={editingCat.subcategories.join(', ')}
                  onChange={(e) =>
                    setEditingCat({
                      ...editingCat,
                      subcategories: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminBrandsModule: React.FC = () => {
  const {
    brandsList,
    categoriesList,
    adminAddBrand,
    adminToggleBrandStatus,
    adminDeleteBrand,
  } = useShop();

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categoriesList[0]?.name || 'Mobiles & Tablets');
  const [origin, setOrigin] = useState('Switzerland');
  const [featured, setFeatured] = useState(true);

  const filtered = brandsList.filter(
    (b) =>
      b.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      b.category.toLowerCase().includes(search.trim().toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    adminAddBrand({
      name: name.trim(),
      category,
      origin,
      productCount: 0,
      featured,
      status: 'Active',
    });
    setIsAddOpen(false);
    setName('');
  };

  return (
    <div className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partner brands..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
          />
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard Brand</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Primary Department</th>
                <th className="py-3 px-4">Origin</th>
                <th className="py-3 px-4">Catalog SKUs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span>{b.name}</span>
                    {b.featured && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{b.category}</td>
                  <td className="py-3 px-4 text-slate-500">{b.origin}</td>
                  <td className="py-3 px-4 tabular-nums font-semibold">{b.productCount}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => adminToggleBrandStatus(b.id)}
                      className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                    >
                      {b.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => adminDeleteBrand(b.id)}
                      className="text-rose-600 font-semibold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Onboard Authorized Brand
            </h3>
            <form onSubmit={handleAdd} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Brand Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Leica Camera"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Primary Department</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                >
                  {categoriesList.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1">Origin Country</label>
                <input
                  type="text"
                  required
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                />
                <span>Feature on Homepage Brand Showcase</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer"
                >
                  Save Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminInventoryModule: React.FC = () => {
  const { allProducts, adminUpdateProduct, formatPrice } = useShop();
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('low');
  const [search, setSearch] = useState('');

  const lowStockCount = allProducts.filter((p) => p.stockCount > 0 && p.stockCount < 10).length;
  const outStockCount = allProducts.filter((p) => p.stockCount === 0).length;
  const totalValuation = allProducts.reduce((acc, p) => acc + p.price * p.stockCount, 0);

  const visible = allProducts.filter((p) => {
    if (filter === 'low' && p.stockCount >= 10) return false;
    if (filter === 'out' && p.stockCount > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const adjustStock = (product: Product, nextStock: number) => {
    const safeStock = Math.max(0, nextStock);
    adminUpdateProduct({
      ...product,
      stockCount: safeStock,
      inStock: safeStock > 0,
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Warehouse Valuation</span>
            <Boxes className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {formatPrice(totalValuation)}
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Low Stock Alerts (&lt; 10 units)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 mt-1 tabular-nums">
            {lowStockCount} SKUs
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Out of Stock SKUs</span>
            <CheckCircle2 className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-600 mt-1 tabular-nums">
            {outStockCount} SKUs
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {[
            { id: 'low', label: `Needs Attention (< 10)` },
            { id: 'out', label: 'Out of Stock' },
            { id: 'all', label: `All Inventory (${allProducts.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'low' | 'out')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                filter === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Unit Value</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {visible.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    All SKUs in this view are adequately stocked.
                  </td>
                </tr>
              ) : (
                visible.slice(0, 30).map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      <div className="line-clamp-1 max-w-xs">{p.title}</div>
                      <span className="text-[11px] text-slate-500 font-normal">{p.brand}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{p.category}</td>
                    <td className="py-3 px-4 tabular-nums font-semibold">
                      {formatPrice(p.price)}
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        min={0}
                        value={p.stockCount}
                        onChange={(e) => adjustStock(p, Number(e.target.value))}
                        className="w-20 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold tabular-nums"
                      />
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => adjustStock(p, p.stockCount + 10)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold cursor-pointer"
                      >
                        +10 Restock
                      </button>
                      <button
                        onClick={() => adjustStock(p, p.stockCount + 25)}
                        className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-bold cursor-pointer"
                      >
                        +25
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

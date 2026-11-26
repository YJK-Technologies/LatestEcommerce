import React, { useState, useEffect } from 'react';
import { useShop } from '../../context/ShopContext';
import { ProductImage } from '../../components/Common/ProductImage';
import { ProductCard } from '../../components/Product/ProductCard';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Zap,
  SlidersHorizontal,
  Check,
  Copy,
  ChevronRight,
  MapPin,
  MessageSquare,
  ThumbsUp,
  HelpCircle,
  Plus,
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const {
    allProducts,
    routeParams,
    navigate,
    addToCart,
    cart,
    toggleWishlist,
    isInWishlist,
    addToCompare,
    isInCompare,
    addRecentlyViewed,
    formatPrice,
    showToast,
  } = useShop();

  const productId = routeParams.id || allProducts[0].id;
  const product = allProducts.find((p) => p.id === productId) || allProducts[0];

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product]);

  // Gallery Active Image
  const gallery = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);

  useEffect(() => {
    setActiveImage(gallery[0]);
  }, [product]);

  // Variant selections
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors?.[0]?.name
  );
  const [selectedStorage, setSelectedStorage] = useState<string | undefined>(
    product.storage?.[0]
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes?.[0]
  );
  const [quantity, setQuantity] = useState(1);

  // Delivery Pincode checker simulation
  const [pincode, setPincode] = useState('400026');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Write Review Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  // Sample Customer Reviews
  const [reviewsList, setReviewsList] = useState([
    {
      id: 'rev-1',
      author: 'Ananya Deshmukh',
      rating: 5,
      date: '2 days ago',
      title: 'Flawless craftsmanship, exceeded expectations',
      comment:
        'The build quality and tactile finish are incredible. Arrived impeccably sealed in tamper-proof security packaging with official warranty registration.',
      helpful: 42,
      verified: true,
    },
    {
      id: 'rev-2',
      author: 'Karan Mehra',
      rating: 5,
      date: '1 week ago',
      title: 'Top tier performance, true to specifications',
      comment:
        'Battery endurance and thermal efficiency are noticeably superior. White-glove technician arrived on time and helped calibrate initial settings.',
      helpful: 19,
      verified: true,
    },
  ]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewTitle || !newReviewComment) return;

    setReviewsList([
      {
        id: 'rev-' + Date.now(),
        author: 'Vikramaditya Roy',
        rating: newReviewRating,
        date: 'Just now',
        title: newReviewTitle,
        comment: newReviewComment,
        helpful: 0,
        verified: true,
      },
      ...reviewsList,
    ]);

    setIsReviewModalOpen(false);
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Review Submitted', 'Thank you for sharing your feedback with the AURA community', 'success');
  };

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Similar Products in same category
  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Bundle: Frequently Bought Together
  const bundleAddon = allProducts.find((p) => p.id !== product.id && p.price < 35000);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, selectedStorage);
    navigate('checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => navigate('home')}
          className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
        <button
          onClick={() => navigate('products', { cat: product.category })}
          className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
        <span className="text-slate-400 truncate max-w-[200px]">{product.subcategory}</span>
        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[280px]">
          {product.title}
        </span>
      </nav>

      {/* Primary 2-Column Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 relative group shadow-xs">
            <ProductImage
              src={activeImage}
              alt={product.title}
              category={product.category}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Quick Badge overlay */}
            <div className="absolute top-3 left-3 flex gap-2">
              {product.isBestSeller && (
                <span className="bg-slate-950/90 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs">
                  Best Seller
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  New 2026 Edition
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-600/20 scale-105 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <ProductImage src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Value Badges Strip */}
          <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs mt-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium leading-tight">
                100% Brand Certified
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium leading-tight">
                Insured Doorstep Air
              </span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-slate-600 dark:text-slate-300 font-medium leading-tight">
                10-Day Hassle Return
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header & Title */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {product.brand}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                SKU: {product.id.toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight font-display">
              {product.title}
            </h1>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-md font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
              </div>
              <a
                href="#reviews"
                className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 underline font-medium"
              >
                {product.reviewsCount.toLocaleString()} Verified Customer Reviews
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> In Stock ({product.stockCount} units available)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-base text-slate-400 line-through tabular-nums">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-md">
                  {product.discount}% Instant Savings
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Inclusive of all applicable GST & customs duties. Complimentary insured transit included.
            </p>
          </div>

          {/* Promotional & Bank Offers Accordion */}
          <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Available Privileges & Bank Offers</span>
            </div>
            <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-mono bg-white dark:bg-slate-800 border px-1.5 py-0.5 rounded text-[10px] font-bold text-indigo-600">
                  FESTIVAL50
                </span>
                <span>Get up to ₹7,500 instant discount on this item at checkout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono bg-white dark:bg-slate-800 border px-1.5 py-0.5 rounded text-[10px] font-bold text-emerald-600">
                  HDFC BANK
                </span>
                <span>Flat ₹5,000 instant cashback on HDFC Infinia / Regalia credit cards.</span>
              </li>
            </ul>
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Selected Finish: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedColor}</span>
              </span>
              <div className="flex items-center gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      selectedColor === c.name
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Storage Selection */}
          {product.storage && product.storage.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Internal Storage
              </span>
              <div className="flex gap-2">
                {product.storage.map((st) => (
                  <button
                    key={st}
                    onClick={() => setSelectedStorage(st)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedStorage === st
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Available Sizing
              </span>
              <div className="flex gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-11 h-11 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                      selectedSize === sz
                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Pincode Check */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-2">
              Delivery Destination & Availability Check
            </span>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36"
              />
              <button
                onClick={() => {
                  setPincodeChecked(true);
                  showToast('Pincode Verified', `Delivery available to ${pincode} via Express Air`, 'success');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold cursor-pointer"
              >
                Check
              </button>
            </div>
            {pincodeChecked && (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Express courier available · Estimated arrival by <strong>{product.deliveryEstimate}</strong></span>
              </p>
            )}
          </div>

          {/* Quantity Stepper & Main CTAs */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Quantity:
              </span>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() =>
                  addToCart(product, quantity, selectedColor, selectedSize, selectedStorage)
                }
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Shopping Bag
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Instant Buy Now
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-500'
                  }`}
                  title="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={() => addToCompare(product)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isCompared
                      ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
                  }`}
                  title="Compare"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications & Highlights Strip */}
      <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">
            Highlights & Craftsmanship
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
            {product.description}
          </p>

          <ul className="space-y-2 text-xs">
            {product.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2.5 text-slate-700 dark:text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">
            Technical Specifications
          </h3>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="grid grid-cols-3 p-3 bg-white dark:bg-slate-900">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
                <span className="col-span-2 font-medium text-slate-900 dark:text-white">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleAddon && (
        <div className="mt-16 p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/40">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display mb-3">
            Frequently Bought Together
          </h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ProductImage src={product.image} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <Plus className="w-4 h-4 text-slate-400" />
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <ProductImage src={bundleAddon.image} alt={bundleAddon.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Bundle Package: {product.title.slice(0, 24)}... + {bundleAddon.title.slice(0, 24)}...
                </div>
                <div className="text-slate-500 mt-0.5">
                  Save extra 5% when purchased as a bundle set
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                addToCart(product);
                addToCart(bundleAddon);
                showToast('Bundle Added', 'Both items added to shopping bag with bundle discount', 'success');
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Add Both to Bag · {formatPrice(product.price + bundleAddon.price)}
            </button>
          </div>
        </div>
      )}

      {/* Customer Reviews & Ratings */}
      <section id="reviews" className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Customer Reviews & Community Feedback
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified experiences from authenticated purchasers across South Asia.
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white transition-colors cursor-pointer"
          >
            Write a Customer Review
          </button>
        </div>

        {/* Rating Breakdown meters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-8">
          <div className="text-center md:border-r border-slate-200 dark:border-slate-800 pr-6 flex flex-col justify-center">
            <span className="text-5xl font-black text-slate-900 dark:text-white font-display">
              {product.rating}
            </span>
            <div className="flex justify-center gap-1 my-2 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <span className="text-xs text-slate-400">
              Based on {product.reviewsCount.toLocaleString()} ratings
            </span>
          </div>

          <div className="col-span-2 space-y-2 text-xs">
            {[
              { stars: 5, pct: 86 },
              { stars: 4, pct: 11 },
              { stars: 3, pct: 2 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 0 },
            ].map((bar) => (
              <div key={bar.stars} className="flex items-center gap-3">
                <span className="w-8 text-slate-500 font-semibold">{bar.stars}★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${bar.pct}%` }}
                  />
                </div>
                <span className="w-8 text-slate-400 text-right tabular-nums">{bar.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Review Cards */}
        <div className="space-y-4">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Verified Purchase
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rev.title}</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>

              <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
                <button
                  onClick={() => {
                    rev.helpful += 1;
                    showToast('Feedback noted', 'Thank you for marking this review as helpful', 'info');
                  }}
                  className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Similar Products Recommendation Slider */}
      {similarProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display mb-6">
            Similar Masterpieces in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-1">
              Write a Verified Customer Review
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share details about build quality, performance, and day-to-day use.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Overall Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className="cursor-pointer p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReviewRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Headline / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Exceptional titanium finish and audio stage"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-slate-700 dark:text-slate-300">
                  Detailed Experience
                </label>
                <textarea
                  rows={4}
                  placeholder="What did you like or dislike? How does it perform?"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

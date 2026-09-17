import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  Star,
  Plus,
  Minus,
  Trash2,
  Coins,
  ShieldCheck,
  CheckCircle,
  Truck,
  Sparkles,
  Heart,
  Eye,
  X,
  ArrowRight,
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface EcommerceShopProps {
  products: Product[];
  cart: CartItem[];
  petCoins: number;
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onDeductCoins: (amount: number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

export const EcommerceShop: React.FC<EcommerceShopProps> = ({
  products,
  cart,
  petCoins,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onDeductCoins,
  isCartOpen,
  setIsCartOpen,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPetType, setSelectedPetType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [coinsToRedeem, setCoinsToRedeem] = useState<number>(0);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const [orderId, setOrderId] = useState('');

  const categories = [
    { id: 'all', label: 'All Pet Essentials' },
    { id: 'food', label: 'Nutrition & Food' },
    { id: 'medicine', label: 'Pharmacy & Care' },
    { id: 'clothes', label: 'Apparel & Outfits' },
    { id: 'toys', label: 'Interactive Toys' },
    { id: 'grooming', label: 'Spas & Grooming' },
    { id: 'accessories', label: 'Beds & Gear' },
  ];

  const petTypes = [
    { id: 'all', label: 'All Pets' },
    { id: 'dog', label: 'Dogs' },
    { id: 'cat', label: 'Cats' },
  ];

  // Filtering
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPetType = selectedPetType === 'all' || item.petType === 'all' || item.petType === selectedPetType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPetType && matchesSearch;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const maxRedeemableCoins = Math.min(petCoins, Math.floor(cartSubtotal * 0.5)); // Up to 50% paid in coins, 1 coin = ₹1
  const coinDiscount = Math.min(cartSubtotal, coinsToRedeem);
  const shippingFee = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 49;
  const grandTotal = Math.max(0, cartSubtotal - coinDiscount + (cartSubtotal > 0 ? shippingFee : 0));

  const handleApplyCoins = (amount: number) => {
    setCoinsToRedeem(Math.min(amount, maxRedeemableCoins));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (coinsToRedeem > 0) {
      onDeductCoins(coinsToRedeem);
    }
    const newOrderId = `PWR-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(newOrderId);
    setCheckoutStep('success');
  };

  const handleFinishOrder = () => {
    onClearCart();
    setCoinsToRedeem(0);
    setCheckoutStep('cart');
    setIsCartOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Banner with Perks */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Petwrld Official Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Premium Food, Pharmacy, Outfits & Play
          </h1>
          <p className="text-sm text-amber-100 leading-relaxed">
            Curated by licensed veterinarians and delivered fast. Earn <strong className="text-white">PetCoins</strong> by playing daily quizzes in the Wiki tab to redeem real cash discounts at checkout!
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <Truck className="w-4 h-4 text-amber-300" />
              <span>Free delivery across India over ₹499</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Genuine Vet Formulations</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg">
              <Coins className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>1 PetCoin = ₹1 Discount</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kibble, jackets, flea medicine, toys..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden"
            />
          </div>

          {/* Pet Type Filter */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto">
            {petTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedPetType(type.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedPetType === type.id
                    ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs border border-stone-200 rounded-lg px-2.5 py-1.5 bg-white text-stone-700 outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="featured">Featured & Best Matches</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-stone-100 pt-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white font-semibold shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-stone-500 text-sm">No pet products found matching your search or filters.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedPetType('all');
              setSearchQuery('');
            }}
            className="text-xs text-amber-700 font-semibold underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                    {product.badge}
                  </span>
                )}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="absolute bottom-2.5 right-2.5 bg-white/90 hover:bg-white text-stone-700 p-1.5 rounded-lg shadow-xs transition-colors"
                  title="Quick View"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                    <span className="capitalize">{product.category}</span>
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                      <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-xs text-stone-900 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-stone-900">₹{product.price.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">In Stock • Fast Dispatch</div>
                  </div>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.name}
                className="w-full sm:w-44 h-44 object-cover rounded-xl border border-stone-200"
              />
              <div className="space-y-2 flex-1">
                <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                  {selectedProduct.category}
                </span>
                <h3 className="text-sm font-bold text-stone-900">{selectedProduct.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-stone-400">({selectedProduct.reviewsCount} verified reviews)</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{selectedProduct.description}</p>
                <div className="text-xl font-black text-stone-900 pt-2">₹{selectedProduct.price.toLocaleString('en-IN')}</div>
                <button
                  onClick={() => {
                    onAddToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full mt-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer / Slide-over */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
            {/* Cart Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-stone-900 text-sm">Your Petwrld Cart</h2>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <p className="text-xs text-stone-500">Your shopping cart is currently empty.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-xs font-semibold text-amber-700 underline"
                      >
                        Explore pet products
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div
                            key={item.product.id}
                            className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 bg-stone-50/50"
                          >
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-14 h-14 object-cover rounded-lg border border-stone-200"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-semibold text-stone-900 truncate">
                                {item.product.name}
                              </h4>
                              <div className="text-xs text-stone-500 mt-0.5">
                                ₹{item.product.price.toLocaleString('en-IN')}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                  className="w-5 h-5 rounded-md bg-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-300"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-5 h-5 rounded-md bg-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-300"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-stone-900">
                                ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                              </div>
                              <button
                                onClick={() => onRemoveFromCart(item.product.id)}
                                className="text-rose-500 hover:text-rose-700 text-xs p-1 mt-2"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* PetCoins Redemption Box */}
                      <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-amber-900">
                            <Coins className="w-4 h-4 text-amber-600 fill-amber-600" />
                            <span>Apply PetCoins Discount</span>
                          </div>
                          <span className="text-amber-800 font-semibold">{petCoins} Available</span>
                        </div>
                        <p className="text-[11px] text-amber-700">
                          Redeem up to {maxRedeemableCoins} coins for ₹{maxRedeemableCoins} instant discount!
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max={maxRedeemableCoins}
                            step="10"
                            value={coinsToRedeem}
                            onChange={(e) => setCoinsToRedeem(Number(e.target.value))}
                            className="flex-1 accent-amber-600"
                          />
                          <span className="text-xs font-bold text-amber-900 w-12 text-right">
                            {coinsToRedeem} 🪙
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1 border-t border-amber-200/60">
                          <span className="text-amber-800">Discount applied:</span>
                          <span className="font-extrabold text-emerald-700">-₹{coinDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {checkoutStep === 'shipping' && (
                <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Delivery & Contact Details
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      defaultValue="Aarav Sharma"
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      defaultValue="Flat 402, Lotus Heights, Indiranagar"
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">City / Pincode</label>
                      <input
                        type="text"
                        defaultValue="Bengaluru, 560038"
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">Phone for Delivery</label>
                      <input
                        type="text"
                        defaultValue="+91 98765 43210"
                        className="w-full text-xs p-2.5 border border-stone-300 rounded-lg outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-stone-800">Delivery Method:</div>
                    <div className="text-stone-600">Standard Petwrld Express Courier (1-2 Business Days)</div>
                  </div>
                </form>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-black text-stone-900">Order Confirmed!</h3>
                  <p className="text-xs text-stone-600">
                    Order <strong className="text-stone-900">{orderId}</strong> is placed and being prepared by our pet warehouse.
                  </p>
                  {coinsToRedeem > 0 && (
                    <div className="text-xs bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-lg">
                      Applied {coinsToRedeem} PetCoins (-₹{coinDiscount.toLocaleString('en-IN')} savings)!
                    </div>
                  )}
                  <button
                    onClick={handleFinishOrder}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Cart Footer */}
            {checkoutStep !== 'success' && cart.length > 0 && (
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
                <div className="space-y-1.5 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-stone-900">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {coinDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>PetCoins Discount</span>
                      <span>-₹{coinDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-stone-900 pt-1 border-t border-stone-200">
                    <span>Total Due</span>
                    <span>₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('shipping')}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Shipping</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                    >
                      Back
                    </button>
                    <button
                      form="checkout-form"
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      Confirm & Pay (₹{grandTotal.toLocaleString('en-IN')})
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

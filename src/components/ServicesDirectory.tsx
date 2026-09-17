import React, { useState } from 'react';
import {
  Search,
  Building2,
  GraduationCap,
  Scissors,
  Home,
  ShieldAlert,
  ShoppingBag,
  Star,
  CheckCircle,
  MapPin,
  Phone,
  Percent,
  Calculator,
  X,
  Send,
  Sparkles,
} from 'lucide-react';
import { DirectoryListing, PetProfile } from '../types';

interface ServicesDirectoryProps {
  listings: DirectoryListing[];
  activePet?: PetProfile;
}

export const ServicesDirectory: React.FC<ServicesDirectoryProps> = ({
  listings,
  activePet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState<DirectoryListing | null>(null);
  const [inquirySent, setInquirySent] = useState(false);

  // Insurance Calculator state
  const [insurancePetSpecies, setInsurancePetSpecies] = useState('dog');
  const [insurancePetAge, setInsurancePetAge] = useState('2');
  const [insuranceCoverage, setInsuranceCoverage] = useState<'essential' | 'comprehensive' | 'platinum'>('comprehensive');

  const categories = [
    { id: 'all', label: 'All Services', icon: Building2 },
    { id: 'kennel', label: 'Kennels & Boarding', icon: Home },
    { id: 'trainer', label: 'Trainers & Dog Schools', icon: GraduationCap },
    { id: 'groomer', label: 'Groomers', icon: Scissors },
    { id: 'pet_sitter', label: 'Pet Sitters', icon: Home },
    { id: 'airbnb_landlord', label: 'Pet-Friendly Airbnbs & Rentals', icon: Home },
    { id: 'pet_shop', label: 'Local Pet Shops', icon: ShoppingBag },
    { id: 'insurance', label: 'Pet Insurance', icon: ShieldAlert },
  ];

  const filteredListings = listings.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const calculateInsuranceQuote = () => {
    let base = insurancePetSpecies === 'dog' ? 599 : 399;
    const ageNum = parseInt(insurancePetAge, 10) || 2;
    base += ageNum * 50;
    if (insuranceCoverage === 'comprehensive') base += 250;
    if (insuranceCoverage === 'platinum') base += 500;
    return base;
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setInquirySent(false);
      setSelectedListing(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Commission Model Highlight */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-amber-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Percent className="w-3.5 h-3.5 text-amber-300" />
            <span>Commission-Based Partner Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Kennels, Trainers, Airbnbs, Sitters & Insurance
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Discover verified pet businesses near you. Whether you need overnight dog boarding, certified behavioral trainers, pet-welcoming landlords & vacation Airbnbs, or comprehensive health insurance — booked securely with verified pet protection.
          </p>
        </div>
      </div>

      {/* Interactive Pet Insurance Calculator Card */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Instant Pet Insurance Quote Estimator
              </h3>
              <p className="text-xs text-stone-500">
                Underwritten by top pet health underwriters with direct vet bill reimbursement
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-amber-800">Estimated Premium</div>
            <div className="text-2xl font-black text-amber-900">₹{calculateInsuranceQuote().toLocaleString('en-IN')} / month</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">Pet Species</label>
            <select
              value={insurancePetSpecies}
              onChange={(e) => setInsurancePetSpecies(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
            >
              <option value="dog">Dog (Canine)</option>
              <option value="cat">Cat (Feline)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">Pet Age (Years)</label>
            <select
              value={insurancePetAge}
              onChange={(e) => setInsurancePetAge(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
            >
              <option value="1">Puppy / Kitten (0-1 yr)</option>
              <option value="2">Young Adult (2-4 yrs)</option>
              <option value="5">Adult (5-7 yrs)</option>
              <option value="8">Senior (8+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 mb-1">Coverage Tier</label>
            <select
              value={insuranceCoverage}
              onChange={(e) => setInsuranceCoverage(e.target.value as any)}
              className="w-full text-xs p-2 rounded-lg border border-amber-300 bg-white"
            >
              <option value="essential">Essential (70% Reimbursement, ₹2,00,000 limit)</option>
              <option value="comprehensive">Comprehensive (80% Reimbursement, ₹5,00,000 limit)</option>
              <option value="platinum">Platinum (90% Reimbursement, Unlimited)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search boarding kennels, certified trainers, Airbnbs in Lake Tahoe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white font-bold shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredListings.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md">
                  {item.category.replace('_', ' ').toUpperCase()}
                </div>
                {item.verified && (
                  <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900">{item.priceRange}</span>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{item.rating}</span>
                    <span className="text-stone-400">({item.reviewsCount})</span>
                  </div>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Commission Model Badge */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-amber-900 flex items-center justify-between">
                  <span>Commission Model:</span>
                  <span className="font-bold text-amber-800">{item.commissionRate}</span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                onClick={() => setSelectedListing(item)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Book or Inquire Host</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking / Inquiry Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!inquirySent ? (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700">
                    Partner Service Inquiry & Booking
                  </span>
                  <h3 className="text-sm font-bold text-stone-900">{selectedListing.title}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">{selectedListing.location}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Service Fee / Rates:</span>
                    <strong className="text-stone-900">{selectedListing.priceRange}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Commission Policy:</span>
                    <span className="text-amber-800 font-semibold">{selectedListing.commissionRate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Pet Guest:</span>
                    <strong className="text-stone-900">{activePet?.name || 'Milo'} ({activePet?.breed})</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Check-in / Start Date</label>
                    <input
                      type="date"
                      required
                      defaultValue="2026-10-01"
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Duration / Days</label>
                    <input
                      type="number"
                      min="1"
                      defaultValue="3"
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Special notes for host / facility
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g., Any feeding routines, compatibility with other dogs, medication needs..."
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Booking Request (Zero Upfront Charge)</span>
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Booking Inquiry Sent!</h4>
                <p className="text-xs text-stone-600">
                  The host / service provider has received your reservation request for{' '}
                  <strong>{activePet?.name || 'Milo'}</strong>. You will receive an SMS and email confirmation within 2 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

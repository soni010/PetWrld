import React, { useState } from 'react';
import {
  PawPrint,
  ShoppingCart,
  Sparkles,
  ChevronDown,
  Plus,
  Compass,
  Stethoscope,
  Camera,
  MessageSquare,
  CreditCard,
  Building2,
  HeartHandshake,
  Trophy,
  Plane,
  BookOpen,
  User,
} from 'lucide-react';
import { PetProfile, UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pets: PetProfile[];
  activePetId: string;
  setActivePetId: (id: string) => void;
  petCoins?: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSOS: () => void;
  onOpenAIChat: () => void;
  onOpenAddPet: () => void;
  currentUser: UserAccount | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  pets,
  activePetId,
  setActivePetId,
  cartCount,
  onOpenCart,
  onOpenAIChat,
  onOpenAddPet,
  currentUser,
}) => {
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  const navItems = [
    { id: 'shop', label: 'E-Commerce', icon: Compass },
    { id: 'vet', label: 'Vet & Booking', icon: Stethoscope },
    { id: 'petgram', label: 'Petgram', icon: Camera },
    { id: 'preddit', label: 'Preddit', icon: MessageSquare },
    { id: 'pet-id', label: 'Pet ID', icon: CreditCard },
    { id: 'directory', label: 'Directory', icon: Building2 },
    { id: 'ngo-ambulance', label: 'NGO & 24/7 SOS', icon: HeartHandshake },
    { id: 'events', label: 'Events & Races', icon: Trophy },
    { id: 'relocation', label: 'Relocation & Chip', icon: Plane },
    { id: 'wiki-quiz', label: 'Wiki & Quiz', icon: BookOpen, badge: 'Win 🪙' },
    {
      id: 'account',
      label: currentUser ? 'My Account' : 'Login / Register',
      icon: User,
      badge: !currentUser ? 'New' : undefined,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-home-btn"
            onClick={() => setActiveTab('shop')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-stone-900">Petwrld</span>
            </div>
          </button>
        </div>

        {/* Right Side Controls: Active Pet Selector, Cart, AI */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Pet Switcher */}
          <div className="relative">
            <button
              id="pet-switcher-btn"
              onClick={() => setPetDropdownOpen(!petDropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium transition-colors"
            >
              <img
                src={activePet.avatarUrl}
                alt={activePet.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-amber-400"
              />
              <span className="hidden sm:inline font-semibold">{activePet.name}</span>
              <span className="text-[10px] text-stone-500 hidden md:inline">({activePet.breed})</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {petDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  Select Active Pet
                </div>
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setActivePetId(pet.id);
                      setPetDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left hover:bg-stone-50 transition-colors ${
                      pet.id === activePetId ? 'bg-amber-50 text-amber-900 font-semibold' : 'text-stone-700'
                    }`}
                  >
                    <img src={pet.avatarUrl} alt={pet.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-stone-900">{pet.name}</div>
                      <div className="text-[10px] text-stone-500">
                        {pet.breed} • {pet.petIdCode}
                      </div>
                    </div>
                  </button>
                ))}
                <div className="border-t border-stone-100 mt-1 pt-1 px-1.5">
                  <button
                    onClick={() => {
                      setPetDropdownOpen(false);
                      onOpenAddPet();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Pet</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                id="header-account-btn"
                onClick={() => setActiveTab('account')}
                title={`Logged in as ${currentUser.owner.name} (${currentUser.email})`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                  activeTab === 'account'
                    ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-black text-[10px]">
                  {currentUser.owner.name.charAt(0)}
                </div>
                <span className="hidden md:inline">{currentUser.owner.name.split(' ')[0]}</span>
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => setActiveTab('account')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-xs"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative p-2 rounded-lg text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Ask AI Vet Assistant */}
          <button
            id="header-ai-chat-btn"
            onClick={onOpenAIChat}
            className="hidden sm:inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Pet Care</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar / Tabs */}
      <nav className="border-t border-stone-200 bg-stone-50/80 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { EcommerceShop } from './components/EcommerceShop';
import { VetBooking } from './components/VetBooking';
import { PetCommunity } from './components/PetCommunity';
import { Petgram } from './components/Petgram';
import { Preddit } from './components/Preddit';
import { PetIDPassport } from './components/PetIDPassport';
import { ServicesDirectory } from './components/ServicesDirectory';
import { NgoAndAmbulance } from './components/NgoAndAmbulance';
import { PetEvents } from './components/PetEvents';
import { RelocationMicrochip } from './components/RelocationMicrochip';
import { PetWikiAndQuiz } from './components/PetWikiAndQuiz';
import { EmergencySOSModal } from './components/EmergencySOSModal';
import { AIChatModal } from './components/AIChatModal';
import { AddPetModal } from './components/AddPetModal';

import {
  INITIAL_PETS,
  INITIAL_PRODUCTS,
  INITIAL_VETS,
  INITIAL_APPOINTMENTS,
  INITIAL_PETGRAM_POSTS,
  INITIAL_FORUM_POSTS,
  INITIAL_DIRECTORY_LISTINGS,
  INITIAL_NGO_INITIATIVES,
  INITIAL_ADOPTABLE_PETS,
  INITIAL_EVENTS,
  INITIAL_WIKI_ARTICLES,
  INITIAL_QUIZ,
} from './data/initialData';

import {
  PetProfile,
  Product,
  CartItem,
  BookingAppointment,
  PetgramPost,
  ForumPost,
} from './types';
import { Heart, Siren, Bot, Shield, Phone, Sparkles, Coins } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('shop');

  // Pet Profiles State
  const [pets, setPets] = useState<PetProfile[]>(INITIAL_PETS);
  const [activePetId, setActivePetId] = useState<string>(INITIAL_PETS[0].id);
  const activePet = pets.find((p) => p.id === activePetId) || pets[0];

  // E-Commerce & Gamification Coins State
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
    },
  ]);
  const [petCoins, setPetCoins] = useState<number>(250);

  // Appointments & Community State
  const [appointments, setAppointments] = useState<BookingAppointment[]>(INITIAL_APPOINTMENTS);
  const [petgramPosts, setPetgramPosts] = useState<PetgramPost[]>(INITIAL_PETGRAM_POSTS);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);

  // Global Modals State
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAddPetOpen, setIsAddPetOpen] = useState<boolean>(false);

  // E-Commerce Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleDeductCoins = (amount: number) => {
    setPetCoins((prev) => Math.max(0, prev - amount));
  };

  const handleAddCoins = (amount: number) => {
    setPetCoins((prev) => prev + amount);
  };

  // Appointment & Health Handlers
  const handleAddAppointment = (appointment: BookingAppointment) => {
    setAppointments((prev) => [appointment, ...prev]);
  };

  // Pet Profile Handlers
  const handleAddPet = (newPet: PetProfile) => {
    setPets((prev) => [...prev, newPet]);
    setActivePetId(newPet.id);
  };

  const handleUpdatePet = (updatedPet: PetProfile) => {
    setPets((prev) =>
      prev.map((p) => (p.id === updatedPet.id ? updatedPet : p))
    );
  };

  // Community Handlers
  const handleAddPetgramPost = (post: PetgramPost) => {
    setPetgramPosts((prev) => [post, ...prev]);
  };

  const handleAddForumPost = (post: ForumPost) => {
    setForumPosts((prev) => [post, ...prev]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-amber-200 selection:text-amber-900">
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pets={pets}
        activePetId={activePetId}
        setActivePetId={setActivePetId}
        petCoins={petCoins}
        cartCount={cartCount}
        onOpenCart={() => {
          setActiveTab('shop');
          setIsCartOpen(true);
        }}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenAddPet={() => setIsAddPetOpen(true)}
      />

      {/* Main Feature View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Feature 1: E-Commerce */}
        {activeTab === 'shop' && (
          <EcommerceShop
            products={INITIAL_PRODUCTS}
            cart={cart}
            petCoins={petCoins}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onDeductCoins={handleDeductCoins}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
          />
        )}

        {/* Feature 2: Online Vet & Spa / Vaccine Booking */}
        {activeTab === 'vet' && (
          <VetBooking
            vets={INITIAL_VETS}
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            activePet={activePet}
          />
        )}

        {/* Feature 3A: Petgram - Pet Social Media */}
        {activeTab === 'petgram' && (
          <Petgram
            posts={petgramPosts}
            onAddPost={handleAddPetgramPost}
            activePet={activePet}
          />
        )}

        {/* Feature 3B: Preddit - Pet Reddit Community Discussions */}
        {activeTab === 'preddit' && (
          <Preddit
            posts={forumPosts}
            onAddPost={handleAddForumPost}
            activePet={activePet}
          />
        )}

        {/* Unified Community (if navigated) */}
        {activeTab === 'community' && (
          <PetCommunity
            petgramPosts={petgramPosts}
            forumPosts={forumPosts}
            onAddPetgramPost={handleAddPetgramPost}
            onAddForumPost={handleAddForumPost}
            activePet={activePet}
          />
        )}

        {/* Feature 4: Unique Pet ID Passport & Reminders */}
        {activeTab === 'pet-id' && (
          <PetIDPassport
            pet={activePet}
            allPets={pets}
            onSelectPet={(id) => setActivePetId(id)}
            onOpenAddPet={() => setIsAddPetOpen(true)}
            onUpdatePet={handleUpdatePet}
          />
        )}

        {/* Feature 5: Commission-based Directory */}
        {activeTab === 'directory' && (
          <ServicesDirectory
            listings={INITIAL_DIRECTORY_LISTINGS}
            activePet={activePet}
          />
        )}

        {/* Feature 6: NGO Ties & 24/7 Ambulance Services */}
        {activeTab === 'ngo-ambulance' && (
          <NgoAndAmbulance
            initiatives={INITIAL_NGO_INITIATIVES}
            adoptablePets={INITIAL_ADOPTABLE_PETS}
            onOpenSOS={() => setIsSOSOpen(true)}
            activePet={activePet}
          />
        )}

        {/* Feature 7: Pet Events, Races, Jumps & Fashion Shows */}
        {activeTab === 'events' && (
          <PetEvents events={INITIAL_EVENTS} activePet={activePet} />
        )}

        {/* Feature 8: Microchipping & Relocation Services */}
        {activeTab === 'relocation' && (
          <RelocationMicrochip activePet={activePet} />
        )}

        {/* Feature 9: Pet Wiki, Fun Facts & Coin Quizzes */}
        {activeTab === 'wiki-quiz' && (
          <PetWikiAndQuiz
            wikiArticles={INITIAL_WIKI_ARTICLES}
            quizQuestions={INITIAL_QUIZ}
            petCoins={petCoins}
            onAddCoins={handleAddCoins}
            onNavigateToShop={() => setActiveTab('shop')}
          />
        )}
      </main>

      {/* Floating Quick-Action Bar */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2.5">
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="bg-stone-900 hover:bg-stone-800 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-stone-700 transition-all hover:scale-105"
          title="Ask Petwrld AI Concierge"
        >
          <Bot className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold hidden sm:inline">Ask AI Concierge</span>
        </button>

        <button
          onClick={() => setIsSOSOpen(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2 transition-all hover:scale-105 animate-pulse"
          title="24/7 Veterinary Emergency SOS"
        >
          <Siren className="w-5 h-5" />
          <span className="text-xs font-black hidden sm:inline">24/7 Ambulance SOS</span>
        </button>
      </div>

      {/* Global Modals */}
      <EmergencySOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        activePet={activePet}
      />

      <AIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        activePet={activePet}
      />

      <AddPetModal
        isOpen={isAddPetOpen}
        onClose={() => setIsAddPetOpen(false)}
        onAddPet={handleAddPet}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black">
                  🐾
                </div>
                <span className="text-xl font-black text-white tracking-tight">Petwrld</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                The all-in-one startup ecosystem for pets and pet parents. E-commerce, tele-vets, the #1 pet social community, unique Pet ID records, 24/7 ambulance response, NGO adoption drives, and global travel.
              </p>
              <div className="text-xs text-amber-400 font-medium">
                Emergency Dispatch: 1-800-PET-WRLD
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-stone-200 tracking-wider mb-3">
                Healthcare & Safety
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('vet')} className="hover:text-amber-400">
                    Online Vet Teleconsult
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('pet-id')} className="hover:text-amber-400">
                    Pet ID Digital Passport
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsSOSOpen(true)} className="hover:text-rose-400">
                    24/7 Rapid Ambulance SOS
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('relocation')} className="hover:text-amber-400">
                    ISO 11784 Microchip Lookup
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-stone-200 tracking-wider mb-3">
                Community & Lifestyle
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('community')} className="hover:text-amber-400">
                    Petgram & Reddit-style Forum
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('events')} className="hover:text-amber-400">
                    Grand Sprint Races & Galas
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-amber-400">
                    Pet-Friendly Airbnbs & Kennels
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('ngo-ambulance')} className="hover:text-amber-400">
                    NGO Sterilization & Adoptions
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs uppercase font-bold text-stone-200 tracking-wider mb-3">
                Shop & Rewards
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('shop')} className="hover:text-amber-400">
                    Petwrld E-Commerce Store
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('wiki-quiz')} className="hover:text-amber-400">
                    Daily Trivia (Earn PetCoins 🪙)
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('directory')} className="hover:text-amber-400">
                    Instant Insurance Quote
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsAIChatOpen(true)} className="hover:text-amber-400">
                    AI Symptom Checker
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-3">
            <div>© {new Date().getFullYear()} Petwrld Startup Inc. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>ISO 11784/11785 Verified</span>
              <span>•</span>
              <span>24/7 Mobile ICU Ready</span>
              <span>•</span>
              <span>Veterinary Telemedicine Certified</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

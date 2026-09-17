import React, { useState } from 'react';
import {
  Plane,
  Radio,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Shield,
  Box,
  Scale,
  Sparkles,
  MapPin,
  Calendar,
  Send,
  X,
  Compass,
} from 'lucide-react';
import { PetProfile } from '../types';

interface RelocationMicrochipProps {
  activePet?: PetProfile;
}

export const RelocationMicrochip: React.FC<RelocationMicrochipProps> = ({ activePet }) => {
  const [activeTab, setActiveTab] = useState<'microchip' | 'relocation'>('relocation');

  // Microchip Lookup State
  const [chipSearchInput, setChipSearchInput] = useState(
    activePet?.microchipNumber || '985141002938192'
  );
  const [chipLookupResult, setChipLookupResult] = useState<{
    found: boolean;
    chipNumber: string;
    petName: string;
    species: string;
    owner: string;
    contact: string;
    registry: string;
    status: string;
  } | null>({
    found: true,
    chipNumber: activePet?.microchipNumber || '985141002938192',
    petName: activePet?.name || 'Milo',
    species: activePet?.species || 'Dog',
    owner: activePet?.ownerName || 'Sarah Jenkins',
    contact: activePet?.emergencyContact || '+1 (555) 234-8910',
    registry: 'Global ISO 11784/11785 National Companion Animal Database',
    status: 'Verified Active & Safeguarded',
  });

  // Lost Pet Alert State
  const [amberAlertSent, setAmberAlertSent] = useState(false);

  // Relocation Flight Crate Calculator
  const [petLengthCm, setPetLengthCm] = useState<number>(75);
  const [petHeightCm, setPetHeightCm] = useState<number>(55);
  const [travelOrigin, setTravelOrigin] = useState('San Francisco (SFO)');
  const [travelDestination, setTravelDestination] = useState('London Heathrow (LHR)');
  const [travelQuoteSent, setTravelQuoteSent] = useState(false);

  // Calculation of IATA crate dimensions
  // Length: A + 1/2 B; Width: C x 2; Height: D
  const crateMinLength = Math.round(petLengthCm + 15);
  const crateMinHeight = Math.round(petHeightCm + 8);
  const recommendedCrate =
    crateMinLength > 100
      ? 'IATA Series 700 (Giant / 48")'
      : crateMinLength > 85
      ? 'IATA Series 500 (Extra Large / 40")'
      : crateMinLength > 70
      ? 'IATA Series 400 (Intermediate / 36")'
      : 'IATA Series 200 (Medium / 28")';

  const handleChipSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (chipSearchInput.length >= 10) {
      setChipLookupResult({
        found: true,
        chipNumber: chipSearchInput,
        petName: activePet?.name || 'Milo',
        species: activePet?.species || 'Dog',
        owner: activePet?.ownerName || 'Sarah Jenkins',
        contact: activePet?.emergencyContact || '+1 (555) 234-8910',
        registry: 'Petwrld ISO 11784 Global Microchip Network',
        status: 'Active Registered Guard',
      });
    } else {
      setChipLookupResult(null);
    }
  };

  const handleTriggerAmberAlert = () => {
    setAmberAlertSent(true);
    setTimeout(() => setAmberAlertSent(false), 5000);
  };

  const handleTravelQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setTravelQuoteSent(true);
    setTimeout(() => setTravelQuoteSent(false), 4000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-indigo-800 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Radio className="w-3.5 h-3.5 text-cyan-200" />
            <span>International Compliance & Safety</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Microchipping Services & Global Pet Relocation
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
            Verify ISO 15-digit microchip identification, activate community lost-pet amber alerts, and plan stress-free domestic or international flights with door-to-door concierge assistance.
          </p>
        </div>
      </div>

      {/* Main Switcher */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
        <button
          onClick={() => setActiveTab('relocation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'relocation'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Plane className="w-4 h-4 text-cyan-400" />
          <span>Pet Relocation & Flight Concierge</span>
        </button>

        <button
          onClick={() => setActiveTab('microchip')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'microchip'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Radio className="w-4 h-4 text-amber-400" />
          <span>ISO Microchip Registry & Amber Alert</span>
        </button>
      </div>

      {/* 1. RELOCATION VIEW */}
      {activeTab === 'relocation' && (
        <div className="space-y-8">
          {/* IATA Flight Crate Calculator */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    IATA Airline Flight Crate Size Calculator
                  </h3>
                  <p className="text-xs text-stone-500">
                    Airlines strictly require pets to be able to stand, turn around, and lie down naturally.
                  </p>
                </div>
              </div>
              <span className="text-xs bg-cyan-50 text-cyan-800 font-bold px-3 py-1 rounded-full border border-cyan-200">
                IATA LAR Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-4 rounded-xl border border-stone-200">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-stone-700">Pet Length (Nose to Base of Tail)</span>
                    <span className="font-black text-cyan-800">{petLengthCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="130"
                    value={petLengthCm}
                    onChange={(e) => setPetLengthCm(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-stone-700">Pet Height (Ground to Top of Head/Ears)</span>
                    <span className="font-black text-cyan-800">{petHeightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={petHeightCm}
                    onChange={(e) => setPetHeightCm(Number(e.target.value))}
                    className="w-full accent-cyan-600"
                  />
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-stone-400">
                    Recommended Airline Approved Crate
                  </div>
                  <div className="text-lg font-black text-cyan-900 mt-1">{recommendedCrate}</div>
                  <div className="text-xs text-stone-600 mt-1">
                    Minimum required dimensions: {crateMinLength}cm (L) × {crateMinHeight}cm (H)
                  </div>
                </div>
                <div className="text-[11px] text-emerald-700 font-medium pt-2 border-t border-stone-100">
                  ✓ Available for immediate delivery in the Petwrld E-Commerce store
                </div>
              </div>
            </div>
          </div>

          {/* Relocation Request Form & Country Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-600" />
                <span>Request Custom Pet Relocation Concierge</span>
              </h3>
              <p className="text-xs text-stone-500">
                Door-to-door flight bookings, climate-controlled transport, customs clearance, and USDA endorsements.
              </p>

              <form onSubmit={handleTravelQuote} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Origin City / Airport</label>
                    <input
                      type="text"
                      required
                      value={travelOrigin}
                      onChange={(e) => setTravelOrigin(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 mb-1">Destination City</label>
                    <input
                      type="text"
                      required
                      value={travelDestination}
                      onChange={(e) => setTravelDestination(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">Target Move Date</label>
                  <input
                    type="date"
                    required
                    defaultValue="2026-11-10"
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  Traveling Pet:{' '}
                  <strong className="text-stone-900">
                    {activePet?.name || 'Milo'} ({activePet?.breed}, {activePet?.weight}kg)
                  </strong>
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  Request Flight Quote & Paperwork Triage
                </button>

                {travelQuoteSent && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold text-center animate-in fade-in">
                    ✓ Travel Concierge Specialist assigned! A detailed itinerary quote has been sent to your email.
                  </div>
                )}
              </form>
            </div>

            {/* Travel Regulations Checklist */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>International Pet Passport Regulations</span>
              </h3>
              <p className="text-xs text-stone-500">
                Key mandatory entry requirements by destination region:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">🇬🇧 United Kingdom & 🇪🇺 European Union</div>
                  <p className="text-stone-600 leading-relaxed">
                    Must have an ISO 11784 microchip implanted BEFORE rabies vaccination. Tapeworm (Echinococcus) treatment required 24-120 hours prior to entry.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">🇦🇺 Australia & 🇳🇿 New Zealand</div>
                  <p className="text-stone-600 leading-relaxed">
                    Rabies Neutralizing Antibody Titer (RNATT) blood test required 180 days in advance. Mandatory 10-day post-arrival quarantine booking.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-900">🇺🇸 United States & 🇨🇦 Canada</div>
                  <p className="text-stone-600 leading-relaxed">
                    CDC Dog Import Form must be completed. Valid rabies certificate from authorized veterinary health authority.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MICROCHIP VIEW */}
      {activeTab === 'microchip' && (
        <div className="space-y-6">
          {/* Microchip Search */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-stone-900">
                15-Digit ISO Microchip Verification & Registry Search
              </h3>
              <p className="text-xs text-stone-500">
                Look up any microchip number to verify ownership, rescue shelter history & contact information.
              </p>
            </div>

            <form onSubmit={handleChipSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={chipSearchInput}
                  onChange={(e) => setChipSearchInput(e.target.value)}
                  placeholder="Enter 15-digit ISO microchip number (e.g. 985141002938192)..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl outline-hidden focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Verify Chip
              </button>
            </form>

            {chipLookupResult && (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Microchip Registered & Safeguarded</span>
                  </div>
                  <span className="font-mono text-emerald-900 font-bold">
                    {chipLookupResult.chipNumber}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px]">PET NAME</span>
                    <strong className="text-stone-900">{chipLookupResult.petName}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">SPECIES</span>
                    <strong className="text-stone-900">{chipLookupResult.species}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">LEGAL GUARDIAN</span>
                    <strong className="text-stone-900">{chipLookupResult.owner}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">EMERGENCY PHONE</span>
                    <strong className="text-stone-900">{chipLookupResult.contact}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lost Pet Amber Alert Broadcast Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-bold text-amber-950">
                  Petwrld Lost Pet Amber Alert Broadcast Beacon
                </h4>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                If your pet goes missing, one click notifies registered pet owners, dog walkers, veterinary clinics, and animal control shelters within a 15-mile radius with your pet's photo and Pet ID.
              </p>
            </div>

            <button
              onClick={handleTriggerAmberAlert}
              className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-transform hover:scale-105 shrink-0"
            >
              Test Lost Pet Broadcast
            </button>
          </div>

          {amberAlertSent && (
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-xs text-rose-950 space-y-1 animate-in fade-in">
              <div className="font-bold flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-600 animate-ping" />
                <span>Simulated Broadcast Active: Alert sent to 1,420 Petwrld users & 14 local clinics!</span>
              </div>
              <p className="text-rose-800 text-[11px]">
                {activePet?.name || 'Milo'}'s photo, color marks, microchip #{activePet?.microchipNumber || '985141002938192'} and emergency contact #{activePet?.emergencyContact || '+1 555 234 8910'} are live on community alert channels.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  HeartHandshake,
  Siren,
  Heart,
  CheckCircle2,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Send,
  X,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { NgoInitiative, AdoptablePet, PetProfile } from '../types';

interface NgoAndAmbulanceProps {
  initiatives: NgoInitiative[];
  adoptablePets: AdoptablePet[];
  onOpenSOS: () => void;
  activePet?: PetProfile;
}

export const NgoAndAmbulance: React.FC<NgoAndAmbulanceProps> = ({
  initiatives,
  adoptablePets,
  onOpenSOS,
  activePet,
}) => {
  const [selectedPetForAdoption, setSelectedPetForAdoption] = useState<AdoptablePet | null>(null);
  const [adoptionSubmitted, setAdoptionSubmitted] = useState(false);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<NgoInitiative | null>(null);
  const [donationSuccess, setDonationSuccess] = useState(false);

  const handleAdoptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdoptionSubmitted(true);
    setTimeout(() => {
      setAdoptionSubmitted(false);
      setSelectedPetForAdoption(null);
    }, 2800);
  };

  const handleDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDonationSuccess(true);
    setTimeout(() => {
      setDonationSuccess(false);
      setDonationModalOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 24/7 Ambulance Hero & Quick SOS Callout */}
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-rose-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Siren className="w-4 h-4 animate-bounce" />
            <span>24/7 Rapid Emergency Response Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            24/7 Veterinary Ambulance & NGO Community Ties
          </h1>
          <p className="text-xs sm:text-sm text-rose-100 leading-relaxed">
            Petwrld partners with local animal welfare NGOs to deliver free stray sterilization drives, citywide rabies vaccination camps, compassionate adoption carnivals, and on-demand 24/7 mobile ICU pet ambulances.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-rose-200" />
              <span>Avg response: 8-12 mins</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-rose-200" />
              <span>Toll-Free: 1-800-PET-WRLD</span>
            </span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onOpenSOS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
          >
            <Siren className="w-4 h-4 text-rose-600" />
            <span>Request 24/7 Ambulance SOS</span>
          </button>
        </div>
      </div>

      {/* Active NGO Drives: Sterilization, Rabies, Adoption */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Active NGO Initiatives & Public Health Camps
            </h2>
            <p className="text-xs text-stone-500">
              Arranging stray sterilization, rabies elimination & rescue campaigns
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            3 Partner NGOs Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {initiatives.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                  <img src={ngo.imageUrl} alt={ngo.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 left-2.5 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {ngo.type.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4 space-y-2.5">
                  <div className="text-[11px] text-amber-800 font-bold">{ngo.ngoName}</div>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                    {ngo.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{ngo.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{ngo.dateRange}</span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">{ngo.description}</p>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-stone-500">Drive Target: {ngo.targetCount}</span>
                      <span className="font-bold text-emerald-700">{ngo.progressPercent}% Complete</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ngo.progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => {
                    setSelectedInitiative(ngo);
                    setDonationModalOpen(true);
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sponsor a Stray ($25) or Volunteer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pet Adoption Drive Gallery */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-stone-900">
                Adoption Drives — Meet Your Future Family Member
              </h2>
              <span className="bg-rose-100 text-rose-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                #AdoptDontShop
              </span>
            </div>
            <p className="text-xs text-stone-500">
              All rescue pets are fully sterilized, vaccinated, microchipped & health-screened
            </p>
          </div>
          <span className="text-xs text-stone-500 font-semibold">{adoptablePets.length} Rescue Paws Available</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {adoptablePets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                  <img src={pet.imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    {pet.name} • {pet.age}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-900">{pet.breed}</span>
                    <span className="text-stone-500">{pet.gender}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{pet.location}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    {pet.sterilized && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                        ✓ Sterilized
                      </span>
                    )}
                    {pet.vaccinated && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md font-semibold">
                        ✓ Vaccinated
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50 p-2.5 rounded-xl border border-stone-100 mt-2">
                    "{pet.story}"
                  </p>

                  <div className="text-[10px] text-stone-400">
                    Partner Rescue: <strong>{pet.ngoPartner}</strong>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedPetForAdoption(pet)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Apply to Adopt {pet.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adoption Application Modal */}
      {selectedPetForAdoption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedPetForAdoption(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!adoptionSubmitted ? (
              <form onSubmit={handleAdoptionSubmit} className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPetForAdoption.imageUrl}
                    alt={selectedPetForAdoption.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      Adoption Application for {selectedPetForAdoption.name}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {selectedPetForAdoption.breed} • {selectedPetForAdoption.ngoPartner}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    defaultValue="Sarah Jenkins"
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number *</label>
                    <input
                      type="text"
                      required
                      defaultValue="+1 (555) 234-8910"
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Home Type</label>
                    <select className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden bg-white">
                      <option>House with Fenced Yard</option>
                      <option>Apartment / Condo</option>
                      <option>Townhouse</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tell us about your home, routine & other pets
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="e.g. Milo is our golden retriever who loves other dogs, work from home full-time, lots of love and daily park visits..."
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  Submit Official Adoption Form
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Adoption Inquiry Submitted!</h4>
                <p className="text-xs text-stone-600">
                  {selectedPetForAdoption.ngoPartner} has received your application to adopt{' '}
                  <strong>{selectedPetForAdoption.name}</strong>. Their coordinator will reach out to schedule a home check or shelter meet-and-greet!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donation / Sponsor Modal */}
      {donationModalOpen && selectedInitiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setDonationModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!donationSuccess ? (
              <form onSubmit={handleDonationSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-700">
                    Sponsor Stray Welfare
                  </span>
                  <h3 className="text-sm font-bold text-stone-900">{selectedInitiative.title}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">{selectedInitiative.ngoName}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['₹500', '₹1,000', '₹2,500'].map((amt, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className="py-2 text-xs font-bold rounded-lg border border-emerald-500 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                    >
                      {amt}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Or volunteer as foster / camp assistant:
                  </label>
                  <input
                    type="text"
                    placeholder="Your email / phone for volunteer orientation"
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors shadow-xs"
                >
                  Confirm Sponsorship & Support Drive
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Thank You for Your Compassion!</h4>
                <p className="text-xs text-stone-600">
                  Your support directly funds sterilization surgeries and rabies vaccinations for stray animals in need.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  X,
  Siren,
  Phone,
  Clock,
  ShieldAlert,
  CheckCircle2,
  Navigation,
  Activity,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';
import { PetProfile } from '../types';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePet?: PetProfile;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  activePet,
}) => {
  const [step, setStep] = useState<'form' | 'dispatched'>('form');
  const [emergencyType, setEmergencyType] = useState('Toxic Ingestion / Poisoning');
  const [location, setLocation] = useState('742 Evergreen Terrace, Metro District (Auto-detected)');
  const [notes, setNotes] = useState('');
  const [etaSeconds, setEtaSeconds] = useState(480); // 8 mins

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'dispatched' && etaSeconds > 0) {
      interval = setInterval(() => {
        setEtaSeconds((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, etaSeconds]);

  if (!isOpen) return null;

  const emergencyCategories = [
    'Toxic Ingestion / Poisoning (Chocolate, Xylitol, Plants)',
    'Hit by Vehicle / Severe Physical Trauma',
    'Severe Breathing Distress / Choking',
    'Bloat / GDV (Retching with swollen hard belly)',
    'Continuous Seizure or Collapse / Unconscious',
    'Difficult Labor / Birthing Complications',
  ];

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('dispatched');
    setEtaSeconds(480);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
              <Siren className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">24/7 Petwrld Emergency Ambulance</h2>
                <span className="bg-white/25 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
                  Priority Response
                </span>
              </div>
              <p className="text-xs text-rose-100">
                Mobile intensive veterinary care vans equipped with oxygen & trauma equipment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {step === 'form' ? (
            <form onSubmit={handleDispatch} className="space-y-5">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-900">
                  <span className="font-bold">If your pet is in immediate cardiac arrest:</span> Call our direct toll-free dispatcher hotline at{' '}
                  <a href="tel:18007389753" className="font-extrabold underline text-rose-700">
                    1-800-PET-WRLD (738-9753)
                  </a>{' '}
                  while submitting this dispatch request.
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
                  Patient Medical Passport
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80'}
                      alt="Pet"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-400"
                    />
                    <div>
                      <div className="font-bold text-stone-900 text-sm">
                        {activePet?.name || 'Milo'} ({activePet?.breed || 'Golden Retriever'})
                      </div>
                      <div className="text-xs text-stone-500">
                        Weight: {activePet?.weight || 29.4}kg • Microchip: {activePet?.microchipNumber || '985141002938192'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] bg-rose-100 text-rose-800 font-semibold px-2 py-1 rounded-md">
                      Pet ID: {activePet?.petIdCode || 'PWR-2026-DOG'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Condition Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Select Triage Emergency Condition *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {emergencyCategories.map((cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => setEmergencyType(cat)}
                      className={`text-left text-xs p-3 rounded-xl border transition-all ${
                        emergencyType === cat
                          ? 'border-rose-500 bg-rose-50/70 text-rose-950 font-semibold ring-1 ring-rose-500'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Ambulance Pickup Address / Live GPS Location *
                </label>
                <div className="relative">
                  <Navigation className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-hidden"
                    placeholder="Enter full address, landmark, or apartment number"
                  />
                </div>
              </div>

              {/* Critical Symptoms Notes */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Current Symptoms & Vital Observations (e.g. gum color, breathing rate)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Ate 150g dark chocolate 20 mins ago, breathing heavily, gums are slightly pale..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-hidden"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="confirm-dispatch-ambulance-btn"
                  className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02]"
                >
                  <Siren className="w-4 h-4 animate-bounce" />
                  <span>Dispatch 24/7 Ambulance Immediately</span>
                </button>
              </div>
            </form>
          ) : (
            /* Dispatched View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-emerald-950">
                  Pet Ambulance #AMB-408 Dispatched!
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Unit from Central Veterinary Trauma Center is en route to your location.
                </p>

                <div className="mt-4 inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-xl border border-emerald-200 shadow-xs">
                  <Clock className="w-5 h-5 text-rose-600 animate-pulse" />
                  <div className="text-left">
                    <div className="text-[10px] uppercase font-bold text-stone-400">Estimated Arrival Time</div>
                    <div className="text-xl font-black text-rose-600">{formatTime(etaSeconds)}</div>
                  </div>
                </div>
              </div>

              {/* Paramedic & Vehicle Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Assigned Medical Crew
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-sm">
                      RN
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-900">Nurse Daniel Ortiz, LVT</div>
                      <div className="text-[11px] text-stone-500">Emergency & Critical Care Specialist</div>
                    </div>
                  </div>
                  <a
                    href="tel:15550192834"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors w-full justify-center"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Direct Call En-Route Paramedic</span>
                  </a>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Target Destination Facility
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900">Oakland Pet Emergency & Trauma Hospital</div>
                    <div className="text-[11px] text-stone-500">4.2 miles • Surgical Suite pre-notified</div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-600 bg-white p-2 rounded-lg border border-stone-200">
                    <Activity className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Vitals telemetry synced with Pet ID #{activePet?.petIdCode || 'PWR-DOG'}</span>
                  </div>
                </div>
              </div>

              {/* First Aid Instructions while waiting */}
              <div className="border border-amber-200 bg-amber-50/60 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <HeartPulse className="w-4 h-4 text-amber-600" />
                  <span>Crucial First-Aid Steps While Ambulance Is Arriving:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                  <li>Keep {activePet?.name || 'your pet'} calm, warm with a blanket, and handle gently.</li>
                  <li>Do NOT offer food, treats, milk, or human medications unless directly instructed by our paramedic.</li>
                  <li>If conscious and stable, keep airway clear. If vomiting, keep head lower than chest to avoid aspiration.</li>
                  <li>Have any product packaging (e.g. chocolate wrapper, plant leaf) ready to hand to the vet nurse.</li>
                </ul>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-xs text-stone-500 hover:text-stone-800 underline"
                >
                  Update Emergency Details
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl"
                >
                  Keep Dispatch Active & Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

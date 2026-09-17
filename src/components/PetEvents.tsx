import React, { useState } from 'react';
import {
  Trophy,
  Calendar,
  MapPin,
  Ticket,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  X,
  Timer,
  Eye,
} from 'lucide-react';
import { PetEvent, PetProfile } from '../types';

interface PetEventsProps {
  events: PetEvent[];
  activePet?: PetProfile;
}

export const PetEvents: React.FC<PetEventsProps> = ({ events, activePet }) => {
  const [selectedEvent, setSelectedEvent] = useState<PetEvent | null>(null);
  const [regType, setRegType] = useState<'contestant' | 'spectator'>('contestant');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketNumber(`PWR-EVT-${Math.floor(100000 + Math.random() * 900000)}`);
    setRegisteredSuccess(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Trophy className="w-3.5 h-3.5 text-amber-200" />
            <span>Championships, Races & Galas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Petwrld Grand Events, Races & Fashion Galas
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            Register your pet as an official contestant in sprint races, dock-diving long jumps, and high-fashion runway shows — or reserve spectator passes to cheer on the furry athletes!
          </p>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
                <img src={evt.imageUrl} alt={evt.title} className="w-full h-full object-cover" />
                <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase">
                  {evt.type.replace('_', ' ')}
                </div>
                <div className="absolute bottom-2.5 right-2.5 bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
                  Prize Pool: {evt.prizes.split('+')[0]}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-amber-700 font-bold">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {evt.date} • {evt.time}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-stone-900 leading-snug">{evt.title}</h3>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{evt.description}</p>

                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Contestant Entry Fee:</span>
                    <strong className="text-stone-900">₹{evt.entryFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Spectator Pass:</span>
                    <strong className="text-stone-900">₹{evt.spectatorFee.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="flex justify-between text-[11px] pt-1 border-t border-stone-200">
                    <span className="text-stone-500">Registered Participants:</span>
                    <span className="text-emerald-700 font-bold">
                      {evt.participantsCount} / {evt.maxParticipants} Spots
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  setSelectedEvent(evt);
                  setRegisteredSuccess(false);
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2.5 rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4" />
                <span>Register Contestant or Buy Tickets</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>

            {!registeredSuccess ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-700">
                    Official Event Registration
                  </span>
                  <h3 className="text-sm font-bold text-stone-900">{selectedEvent.title}</h3>
                  <div className="text-xs text-stone-500 mt-0.5">
                    {selectedEvent.date} at {selectedEvent.location}
                  </div>
                </div>

                {/* Participation Type Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setRegType('contestant')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      regType === 'contestant'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    🐾 Pet Contestant (₹{selectedEvent.entryFee.toLocaleString('en-IN')})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('spectator')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      regType === 'spectator'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    🎟️ Spectator Pass (₹{selectedEvent.spectatorFee.toLocaleString('en-IN')})
                  </button>
                </div>

                {regType === 'contestant' ? (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                    <div className="font-bold text-stone-700">Participating Pet:</div>
                    <div className="flex items-center gap-2">
                      <img
                        src={activePet?.avatarUrl || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=100&q=80'}
                        alt="Pet"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-stone-900">{activePet?.name || 'Milo'}</span>
                      <span className="text-stone-500">({activePet?.breed})</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 pt-1">
                      ✓ Health & Vaccine records verified from Pet ID #{activePet?.petIdCode || 'PWR-DOG'}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Number of Spectator Passes
                    </label>
                    <select className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden bg-white">
                      <option>1 Pass (₹{selectedEvent.spectatorFee.toLocaleString('en-IN')})</option>
                      <option>2 Passes (₹{(selectedEvent.spectatorFee * 2).toLocaleString('en-IN')})</option>
                      <option>4 Family Passes (₹{(selectedEvent.spectatorFee * 4).toLocaleString('en-IN')})</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Participant / Attendee Contact Phone *
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue="+91 98765 43210"
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs">
                    <span className="text-stone-500">Total: </span>
                    <strong className="text-base text-stone-900">
                      ₹{(regType === 'contestant' ? selectedEvent.entryFee : selectedEvent.spectatorFee).toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    Confirm & Generate Pass
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-black text-stone-900 text-base">Registration Confirmed!</h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {regType === 'contestant'
                      ? `${activePet?.name || 'Your pet'} is officially registered in ${selectedEvent.title}!`
                      : `Your spectator ticket for ${selectedEvent.title} is ready!`}
                  </p>
                </div>

                {/* Digital Ticket Pass Card */}
                <div className="p-4 bg-stone-900 text-white rounded-xl text-left font-mono space-y-1">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">EVENT ENTRY PASS</div>
                  <div className="text-xs font-bold text-stone-100">{ticketNumber}</div>
                  <div className="text-[11px] text-stone-400">Date: {selectedEvent.date}</div>
                  <div className="text-[11px] text-stone-400">Venue: {selectedEvent.location}</div>
                </div>

                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2 rounded-xl transition-colors"
                >
                  Close & View Schedule
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

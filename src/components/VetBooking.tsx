import React, { useState } from 'react';
import {
  Video,
  Building2,
  Sparkles,
  Syringe,
  Calendar,
  Clock,
  Star,
  CheckCircle2,
  MapPin,
  FileText,
  X,
  Stethoscope,
  Scissors,
} from 'lucide-react';
import { VetDoctor, BookingAppointment, PetProfile } from '../types';

interface VetBookingProps {
  vets: VetDoctor[];
  appointments: BookingAppointment[];
  onAddAppointment: (appointment: BookingAppointment) => void;
  activePet?: PetProfile;
}

export const VetBooking: React.FC<VetBookingProps> = ({
  vets,
  appointments,
  onAddAppointment,
  activePet,
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'online_vet' | 'in_clinic' | 'spa_grooming' | 'vaccine'
  >('online_vet');
  const [selectedVet, setSelectedVet] = useState<VetDoctor | null>(null);
  const [selectedService, setSelectedService] = useState<{
    type: 'online_vet' | 'in_clinic' | 'spa_grooming' | 'vaccine';
    title: string;
    price: number;
    provider: string;
  } | null>(null);

  const [bookDate, setBookDate] = useState('2026-09-22');
  const [bookTime, setBookTime] = useState('10:30 AM');
  const [notes, setNotes] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const spaServices = [
    {
      title: 'Full Hydrotherapy Bath, Blow-dry & Fluff',
      desc: 'Deep warm cleansing with herbal oatmeal shampoo, tearless facial wash, and ear canal flush.',
      price: 999,
      duration: '45 mins',
      provider: 'Petwrld Certified Mobile Spa Unit',
    },
    {
      title: 'Complete Deshedding & Full Body Styling',
      desc: 'High-velocity undercoat blowout, sanitary trim, paw pad conditioning, and ultrasonic teeth gel.',
      price: 1499,
      duration: '75 mins',
      provider: 'Pawsome Luxury Grooming Salon',
    },
    {
      title: 'Nail Grinding & Paw Pad Lavender Butter Treatment',
      desc: 'Gentle rotary smoothing prevents carpet snagging and moisturizes dry cracked pads.',
      price: 499,
      duration: '20 mins',
      provider: 'Gentle Paws Grooming Care',
    },
  ];

  const vaccinePackages = [
    {
      title: 'Annual Canine Core Shield (Rabies + DHPP + Leptospirosis)',
      desc: '3-in-one comprehensive immunization booster with certified veterinary certificate for Pet ID.',
      price: 1299,
      duration: '30 mins',
      provider: 'Oakland Pet Wellness & Hospital',
    },
    {
      title: 'Feline Triple Protection (FVRCP + Feline Rabies + FeLV)',
      desc: 'Protects indoor and outdoor cats against respiratory viruses and leukemia.',
      price: 1099,
      duration: '30 mins',
      provider: 'Whiskers & Paws Feline Practice',
    },
    {
      title: 'Bordetella (Kennel Cough) Rapid Oral Immunization',
      desc: 'Required for dog boarding, daycare, agility parks, and pet hotel stays.',
      price: 699,
      duration: '15 mins',
      provider: 'Pacific Bay Animal Specialty Center',
    },
  ];

  const handleStartBooking = (service: {
    type: 'online_vet' | 'in_clinic' | 'spa_grooming' | 'vaccine';
    title: string;
    price: number;
    provider: string;
  }) => {
    setSelectedService(service);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const newApt: BookingAppointment = {
      id: `apt-${Date.now()}`,
      type: selectedService.type,
      serviceTitle: selectedService.title,
      providerName: selectedService.provider,
      petName: activePet?.name || 'Milo',
      date: bookDate,
      timeSlot: bookTime,
      status: 'Confirmed',
      price: selectedService.price,
      notes,
    };

    onAddAppointment(newApt);
    setBookingConfirmed(true);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Tele-Health & Certified Clinic Bookings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Veterinary Care, Spas & Vaccine Immunizations
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100">
            Connect directly with verified veterinarians via HD video or book physical visits, luxury grooming baths, and rabies shots. All records automatically sync to your pet's <strong className="text-white">Pet ID</strong>.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-stone-100 p-1.5 rounded-xl border border-stone-200">
        <button
          onClick={() => setActiveCategory('online_vet')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCategory === 'online_vet'
              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Video className="w-4 h-4 text-emerald-600" />
          <span>Online Video Vet</span>
        </button>

        <button
          onClick={() => setActiveCategory('in_clinic')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCategory === 'in_clinic'
              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-4 h-4 text-teal-600" />
          <span>Clinic Visit</span>
        </button>

        <button
          onClick={() => setActiveCategory('spa_grooming')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCategory === 'spa_grooming'
              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Scissors className="w-4 h-4 text-amber-600" />
          <span>Spa & Grooming</span>
        </button>

        <button
          onClick={() => setActiveCategory('vaccine')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold transition-all ${
            activeCategory === 'vaccine'
              ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Syringe className="w-4 h-4 text-rose-600" />
          <span>Vaccine Booking</span>
        </button>
      </div>

      {/* Content depending on category */}
      {(activeCategory === 'online_vet' || activeCategory === 'in_clinic') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">
              {activeCategory === 'online_vet'
                ? 'Available Tele-Health Veterinary Doctors'
                : 'Partner Veterinary Clinics & In-Person Doctors'}
            </h2>
            <span className="text-xs text-stone-500">
              Booking for patient: <strong className="text-stone-800">{activePet?.name || 'Milo'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {vets.map((vet) => (
              <div
                key={vet.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={vet.imageUrl}
                      alt={vet.name}
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-emerald-400"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 leading-tight">
                        {vet.name}
                      </h3>
                      <p className="text-[11px] text-emerald-700 font-semibold">{vet.specialty}</p>
                      <p className="text-[10px] text-stone-400">{vet.experienceYears} Years Clinical Exp.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 p-2 rounded-lg">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-stone-900">{vet.rating}</span>
                    <span className="text-stone-400">({vet.reviewsCount} reviews)</span>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate">{vet.clinicName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Available: {vet.availableDays.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-stone-400 font-semibold">Consult Fee</div>
                    <div className="text-sm font-black text-stone-900">₹{vet.consultFee.toLocaleString('en-IN')}</div>
                  </div>
                  <button
                    onClick={() =>
                      handleStartBooking({
                        type: activeCategory,
                        title:
                          activeCategory === 'online_vet'
                            ? `Video Consultation with ${vet.name}`
                            : `Clinic Consultation at ${vet.clinicName}`,
                        price: vet.consultFee,
                        provider: vet.name,
                      })
                    }
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spa & Grooming View */}
      {activeCategory === 'spa_grooming' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Luxury Grooming & Spa Packages</h2>
            <span className="text-xs text-stone-500">Includes hypoallergenic organic products</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {spaServices.map((spa, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm">
                      Duration: {spa.duration}
                    </span>
                    <span className="text-base font-black text-stone-900">₹{spa.price.toLocaleString('en-IN')}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900">{spa.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{spa.desc}</p>
                  <p className="text-[11px] text-stone-400 font-medium">Provider: {spa.provider}</p>
                </div>
                <button
                  onClick={() =>
                    handleStartBooking({
                      type: 'spa_grooming',
                      title: spa.title,
                      price: spa.price,
                      provider: spa.provider,
                    })
                  }
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Reserve Spa Session</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Vaccine Booking View */}
      {activeCategory === 'vaccine' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900">Certified Vaccine Immunization Protocols</h2>
            <span className="text-xs text-emerald-600 font-semibold">Includes Official Digital Certificate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {vaccinePackages.map((vac, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-sm">
                      Certified Shield
                    </span>
                    <span className="text-base font-black text-stone-900">₹{vac.price.toLocaleString('en-IN')}</span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-stone-900">{vac.title}</h3>
                  <p className="text-xs text-stone-600 leading-relaxed">{vac.desc}</p>
                  <p className="text-[11px] text-stone-400 font-medium">Administering Center: {vac.provider}</p>
                </div>
                <button
                  onClick={() =>
                    handleStartBooking({
                      type: 'vaccine',
                      title: vac.title,
                      price: vac.price,
                      provider: vac.provider,
                    })
                  }
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Syringe className="w-3.5 h-3.5" />
                  <span>Book Vaccine Shot</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Appointments List */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs sm:text-sm text-stone-900">Your Confirmed Appointments</h3>
          </div>
          <span className="text-xs text-stone-500 font-semibold">{appointments.length} Total</span>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-stone-500 py-4 text-center">No upcoming appointments scheduled.</p>
        ) : (
          <div className="divide-y divide-stone-100">
            {appointments.map((apt) => (
              <div key={apt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{apt.serviceTitle}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Pet: <strong className="text-stone-700">{apt.petName}</strong> • Provider: {apt.providerName}
                  </div>
                  {apt.notes && <div className="text-[11px] text-stone-400 italic mt-0.5">Note: "{apt.notes}"</div>}
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs font-semibold text-stone-800">
                    {apt.date} • {apt.timeSlot}
                  </div>
                  <div className="text-xs font-bold text-emerald-700">₹{apt.price.toLocaleString('en-IN')} Paid</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Appointment Confirmation</div>
                  <h3 className="text-sm font-bold text-stone-900">{selectedService.title}</h3>
                  <div className="text-xs text-stone-500 mt-1">Provider: {selectedService.provider}</div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <span className="text-stone-500">Patient: </span>
                  <strong className="text-stone-900">
                    {activePet?.name || 'Milo'} ({activePet?.breed || 'Golden Retriever'})
                  </strong>
                  <div className="text-[11px] text-stone-400 mt-0.5">Pet ID: {activePet?.petIdCode || 'PWR-DOG'}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      required
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Time Slot *</label>
                    <select
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden bg-white"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Symptoms or Special Requests
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Skin scratching around ears, or wants organic oatmeal shampoo..."
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500">Total: </span>
                    <strong className="text-base text-stone-900">₹{selectedService.price.toLocaleString('en-IN')}</strong>
                  </div>
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    Confirm & Sync to Pet ID
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-stone-900 text-base">Booking Successfully Confirmed!</h4>
                <p className="text-xs text-stone-600">
                  Your appointment for <strong className="text-stone-900">{activePet?.name || 'Milo'}</strong> on{' '}
                  <strong className="text-stone-900">
                    {bookDate} at {bookTime}
                  </strong>{' '}
                  has been added to your calendar and synced with your Pet ID health passport.
                </p>
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-6 py-2 rounded-xl transition-colors mt-2"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

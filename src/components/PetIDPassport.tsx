import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Calendar,
  Syringe,
  FileText,
  Clock,
  Plus,
  ShieldCheck,
  AlertCircle,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Activity,
  Heart,
  X,
  Sparkles,
} from 'lucide-react';
import { PetProfile, VaccineRecord, PrescriptionRecord } from '../types';

interface PetIDPassportProps {
  pet: PetProfile;
  allPets: PetProfile[];
  onSelectPet: (id: string) => void;
  onOpenAddPet: () => void;
  onUpdatePet: (updatedPet: PetProfile) => void;
}

export const PetIDPassport: React.FC<PetIDPassportProps> = ({
  pet,
  allPets,
  onSelectPet,
  onOpenAddPet,
  onUpdatePet,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'vaccines' | 'prescriptions' | 'visits' | 'documents'
  >('overview');

  const [isAddVaccineOpen, setIsAddVaccineOpen] = useState(false);
  const [isAddRxOpen, setIsAddRxOpen] = useState(false);
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // New Vaccine form
  const [newVacName, setNewVacName] = useState('Rabies Annual Booster');
  const [newVacAdminDate, setNewVacAdminDate] = useState('2026-09-15');
  const [newVacDueDate, setNewVacDueDate] = useState('2027-09-15');
  const [newVacVet, setNewVacVet] = useState('Dr. Elena Rostova');
  const [newVacClinic, setNewVacClinic] = useState('Oakland Pet Wellness & Hospital');

  // New Rx Form
  const [newMedName, setNewMedName] = useState('');
  const [newDosage, setNewDosage] = useState('');
  const [newVetName, setNewVetName] = useState('Dr. Elena Rostova');

  const handleAddVaccine = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: VaccineRecord = {
      id: `vac-${Date.now()}`,
      name: newVacName,
      dateAdministered: newVacAdminDate,
      dueDate: newVacDueDate,
      status: 'Completed',
      veterinarian: newVacVet,
      clinic: newVacClinic,
    };
    const updated = {
      ...pet,
      vaccinations: [newRecord, ...pet.vaccinations],
    };
    onUpdatePet(updated);
    setIsAddVaccineOpen(false);
    showToast(`Vaccine record "${newVacName}" logged with automated reminder!`);
  };

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    const newRx: PrescriptionRecord = {
      id: `rx-${Date.now()}`,
      medicationName: newMedName,
      dosage: newDosage,
      prescribedBy: newVetName,
      date: new Date().toISOString().split('T')[0],
      duration: 'Ongoing',
      notes: 'Prescribed via Petwrld Vet Teleconsultation',
      documentName: `${newMedName.replace(/\s+/g, '_')}_Official_Rx.pdf`,
    };
    const updated = {
      ...pet,
      prescriptions: [newRx, ...pet.prescriptions],
    };
    onUpdatePet(updated);
    setIsAddRxOpen(false);
    showToast(`Prescription "${newMedName}" saved to Pet ID!`);
  };

  const showToast = (msg: string) => {
    setReminderToast(msg);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Toast */}
      {reminderToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{reminderToast}</span>
        </div>
      )}

      {/* Header with Pet Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-stone-900">Pet ID Digital Health Passport</h1>
              <span className="text-[10px] uppercase font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                Global ISO 11784 Verified
              </span>
            </div>
            <p className="text-xs text-stone-500">
              One unified digital card containing all medical histories, vaccines, reminders & prescriptions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
            {allPets.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelectPet(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  p.id === pet.id ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <img src={p.avatarUrl} alt={p.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{p.name}</span>
              </button>
            ))}
          </div>
          <button
            onClick={onOpenAddPet}
            className="p-2 rounded-xl border border-stone-200 text-amber-700 hover:bg-amber-50"
            title="Register New Pet"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Digital Pet ID Card Visualization */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-amber-500/30">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          {/* Left Column: Photo & Biometrics */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="relative">
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-amber-500/50 shadow-lg"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                Active ID
              </span>
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-2xl font-black tracking-tight">{pet.name}</span>
                <span className="text-xs bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  {pet.species}
                </span>
              </div>
              <div className="text-xs text-amber-200 font-semibold">{pet.breed}</div>
              <div className="text-xs text-stone-300">
                {pet.age} • {pet.gender} • {pet.weight} kg • {pet.color}
              </div>
              <div className="text-[11px] text-stone-400 font-mono pt-1">
                Microchip: <strong className="text-white font-mono">{pet.microchipNumber}</strong>
              </div>
              <div className="text-[11px] text-stone-300">
                Blood Group: <strong className="text-amber-400">{pet.bloodGroup}</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Unique Petwrld ID Code & Scannable QR */}
          <div className="flex flex-col sm:flex-row md:flex-col justify-between items-center sm:items-end gap-4 border-t md:border-t-0 md:border-l border-stone-700/60 pt-4 md:pt-0 md:pl-6">
            <div className="text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-widest">
                OFFICIAL PETWRLD PASSPORT ID
              </div>
              <div className="text-lg font-black font-mono tracking-wider text-white">
                {pet.petIdCode}
              </div>
              <div className="text-[11px] text-stone-400">
                Emergency: <span className="text-rose-300 font-semibold">{pet.emergencyContact}</span>
              </div>
            </div>

            {/* Simulated QR Code */}
            <div className="bg-white p-2.5 rounded-xl shadow-md flex flex-col items-center">
              <div className="w-20 h-20 bg-stone-900 rounded-lg flex items-center justify-center p-1.5">
                {/* SVG pattern representing a stylized QR code */}
                <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm4 4h4v4h-4v-4zm-2 2h2v2h-2v-2zm-6-2h2v4h-2v-4zm4-4h2v2h-2v-2z" />
                </svg>
              </div>
              <span className="text-[9px] font-bold text-stone-700 mt-1">Scan for Health Vitals</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrintPassport}
                className="inline-flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-stone-600"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Card</span>
              </button>
              <button
                onClick={() => showToast(`Shareable passport link copied for ${pet.name}!`)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share ID</span>
              </button>
            </div>
          </div>
        </div>

        {/* Allergies & Special Medical Alerts */}
        <div className="mt-5 pt-4 border-t border-stone-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">Medical Alerts:</span>
            {pet.allergies.map((allergy, i) => (
              <span
                key={i}
                className="bg-rose-950/80 text-rose-200 border border-rose-800 text-[11px] px-2 py-0.5 rounded-md font-medium"
              >
                ⚠️ {allergy}
              </span>
            ))}
          </div>
          <div className="text-[11px] text-stone-400">
            Registered Guardian: <span className="text-stone-200 font-semibold">{pet.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Vaccines, Prescriptions, Visits, Reports */}
      <div className="flex items-center gap-2 border-b border-stone-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'overview'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Health Summary</span>
        </button>

        <button
          onClick={() => setActiveSubTab('vaccines')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'vaccines'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Syringe className="w-4 h-4" />
          <span>Vaccine Schedule & Reminders</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded-full">
            {pet.vaccinations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('prescriptions')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'prescriptions'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Prescriptions & Medications</span>
          <span className="bg-stone-100 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full">
            {pet.prescriptions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('visits')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
            activeSubTab === 'visits'
              ? 'border-amber-600 text-amber-900'
              : 'border-transparent text-stone-500 hover:text-stone-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Veterinary Visits</span>
          <span className="bg-stone-100 text-stone-700 text-[10px] px-1.5 py-0.2 rounded-full">
            {pet.vetVisits.length}
          </span>
        </button>
      </div>

      {/* OVERVIEW / SUMMARY VIEW */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Vaccine Shield Status
              </span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">
              {pet.vaccinations.filter((v) => v.status === 'Completed').length} / {pet.vaccinations.length}
            </div>
            <p className="text-xs text-stone-600">
              Core immunizations are active. Next upcoming booster due in November.
            </p>
            <button
              onClick={() => setActiveSubTab('vaccines')}
              className="text-xs text-amber-700 font-bold hover:underline inline-block pt-1"
            >
              View Immunization Timeline →
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Active Medications
              </span>
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-stone-900">{pet.prescriptions.length} Active</div>
            <p className="text-xs text-stone-600">
              NexGard monthly chewable + seasonal Apoquel allergy protocol logged.
            </p>
            <button
              onClick={() => setActiveSubTab('prescriptions')}
              className="text-xs text-amber-700 font-bold hover:underline inline-block pt-1"
            >
              View Prescriptions & Refill →
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                Automated SMS/Email Alerts
              </span>
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="text-xs text-stone-700 space-y-1.5">
              <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg">
                <span>Vaccine Due Reminder:</span>
                <span className="text-emerald-700 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between bg-stone-50 p-2 rounded-lg">
                <span>Flea/Tick Monthly Push:</span>
                <span className="text-emerald-700 font-bold">1st of Month</span>
              </div>
            </div>
            <button
              onClick={() => showToast('Syncing push notifications to your device!')}
              className="text-xs text-indigo-700 font-bold hover:underline inline-block pt-1"
            >
              Configure Push Settings →
            </button>
          </div>
        </div>
      )}

      {/* VACCINES TAB */}
      {activeSubTab === 'vaccines' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Vaccination Records & Reminders</h3>
              <p className="text-xs text-stone-500">
                Official certificates for boarding, international travel & agility championships
              </p>
            </div>
            <button
              onClick={() => setIsAddVaccineOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Vaccine</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
            {pet.vaccinations.map((vac) => (
              <div key={vac.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{vac.name}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vac.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : vac.status === 'Upcoming'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {vac.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Administered: <strong className="text-stone-700">{vac.dateAdministered}</strong> • Next Due:{' '}
                    <strong className="text-amber-800">{vac.dueDate}</strong>
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Doctor: {vac.veterinarian} • {vac.clinic}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      showToast(`Calendar alert set for ${vac.name} due on ${vac.dueDate}!`)
                    }
                    className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 px-2.5 py-1.5 rounded-lg"
                  >
                    <Clock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Set Reminder</span>
                  </button>
                  <button
                    onClick={() =>
                      showToast(`Downloading certified vaccine proof for ${vac.name}...`)
                    }
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeSubTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900">Active Prescriptions & Pharmacy Logs</h3>
              <p className="text-xs text-stone-500">
                Verified veterinary scripts eligible for 1-click reorder via Petwrld E-Commerce
              </p>
            </div>
            <button
              onClick={() => setIsAddRxOpen(true)}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Prescription</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pet.prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-900">{rx.medicationName}</span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Verified Rx
                    </span>
                  </div>
                  <div className="text-xs text-stone-600">
                    Dosage: <strong className="text-stone-800">{rx.dosage}</strong>
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Prescribed by: {rx.prescribedBy} on {rx.date} ({rx.duration})
                  </div>
                  {rx.notes && (
                    <div className="text-[11px] text-stone-500 bg-stone-50 p-2 rounded-lg italic">
                      "{rx.notes}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-mono">
                    {rx.documentName || 'Digital_Script.pdf'}
                  </span>
                  <button
                    onClick={() =>
                      showToast(`Downloading ${rx.medicationName} prescription file...`)
                    }
                    className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISITS TAB */}
      {activeSubTab === 'visits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">Veterinary Clinical Visit Logs</h3>
            <span className="text-xs text-stone-500">Full clinical examinations & diagnostic outcomes</span>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
            {pet.vetVisits.map((visit) => (
              <div key={visit.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-stone-900">{visit.reason}</div>
                  <div className="text-xs text-stone-500">{visit.date}</div>
                </div>
                <div className="text-xs text-emerald-800 font-medium">
                  {visit.vetName} • {visit.clinicName}
                </div>
                <div className="text-xs text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <strong className="text-stone-800">Doctor Diagnosis: </strong>
                  {visit.diagnosis}
                </div>
                {visit.followUpDate && (
                  <div className="text-[11px] text-amber-800 font-semibold">
                    Scheduled Follow-up: {visit.followUpDate}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Vaccine Modal */}
      {isAddVaccineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsAddVaccineOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-3">Log Vaccine Immunization</h3>
            <form onSubmit={handleAddVaccine} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Vaccine Name *</label>
                <input
                  type="text"
                  required
                  value={newVacName}
                  onChange={(e) => setNewVacName(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Administered Date</label>
                  <input
                    type="date"
                    required
                    value={newVacAdminDate}
                    onChange={(e) => setNewVacAdminDate(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={newVacDueDate}
                    onChange={(e) => setNewVacDueDate(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Administering Vet</label>
                <input
                  type="text"
                  value={newVacVet}
                  onChange={(e) => setNewVacVet(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Hospital / Clinic</label>
                <input
                  type="text"
                  value={newVacClinic}
                  onChange={(e) => setNewVacClinic(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors mt-2"
              >
                Save to Pet ID Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Rx Modal */}
      {isAddRxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-stone-200">
            <button
              onClick={() => setIsAddRxOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-stone-900 mb-3">Add Prescription Record</h3>
            <form onSubmit={handleAddRx} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Medication Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bravecto 3-Month Chewable"
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Dosage & Frequency *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 tablet every 90 days with food"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Prescribing Doctor</label>
                <input
                  type="text"
                  value={newVetName}
                  onChange={(e) => setNewVetName(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl transition-colors mt-2"
              >
                Log Prescription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { X, Sparkles, Plus, ShieldCheck } from 'lucide-react';
import { PetProfile } from '../types';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (newPet: PetProfile) => void;
}

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet,
}) => {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Rabbit'>('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [weight, setWeight] = useState(12);
  const [color, setColor] = useState('Golden Honey');
  const [bloodGroup, setBloodGroup] = useState('DEA 1.1 +');
  const [ownerName, setOwnerName] = useState('Sarah Jenkins');
  const [emergencyContact, setEmergencyContact] = useState('+1 (555) 234-8910');
  const [avatarUrl, setAvatarUrl] = useState(
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const chipNum = `98514100${Math.floor(1000000 + Math.random() * 9000000)}`;

    const newPet: PetProfile = {
      id: `pet-${Date.now()}`,
      petIdCode: `PWR-${species.toUpperCase().slice(0, 3)}-${randomSuffix}`,
      name: name.trim(),
      species,
      breed: breed || 'Companion Mix',
      age: age || '1.5 yrs',
      gender,
      weight,
      color,
      bloodGroup,
      avatarUrl:
        avatarUrl ||
        'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
      ownerName,
      emergencyContact,
      microchipNumber: chipNum,
      allergies: ['None declared'],
      vaccinations: [
        {
          id: `vac-${Date.now()}-1`,
          name: 'Core Rabies Vaccination',
          dateAdministered: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Completed',
          veterinarian: 'Dr. Elena Rostova, DVM',
          clinic: 'Petwrld Central Hospital',
        },
      ],
      prescriptions: [],
      vetVisits: [
        {
          id: `visit-${Date.now()}-1`,
          date: new Date().toISOString().split('T')[0],
          reason: 'Initial Registration & Physical Wellness Check',
          vetName: 'Dr. Elena Rostova, DVM',
          clinicName: 'Petwrld Central Hospital',
          diagnosis: 'Healthy, active heart rhythm and sound joints. Welcome to Petwrld!',
        },
      ],
    };

    onAddPet(newPet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-stone-200 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <Plus className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900">Register New Pet to Petwrld</h2>
            <p className="text-xs text-stone-500">
              Instant digital Pet ID card, microchip registry record, and health passport
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Pet Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Luna"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Species *</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden bg-white"
              >
                <option value="Dog">Dog (Canine)</option>
                <option value="Cat">Cat (Feline)</option>
                <option value="Bird">Bird (Avian)</option>
                <option value="Rabbit">Rabbit</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Breed</label>
              <input
                type="text"
                placeholder="e.g. French Bulldog, Siamese..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Age</label>
              <input
                type="text"
                placeholder="e.g. 2 years"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Photo URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Guardian Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Emergency Phone</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Generate Official Pet ID & Passport</span>
          </button>
        </form>
      </div>
    </div>
  );
};

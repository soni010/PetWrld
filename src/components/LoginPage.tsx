import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Heart,
  PawPrint,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Plus,
  QrCode,
  Calendar,
  Activity,
  FileText,
} from 'lucide-react';
import { UserAccount, OwnerGender, PetProfile, VaccineRecord } from '../types';
import {
  getStoredAccounts,
  saveStoredAccounts,
  setCurrentUser,
  generatePetIdCode,
} from '../data/initialAccounts';
import { auth, googleProvider } from '../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { saveUserProfileToFirestore, savePetToFirestore } from '../firebase/firestoreService';
import { syncUserToSupabase, syncPetToSupabase } from '../supabase/supabaseService';
import { INITIAL_PETS } from '../data/initialData';

interface LoginPageProps {
  currentUser: UserAccount | null;
  onLoginSuccess: (account: UserAccount) => void;
  onLogout: () => void;
  onNavigateToPetId: () => void;
  onNavigateToShop: () => void;
  onContinueAsGuest?: () => void;
}

const PRESET_AVATARS = [
  { label: 'Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80' },
  { label: 'Persian Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80' },
  { label: 'French Bulldog', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80' },
  { label: 'Beagle', url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=80' },
  { label: 'Ginger Tabby', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80' },
  { label: 'Fluffy Rabbit', url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80' },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
  onNavigateToPetId,
  onNavigateToShop,
  onContinueAsGuest,
}) => {
  // Mode: 'login' | 'register' | 'profile'
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>(
    currentUser ? 'profile' : 'login'
  );

  // Login Form State
  const [loginEmailOrPhone, setLoginEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration Form State
  // Owner details
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerGender, setOwnerGender] = useState<OwnerGender>('Female');
  const [ownerEmail, setOwnerEmail] = useState(''); // gmail
  const [ownerAddress, setOwnerAddress] = useState('');
  const [ownerCity, setOwnerCity] = useState('');
  const [ownerPincode, setOwnerPincode] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Pet details
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Rabbit'>('Dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petGender, setPetGender] = useState<'Male' | 'Female'>('Male');
  const [petWeight, setPetWeight] = useState('12');
  const [petColor, setPetColor] = useState('Golden Honey');
  const [petBloodGroup, setPetBloodGroup] = useState('DEA 1.1 Positive');
  const [microchipNumber, setMicrochipNumber] = useState('');
  const [petAllergies, setPetAllergies] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);

  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setLoginError('');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;

      const googleAccount: UserAccount = {
        id: user.uid,
        email: user.email || 'petparent@gmail.com',
        owner: {
          id: `owner-${user.uid}`,
          name: user.displayName || user.email?.split('@')[0] || 'Pet Parent',
          phone: user.phoneNumber || '+91 98201 12345',
          gender: 'Prefer not to say',
          email: user.email || '',
          address: 'Metro Companion Residence',
          city: 'Bengaluru',
          pincode: '560001',
          emergencyContact: '+91 98201 99999',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        },
        pets: [INITIAL_PETS[0]],
        activePetId: INITIAL_PETS[0].id,
      };

      // Save to local storage cache
      const existing = getStoredAccounts();
      const filtered = existing.filter((a) => a.id !== googleAccount.id && a.email !== googleAccount.email);
      saveStoredAccounts([googleAccount, ...filtered]);
      setCurrentUser(googleAccount);

      // Persist to Cloud Firestore: /users/{userId} & /users/{userId}/pets/{petId}
      await saveUserProfileToFirestore(googleAccount, 250);
      await savePetToFirestore(googleAccount.id, googleAccount.pets[0]);

      onLoginSuccess(googleAccount);
      setMode('profile');
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      // If popup was closed by user or cancelled, provide helpful message
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoginError('Sign-in popup was closed. Please try again.');
      } else {
        setLoginError(err?.message || 'Google Sign-In failed. Please try again or use the demo login.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // Generate ISO Microchip helper
  const handleGenerateMicrochip = () => {
    const random15 = '985' + Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setMicrochipNumber(random15);
  };

  // Quick Demo Account Login
  const handleQuickLogin = (email: string) => {
    setLoginLoading(true);
    setLoginError('');
    setTimeout(() => {
      const accounts = getStoredAccounts();
      const found = accounts.find((acc) => acc.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setCurrentUser(found);
        onLoginSuccess(found);
        setMode('profile');
      } else {
        setLoginError('Demo account not found.');
      }
      setLoginLoading(false);
    }, 400);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmailOrPhone.trim()) {
      setLoginError('Please enter your Gmail or registered phone number.');
      return;
    }

    if (!loginPassword.trim()) {
      setLoginError('Please enter your password.');
      return;
    }

    setLoginLoading(true);

    setTimeout(() => {
      const accounts = getStoredAccounts();
      const term = loginEmailOrPhone.trim().toLowerCase();

      const matchedAccount = accounts.find(
        (acc) =>
          acc.email.toLowerCase() === term ||
          acc.owner.phone.replace(/\s+/g, '').includes(term.replace(/\s+/g, ''))
      );

      if (!matchedAccount) {
        setLoginError(
          'No account found with this Gmail or phone number. Click "Create a new pet account" below to register.'
        );
        setLoginLoading(false);
        return;
      }

      if (matchedAccount.password && matchedAccount.password !== loginPassword) {
        setLoginError('Incorrect password. For demo accounts, try: password123');
        setLoginLoading(false);
        return;
      }

      // Successful login
      setCurrentUser(matchedAccount);
      onLoginSuccess(matchedAccount);
      setMode('profile');
      setLoginLoading(false);
    }, 450);
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    // Validations
    if (!ownerName.trim()) {
      setRegisterError('Owner full name is required.');
      return;
    }
    if (!ownerPhone.trim()) {
      setRegisterError('Owner phone number is required.');
      return;
    }
    if (!ownerEmail.trim() || !ownerEmail.includes('@')) {
      setRegisterError('Please enter a valid Gmail / email address.');
      return;
    }
    if (!ownerAddress.trim()) {
      setRegisterError('Owner residential address is required for vet & ambulance services.');
      return;
    }
    if (!password || password.length < 6) {
      setRegisterError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setRegisterError('Passwords do not match.');
      return;
    }
    if (!petName.trim()) {
      setRegisterError('Pet name is required.');
      return;
    }
    if (!petBreed.trim()) {
      setRegisterError('Pet breed is required.');
      return;
    }
    if (!petAge.trim()) {
      setRegisterError('Pet age is required.');
      return;
    }

    // Check if email already exists
    const accounts = getStoredAccounts();
    const existing = accounts.find((a) => a.email.toLowerCase() === ownerEmail.trim().toLowerCase());
    if (existing) {
      setRegisterError('An account with this Gmail address already exists. Please log in instead.');
      return;
    }

    const newPetId = `pet-${Date.now()}`;
    const generatedPetCode = generatePetIdCode(petSpecies);
    const chip = microchipNumber.trim() || '985' + Math.floor(100000000000 + Math.random() * 900000000000).toString();

    const initialVaccines: VaccineRecord[] = [
      {
        id: `vac-${Date.now()}-1`,
        name: 'Rabies Core Immunization',
        dateAdministered: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Completed',
        veterinarian: 'Dr. Petwrld Certified Vet',
        clinic: `${ownerCity || 'City'} Central Veterinary Hospital`,
      },
      {
        id: `vac-${Date.now()}-2`,
        name: petSpecies === 'Dog' ? 'DHPP Annual Booster' : 'FVRCP Tri-cat Core',
        dateAdministered: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Upcoming',
        veterinarian: 'Dr. Petwrld Certified Vet',
        clinic: `${ownerCity || 'City'} Central Veterinary Hospital`,
      },
    ];

    const newPet: PetProfile = {
      id: newPetId,
      petIdCode: generatedPetCode,
      name: petName.trim(),
      species: petSpecies,
      breed: petBreed.trim(),
      age: petAge.trim(),
      gender: petGender,
      weight: parseFloat(petWeight) || 10,
      color: petColor.trim() || 'Natural',
      microchipNumber: chip,
      avatarUrl: avatarUrl || PRESET_AVATARS[0].url,
      allergies: petAllergies.trim()
        ? petAllergies.split(',').map((s) => s.trim()).filter(Boolean)
        : ['None reported'],
      ownerName: ownerName.trim(),
      emergencyContact: emergencyContact.trim() || ownerPhone.trim(),
      bloodGroup: petBloodGroup,
      vaccinations: initialVaccines,
      prescriptions: [],
      vetVisits: [],
    };

    const newAccount: UserAccount = {
      id: `acc-${Date.now()}`,
      email: ownerEmail.trim().toLowerCase(),
      password,
      owner: {
        id: `owner-${Date.now()}`,
        name: ownerName.trim(),
        phone: ownerPhone.trim(),
        gender: ownerGender,
        email: ownerEmail.trim().toLowerCase(),
        address: ownerAddress.trim(),
        city: ownerCity.trim() || 'Bengaluru',
        pincode: ownerPincode.trim() || '560001',
        emergencyContact: emergencyContact.trim() || ownerPhone.trim(),
        memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      },
      pets: [newPet],
      activePetId: newPetId,
    };

    // Save locally
    const updatedAccounts = [...accounts, newAccount];
    saveStoredAccounts(updatedAccounts);
    setCurrentUser(newAccount);

    // Save to Cloud Firestore
    saveUserProfileToFirestore(newAccount, 250).catch((e) =>
      console.warn('[Firestore] Profile save on register error:', e)
    );
    savePetToFirestore(newAccount.id, newPet).catch((e) =>
      console.warn('[Firestore] Pet save on register error:', e)
    );

    setRegisterSuccess(true);
    setTimeout(() => {
      onLoginSuccess(newAccount);
      setMode('profile');
      setRegisterSuccess(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 sm:px-4">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 font-black shadow-lg shadow-amber-500/20 mb-3 text-2xl">
          🐾
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
          {mode === 'profile'
            ? 'Pet Parent & Companion Account'
            : mode === 'register'
            ? 'Create a New Pet Account'
            : 'Log In to Petwrld'}
        </h1>
        <p className="text-sm text-stone-600 max-w-lg mx-auto mt-1.5">
          {mode === 'profile'
            ? 'Manage your owner profile, registered pets, digital ID passports, and medical credentials.'
            : mode === 'register'
            ? 'Register pet parent and companion details to unlock unified passports, emergency dispatch, and care.'
            : 'Access your pet’s digital health passport, tele-consultations, orders, and community.'}
        </p>
      </div>

      {/* Mode Switcher for non-logged in state */}
      {!currentUser && (
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 bg-stone-200/90 rounded-2xl border border-stone-300 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginError('');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-white text-stone-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In to Account
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setRegisterError('');
              }}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-white text-stone-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create New Pet Account
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: PROFILE / LOGGED IN STATE */}
      {mode === 'profile' && currentUser && (
        <div className="space-y-6">
          {/* Top Status Card */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center text-2xl font-black shadow-inner">
                  {currentUser.owner.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{currentUser.owner.name}</h2>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified Pet Parent
                    </span>
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {currentUser.email} • {currentUser.owner.phone}
                  </p>
                  <p className="text-[11px] text-amber-300/80 mt-1">
                    Member since {currentUser.owner.memberSince} • {currentUser.pets.length} Registered Pet(s)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setMode('register')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-all shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Another Pet</span>
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMode('login');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-700/80 hover:bg-stone-700 text-stone-200 hover:text-white text-xs font-semibold border border-stone-600 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>

          {/* Credentials Grid: Owner Details & Pet Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Owner Credentials Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">Owner Credentials</h3>
                </div>
                <span className="text-[11px] text-stone-400 font-medium">Pet Parent Profile</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Full Name</span>
                  <span className="font-semibold text-stone-800">{currentUser.owner.name}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Gender</span>
                  <span className="font-semibold text-stone-800">{currentUser.owner.gender}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl col-span-2">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Gmail / Email</span>
                  <span className="font-semibold text-stone-800 break-all">{currentUser.owner.email}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Primary Phone</span>
                  <span className="font-semibold text-stone-800">{currentUser.owner.phone}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Emergency Phone</span>
                  <span className="font-semibold text-stone-800">{currentUser.owner.emergencyContact || 'Same as primary'}</span>
                </div>
                <div className="bg-stone-50 p-3 rounded-xl col-span-2">
                  <span className="text-stone-400 block text-[10px] uppercase font-semibold">Residential Address</span>
                  <span className="font-semibold text-stone-800">
                    {currentUser.owner.address}
                    {currentUser.owner.city ? `, ${currentUser.owner.city}` : ''}
                    {currentUser.owner.pincode ? ` - ${currentUser.owner.pincode}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Pet Companion(s) */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                    <PawPrint className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm">Registered Pet Companion</h3>
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  Active in App
                </span>
              </div>

              {currentUser.pets.map((pet) => (
                <div key={pet.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={pet.avatarUrl}
                      alt={pet.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-amber-400 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-stone-900">{pet.name}</h4>
                        <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                          {pet.petIdCode}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">
                        {pet.gender} • {pet.breed} ({pet.species})
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200/60">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Age</span>
                      <span className="font-semibold text-stone-800">{pet.age}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200/60">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Weight</span>
                      <span className="font-semibold text-stone-800">{pet.weight} kg</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200/60">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Blood Group</span>
                      <span className="font-semibold text-stone-800">{pet.bloodGroup || 'DEA 1.1'}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200/60 col-span-3">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">ISO Microchip ID</span>
                      <span className="font-mono font-semibold text-stone-800">{pet.microchipNumber}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-stone-200/60 col-span-3">
                      <span className="text-stone-400 block text-[9px] uppercase font-bold">Known Allergies</span>
                      <span className="font-medium text-stone-700">
                        {pet.allergies && pet.allergies.length > 0 ? pet.allergies.join(', ') : 'None reported'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={onNavigateToPetId}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Open Pet ID Passport</span>
                    </button>
                    <button
                      onClick={onNavigateToShop}
                      className="text-xs font-bold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1"
                    >
                      <span>Order Food & Care</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: LOGIN FORM */}
      {mode === 'login' && (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          {/* Google Sign-in (Firebase Auth) */}
          <div className="mb-5 space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-60 cursor-pointer"
            >
              {googleLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Continue with Google (Firebase Auth)</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200"></div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Or email & password</span>
              <div className="flex-1 h-px bg-stone-200"></div>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Gmail / Email or Registered Phone
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={loginEmailOrPhone}
                  onChange={(e) => setLoginEmailOrPhone(e.target.value)}
                  placeholder="e.g. sarah.jenkins@gmail.com or 9820144521"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-amber-700 font-medium">Demo: password123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Petwrld</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-stone-100">
            <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider block mb-2 text-center">
              Quick 1-Click Demo Logins
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('sarah.jenkins@gmail.com')}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🐶</span>
                  <div>
                    <div className="font-bold text-xs text-stone-800">Sarah Jenkins</div>
                    <div className="text-[10px] text-stone-500">Milo (Golden Ret.)</div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('arjun.sharma@gmail.com')}
                className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🐱</span>
                  <div>
                    <div className="font-bold text-xs text-stone-800">Arjun Sharma</div>
                    <div className="text-[10px] text-stone-500">Luna (Persian Cat)</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Prompt to Register */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-center space-y-3">
            <p className="text-xs text-stone-600">
              Account not registered yet?
            </p>
            <div>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLoginError('');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-colors border border-amber-200/80"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create a New Pet Account</span>
              </button>
            </div>

            {onContinueAsGuest && (
              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={onContinueAsGuest}
                  className="text-[11px] font-medium text-stone-500 hover:text-stone-800 hover:underline"
                >
                  Continue browsing as Guest →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: REGISTRATION FORM */}
      {mode === 'register' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm">
          {registerSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">Pet Account Registered Successfully!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                Official Petwrld Digital ID Passport and credentials have been provisioned. Redirecting to your account dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-8">
              {/* Google 1-Click Fast Registration */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-stone-900">Prefer 1-Click Instant Sign-up?</div>
                  <div className="text-[11px] text-stone-500">Sign in with Google to securely link your companion profiles and database automatically.</div>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading}
                  className="shrink-0 py-2.5 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Register with Google</span>
                </button>
              </div>

              {registerError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* SECTION 1: OWNER / PET PARENT CREDENTIALS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                  <div className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                      Owner & Pet Parent Information
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Your identity as the legally registered primary caretaker
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name of Owner <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="e.g. Rohan Mehra"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="e.g. +91 98200 12345"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Owner Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={ownerGender}
                      onChange={(e) => setOwnerGender(e.target.value as OwnerGender)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Gmail / Primary Email (Sign-In ID) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="e.g. rohan.mehra@gmail.com"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        className="w-full pl-9 pr-8 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Residential Dispatch Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={ownerAddress}
                        onChange={(e) => setOwnerAddress(e.target.value)}
                        placeholder="Flat/House No., Building, Street, Area (used for ambulance & deliveries)"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={ownerCity}
                      onChange={(e) => setOwnerCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bengaluru, Delhi"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Emergency Alternate Phone
                    </label>
                    <input
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="e.g. +91 98200 99999 (Family/Neighbor)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PET COMPANION CREDENTIALS */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide">
                      Pet Companion Credentials
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Medical identification & passport specifications for your pet
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pet Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="e.g. Bruno, Simba, Chloe"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Species <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={petSpecies}
                      onChange={(e) => setPetSpecies(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 bg-white font-medium"
                    >
                      <option value="Dog">Dog 🐕</option>
                      <option value="Cat">Cat 🐈</option>
                      <option value="Bird">Bird 🦜</option>
                      <option value="Rabbit">Rabbit 🐇</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pet Breed <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petBreed}
                      onChange={(e) => setPetBreed(e.target.value)}
                      placeholder="e.g. Labrador Retriever, Indie, Persian"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pet Age <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={petAge}
                      onChange={(e) => setPetAge(e.target.value)}
                      placeholder="e.g. 2 Years 3 Months or 8 Months"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pet Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={petGender}
                      onChange={(e) => setPetGender(e.target.value as 'Male' | 'Female')}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Pet Weight (in kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={petWeight}
                      onChange={(e) => setPetWeight(e.target.value)}
                      placeholder="e.g. 18.5"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={petBloodGroup}
                      onChange={(e) => setPetBloodGroup(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 bg-white"
                    >
                      <option value="DEA 1.1 Positive">DEA 1.1 Positive (Canine)</option>
                      <option value="DEA 1.1 Negative">DEA 1.1 Negative (Universal Canine)</option>
                      <option value="Type A">Type A (Feline)</option>
                      <option value="Type B">Type B (Feline)</option>
                      <option value="Unknown">Pending Lab Test</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-stone-700">
                        ISO 11784 RFID Microchip ID
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateMicrochip}
                        className="text-[10px] font-bold text-amber-700 hover:text-amber-800"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={microchipNumber}
                      onChange={(e) => setMicrochipNumber(e.target.value)}
                      placeholder="15-digit RFID tag or click auto-generate"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Known Allergies & Dietary Restrictions
                    </label>
                    <input
                      type="text"
                      value={petAllergies}
                      onChange={(e) => setPetAllergies(e.target.value)}
                      placeholder="e.g. Chicken protein allergy, sensitive skin, flea allergy (or leave empty if none)"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Choose Pet Photo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-stone-700 mb-2">
                      Choose Pet Photo Avatar
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_AVATARS.map((avatar) => (
                        <button
                          key={avatar.label}
                          type="button"
                          onClick={() => setAvatarUrl(avatar.url)}
                          className={`relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                            avatarUrl === avatar.url
                              ? 'border-amber-500 ring-2 ring-amber-400 scale-105'
                              : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={avatar.url}
                            alt={avatar.label}
                            className="w-full h-full object-cover"
                          />
                          {avatarUrl === avatar.url && (
                            <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit & Links */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PawPrint className="w-4 h-4" />
                  <span>Create Pet Account & Provision Digital ID Passport</span>
                </button>

                <div className="text-center">
                  <span className="text-xs text-stone-600">Already registered? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRegisterError('');
                    }}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                  >
                    Log in here
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

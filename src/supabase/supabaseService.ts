import { supabase, SUPABASE_PROJECT_REF, SUPABASE_DASHBOARD_URLS } from './config';
import { UserAccount, PetProfile, BookingAppointment, CartItem } from '../types';

export { SUPABASE_DASHBOARD_URLS, SUPABASE_PROJECT_REF };

// SQL DDL statements to set up tables in Supabase SQL editor
export const SUPABASE_SETUP_SQL = `-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql

-- 1. Users / Pet Owners Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  gender TEXT,
  address TEXT,
  city TEXT,
  pincode TEXT,
  emergency_contact TEXT,
  pet_coins INTEGER DEFAULT 250,
  active_pet_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Registered Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id_code TEXT,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  gender TEXT,
  weight NUMERIC,
  avatar_url TEXT,
  color TEXT,
  blood_group TEXT,
  microchip_number TEXT,
  allergies JSONB DEFAULT '[]'::jsonb,
  owner_name TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Vet Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  service_title TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  pet_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC DEFAULT 650,
  status TEXT DEFAULT 'Confirmed',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER DEFAULT 1,
  image_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Emergency SOS Dispatches Table
CREATE TABLE IF NOT EXISTS public.emergency_sos (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  contact_number TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  triage_level TEXT DEFAULT 'CRITICAL_1',
  dispatch_status TEXT DEFAULT 'DISPATCHED_EN_ROUTE',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public access for demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_sos ENABLE ROW LEVEL SECURITY;

-- Allow public read/write policies for frictionless demo access
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Users') THEN
    CREATE POLICY "Public Access Users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Pets') THEN
    CREATE POLICY "Public Access Pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Appointments') THEN
    CREATE POLICY "Public Access Appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access Cart') THEN
    CREATE POLICY "Public Access Cart" ON public.cart_items FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Access SOS') THEN
    CREATE POLICY "Public Access SOS" ON public.emergency_sos FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`;

// Sync user account profile to Supabase 'users' table
export async function syncUserToSupabase(account: UserAccount, petCoins: number = 250): Promise<boolean> {
  try {
    const payload = {
      id: account.id,
      email: account.email,
      name: account.owner.name,
      phone: account.owner.phone,
      gender: account.owner.gender,
      address: account.owner.address,
      city: account.owner.city,
      pincode: account.owner.pincode,
      emergency_contact: account.owner.emergencyContact,
      pet_coins: petCoins,
      active_pet_id: account.activePetId,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('users').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Sync user error (table might need creation):', error.message);
      return false;
    }
    console.log('[Supabase] User profile synced to table: users');
    return true;
  } catch (e) {
    console.warn('[Supabase] Sync user exception:', e);
    return false;
  }
}

// Sync pet to Supabase 'pets' table
export async function syncPetToSupabase(userId: string, pet: PetProfile): Promise<boolean> {
  try {
    const payload = {
      id: pet.id,
      user_id: userId,
      pet_id_code: pet.petIdCode,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      weight: pet.weight,
      avatar_url: pet.avatarUrl,
      color: pet.color,
      blood_group: pet.bloodGroup,
      microchip_number: pet.microchipNumber,
      allergies: pet.allergies,
      owner_name: pet.ownerName,
      emergency_contact: pet.emergencyContact,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('pets').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Sync pet error:', error.message);
      return false;
    }
    console.log('[Supabase] Pet profile synced to table: pets');
    return true;
  } catch (e) {
    console.warn('[Supabase] Sync pet exception:', e);
    return false;
  }
}

// Sync appointment to Supabase 'appointments' table
export async function syncAppointmentToSupabase(userId: string, appointment: BookingAppointment): Promise<boolean> {
  try {
    const payload = {
      id: appointment.id,
      user_id: userId,
      service_title: appointment.serviceTitle,
      provider_name: appointment.providerName,
      pet_name: appointment.petName,
      date: appointment.date,
      time_slot: appointment.timeSlot,
      type: appointment.type,
      price: appointment.price,
      status: appointment.status,
      notes: appointment.notes || '',
    };

    const { error } = await supabase.from('appointments').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Sync appointment error:', error.message);
      return false;
    }
    console.log('[Supabase] Appointment synced to table: appointments');
    return true;
  } catch (e) {
    console.warn('[Supabase] Sync appointment exception:', e);
    return false;
  }
}

// Sync cart item to Supabase 'cart_items' table
export async function syncCartItemToSupabase(userId: string, item: CartItem): Promise<boolean> {
  try {
    const payload = {
      id: `${userId}_${item.product.id}`,
      user_id: userId,
      product_id: item.product.id,
      title: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image_url: item.product.imageUrl || '',
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('cart_items').upsert(payload, { onConflict: 'id' });
    if (error) {
      console.warn('[Supabase] Sync cart error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[Supabase] Sync cart exception:', e);
    return false;
  }
}

// Check connectivity to Supabase
export async function checkSupabaseConnection(): Promise<{ connected: boolean; tablesExist: boolean; message: string }> {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "public.users" does not exist')) {
        return {
          connected: true,
          tablesExist: false,
          message: 'Connected to Supabase! The tables are ready to be created using the 1-click SQL script.',
        };
      }
      return {
        connected: false,
        tablesExist: false,
        message: error.message,
      };
    }
    return {
      connected: true,
      tablesExist: true,
      message: 'Connected to Supabase & tables are active!',
    };
  } catch (err: any) {
    return {
      connected: false,
      tablesExist: false,
      message: err?.message || 'Connection failed',
    };
  }
}

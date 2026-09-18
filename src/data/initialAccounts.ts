import { UserAccount, OwnerProfile, PetProfile } from '../types';
import { INITIAL_PETS } from './initialData';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-sarah-jenkins',
    email: 'sarah.jenkins@gmail.com',
    password: 'password123',
    owner: {
      id: 'owner-sarah-jenkins',
      name: 'Sarah Jenkins',
      phone: '+91 98201 44521',
      gender: 'Female',
      email: 'sarah.jenkins@gmail.com',
      address: 'Flat 402, Green Glen Towers, Outer Ring Road',
      city: 'Bengaluru',
      pincode: '560103',
      emergencyContact: '+91 98201 99988',
      memberSince: 'March 2025',
    },
    pets: [INITIAL_PETS[0]], // Milo
    activePetId: INITIAL_PETS[0].id,
  },
  {
    id: 'acc-arjun-sharma',
    email: 'arjun.sharma@gmail.com',
    password: 'password123',
    owner: {
      id: 'owner-arjun-sharma',
      name: 'Arjun Sharma',
      phone: '+91 98765 12345',
      gender: 'Male',
      email: 'arjun.sharma@gmail.com',
      address: 'Plot 18, Gulmohar Enclave, Juhu',
      city: 'Mumbai',
      pincode: '400049',
      emergencyContact: '+91 98765 88888',
      memberSince: 'January 2026',
    },
    pets: [INITIAL_PETS[1]], // Luna
    activePetId: INITIAL_PETS[1].id,
  },
];

const STORAGE_ACCOUNTS_KEY = 'petwrld_accounts_v1';
const STORAGE_CURRENT_USER_KEY = 'petwrld_active_session_v3';

export function getStoredAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(INITIAL_ACCOUNTS));
      return INITIAL_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ACCOUNTS;
  } catch (e) {
    console.error('Failed to load accounts from localStorage', e);
    return INITIAL_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to localStorage', e);
  }
}

export function getCurrentUser(): UserAccount | null {
  try {
    // Clear any previous auto-logged-in session from older version
    if (localStorage.getItem('petwrld_current_user_v1')) {
      localStorage.removeItem('petwrld_current_user_v1');
    }
    const raw = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get current user', e);
    return null;
  }
}

export function setCurrentUser(account: UserAccount | null): void {
  try {
    if (account) {
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(account));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
    }
  } catch (e) {
    console.error('Failed to set current user', e);
  }
}

export function generatePetIdCode(species: string): string {
  const cleanSpecies = species.toUpperCase().slice(0, 3) || 'PET';
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PWR-${year}-${cleanSpecies}-${randomNum}`;
}

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, auth } from './config';
import { handleFirestoreError, OperationType } from './errors';
import {
  UserAccount,
  PetProfile,
  BookingAppointment,
  CartItem,
} from '../types';

/**
 * Checks whether the current user is authenticated in Firebase Auth
 * and matches the provided user ID.
 */
export function isUserAuthenticated(userId?: string | null): boolean {
  if (!userId) return false;
  return !!auth.currentUser && auth.currentUser.uid === userId;
}

/**
 * Persists or updates the UserProfile document in Cloud Firestore: /users/{userId}
 */
export async function saveUserProfileToFirestore(account: UserAccount, petCoins = 250): Promise<void> {
  if (!isUserAuthenticated(account.id)) {
    return;
  }
  const path = `users/${account.id}`;
  try {
    const userRef = doc(db, 'users', account.id);
    const payload = {
      id: account.id,
      email: account.email,
      displayName: account.owner?.name || account.email.split('@')[0],
      phone: account.owner?.phone || '',
      gender: account.owner?.gender || 'Other',
      address: account.owner?.address || '',
      city: account.owner?.city || 'Bengaluru',
      pincode: account.owner?.pincode || '',
      emergencyContact: account.owner?.emergencyContact || '',
      petCoins: typeof petCoins === 'number' ? petCoins : 250,
      activePetId: account.activePetId || (account.pets?.[0]?.id ?? ''),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await setDoc(userRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Updates petCoins balance in Firestore: /users/{userId}
 */
export async function updatePetCoinsInFirestore(userId: string, newCoins: number): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}`;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      petCoins: Math.max(0, newCoins),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Subscribes to changes on the UserProfile document
 */
export function subscribeUserProfile(
  userId: string,
  onUpdate: (data: any) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    return () => {};
  }
  const path = `users/${userId}`;
  const userRef = doc(db, 'users', userId);

  return onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

/**
 * Saves or updates a Pet document in Firestore: /users/{userId}/pets/{petId}
 */
export async function savePetToFirestore(userId: string, pet: PetProfile): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/pets/${pet.id}`;
  try {
    const petRef = doc(db, 'users', userId, 'pets', pet.id);
    const payload = {
      id: pet.id,
      userId,
      name: pet.name,
      species: pet.species,
      breed: pet.breed || '',
      age: String(pet.age || ''),
      gender: pet.gender || 'Male',
      weight: String(pet.weight || ''),
      avatarUrl: pet.avatarUrl || '',
      color: pet.color || '',
      bloodGroup: pet.bloodGroup || '',
      microchipNumber: pet.microchipNumber || '',
      petIdCode: pet.petIdCode || '',
      allergies: Array.isArray(pet.allergies) ? pet.allergies.join(', ') : String(pet.allergies || ''),
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    await setDoc(petRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a Pet document from Firestore: /users/{userId}/pets/{petId}
 */
export async function deletePetFromFirestore(userId: string, petId: string): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/pets/${petId}`;
  try {
    const petRef = doc(db, 'users', userId, 'pets', petId);
    await deleteDoc(petRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Real-time listener for user's registered pets: /users/{userId}/pets
 */
export function subscribePetsFromFirestore(
  userId: string,
  onUpdate: (pets: PetProfile[]) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    return () => {};
  }
  const path = `users/${userId}/pets`;
  const petsCol = collection(db, 'users', userId, 'pets');

  return onSnapshot(
    petsCol,
    (snapshot) => {
      const pets: PetProfile[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        pets.push({
          id: data.id || docSnap.id,
          petIdCode: data.petIdCode || 'PWR-9024-PET',
          name: data.name || 'Companion Pet',
          species: data.species || 'Dog',
          breed: data.breed || 'Companion Breed',
          age: String(data.age || '2 years'),
          gender: data.gender === 'Female' ? 'Female' : 'Male',
          weight: Number(data.weight) || 12,
          avatarUrl: data.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
          color: data.color || 'Golden',
          bloodGroup: data.bloodGroup || 'DEA 1.1 Positive',
          microchipNumber: data.microchipNumber || '985141002938475',
          allergies: Array.isArray(data.allergies) ? data.allergies : [],
          ownerName: data.ownerName || 'Pet Parent',
          emergencyContact: data.emergencyContact || '+91 98200 99999',
          vaccinations: Array.isArray(data.vaccinations) ? data.vaccinations : [],
          prescriptions: Array.isArray(data.prescriptions) ? data.prescriptions : [],
          vetVisits: Array.isArray(data.vetVisits) ? data.vetVisits : [],
        });
      });
      onUpdate(pets);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Saves a vet booking to Firestore: /users/{userId}/appointments/{appointmentId}
 */
export async function saveAppointmentToFirestore(
  userId: string,
  appointment: BookingAppointment
): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/appointments/${appointment.id}`;
  try {
    const appRef = doc(db, 'users', userId, 'appointments', appointment.id);
    const payload = {
      id: appointment.id,
      userId,
      serviceTitle: appointment.serviceTitle || 'Veterinary Consultation',
      providerName: appointment.providerName || 'Petwrld Partner Vet',
      petName: appointment.petName || 'Companion Pet',
      date: appointment.date,
      timeSlot: appointment.timeSlot || '10:00 AM',
      type: appointment.type || 'in_clinic',
      price: typeof appointment.price === 'number' ? appointment.price : 650,
      status: appointment.status || 'Confirmed',
      notes: appointment.notes || '',
      createdAt: new Date().toISOString(),
    };
    await setDoc(appRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Real-time listener for user's vet appointments: /users/{userId}/appointments
 */
export function subscribeAppointmentsFromFirestore(
  userId: string,
  onUpdate: (appointments: BookingAppointment[]) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    return () => {};
  }
  const path = `users/${userId}/appointments`;
  const appsCol = collection(db, 'users', userId, 'appointments');

  return onSnapshot(
    appsCol,
    (snapshot) => {
      const apps: BookingAppointment[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        apps.push({
          id: data.id || docSnap.id,
          serviceTitle: data.serviceTitle || 'Veterinary Consultation',
          providerName: data.providerName || 'Petwrld Partner Vet',
          petName: data.petName || 'Companion Pet',
          date: data.date || new Date().toISOString().split('T')[0],
          timeSlot: data.timeSlot || '10:00 AM',
          type: data.type || 'in_clinic',
          price: typeof data.price === 'number' ? data.price : 650,
          status: data.status || 'Confirmed',
          notes: data.notes || '',
        });
      });
      onUpdate(apps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Saves cart items to Firestore: /users/{userId}/cart/{productId}
 */
export async function syncCartItemToFirestore(
  userId: string,
  item: CartItem
): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/cart/${item.product.id}`;
  try {
    const cartRef = doc(db, 'users', userId, 'cart', item.product.id);
    const payload = {
      id: item.product.id,
      userId,
      productId: item.product.id,
      title: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl || '',
      updatedAt: new Date().toISOString(),
    };
    await setDoc(cartRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Removes an item from Firestore cart: /users/{userId}/cart/{productId}
 */
export async function removeCartItemFromFirestore(
  userId: string,
  productId: string
): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/cart/${productId}`;
  try {
    const cartRef = doc(db, 'users', userId, 'cart', productId);
    await deleteDoc(cartRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Clears user's cart in Firestore
 */
export async function clearCartInFirestore(userId: string): Promise<void> {
  if (!isUserAuthenticated(userId)) {
    return;
  }
  const path = `users/${userId}/cart`;
  try {
    const cartCol = collection(db, 'users', userId, 'cart');
    const snapshot = await getDocs(cartCol);
    const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribes to real-time cart changes: /users/{userId}/cart
 */
export function subscribeCartFromFirestore(
  userId: string,
  onUpdate: (items: any[]) => void
): () => void {
  if (!isUserAuthenticated(userId)) {
    return () => {};
  }
  const path = `users/${userId}/cart`;
  const cartCol = collection(db, 'users', userId, 'cart');

  return onSnapshot(
    cartCol,
    (snapshot) => {
      const items: any[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data());
      });
      onUpdate(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

/**
 * Dispatches an Emergency SOS Alert to Firestore: /emergency_sos/{sosId}
 */
export async function dispatchEmergencySosToFirestore(
  userId: string,
  alert: {
    id: string;
    emergencyType: string;
    location: string;
    petName: string;
    notes?: string;
    status?: string;
  }
): Promise<void> {
  if (!auth.currentUser) {
    return;
  }
  const path = `emergency_sos/${alert.id}`;
  try {
    const sosRef = doc(db, 'emergency_sos', alert.id);
    const payload = {
      id: alert.id,
      userId,
      emergencyType: alert.emergencyType,
      location: alert.location,
      petName: alert.petName || 'Companion Pet',
      notes: alert.notes || '',
      status: alert.status || 'Dispatched',
      createdAt: new Date().toISOString(),
    };
    await setDoc(sosRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

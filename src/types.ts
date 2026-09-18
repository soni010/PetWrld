export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';

export type OwnerGender = 'Male' | 'Female' | 'Non-binary' | 'Prefer not to say';

export interface OwnerProfile {
  id: string;
  name: string;
  phone: string;
  gender: OwnerGender;
  email: string; // gmail / email
  address: string;
  city: string;
  pincode: string;
  emergencyContact: string;
  memberSince: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  owner: OwnerProfile;
  pets: PetProfile[];
  activePetId: string;
}

export interface PetProfile {
  id: string;
  petIdCode: string; // e.g. "PWR-9024-DOG"
  name: string;
  species: 'Dog' | 'Cat' | 'Bird' | 'Rabbit';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  weight: number; // in kg
  color: string;
  microchipNumber: string;
  avatarUrl: string;
  allergies: string[];
  ownerName: string;
  emergencyContact: string;
  bloodGroup: string;
  vaccinations: VaccineRecord[];
  prescriptions: PrescriptionRecord[];
  vetVisits: VetVisitRecord[];
}

export interface VaccineRecord {
  id: string;
  name: string;
  dateAdministered: string;
  dueDate: string;
  status: 'Completed' | 'Upcoming' | 'Overdue';
  veterinarian: string;
  clinic: string;
  batchNumber?: string;
}

export interface PrescriptionRecord {
  id: string;
  medicationName: string;
  dosage: string;
  prescribedBy: string;
  date: string;
  duration: string;
  notes: string;
  documentName?: string;
}

export interface VetVisitRecord {
  id: string;
  date: string;
  clinicName: string;
  vetName: string;
  reason: string;
  diagnosis: string;
  followUpDate?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'clothes' | 'medicine' | 'toys' | 'grooming' | 'accessories';
  petType: 'all' | 'dog' | 'cat' | 'bird';
  price: number;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  description: string;
  inStock: boolean;
  featured?: boolean;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface VetDoctor {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  consultFee: number;
  clinicName: string;
  imageUrl: string;
  availableDays: string[];
  consultTypes: ('video' | 'chat' | 'in_clinic')[];
}

export interface BookingAppointment {
  id: string;
  type: 'online_vet' | 'in_clinic' | 'spa_grooming' | 'vaccine';
  serviceTitle: string;
  providerName: string;
  petName: string;
  date: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  price: number;
  notes?: string;
}

export interface PetgramPost {
  id: string;
  petName: string;
  petHandle: string;
  petAvatar: string;
  breed: string;
  imageUrl: string;
  caption: string;
  likes: number;
  isLiked?: boolean;
  comments: {
    id: string;
    author: string;
    avatar: string;
    text: string;
    timestamp: string;
  }[];
  timestamp: string;
  tags: string[];
}

export interface ForumPost {
  id: string;
  channel: string; // e.g. "r/DogCare", "r/VetQuestions", "r/PetStories"
  author: string;
  petBadge?: string;
  title: string;
  content: string;
  upvotes: number;
  userVote?: 1 | -1 | 0;
  commentsCount: number;
  timestamp: string;
  tags: string[];
  comments?: {
    id: string;
    author: string;
    content: string;
    timestamp: string;
    upvotes: number;
  }[];
}

export interface DirectoryListing {
  id: string;
  title: string;
  category: 'kennel' | 'pet_shop' | 'trainer' | 'groomer' | 'pet_sitter' | 'airbnb_landlord' | 'insurance';
  rating: number;
  reviewsCount: number;
  location: string;
  priceRange: string;
  commissionRate: string; // e.g. "8% booking commission"
  imageUrl: string;
  description: string;
  tags: string[];
  contactPhone: string;
  verified: boolean;
}

export interface NgoInitiative {
  id: string;
  title: string;
  ngoName: string;
  type: 'sterilization' | 'rabies_awareness' | 'adoption_drive' | 'rescue_shelter';
  location: string;
  dateRange: string;
  description: string;
  imageUrl: string;
  targetCount: string;
  progressPercent: number;
}

export interface AdoptablePet {
  id: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Puppy' | 'Kitten';
  breed: string;
  age: string;
  gender: 'Male' | 'Female';
  ngoPartner: string;
  location: string;
  imageUrl: string;
  healthStatus: string;
  story: string;
  sterilized: boolean;
  vaccinated: boolean;
}

export interface PetEvent {
  id: string;
  title: string;
  type: 'race' | 'long_jump' | 'fashion_show' | 'festival' | 'agility';
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  description: string;
  prizes: string;
  entryFee: number;
  spectatorFee: number;
  participantsCount: number;
  maxParticipants: number;
  registrationOpen: boolean;
}

export interface WikiArticle {
  id: string;
  title: string;
  category: 'Breeds' | 'Nutrition' | 'Behavior' | 'Emergency' | 'Grooming';
  summary: string;
  content: string[];
  funFact: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  coinsReward: number;
}

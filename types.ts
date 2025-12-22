
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN',
  NONE = 'NONE'
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  participants: string[];
  messages: Message[];
  lastUpdated: number;
}

export interface Report {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details?: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'rejected';
  adminNote?: string;
}

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: 'Apartment' | 'Villa' | 'Warehouse' | 'Plot' | 'Land';
  beds?: number;
  baths?: number;
  sqft: number;
  dimensions?: string;
  builtUpArea?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  imageUrl: string;
  images: string[];
  verified: boolean;
  featured: boolean;
  coordinates: { lat: number; lng: number };
  ownerId: string;
  reviews: Review[];
  reported?: boolean;
  legalDocs?: {
    saleDeedUrl?: string;
    nocUrl?: string;
    verificationNotes?: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  isVerified: boolean;
  role: UserRole;
  savedProperties: string[];
  likedProperties: string[];
  isBanned?: boolean;
}

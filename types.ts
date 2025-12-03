

export interface Review {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Therapist {
  id: number;
  name: string;
  email?: string; // For sending booking confirmations
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  description: string; // Therapist's biography or professional summary
  qualifications: string[];
  clinicPhotos: string[];
  reviews: Review[];
  fee: number;
  
  // New fields from the image
  isProfileClaimed: boolean;
  experience: number;
  specialistExperience: number;
  patientSatisfaction: number;

  clinic: {
    name: string;
    address: string;
    rating: number;
    timings: {
      days: string;
      hours: string[];
    };
    isOnlinePaymentAvailable: boolean;
    isPrime: boolean;
    maxWaitTime: number; // in minutes
    isVerified: boolean;
    phone?: string;
  }
}

export interface User {
  id: string; // Supabase user ID
  name: string;
  email?: string; // Now optional to support phone-only login
  role: 'patient' | 'therapist' | 'admin';
  therapistId?: number; // Links a user account to a therapist profile
}

export interface IntakeForm {
  personalInfo: {
    fullName: string;
    dob: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  };
  medicalHistory: {
    allergies: string;
    medications: string;

    pastSurgeries: string;
    chronicConditions: string;
  };
  currentCondition: {
    primaryComplaint: string;
    symptoms: string;
    painLevel: number; // 1-10 scale
    onset: string;
    betterWith: string;
    worseWith: string;
  };
  goals: {
    patientGoals: string;
  };
}


export interface Booking {
  id: string;
  userId: string;
  patientName: string;
  therapist: Therapist;
  date: Date;
  time: string;
  status?: 'confirmed' | 'checked-in' | 'completed' | 'cancelled';
  intakeForm?: IntakeForm;
  patientEmail?: string;
  phoneNo?: string;
  service?: string;
  isPaid?: boolean;
}
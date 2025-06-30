export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  startDate: string;
  startWeight: number;
  currentWeight?: number;
  goalWeight?: number;
  status: 'active' | 'inactive' | 'yet-to-start' | 'completed';
  notes: string;
  weightEntries: WeightEntry[];
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: 'dumbbell' | 'bodyweight' | 'hiit' | 'core' | 'zumba' | 'yoga';
  videoUrl: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'supplements' | 'equipment' | 'apparel' | 'accessories';
  price: string;
  imageUrl: string;
  purchaseUrl: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  calories: number;
  imageUrl: string;
}

export interface ReferralSubmission {
  referrerName: string;
  referrerEmail: string;
  friendName: string;
  friendEmail: string;
  message?: string;
}
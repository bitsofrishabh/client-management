export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  startDate: string;
  startWeight: number; // in kg
  currentWeight?: number; // in kg
  goalWeight?: number; // in kg
  height?: number; // in cm
  status: 'active' | 'inactive' | 'yet-to-start' | 'completed';
  notes: string;
  healthIssues?: string[];
  dietEndDate?: string | null;
  weightEntries: WeightEntry[];
  comments: Comment[];
  routine?: string;
  healthSummary?: string;
}

export interface WeightEntry {
  date: string;
  weight: number; // in kg
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
  category: 'green-tea' | 'apple-cider-vinegar' | 'seeds-dry-fruits' | 'grains' | 'workout-essentials' | 'supplements' | 'weight-machine';
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
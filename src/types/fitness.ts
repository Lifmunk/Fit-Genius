export interface UserProfile {
  name: string;
  weight: number;
  weightUnit: 'kg' | 'lbs';
  height: number;
  heightUnit: 'cm' | 'ft';
  age: number;
  gender: 'male' | 'female' | 'other';
  goal: 'lose' | 'gain' | 'maintain' | 'build';
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  equipment?: string;
  dietaryPreferences?: string;
  allergies?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  duration: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  weeklyPlan: WorkoutDay[];
  tips: string[];
  generatedAt: string;
}

export interface Meal {
  meal: string;
  time: string;
  name: string;
  ingredients: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  dailyPlan: {
    targetCalories: number;
    meals: Meal[];
    totalMacros: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  tips: string[];
  generatedAt: string;
}

export interface ProgressEntry {
  date: string;
  weight?: number;
  workoutsCompleted?: number;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

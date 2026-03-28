export type EffortLevel = "Low" | "Medium" | "High";
export type Cost = "$" | "$$" | "$$$";
export type Category = "healthy" | "quick" | "budget";
export type SkillRequired = "Beginner" | "Intermediate" | "Advanced";

export interface Meal {
    id: string;
    name: string;
    description: string;
    category: Category[];
    timeMinutes: number;
    servings: number;
    effortLevel: EffortLevel;
    skillRequired: SkillRequired;
    cost: Cost;
    allergens: string[];
    dietaryPreferences: string[];
    favorited: boolean;
    imageUrl: string;
}
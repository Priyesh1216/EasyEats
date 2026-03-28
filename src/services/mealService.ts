import { collection, doc, writeBatch, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { meals } from "../data/meals";
import { Meal } from "../types/meal";

export const clearAndSeedMeals = async (): Promise<void> => {
    try {
        // Clear old meals
        const snapshot = await getDocs(collection(db, "meals"));
        const deleteBatch = writeBatch(db);
        snapshot.forEach((d) => deleteBatch.delete(d.ref));
        await deleteBatch.commit();
        console.log("Old meals cleared");

        // Add new meals
        const seedBatch = writeBatch(db);
        meals.forEach((meal: Meal) => {
            const ref = doc(collection(db, "meals"), meal.id);
            seedBatch.set(ref, meal);
        });
        await seedBatch.commit();
        console.log("30 meals added into DB");
    }
    catch (error) {
        console.error("Failed:", error);
        throw error;
    }
};
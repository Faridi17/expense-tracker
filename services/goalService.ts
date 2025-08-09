import { GoalType, ResponseType } from "@/types";
import { firestore } from "@/config/firebase";
import { addDoc, collection } from "firebase/firestore";

export const createGoal = async (
    goalData: Partial<GoalType>
): Promise<ResponseType> => {
    try {
        await addDoc(collection(firestore, "goals"), goalData);

        return { success: true, data: { ...goalData } };
    } catch (error: any) {
        return { success: false, msg: error.message };
    }
};
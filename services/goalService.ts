import { GoalType, ResponseType } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from 'react-native-uuid';

const formatDate = (isoString: string) => 
    new Date(isoString).toISOString().slice(0, 19).replace("T", " ");

export const createGoal = async (
    db: SQLiteDatabase,
    goalData: Partial<GoalType>
): Promise<ResponseType> => {
    try {
        const formattedStartDate = formatDate(goalData.startDate as string);
        const formattedEndDate = formatDate(goalData.endDate as string);
        goalData.id = uuid.v4();

        await db.runAsync(
            `INSERT INTO goals (id, uid, name, target, collected, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                goalData.id,
                goalData.uid,
                goalData.name,
                goalData.target,
                goalData.collected,
                formattedStartDate,
                formattedEndDate
            ]
        );

        return { success: true, data: { ...goalData } };
    } catch (error: any) {
        return { success: false, msg: error.message };
    }
};
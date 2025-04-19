import { BudgetType, ResponseType } from "@/types";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from 'react-native-uuid';

const formatDate = (isoString: string) => 
    new Date(isoString).toISOString().slice(0, 19).replace("T", " ");

export const createBudget = async (
    db: SQLiteDatabase,
    budgetData: Partial<BudgetType>
): Promise<ResponseType> => {
    try {
        const formattedStartDate = formatDate(budgetData.startDate as string);
        const formattedEndDate = formatDate(budgetData.endDate as string);
        budgetData.id = uuid.v4();

        const spent = await checkSpent(
            db,
            budgetData.uid as string,
            budgetData.category as string,
            formattedStartDate,
            formattedEndDate
        );        
        budgetData.spent = spent;

        await db.runAsync(
            `INSERT INTO budgets (id, uid, category, amount, spent, startDate, endDate) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                budgetData.id,
                budgetData.uid,
                budgetData.category,
                budgetData.amount,
                budgetData.spent,
                formattedStartDate,
                formattedEndDate
            ]
        );

        return { success: true, data: { ...budgetData } };
    } catch (error: any) {
        return { success: false, msg: error.message };
    }
};

export const checkSpent = async (
    db: SQLiteDatabase,
    uid: string,
    category: string,
    startDate: string,
    endDate: string
): Promise<number> => {
    try {
        const transactions = await db.getAllAsync(
            `SELECT SUM(amount) as totalSpent FROM transactions WHERE uid = ? AND category = ? AND createdAt BETWEEN ? AND ?`,
            [uid, category, startDate, endDate]
        );

        return transactions[0]?.totalSpent || 0;
    } catch (error) {
        console.error("Error fetching spent amount:", error);
        return 0;
    }
};

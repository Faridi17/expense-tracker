import { BudgetType, ResponseType } from "@/types";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/config/firebase";

export const createBudget = async (
    budgetData: Partial<BudgetType>
): Promise<ResponseType> => {
    try {
        const spent = await checkSpent(budgetData.uid as string, budgetData.category as string, budgetData.fromDate as Date, budgetData.toDate as Date);        
        budgetData.spent = spent        

        await addDoc(collection(firestore, "budgets"), budgetData);

        return { success: true, data: { ...budgetData } };

    } catch (error: any) {
        return { success: false, msg: error.message };
    }
};

export const checkSpent = async (uid: string, category: string, fromDate: Date, toDate: Date): Promise<number> => {
    try {
        const transactionsRef = collection(firestore, "transactions");
        const q = query(
            transactionsRef,
            where("uid", "==", uid),
            where("category", "==", category),
            where("date", ">=", fromDate),  
            where("date", "<=", toDate)   
        );

        const querySnapshot = await getDocs(q);
        let totalSpent = 0;

        querySnapshot.forEach((doc) => {
            const transaction = doc.data();
            totalSpent += transaction.amount || 0;
        });

        return totalSpent;

    } catch (error) {
        console.error("Error fetching spent amount:", error);
        return 0;
    }
};

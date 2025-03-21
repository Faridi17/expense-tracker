import { ResponseType, TransactionType, WalletType } from "@/types";
import { uploadFileToLocal } from "./imageService";
import { Alert } from "react-native";
import { expenseCategories } from "@/constants/data";
import { SQLiteDatabase } from "expo-sqlite";
import uuid from 'react-native-uuid';

export const createTransaction = async (
    db: SQLiteDatabase,
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {

    try {
        const { id, type, walletId, amount, image, category, uid, description } = transactionData;
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: "Transaksi tidak valid" };
        }


        const res = await updateWalletForNewTransaction(db, walletId, Number(amount), type);
        if (!res.success) return res;

        if (type === "expense") {
            await updateBudgetForNewTransaction(db, uid!, category!, Number(amount));
        }

        if (image) {
            const imageUploadRes = await uploadFileToLocal(image, "transactions");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Gagal menggunggah kuitansi" };
            }
            transactionData.image = imageUploadRes.data;
        }

        const transcationId = uuid.v4();
        await db.runAsync(
            `INSERT INTO transactions (id, walletId, amount, type, image, category, description, uid) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [transcationId, walletId, amount, type, transactionData.image, category, description, uid]
        );


        return { success: true, data: { ...transactionData, id } };
    } catch (err: any) {
        console.error("Error saat menyimpan transaksi:", err);
        return { success: false, msg: err.message };
    }
};

const updateWalletForNewTransaction = async (
    db: SQLiteDatabase,
    walletId: string,
    amount: number,
    type: string
): Promise<ResponseType> => {
    try {
        const wallet = await db.getFirstAsync<WalletType>("SELECT * FROM wallets WHERE id = ?", [walletId]);
        if (!wallet) {
            console.log("Dompet tidak ditemukan");
            return { success: false, msg: "Dompet tidak ditemukan" };
        }

        if (type === "expense" && wallet.amount - amount < 0) {
            return { success: false, msg: "Saldo tidak mencukupi" };
        }

        const updatedAmount = type === "income" ? wallet.amount + amount : wallet.amount - amount;
        const updateField = type === "income" ? "totalIncome" : "totalExpenses";
        const updatedTotals = wallet[updateField] + amount;

        await db.runAsync(
            `UPDATE wallets 
             SET amount = ?, ${updateField} = ? 
             WHERE id = ?`,
            [updatedAmount, updatedTotals, walletId]
        );

        return { success: true };
    } catch (err: any) {
        console.error("Error saat memperbarui dompet:", err);
        return { success: false, msg: err.message };
    }
};

const updateBudgetForNewTransaction = async (
    db: SQLiteDatabase,
    uid: string,
    category: string,
    amount: number
): Promise<ResponseType> => {
    try {
        const currentDateTime = new Date().toISOString().slice(0, 19).replace("T", " ");

        const budgets = await db.getFirstAsync(
            `SELECT * FROM budgets 
             WHERE uid = ? AND category = ? 
             AND startDate <= ? AND endDate >= ?`,
            [uid, category, currentDateTime, currentDateTime]
        );

        if (!budgets) {
            return { success: false, msg: "Tidak ada anggaran yang sesuai" };
        }

        const newSpent = (budgets.spent || 0) + amount;
        const budgetLimit = budgets.amount || 0;

        await db.runAsync(
            `UPDATE budgets 
             SET spent = ? 
             WHERE id = ?`,
            [newSpent, budgets.id]
        );

        if (budgetLimit > 0 && newSpent / budgetLimit >= 0.9) {
            const categoryLabel = expenseCategories[category]?.label || category;
            Alert.alert(
                "Peringatan Anggaran!",
                `Pengeluaran untuk kategori ${categoryLabel} telah mencapai ${Math.round(
                    (newSpent / budgetLimit) * 100
                )}% dari batas anggaran.`,
                [{ text: "OK" }]
            );
        }

        return { success: true };
    } catch (err: any) {
        console.error("Error saat memperbarui anggaran:", err);
        return { success: false, msg: err.message };
    }
};


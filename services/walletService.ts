import { ResponseType, WalletType } from "@/types";
import { SQLiteDatabase, useSQLiteContext } from "expo-sqlite";
import { uploadFileToLocal } from "./imageService";
import uuid from 'react-native-uuid';

export const createOrUpdateWallet = async (
    db: SQLiteDatabase, 
    walletData: Partial<WalletType>
): Promise<ResponseType> => {

    try {
        let walletToSave = { ...walletData };
        

        if (walletData.image) {
            const imageUploadRes = await uploadFileToLocal(walletData.image, "wallets");
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || "Gagal menggunggah ikon dompet" };
            }
            walletToSave.image = imageUploadRes.data;
        }
        

        if (!walletData.id) {
            const walletId = uuid.v4(); 
            walletToSave.id = walletId
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;

            await db.runAsync(
                `INSERT INTO wallets (id, name, amount, totalIncome, totalExpenses, image, uid) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [  
                    walletToSave.id,
                    walletToSave.name,
                    walletToSave.amount,
                    walletToSave.totalIncome,
                    walletToSave.totalExpenses,
                    walletToSave.image || null,
                    walletToSave.uid,
                ]
            );

            const result = await db.getFirstAsync("SELECT last_insert_rowid() AS id");
            walletToSave.id = result.id.toString();
        } else {
            await db.runAsync(
                `UPDATE wallets 
                 SET name = ?, image = ? 
                 WHERE id = ?`,
                [walletToSave.name, walletToSave.image || null, walletToSave.id]
            );
        }

        return { success: true, data: walletToSave };
    } catch (error: any) {
        return { success: false, msg: error.message };
    }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
    const db = useSQLiteContext();
     
    try {
        await db.runAsync("DELETE FROM wallets WHERE id = ?", [walletId]);
        return { success: true, msg: "Dompet berhasil dihapus" };
    } catch (error: any) {
        console.log("Error deleting wallet:", error);
        return { success: false, msg: error.message };
    }
};
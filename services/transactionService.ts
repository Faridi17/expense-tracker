import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
    try {
        const { id, type, walletId, amount, image } = transactionData
        if (!amount || amount <= 0 || !walletId || !type) {
            return { success: false, msg: 'Transaksi tidak valid' }
        }

        if (!id) {
            const res = await updateWalletForNewTransaction(
                walletId,
                Number(amount!),
                type
            )
            if (type === 'expense') {
               const resBudget = await updateBudgetForNewTransaction(transactionData.uid!, transactionData.category!, Number(amount!), new Date());
               
               console.log(resBudget);
            }

            if (!res.success) return res
        }


        if (image) {
            const imageUploadRes = await uploadFileToCloudinary(image, 'transactions')
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || 'Gagal menggunggah kuitansi' }

            }
            transactionData.image = imageUploadRes.data
        }
        const transactionRef = id
            ? doc(firestore, 'transactions', id)
            : doc(collection(firestore, 'transactions'))

        await setDoc(transactionRef, transactionData, { merge: true })

        return { success: true, data: { ...transactionData, id: transactionRef.id } }
    } catch (err: any) {
        console.log('error creating or updating transaction', err);
        return { success: false, msg: err.message }

    }
}

const updateWalletForNewTransaction = async (
    walletId: string,
    amount: number,
    type: string
) => {
    try {
        const walletRef = doc(firestore, 'wallets', walletId)
        const walletSnapshot = await getDoc(walletRef)
        if (!walletSnapshot.exists()) {
            console.log('error updating wallet for new transaction');
            return { success: false, msg: 'Dompet tidak ditemukan' }
        }

        const walletData = walletSnapshot.data() as WalletType

        if (type == 'expense' && walletData.amount! - amount < 0) {
            return { success: false, msg: 'Dompet yang dipilih tidak memiliki saldo yang cukup' }
        }

        const updateType = type == 'income' ? 'totalIncome' : 'totalExpenses'
        const updatedWalletAmount =
            type == 'income'
                ? Number(walletData.amount) + amount
                : Number(walletData.amount) - amount

        const updatedTotals = type == 'income'
            ? Number(walletData.totalIncome) + amount
            : Number(walletData.totalExpenses) + amount

        await updateDoc(walletRef, {
            amount: updatedWalletAmount,
            [updateType]: updatedTotals
        })

        return { success: true }
    } catch (err: any) {
        console.log('error updating transaction for new transaction', err);
        return { success: false, msg: err.message }

    }
}

const updateBudgetForNewTransaction = async (
    uid: string,
    category: string,
    amount: number,
    date: Date
) => {
    try {
        const budgetsRef = collection(firestore, 'budgets');

        // Cari budget berdasarkan UID, kategori, dan rentang tanggal
        const q = query(
            budgetsRef,
            where('uid', '==', uid),
            where('category', '==', category),
            where('fromDate', '<=', date),
            where('toDate', '>=', date)
        );

        const budgetSnapshot = await getDocs(q);

        if (budgetSnapshot.empty) {
            return { success: false, msg: 'Tidak ada anggaran yang sesuai' };
        }

        // Update spent pada semua budget yang cocok
        const batchUpdates = budgetSnapshot.docs.map(async (budgetDoc) => {
            const budgetData = budgetDoc.data();
            const newSpent = (budgetData.spent || 0) + amount;

            await updateDoc(doc(firestore, 'budgets', budgetDoc.id), {
                spent: newSpent
            });
        });

        await Promise.all(batchUpdates);

        return { success: true };
    } catch (err: any) {
        console.log('error updating budget for new transaction', err);
        return { success: false, msg: err.message };
    }
};
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { formatRupiah } from './formatRupiah';
import { expenseCategories, transactionTypes } from '@/constants/data';
import { SQLiteDatabase } from 'expo-sqlite';

export const exportToExcel = async (
    db: SQLiteDatabase,
    uid: string,
    report: { fromDate: string; toDate: string; nameReport: string }
): Promise<{ success: boolean; msg?: string }> => {
    try {
        const fromDate = new Date(report.fromDate).toISOString().slice(0, 19).replace("T", " ");
        const toDate = new Date(report.toDate).toISOString().slice(0, 19).replace("T", " ");

        const transactions = await db.getAllAsync(
            `SELECT * FROM transactions WHERE uid = ? AND createdAt >= ? AND createdAt <= ?`,
            [uid, fromDate, toDate]
        );

        if (transactions.length === 0) {
            Alert.alert('Info', 'Tidak ada transaksi untuk diekspor.');
            return { success: false, msg: 'Tidak ada transaksi untuk diekspor' };
        }

        const dataForExcel = transactions.map((item: any, index: number) => ({
            No: index + 1,
            Tanggal: new Date(item.createdAt).toISOString().split('T')[0],
            Tipe: transactionTypes.find((t) => t.value === item.type)?.label || '-',
            Kategori: expenseCategories[item.category]?.label || '-',
            Deskripsi: item.description || '-',
            Jumlah: formatRupiah(item.amount || 0),
        }));
        

        const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');

        const excelData = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
        const fileUri = FileSystem.documentDirectory + `${report.nameReport}.xlsx`;

        await FileSystem.writeAsStringAsync(fileUri, excelData, { encoding: FileSystem.EncodingType.Base64 });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            Alert.alert('Sukses', `File berhasil diekspor: ${fileUri}`);
        }

        return { success: true };
    } catch (err: any) {
        console.error('Error exporting transactions:', err);
        return { success: false, msg: err.message };
    }
};
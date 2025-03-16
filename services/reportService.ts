import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { ReportType, ResponseType } from '@/types';
import { firestore } from '@/config/firebase';
import { formatRupiah } from './formatRupiah';
import { expenseCategories, transactionTypes } from '@/constants/data';

export const exportToExcel = async (uid: string, report: ReportType): Promise<ResponseType> => {
    try {
        const db = firestore;

        const transactionQuery = query(
            collection(db, 'transactions'),
            where('uid', '==', uid),
            where('date', '>=', report.fromDate),
            where('date', '<=', report.toDate),
            orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(transactionQuery);
        

        if (querySnapshot.empty) {
            Alert.alert('Info', 'Tidak ada transaksi untuk diekspor.');
            return { success: false, msg: 'Tidak ada transaksi untuk diekspor' };
        }

        // Konversi data transaksi ke format array untuk Excel
        const dataForExcel = querySnapshot.docs.map((doc, index) => {
            const item = doc.data();
            
            return {
                No: index + 1,
                Tanggal: item.date.toDate().toLocaleDateString(),
                Tipe: transactionTypes.find((t) => t.value === item.type)?.label || '-',
                Kategori: expenseCategories[item.category]?.label || '-',
                Deskripsi: item.description || '-',
                Jumlah: formatRupiah(item.amount || 0) 
            };
        });

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

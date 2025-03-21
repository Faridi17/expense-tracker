import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import { ResponseType } from "@/types";

const LOCAL_UPLOADS_DIR = `${FileSystem.documentDirectory}uploads/`;

export const uploadFileToLocal = async (
    file: { uri?: string } | string,
    folderName: string
): Promise<ResponseType> => {
    try {
        if (!file) return { success: true, data: null };
        if (typeof file === 'string') {
            return { success: true, data: file };
        }

        if (file.uri) {
            const uniqueId = uuid.v4(); 
            const fileExtension = file.uri.split('.').pop() || 'jpg';
            const fileName = `file_${uniqueId}.${fileExtension}`;
            const localFilePath = `${LOCAL_UPLOADS_DIR}${folderName}/${fileName}`;

            await FileSystem.makeDirectoryAsync(`${LOCAL_UPLOADS_DIR}${folderName}/`, { intermediates: true });

            await FileSystem.copyAsync({
                from: file.uri,
                to: localFilePath
            });

            return { success: true, data: localFilePath };
        }

        return { success: true };
    } catch (error: any) {
        return { success: false, msg: error.message || 'Gagal menyimpan foto secara lokal' };
    }
};


export const getProfileImage = (file: any) => {
    if(file && typeof file == 'string') return file 
    if(file && typeof file == 'object') return file.uri

    return require('../assets/images/defaultAvatar.png')
}

export const getFilePath = (file: any) => {
    if(file && typeof file == 'string') return file 
    if(file && typeof file == 'object') return file.uri

    return null
}
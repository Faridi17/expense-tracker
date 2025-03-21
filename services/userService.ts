import { ResponseType, UserDataType } from "@/types";
import { useSQLiteContext } from "expo-sqlite";
import { uploadFileToLocal } from "./imageService";

export const updateUser = async (
    db: ReturnType<typeof useSQLiteContext>, 
    uid: string, 
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {
        if (updatedData.image && updatedData?.image?.uri) {
            const imageUploadRes = await uploadFileToLocal(updatedData.image, 'users');
            if (!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || 'Gagal menggunggah foto' };
            }
            updatedData.image = imageUploadRes.data;
        }

        await db.runAsync(
            `UPDATE users 
             SET name = ?, image = ?, phone = ?, profession = ?, address = ? 
             WHERE uid = ?`,
            [
                updatedData.name,
                updatedData.image || null,
                updatedData.phone || null,
                updatedData.profession || null,
                updatedData.address || null,
                uid
            ]
        );

        return { success: true, msg: 'Berhasil diubah' };
    } catch (error: any) {
        return { success: false, msg: error?.message };
    }
};

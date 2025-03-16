import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "./imageService";

export const updateUser = async (
    uid: string,
    updatedData: UserDataType
): Promise<ResponseType> => {
    try {

        if(updatedData.image && updatedData?.image?.uri) {
            const imageUploadRes = await uploadFileToCloudinary(updatedData.image, 'users')
            if(!imageUploadRes.success) {
                return { success: false, msg: imageUploadRes.msg || 'Gagal menggunggah foto'}
                
            }
            updatedData.image = imageUploadRes.data
        }
        const useRef = doc(firestore, 'users', uid)
        await updateDoc(useRef, updatedData)

        return { success: true, msg: 'Berhasil diubah' }
    } catch (error: any) {
        return { success: false, msg: error?.message }
    }
}
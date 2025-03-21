import { Alert, ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { WalletType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ImageUpload from '@/components/ImageUpload'
import { createOrUpdateWallet, deleteWallet } from '@/services/walletService'
import { useSQLiteContext } from 'expo-sqlite'

const WaletModal = () => {
    const db = useSQLiteContext();
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [wallet, setWallet] = useState<WalletType>({
        name: '',
        image: null
    })
    const router = useRouter()
    const oldWallet: { name: string; image: string; id: string} = useLocalSearchParams()    

    useEffect(() => {
        if(oldWallet?.id) {
            setWallet({
                name: oldWallet?.name,
                image: oldWallet?.image
            })
        }
    }, [])

    const onSubmit = async () => {
        const {name, image} = wallet
        if(!name.trim()) {
            Alert.alert("Dompet", 'Harap semua kolom diisi')
            return
        }

        const data: WalletType = {
            name,
            image,
            uid: user?.uid
        }

        if(oldWallet?.id) data.id = oldWallet?.id
        
        setLoading(true)
        
        const res = await createOrUpdateWallet(db, data)
        setLoading(false)

        if(res.success) {
            router.back()
        } else {
            Alert.alert("Dompet", res.msg)
        }
    }

    const onDelete = async () => {
        if(!oldWallet?.id) return
        setLoading(true)
        const res = await deleteWallet(oldWallet?.id)
        setLoading(false)

        if(res.success){
            router.back()
        } else {
            Alert.alert('Wallet', res.msg)
        }
    }

    const showDeleteAlert = () => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin melanjutkan? \nTindakan ini akan menghapus semua transaksi yang terkait dengan dompet ini',
            [
                {
                    text: "Batal",
                    onPress: () => console.log('Batalkan Penghapusan'),
                    style: 'cancel',
                },
                {
                    text: "Hapus",
                    onPress: () => onDelete(),
                    style: 'destructive',
                },
            ]
        )
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header 
                    title={oldWallet?.id ? 'Ubah Dompet' : 'Tambah Dompet'} 
                    leftIcon={<BackButton />} 
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form}>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Nama Dompet</Typo>
                        <Input
                            placeholder='Gaji'
                            value={wallet.name}
                            onChangeText={(value) => setWallet({...wallet, name: value})}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Ikon Dompet</Typo>
                        <ImageUpload 
                            file={wallet.image}
                            onClear={() => setWallet({ ...wallet, image: null})}
                            onSelect={(file) => setWallet({...wallet, image: file})}
                            placeholder='Unggah Gambar'
                        />
                    </View>
                </ScrollView>
            </View>
        
            <View style={styles.footer}>
                {
                    oldWallet?.id && !loading && (
                        <Button
                            onPress={showDeleteAlert}
                            style={{
                                backgroundColor: colors.rose,
                                paddingHorizontal: spacingX._15
                            }}
                        >
                            <Icons.Trash
                                color={colors.white}
                                size={verticalScale(24)}
                                weight='bold'
                            />
                        </Button>
                    )
                }
                <Button onPress={onSubmit} loading={loading} style={{flex: 1}}>
                    <Typo color={colors.black} fontWeight={'700'}>
                        {oldWallet?.id ? 'Ubah Dompet' : 'Tambah Dompet'}
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default WaletModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacingX._20
    },
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral700,
        marginBottom: spacingY._5,
        borderTopWidth: 1,
    },
    form: {
        gap: spacingY._30,
        marginTop: spacingY._15
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center"
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(135),
        width: verticalScale(135),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    editIcon: {
        position: "absolute",
        bottom: spacingY._5,
        right: spacingY._7,
        borderRadius: 100,
        backgroundColor: colors.neutral100,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 4,
        padding: spacingY._7
    },
    inputContainer: {
        gap: spacingY._10
    }
})
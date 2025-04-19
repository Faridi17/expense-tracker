import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageService'
import * as Icons from 'phosphor-react-native'
import Typo from '@/components/Typo'
import Input from '@/components/Input' 
import { UserDataType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { updateUser } from '@/services/userService'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useSQLiteContext } from 'expo-sqlite'

const ProfileModal = () => {
    const db = useSQLiteContext()
    const { user, updateUserData } = useAuth()
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<UserDataType>({
        name: '',
        image: null,
        phone: '',
        profession: '',
        address: ''
    });

    const router = useRouter();

    useEffect(() => {
        setUserData({
            name: user?.name || '',
            image: user?.image || null,
            phone: user?.phone || '',
            profession: user?.profession || '',
            address: user?.address || ''
        });
    }, [user]);

    const onPickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setUserData({ ...userData, image: result.assets[0] });
        }
    }

    const onSubmit = async () => {
        const { name } = userData
        if (!name.trim()) {
            Alert.alert("Pengguna", 'Harap semua kolom diisi')
            return
        }

        setLoading(true)
        const res = await updateUser(db, user?.uid as string, userData)
        setLoading(false)

        if (res.success) {
            updateUserData(user?.uid as string)
            router.back()
        } else {
            Alert.alert("Pengguna", res.msg)
        }
    }
 
    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title='Ubah Profil'
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={getProfileImage(userData.image)}
                            contentFit='cover'
                            transition={100}
                        />
                        <TouchableOpacity onPress={onPickImage} style={styles.editIcon}>
                            <Icons.Pencil size={verticalScale(20)} color={colors.neutral800} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Nama</Typo>
                        <Input
                            placeholder='Nama'
                            value={userData.name}
                            onChangeText={(value) => setUserData({ ...userData, name: value })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Email</Typo>
                        <Input
                            value={user?.email || '-'}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Nomor Telepon</Typo>
                        <Input
                            placeholder='Nomor telepon'
                            value={userData.phone}
                            onChangeText={(value) => setUserData({ ...userData, phone: value })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Profesi</Typo>
                        <Input
                            placeholder='Profesi'
                            value={userData.profession}
                            onChangeText={(value) => setUserData({ ...userData, profession: value })}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Gender</Typo>
                        <Input
                            value={user?.gender === 'man' ? 'Laki-laki' : user?.gender === 'woman' ? 'Perempuan' : '-'}
                            editable={false}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200}>Alamat</Typo>
                        <Input
                            placeholder='Alamat'
                            multiline
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start',
                                paddingVertical: 15
                            }}
                            value={userData.address}
                            onChangeText={(value) => setUserData({ ...userData, address: value })}
                        />
                    </View>

                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>
                        Ubah
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default ProfileModal

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
        gap: spacingY._20,
        marginVertical: spacingY._15,
    },
    avatarContainer: {
        position: "relative",
        alignSelf: "center",
        marginBottom: spacingY._10
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
        gap: spacingY._10,
        color: colors.neutral500
    }
})
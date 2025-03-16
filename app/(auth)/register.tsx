import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext'
import { Dropdown } from 'react-native-element-dropdown';
import { genderTypes } from '@/constants/data'

const Register = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const nameRef = useRef("")
    const phoneRef = useRef("")
    const professionRef = useRef("")
    const genderRef = useRef("")
    const addressRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()
    const { register: registerUser } = useAuth()

    const handleSubmit = async () => {
        if (
            !emailRef.current ||
            !passwordRef.current ||
            !nameRef.current ||
            !phoneRef.current ||
            !professionRef.current ||
            !genderRef.current ||
            !addressRef.current
        ) {
            Alert.alert("Daftar", "Harap semua kolom diisi")
            return
        }
        setIsLoading(true)
        const res = await registerUser(
            emailRef.current,
            passwordRef.current,
            nameRef.current,
            phoneRef.current,
            professionRef.current,
            genderRef.current,
            addressRef.current
        )

        setIsLoading(false)
        if (!res.success) {
            Alert.alert("Daftar", res.msg)
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />
                <ScrollView contentContainerStyle={styles.form} showsHorizontalScrollIndicator={false}>
                    <View style={{ gap: 5, marginTop: spacingY._20 }}>
                        <Typo size={30} fontWeight={"800"}>
                            Ayo,
                        </Typo>
                        <Typo size={30} fontWeight={"800"}>
                            Mulai Sekarang
                        </Typo>
                    </View>

                    {/* form */}
                    <View style={styles.form}>
                        <Typo size={16} color={colors.textLighter}>
                            Buat akun untuk lacak pengeluaranmu
                        </Typo>
                        <Input
                            placeholder='Masukkan nama anda'
                            onChangeText={(value) => (nameRef.current = value)}
                            icon={<Icons.User size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                        />
                        <Input
                            placeholder='Masukkan email anda'
                            onChangeText={(value) => (emailRef.current = value)}
                            icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                        />
                        <Input
                            placeholder='Masukkan password anda'
                            secureTextEntry
                            onChangeText={(value) => (passwordRef.current = value)}
                            icon={<Icons.Lock size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                        />
                        <Input
                            placeholder='Masukkan nomor telepon anda'
                            onChangeText={(value) => (phoneRef.current = value)}
                            icon={<Icons.Phone size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                        />
                        <Input
                            placeholder='Masukkan profesi anda'
                            onChangeText={(value) => (professionRef.current = value)}
                            icon={<Icons.BagSimple size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                        />
                        <Dropdown
                            showsVerticalScrollIndicator={false}
                            activeColor={colors.neutral700}
                            style={styles.dropdownContainer}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={genderTypes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropdownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            placeholder={'Pilih gender'}
                            value={genderRef}
                            onChange={(value) => { genderRef.current = value.value }}
                            renderLeftIcon={() => <Icons.GenderMale size={verticalScale(26)} color={colors.neutral300} />}
                        />
                        <Input
                            placeholder='Masukkan alamat anda'
                            multiline
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start',
                                paddingVertical: 15
                            }}
                            onChangeText={(value) => (addressRef.current = value)}
                        />
                    </View>

                    <Button loading={isLoading} onPress={handleSubmit}>
                        <Typo fontWeight={"700"} color={colors.black} size={20}>
                            Daftar
                        </Typo>
                    </Button>

                    {/* footer */}
                    <View style={styles.footer}>
                        <Typo size={15}>Sudah punya akun?</Typo>
                        <Pressable onPress={() => router.navigate("/(auth)/login")}>
                            <Typo size={15} fontWeight={"700"} color={colors.primary}>Masuk</Typo>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default Register

const styles = StyleSheet.create({
    container: {
        flex: 2,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20,
    },
    welcomeText: {
        fontSize: verticalScale(20),
        fontWeight: "bold",
        color: colors.text
    },
    form: {
        gap: spacingY._20
    },
    forgotPassword: {
        textAlign: "right",
        fontWeight: "500",
        color: colors.text
    },
    dropdownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        backgroundColor: colors.neutral800,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: 'continuous'
    },
    dropdownItemText: { color: colors.white },
    dropdownSelectedText: {
        color: colors.white,
        paddingLeft: spacingY._10,
        fontSize: verticalScale(14)
    },
    dropdownListContainer: {
        backgroundColor: colors.neutral900,
        borderRadius: radius._15,
        borderCurve: 'continuous',
        paddingVertical: spacingY._7,
        top: 5,
        borderColor: colors.neutral500,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 7,
        elevation: 5
    },
    dropdownPlaceholder: {
        color: colors.neutral400,
        paddingLeft: spacingY._10
    },
    dropdownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7
    },
    dropdownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5,
        marginBottom: verticalScale(30)
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15),
    }
})
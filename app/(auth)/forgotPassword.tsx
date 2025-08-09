import { Alert, Pressable, StyleSheet, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import * as Icons from 'phosphor-react-native'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'

const Login = () => {
    const emailRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    const { login: loginUser } = useAuth()

    const handleSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert("Masuk", "Harap semua kolom diisi")
            return
        }
        setIsLoading(true)
        const res = await loginUser(emailRef.current, passwordRef.current)
        setIsLoading(false)
        if (!res.success) {
            Alert.alert("Masuk", res.msg)
        }
    }

    const handleForgotPassword = async () => {

        setIsLoading(true)

        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, emailRef.current);
            Alert.alert("Email Terkirim", "Silakan cek email Anda untuk reset password");
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                Alert.alert("Error", "Email tidak ditemukan");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Error", "Format email tidak valid");
            } else {
                Alert.alert("Error", error.message);
            }
        }

        setIsLoading(false)
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>
                        Yuk,
                    </Typo>
                    <Typo size={30} fontWeight={"800"}>
                        Ubah Password
                    </Typo>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Silakan masukkan email Anda untuk mereset password
                    </Typo>
                    <Input
                        placeholder='Masukkan email anda'
                        onChangeText={(value) => (emailRef.current = value)}
                        icon={<Icons.At size={verticalScale(26)} color={colors.neutral300} weight='fill' />}
                    />
                </View>

                <Button loading={isLoading} onPress={handleForgotPassword}>
                    <Typo fontWeight={"700"} color={colors.black} size={20}>
                        Verifikasi Email
                    </Typo>
                </Button>

                {/* footer */}
                
            </View>
        </ScreenWrapper>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        flex: 2,
        gap: spacingY._30,
        paddingHorizontal: spacingX._20
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
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 5
    },
    footerText: {
        textAlign: "center",
        color: colors.text,
        fontSize: verticalScale(15)
    }
})
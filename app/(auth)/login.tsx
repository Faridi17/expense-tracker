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

const Login = () => {
    const emailRef = useRef("")
    const passwordRef = useRef("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const {login: loginUser} = useAuth()

    const handleSubmit = async () =>  {
        if(!emailRef.current || !passwordRef.current) {
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

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <BackButton iconSize={28} />

                <View style={{ gap: 5, marginTop: spacingY._20 }}>
                    <Typo size={30} fontWeight={"800"}>
                        Hai,
                    </Typo>
                    <Typo size={30} fontWeight={"800"}>
                        Kembali Lagi
                    </Typo>
                </View>

                {/* form */}
                <View style={styles.form}>
                    <Typo size={16} color={colors.textLighter}>
                        Login sekarang untuk lacak pengeluaranmu
                    </Typo>
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
                </View>
                
                <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
                    Lupa Password?
                </Typo>

                <Button loading={isLoading} onPress={handleSubmit}>
                    <Typo fontWeight={"700"} color={colors.black} size={20}>
                        Masuk
                    </Typo>
                </Button>

                {/* footer */}
                <View style={styles.footer}>
                    <Typo size={15}>Belum punya akun?</Typo>
                    <Pressable onPress={() => router.navigate("/(auth)/register")}>
                        <Typo size={15} fontWeight={"700"} color={colors.primary}>Daftar</Typo>
                    </Pressable>
                </View>
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
import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import Typo from '@/components/Typo'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import { useAuth } from '@/context/authContext'
import * as Icons from 'phosphor-react-native'
import HomeCard from '@/components/HomeCard'
import TransactionList from '@/components/TransactionList'
import Button from '@/components/Button'
import { useRouter } from 'expo-router'
import { limit, orderBy, where } from 'firebase/firestore'
import useFetchData from '@/hooks/useFetchData'
import { TransactionType } from '@/types'
import { Image } from 'expo-image'
import { getProfileImage } from '@/services/imageService'

const Home = () => {
    const { user } = useAuth()
    const router = useRouter()
    const queryConstraints = user?.uid
        ? [where('uid', '==', user.uid), orderBy('date', 'desc'), limit(30)]
        : [];

    const { data: recentTransaction, loading: transactionLoading } = useFetchData<TransactionType>('transactions', queryConstraints);

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                {/* header */}
                <View style={styles.header}>
                    <View style={{ gap: 4 }}>
                        <Typo size={16} color={colors.neutral400}>
                            Halo,
                        </Typo>
                        <Typo>
                            {user?.name}
                        </Typo>
                    </View>
                    <View style={styles.avatarContainer}>
                        <Image
                            style={styles.avatar}
                            source={getProfileImage(user?.image)}
                            contentFit='cover'
                            transition={100}
                        />
                    </View>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}
                >
                    {/* card */}
                    <View>
                        <HomeCard />
                    </View>

                    <TransactionList
                        data={recentTransaction}
                        loading={transactionLoading}
                        emptyListMessage='Belum ada Transaksi'
                        title='Transaksi Terbaru'
                    />
                </ScrollView>

                <Button style={styles.floatingButton} onPress={() => router.push('/(modals)/transactionModal')}>
                    <Icons.Plus
                        color={colors.black}
                        weight='bold'
                        size={verticalScale(24)}
                    />
                </Button>
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        marginTop: verticalScale(8)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacingY._10
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: 'absolute',
        bottom: verticalScale(30),
        right: verticalScale(30)
    },
    scrollViewStyle: {
        marginTop: spacingY._10,
        paddingBottom: verticalScale(100),
        gap: spacingY._25
    },
    avatar: {
        alignSelf: "center",
        backgroundColor: colors.neutral300,
        height: verticalScale(40),
        width: verticalScale(40),
        borderRadius: 200,
        borderWidth: 1,
        borderColor: colors.neutral500
    },
    avatarContainer: {
        marginRight: verticalScale(5),
        position: "relative",
        alignSelf: "center",
    }
})
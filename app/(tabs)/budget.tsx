import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import Typo from '@/components/Typo'
import { scale, verticalScale } from '@/utils/styling'
import { colors, spacingX, spacingY } from '@/constants/theme'
import ScreenWrapper from '@/components/ScreenWrapper'
import Header from '@/components/Header'
import Button from '@/components/Button'
import * as Icons from 'phosphor-react-native'
import { useRouter } from 'expo-router'
import BudgetList from '@/components/BudgetList'
import { BudgetType } from '@/types'
import useFetchData from '@/hooks/useFetchData'
import { orderBy, where } from 'firebase/firestore'
import { useAuth } from '@/context/authContext'

const budget = () => {
    const { user } = useAuth()
    const router = useRouter()
    const queryConstraints = user?.uid
        ? [
            where('uid', '==', user.uid),
            where('toDate', '>=', new Date()), 
            orderBy('spent', 'asc') 
        ]
        : [];

    const { data: recentBudget, loading: budgetLoading } = useFetchData<BudgetType>('budgets', queryConstraints);

    console.log(recentBudget);


    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header title='Anggaran' />
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}
                >

                    <BudgetList
                        data={recentBudget}
                        loading={budgetLoading}
                        emptyListMessage='Belum ada Transaksi'

                    />
                </ScrollView>
                <Button style={styles.floatingButton} onPress={() => router.push('/(modals)/budgetModal')}>
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

export default budget

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: spacingX._20,
        gap: scale(12),
        paddingTop: spacingY._15,
        borderTopColor: colors.neutral900,
        marginBottom: spacingY._30,
        borderTopWidth: 1,
    },
    header: {
        paddingTop: spacingY._10
    },
    container: {
        flex: 1,
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingY._5,
        gap: spacingY._10
    },
    scrollViewStyle: {
        marginTop: spacingY._10,
        paddingBottom: verticalScale(100),
        gap: spacingY._25
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: 'absolute',
        bottom: verticalScale(30),
        right: verticalScale(30)
    },
})
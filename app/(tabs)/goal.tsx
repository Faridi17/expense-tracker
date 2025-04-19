import { View, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Button from '@/components/Button'
import Header from '@/components/Header'
import { colors, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import * as Icons from 'phosphor-react-native'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'
import useFetchData from '@/hooks/useFetchData'
import { GoalType } from '@/types'
import GoalList from '@/components/GoalList'
import SemiCircleProgressBar from '@/components/SemiCircleProgressBar'

const goal = () => {
    const { user } = useAuth()
    const router = useRouter()
    const now = new Date().toISOString();
    const { data: recentGoal, loading: goalLoading } = useFetchData<GoalType>(
        "goals",
        user?.uid,
        "AND endDate >= ?",
        [now]
    );

    // Hitung total progress
    const totalCollected = recentGoal?.reduce((sum, goal) => {
        const capped = Math.min(goal.collected, goal.target);
        return sum + capped;
    }, 0) ?? 0;

    const totalTarget = recentGoal?.reduce((sum, goal) => sum + goal.target, 0) ?? 0;

    const totalProgress = totalTarget > 0 ? Math.round((totalCollected / totalTarget) * 100) : 0;
    
    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header title='Perencanaan' />
                </View>
                <ScrollView
                    contentContainerStyle={styles.scrollViewStyle}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.progressContainer}>
                        <SemiCircleProgressBar progress={totalProgress} />
                    </View>

                    <GoalList
                        data={recentGoal}
                        loading={goalLoading}
                        emptyListMessage='Belum ada Perencanaan'
                    />
                </ScrollView>
                <Button style={styles.floatingButton} onPress={() => router.push('/(modals)/goalModal')}>
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

export default goal;

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
        marginTop: spacingY._25,
        paddingBottom: verticalScale(100),
    },
    progressContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacingY._40
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

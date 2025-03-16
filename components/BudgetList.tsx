import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Typo from './Typo';
import { verticalScale } from '@/utils/styling';
import Loading from './Loading';
import { BudgetItemProps, BudgetListType } from '@/types';
import { expenseCategories } from '@/constants/data';
import ProgressBar from "react-native-progress/Bar";
import { formatRupiah } from '@/services/formatRupiah';

const BudgetList = ({ data, loading, emptyListMessage }: BudgetListType) => {
    return (
        <View style={styles.container}>
            <View style={styles.list}>
                <FlashList
                    data={data}
                    renderItem={({ item, index }) => <BudgetItem item={item} index={index} />}
                    estimatedItemSize={60}
                />
            </View>
            {!loading && data.length == 0 && (
                <Typo
                    size={15}
                    color={colors.neutral400}
                    style={{ textAlign: 'center', marginTop: spacingY._15 }}
                >
                    {emptyListMessage}
                </Typo>
            )}

            {
                loading && (
                    <View style={{ top: verticalScale(100) }}>
                        <Loading />
                    </View>
                )
            }
        </View>
    );
};

const BudgetItem = ({ item, index }: BudgetItemProps) => {
    let category = expenseCategories[item.category!]
    const IconComponent = category.icon
    const dateNow = new Date();
    const toDate = item.toDate.toDate();
    const diffTime = toDate.getTime() - dateNow.getTime();
    const remainingDay = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    const progress = Math.min(item.spent / item.amount, 1);

    const percentage = Math.round(progress * 100);
    const remainingBudget = item.amount - item.spent;;
    const progressColor =
        percentage > 90 ? colors.rose :
            percentage > 50 ? colors.yellow :
                colors.primary;


    return (
        <View style={styles.container}>
            <View style={styles.column}>
                {/* Header */}
                <View style={styles.row}>
                    <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
                        {IconComponent && (
                            <IconComponent
                                size={verticalScale(25)}
                                weight="fill"
                                color={colors.white}
                            />
                        )}
                    </View>
                    <View style={styles.categoryDes}>
                        <Typo size={16} fontWeight="600">{category.label}</Typo>
                        <Typo size={12} color={colors.neutral400}>Anggaran</Typo>
                    </View>
                    <View style={styles.remaining}>
                        <Typo size={12} color={colors.neutral400}>sisa</Typo>
                        <Typo size={16} color={progressColor}>
                            {remainingBudget > 0 ? formatRupiah(remainingBudget) : 'Habis'}
                        </Typo>
                    </View>
                </View>


                {/* Progress Bar */}
                <View style={styles.progressContainer}>

                    <ProgressBar
                        progress={progress}
                        width={300}
                        height={12}
                        color={progressColor}
                        unfilledColor={colors.neutral700}
                        borderColor={colors.neutral700}
                        borderRadius={6}
                    />
                    <View style={styles.percentage}>
                        <Typo size={13} color={colors.neutral400}>
                            {percentage}%
                        </Typo>
                    </View>

                </View>

                {/* Budget Info */}
                <View style={styles.budgetInfo}>
                    <View style={styles.budgetItem}>
                        <Typo size={12} color={colors.neutral400}>Total</Typo>
                        <Typo size={16} color={colors.neutral300}>
                            {formatRupiah(item.amount)}
                        </Typo>
                    </View>
                    <View style={styles.budgetItem}>
                        <Typo size={12} color={colors.neutral400}>{remainingDay} Hari</Typo>
                        
                    </View>
                </View>
            </View>
        </View>
    );
}

export default BudgetList;

const styles = StyleSheet.create({
    container: {
        gap: spacingY._30
    },
    column: {
        backgroundColor: colors.neutral800,
        borderRadius: radius._17,
        gap: spacingX._12,
        padding: spacingX._10,
        marginBottom: spacingY._12
    },
    list: {
        minHeight: 3
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacingX._12,
    },
    icon: {
        height: verticalScale(44),
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: radius._12,
        borderCurve: 'continuous'
    },
    categoryDes: {
        flex: 1,
        gap: 2.5
    },
    remaining: {
        alignItems: 'flex-end',
        gap: 3,
    },
    budgetInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacingY._7,
        paddingHorizontal: spacingX._10
    },
    budgetItem: {
        // alignItems: 'flex-end',
        gap: spacingX._3,
    },
    progressContainer: {
        position: "relative",
        marginTop: spacingY._10,
    },
    percentage: {
        position: 'absolute',
        right: 0
    }
});
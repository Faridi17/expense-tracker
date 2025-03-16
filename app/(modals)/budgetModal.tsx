import { Alert, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Typo from '@/components/Typo'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import { Dropdown } from 'react-native-element-dropdown'
import { expenseCategories } from '@/constants/data'
import Input from '@/components/Input'
import { formatRupiah } from '@/services/formatRupiah'
import Button from '@/components/Button'
import DateTimePicker from '@react-native-community/datetimepicker';
import { BudgetType } from '@/types'
import { createBudget } from '@/services/budgetService'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext'


const budgetModal = () => {
    const [loading, setLoading] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [duration, setDuration] = useState<number>(0);
    const [budget, setBudget] = useState<BudgetType>({
        category: 'expense',
        amount: 0,
        spent: 0,
        fromDate: new Date(),
        toDate: new Date(),
        uid: '',
    })
    const { user } = useAuth()
    const router = useRouter()

    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || budget.fromDate
        setBudget({ ...budget, fromDate: currentDate })
        setShowDatePicker(Platform.OS == 'ios' ? true : false)
    }

    const onSubmit = async () => {
        const { category, amount, spent, fromDate, toDate } = budget
        
        if (!category || !amount || !fromDate || !toDate) {
            Alert.alert('Anggaran', 'Harap semua kolom diisi')
            return
        }
        

        const budgetData: BudgetType = {
            category,
            amount,
            spent,
            fromDate,
            toDate,
            uid: user?.uid
        }


        setLoading(true)
        const res = await createBudget(budgetData)

        setLoading(false)
        if (res.success) {
            router.back()
        } else {
            Alert.alert('Anggaran', res.msg)
        }
    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title={'Buat Anggaran'}
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form} showsHorizontalScrollIndicator={false}>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Kategori</Typo>
                        <Dropdown
                            showsVerticalScrollIndicator={false}
                            activeColor={colors.neutral700}
                            style={styles.dropdownContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={Object.values(expenseCategories)}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropdownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            placeholder={'Pilih kategori'}
                            value={budget.category}
                            onChange={item => {
                                setBudget({ ...budget, category: item.value || '' })
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Jumlah Anggaran</Typo>
                        <Input
                            keyboardType='numeric'
                            value={budget?.amount ? formatRupiah(budget.amount) : '0'}
                            onChangeText={(value) => setBudget({
                                ...budget,
                                amount: Number(value.replace(/[^0-9]/g, ''))
                            })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Dari Tanggal</Typo>
                        {!showDatePicker && (
                            <Pressable
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Typo size={14}>
                                    {(budget.fromDate as Date).toLocaleDateString()}
                                </Typo>
                            </Pressable>
                        )}

                        {showDatePicker && (
                            <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                                <DateTimePicker
                                    themeVariant='dark'
                                    value={budget.fromDate as Date}
                                    textColor={colors.white}
                                    mode='date'
                                    display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                                    onChange={onDateChange}
                                />
                                {Platform.OS == 'ios' && (
                                    <TouchableOpacity
                                        style={styles.datePickerButton}
                                        onPress={() => setShowDatePicker(false)}
                                    >
                                        <Typo size={15} fontWeight={'500'}>
                                            Ok
                                        </Typo>
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Durasi</Typo>
                        <Input
                            keyboardType="numeric"
                            placeholder='0 Hari'
                            value={duration ? `${duration} Hari` : ''}
                            onChangeText={(value) => {
                                const days = Number(value.replace(/[^0-9]/g, ''));

                                setDuration(days);

                                // Hitung `toDate` dari `fromDate`
                                const newToDate = new Date(budget.fromDate);
                                newToDate.setDate(newToDate.getDate() + days);

                                setBudget({
                                    ...budget,
                                    toDate: newToDate,
                                });
                            }}
                        />
                    </View>

                </ScrollView>
            </View>
            <View style={styles.footer}>
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>
                        Buat
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default budgetModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: spacingY._20
    },
    form: {
        gap: spacingY._20,
        paddingVertical: spacingY._15,
        paddingBottom: spacingY._40
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
        borderTopWidth: 1
    },
    inputContainer: { gap: spacingY._10 },
    iosDropDown: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        fontSize: verticalScale(14),
        borderWidth: 1,
        color: colors.white,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    androidDropDown: {
        height: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        fontSize: verticalScale(14),
        color: colors.white,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacingX._5
    },
    dateInput: {
        flexDirection: 'row',
        height: verticalScale(54),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.neutral300,
        borderRadius: radius._17,
        borderCurve: 'continuous',
        paddingHorizontal: spacingX._15
    },
    iosDatePicker: {

    },
    datePickerButton: {
        backgroundColor: colors.neutral700,
        alignSelf: 'flex-end',
        padding: spacingY._7,
        marginRight: spacingX._7,
        paddingHorizontal: spacingY._15,
        borderRadius: radius._10
    },
    dropdownContainer: {
        height: verticalScale(54),
        borderWidth: 1,
        borderColor: colors.neutral300,
        paddingHorizontal: spacingX._15,
        borderRadius: radius._15,
        borderCurve: 'continuous'
    },
    dropdownItemText: { color: colors.white },
    dropdownSelectedText: {
        color: colors.white,
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
    dropdownPlaceholder: { color: colors.white },
    dropdownItemContainer: {
        borderRadius: radius._15,
        marginHorizontal: spacingX._7
    },
    dropdownIcon: {
        height: verticalScale(30),
        tintColor: colors.neutral300
    }
})
import { Alert, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import ModalWrapper from '@/components/ModalWrapper'
import Header from '@/components/Header'
import BackButton from '@/components/BackButton'
import Typo from '@/components/Typo'
import { TransactionType, WalletType } from '@/types'
import Button from '@/components/Button'
import { useAuth } from '@/context/authContext'
import { useRouter } from 'expo-router'
import ImageUpload from '@/components/ImageUpload'
import { Dropdown } from 'react-native-element-dropdown';
import { expenseCategories, transactionTypes } from '@/constants/data'
import useFetchData from '@/hooks/useFetchData'
import { formatRupiah } from '@/services/formatRupiah'
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '@/components/Input'
import { createTransaction } from '@/services/transactionService'
import { useSQLiteContext } from 'expo-sqlite'

const TransactionModal = () => {
    const db = useSQLiteContext();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [transaction, setTransaction] = useState<TransactionType>({
        type: 'expense',
        amount: 0,
        description: '',
        category: '',
        date: new Date(),
        walletId: '',
        image: null
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [wallets, setWallets] = useState<WalletType[]>([]);
    const router = useRouter();

    useEffect(() => {
        let isMounted = true;

        const fetchWallets = async () => {
            try {
                const results = await db.getAllAsync(
                    `SELECT * FROM wallets WHERE uid = ? ORDER BY createdAt DESC`,
                    [user.uid]
                );

                if (isMounted) {
                    setWallets(results as WalletType[]);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Error fetching wallets:", err);
                }
            }
        };

        fetchWallets();

        return () => {
            isMounted = false;
        };
    }, [user.uid]);

    const onDateChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || transaction.date
        setTransaction({ ...transaction, date: currentDate })
        setShowDatePicker(Platform.OS == 'ios' ? true : false)
    }

    const onSubmit = async () => {
        const { type, amount, description, category, date, walletId, image } = transaction
        if (!walletId || !date || !amount || (type == 'expense' && !category)) {
            Alert.alert('Transaksi', 'Harap semua kolom diisi')
            return
        }

        const transactionData: TransactionType = {
            type,
            amount,
            description,
            category,
            date,
            walletId,
            image,
            uid: user?.uid
        }

        setLoading(true)
        const res = await createTransaction(db, transactionData)

        setLoading(false)
        if (res.success) {
            router.back()
        } else {
            Alert.alert('Transaksi', res.msg)
        }

    }

    return (
        <ModalWrapper>
            <View style={styles.container}>
                <Header
                    title='Tambah Transaksi'
                    leftIcon={<BackButton />}
                    style={{ marginBottom: spacingY._10 }}
                />

                {/* form */}
                <ScrollView contentContainerStyle={styles.form} showsHorizontalScrollIndicator={false}>

                    {/* type transaction */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Tipe</Typo>
                        <Dropdown
                            showsVerticalScrollIndicator={false}
                            activeColor={colors.neutral700}
                            style={styles.dropdownContainer}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={transactionTypes}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropdownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            value={transaction.type}
                            onChange={item => {
                                setTransaction({ ...transaction, type: item.value })
                            }}
                        />
                    </View>

                    {/* wallet input */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Dompet</Typo>
                        <Dropdown
                            showsVerticalScrollIndicator={false}
                            activeColor={colors.neutral700}
                            style={styles.dropdownContainer}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownSelectedText}
                            iconStyle={styles.dropdownIcon}
                            data={wallets.map((wallet) => ({
                                label: `${wallet?.name} (${formatRupiah(wallet?.amount as number)})`,
                                value: wallet?.id
                            }))}
                            maxHeight={300}
                            labelField="label"
                            valueField="value"
                            itemTextStyle={styles.dropdownItemText}
                            itemContainerStyle={styles.dropdownItemContainer}
                            containerStyle={styles.dropdownListContainer}
                            placeholder={'Pilih dompet'}
                            value={transaction.walletId}
                            onChange={item => {
                                setTransaction({ ...transaction, walletId: item.value || '' })
                            }}
                        />
                    </View>

                    {/* expense category */}
                    {transaction.type == 'expense' && (
                        <View style={styles.inputContainer}>
                            <Typo color={colors.neutral200} size={16}>Kategori Pengeluaran</Typo>
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
                                value={transaction.category}
                                onChange={item => {
                                    setTransaction({ ...transaction, category: item.value || '' })
                                }}
                            />
                        </View>
                    )}

                    {/* date picker */}

                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Tanggal</Typo>
                        {!showDatePicker && (
                            <Pressable
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Typo size={14}>
                                    {(transaction.date as Date).toLocaleDateString()}
                                </Typo>
                            </Pressable>
                        )}

                        {showDatePicker && (
                            <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                                <DateTimePicker
                                    themeVariant='dark'
                                    value={transaction.date as Date}
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

                    {/* amount */}
                    <View style={styles.inputContainer}>
                        <Typo color={colors.neutral200} size={16}>Jumlah</Typo>
                        <Input
                            keyboardType='numeric'
                            value={transaction?.amount ? formatRupiah(transaction.amount) : '0'}
                            onChangeText={(value) => setTransaction({
                                ...transaction,
                                amount: Number(value.replace(/[^0-9]/g, ''))
                            })}
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200} size={16}>
                                Deksripsi
                            </Typo>
                            <Typo color={colors.neutral500} size={14}>
                                (opsional)
                            </Typo>
                        </View>
                        <Input
                            value={transaction.description}
                            multiline
                            containerStyle={{
                                flexDirection: 'row',
                                height: verticalScale(100),
                                alignItems: 'flex-start',
                                paddingVertical: 15
                            }}
                            onChangeText={(value) => setTransaction({ ...transaction, description: value })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.flexRow}>
                            <Typo color={colors.neutral200} size={16}>
                                Kuitansi
                            </Typo>
                            <Typo color={colors.neutral500} size={14}>
                                (opsional)
                            </Typo>
                        </View>
                        <ImageUpload
                            file={transaction.image}
                            onClear={() => setTransaction({ ...transaction, image: null })}
                            onSelect={(file) => setTransaction({ ...transaction, image: file })}
                            placeholder='Unggah Gambar'
                        />
                    </View>
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                    <Typo color={colors.black} fontWeight={'700'}>
                        Tambah
                    </Typo>
                </Button>
            </View>
        </ModalWrapper>
    )
}

export default TransactionModal

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
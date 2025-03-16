import { Alert, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/context/authContext'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import Input from '@/components/Input'
import { ReportType } from '@/types'
import { exportToExcel } from '@/services/reportService'

const Report = () => {
  const [loading, setLoading] = useState(false)
  const [showFromDatePicker, setShowFromDatePicker] = useState(false)
  const [showToDatePicker, setShowToDatePicker] = useState(false)
  const [report, setReport] = useState<ReportType>({
    nameReport: '',
    fromDate: new Date(),
    toDate: new Date(),
  })
  const { user } = useAuth()  


  const onChangeDate = (event: any, selectedDate: any, field: 'fromDate' | 'toDate') => {
    if (selectedDate) {
      setReport(prev => ({ ...prev, [field]: selectedDate }));
    }
    if (field === 'fromDate') {
      setShowFromDatePicker(Platform.OS === 'ios');
    } else {
      setShowToDatePicker(Platform.OS === 'ios');
    }
    
  };
  const onSubmit = async () => {
    if (
      !report.nameReport ||
      !report.fromDate ||
      !report.toDate
    ) {
      Alert.alert("Daftar", "Harap semua kolom diisi")      
      return
    }

    setLoading(true)
    const res = await exportToExcel(user?.uid || '', report)
    setLoading(false)

    if (res.success) {
      Alert.alert('Laporan', 'Transaksi berhasil diekspor')
    } else {
      Alert.alert('Laporan', res.msg)
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Header title='Tutup Buku' />
        </View>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200}>Nama Laporan</Typo>
            <Input
              placeholder='Nama laporan'
              value={report.nameReport}
              onChangeText={text => {
                setReport(item => ({ ...item, nameReport: text }))
              }}
            />
          </View>
          <View style={styles.inputContainer}>
            <Typo color={colors.neutral200} size={16}>Dari Tanggal</Typo>
            {!showFromDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowFromDatePicker(true)}
              >
                <Typo size={14}>
                  {(report.fromDate as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showFromDatePicker && (
              <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant='dark'
                  value={report.fromDate as Date}
                  textColor={colors.white}
                  mode='date'
                  display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => onChangeDate(event, date, 'fromDate')}
                />
                {Platform.OS == 'ios' && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowFromDatePicker(false)}
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
            <Typo color={colors.neutral200} size={16}>Sampai Tanggal</Typo>
            {!showToDatePicker && (
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowToDatePicker(true)}
              >
                <Typo size={14}>
                  {(report.toDate as Date).toLocaleDateString()}
                </Typo>
              </Pressable>
            )}

            {showToDatePicker && (
              <View style={Platform.OS == 'ios' && styles.iosDatePicker}>
                <DateTimePicker
                  themeVariant='dark'
                  value={report.toDate as Date}
                  textColor={colors.white}
                  mode='date'
                  display={Platform.OS == 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => onChangeDate(event, date, 'toDate')}
                />
                {Platform.OS == 'ios' && (
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => setShowToDatePicker(false)}
                  >
                    <Typo size={15} fontWeight={'500'}>
                      Ok
                    </Typo>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={'700'}>
            Ekspor
          </Typo>
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default Report

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
  inputContainer: {
    gap: spacingY._10,
    color: colors.neutral500
  },
  form: {
    gap: spacingY._20,
    marginVertical: spacingY._15,
  },
  dateInput: {
    flexDirection: 'row',
    height: verticalScale(54),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.neutral300,
    backgroundColor: colors.neutral800,
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
})
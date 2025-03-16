import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from '@/components/Typo'
import { formatRupiah } from '@/services/formatRupiah'
import * as Icons from 'phosphor-react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/authContext'
import useFetchData from '@/hooks/useFetchData'
import { WalletType } from '@/types'
import { orderBy, where } from 'firebase/firestore'
import Loading from '@/components/Loading'
import WalletListItem from '@/components/WalletListItem'

const Wallet = () => {
  const router = useRouter()
  const { user } = useAuth();
  const [queryFilters, setQueryFilters] = useState<any[]>([]);
  const { data: wallets, loading } = useFetchData<WalletType>('wallets', queryFilters);

  useEffect(() => {
    if (user?.uid) {
      setQueryFilters([
        where('uid', '==', user.uid),
        orderBy('created', 'desc')
      ]);
    }
  }, [user?.uid]);

  const getTotalBalance = () => 
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0)
      return total
    }, 0)
  
  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        {/* balance view */}
        <View style={styles.balanceView}>
          <View style={{ alignItems: 'center' }}>
            <Typo size={45} fontWeight={'500'}>
              {formatRupiah(getTotalBalance())}
            </Typo>
            <Typo size={16} color={colors.neutral300}>
              Total Saldo
            </Typo>
          </View>
        </View>

        {/* wallets */}
        <View style={styles.wallets}>

          {/* header */}
          <View style={styles.flexRow}>
            <Typo size={20} fontWeight={'500'}>
              Dompet saya
            </Typo>
            <TouchableOpacity onPress={() => router.push('/(modals)/walletModal')}>
              <Icons.PlusCircle
                weight='fill'
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>

          {loading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              )
            }}
          />
        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Wallet

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  balanceView: {
    height: verticalScale(100),
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacingY._10
  },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15
  }
})
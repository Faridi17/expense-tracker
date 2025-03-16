import React from 'react'
import { Stack } from 'expo-router'
import { AuthProvider } from '@/context/authContext'

const StackLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name='(modals)/profileModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/budgetModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/walletModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/transactionModal'
                options={{ presentation: 'modal' }}
            />
            <Stack.Screen
                name='(modals)/reportModal'
                options={{ presentation: 'modal' }}
            />
        </Stack>
    )
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <StackLayout />
        </AuthProvider>
    )
}

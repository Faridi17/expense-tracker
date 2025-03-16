import React from 'react'
import { Tabs } from 'expo-router'
import CustomTabs from '@/components/CustomTabs'

const _layout = () => {
    return (
        <Tabs tabBar={CustomTabs} screenOptions={{ headerShown: false}}>
            <Tabs.Screen name='index' />
            <Tabs.Screen name='budget' />
            <Tabs.Screen name='wallet' />
            <Tabs.Screen name='report' />
            <Tabs.Screen name='profile' />
        </Tabs>
    )
}

export default _layout
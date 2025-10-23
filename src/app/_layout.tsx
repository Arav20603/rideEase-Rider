import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Provider } from 'react-redux'
import { store } from '@/features/store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const RootLayout = () => {
  const inset = useSafeAreaInsets()
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='index' />
        <Stack.Screen name='(tabs)' />
        <Stack.Screen name='components' />
        <Stack.Screen name='screens' />
      </Stack>
    </Provider>
  )
}

export default RootLayout

const styles = StyleSheet.create({})
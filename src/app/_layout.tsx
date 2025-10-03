import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name='index' />
    <Stack.Screen name='(tabs)' />
    <Stack.Screen name='components' />
    <Stack.Screen name='screens' />
  </Stack>
}

export default RootLayout

const styles = StyleSheet.create({})
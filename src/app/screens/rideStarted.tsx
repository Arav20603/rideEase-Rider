import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import RideStartedMap from './rideStartedMap'

const RideStarted = () => {
  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <RideStartedMap />
      </View>

      <View style={styles.floatingText}>
        <Text>Reached drop</Text>
      </View>
    </View>
  )
}

export default RideStarted

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
  },
  floatingText: {
    position: 'absolute',
    bottom: 10,
  }
})
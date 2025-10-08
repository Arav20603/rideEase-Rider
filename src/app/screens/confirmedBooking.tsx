import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/features/store'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import RiderMap from './riderMap'

const ConfirmedBooking = () => {
  const ride = useSelector((state: RootState) => state.ride)

  useEffect(() => {
    console.log(ride)
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {/* Top info panel */}
      <View style={styles.infoContainer}>
        {/* Pickup section */}
        <View style={styles.locationBox}>
          <Ionicons name='location' size={22} color='#007bff' />
          <View>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.value}>{ride.origin?.description || '—'}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Rider info section */}
        <View style={styles.userContainer}>
          <View style={styles.leftBox}>
            <Ionicons name='person-circle' size={42} color='#28a745' />
            <View style={styles.innerBox}>
              <Text style={styles.userName}>{ride.user?.name || 'User Name'}</Text>
              <Text style={styles.userPhone}>{ride.user?.phone || '+91 ————'}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.callButton}>
            <Ionicons name='call' size={26} color='white' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Map area placeholder */}
      <View style={styles.mapContainer}>
       
        <RiderMap />
      </View>
    </SafeAreaView>
  )
}

export default ConfirmedBooking

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  infoContainer: {
    flex: 0.18,
    backgroundColor: '#f8f9fa',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
  },
  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 12,
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  innerBox: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
  },
  userPhone: {
    fontSize: 14,
    color: '#495057',
  },
  callButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 50,
    elevation: 3,
  },
  mapContainer: {
    flex: 0.8,
    width: '100%',
    height: '100%'
  },
})

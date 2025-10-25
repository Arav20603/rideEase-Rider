import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import RideStartedMap from './rideStartedMap';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import { Toast } from 'toastify-react-native';

const RideStarted = () => {
  const ride = useSelector((state: RootState) => state.ride);

  useEffect(() => {
    socket.on('user_cancelled_ride', (msg) => {
      if (msg) {
        Toast.show({ text1: 'User cancelled ride', type: 'error', visibilityTime: 2000 })
        router.push('/home')
      }
    })
  }, [])

  const handleRideComplete = async () => {
    try {
      socket.emit('ride_complete', { msg: 'ride completed, payment pending' })
      router.push('/screens/rideCompleted')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <View style={styles.mapContainer}>
        <RideStartedMap />
      </View>

      {/* Live Ride Info Card */}
      <View style={styles.infoCard}>
        {/* Ride Progress Header */}
        <Text style={styles.title}>Ride in Progress 🚗</Text>

        {/* Origin */}
        <View style={styles.row}>
          <Ionicons name="location-sharp" size={22} color="#0284c7" />
          <Text style={styles.text}>{ride.origin?.description || 'Pickup'}</Text>
        </View>

        {/* Destination */}
        <View style={styles.row}>
          <Ionicons name="flag-sharp" size={22} color="#f97316" />
          <Text style={styles.text}>{ride.destination?.description?.slice(0, 40) || 'Drop'}</Text>
        </View>

        {/* Fare */}
        <View style={styles.row}>
          <MaterialCommunityIcons name="currency-inr" size={22} color="#28a745" />
          <Text style={styles.fareText}>{ride.fare}</Text>
        </View>

        <View style={styles.divider} />

        {/* Reached Drop Button */}
        <TouchableOpacity style={styles.dropBtn} onPress={handleRideComplete}>
          <Text style={styles.dropBtnText}>Reached Drop</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Contact Buttons */}
      <View style={styles.floatingIcons}>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="call" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="chatbubble" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideStarted;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  mapContainer: { width: '100%', height: '100%' },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#003366', marginBottom: 15 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  text: { fontSize: 16, color: '#333', marginLeft: 10, flexShrink: 1 },
  fareText: { fontSize: 16, color: '#28a745', marginLeft: 10 },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 15 },
  dropBtn: { backgroundColor: '#0284c7', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
  dropBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  floatingIcons: { position: 'absolute', top: 50, right: 20, flexDirection: 'column' },
  iconBtn: { backgroundColor: '#0284c7', padding: 14, borderRadius: 50, marginBottom: 15, elevation: 6 },
});

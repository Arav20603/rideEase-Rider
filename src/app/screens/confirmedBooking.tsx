import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RiderMap from './riderMap';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import { Toast } from 'toastify-react-native';

const ConfirmedBooking = () => {
  const ride = useSelector((state: RootState) => state.ride);

  useEffect(() => {
    socket.on('user_cancelled_ride', (msg) => {
      if (msg) {
        Toast.show({ text1: 'User cancelled ride', type: 'error', visibilityTime: 2000 })
        router.push('/home')
      }
    })
  }, [])

  const handleReachedPickup = () => router.push('/components/shareOtp');
  const handleCancelRide = () => {
    Alert.alert('Cancel ride', 'Do u want to cancel the ride?', [
      {
        text: 'No', style: 'cancel'
      },
      {
        text: 'Cancel', style: 'destructive', onPress: () => {
          socket.emit('rider_cancelled_ride', { msg: 'rider cancelled ride' })
          router.push('/home')
        }
      }
    ])
  };
  const handleCallUser = () => console.log('Calling User...');
  const handleCallRider = () => console.log('Calling Rider...');

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Info Panel */}
      <View style={styles.infoContainer}>
        {/* Pickup */}
        <View style={styles.locationBox}>
          <Ionicons name='location-sharp' size={24} color='#007bff' />
          <View>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.value}>{ride.origin?.description || '—'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* User & Rider Info */}
        <View style={styles.userContainer}>
          {/* User */}
          <View style={styles.leftBox}>
            <Ionicons name='person-circle-outline' size={50} color='#28a745' />
            <View style={styles.innerBox}>
              <Text style={styles.userName}>{ride.user?.name || 'User Name'}</Text>
              <TouchableOpacity onPress={handleCallUser} style={styles.smallCallButton}>
                <Ionicons name='call' size={18} color='#fff' />
              </TouchableOpacity>
            </View>
          </View>

          {/* Rider */}
          <View style={styles.leftBox}>
            <Ionicons name='person-circle' size={50} color='#007bff' />
            <View style={styles.innerBox}>
              <Text style={styles.userName}>{ride.user?.name || 'Rider Name'}</Text>
              <TouchableOpacity onPress={handleCallRider} style={styles.smallCallButtonRider}>
                <Ionicons name='call' size={18} color='#fff' />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Map Area */}
      <View style={styles.mapContainer}>
        <RiderMap />
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: '#28a745' }]}
          onPress={handleReachedPickup}
        >
          <Text style={styles.fabText}>Reached Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: '#dc3545' }]}
          onPress={handleCancelRide}
        >
          <Text style={styles.fabText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConfirmedBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  infoContainer: {
    flex: 0.22,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  locationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  smallCallButton: {
    marginTop: 4,
    backgroundColor: '#28a745',
    padding: 6,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  smallCallButtonRider: {
    marginTop: 4,
    backgroundColor: '#007bff',
    padding: 6,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  mapContainer: {
    flex: 0.78,
    width: '100%',
    height: '100%',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  fabButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

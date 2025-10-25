import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import RiderMap from './riderMap';
import { router } from 'expo-router';
import { socket } from '@/utils/socket';
import { Toast } from 'toastify-react-native';

const ConfirmedBooking = () => {
  const ride = useSelector((state: RootState) => state.ride);

  useEffect(() => {
    socket.on('user_cancelled_ride', (msg) => {
      if (msg) {
        Toast.show({ text1: 'User cancelled ride', type: 'error', visibilityTime: 2000 });
        router.push('/home');
      }
    });
  }, []);

  const handleReachedPickup = () => router.push('/components/shareOtp');
  const handleCancelRide = () => {
    Alert.alert('Cancel ride', 'Do you want to cancel the ride?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel',
        style: 'destructive',
        onPress: () => {
          socket.emit('rider_cancelled_ride', { msg: 'rider cancelled ride' });
          router.push('/home');
        },
      },
    ]);
  };
  const handleCallUser = () => console.log('Calling User...');

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Info Panel */}
      <View style={styles.topPanel}>
        {/* Pickup Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={28} color="#2563EB" />
            <View style={styles.col}>
              <Text style={styles.label}>Pickup Location</Text>
              <Text numberOfLines={2} style={styles.value}>
                {ride.origin?.description || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* User Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <MaterialIcons name="person-outline" size={50} color="#10B981" />
            <View style={styles.col}>
              <Text style={styles.userLabel}>Rider Info</Text>
              <Text style={styles.userName}>{ride.user?.name || 'User Name'}</Text>
              <TouchableOpacity onPress={handleCallUser} style={styles.callBtn}>
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.callText}>Call</Text>
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
          style={[styles.fabButton, { backgroundColor: '#10B981' }]}
          onPress={handleReachedPickup}
        >
          <Text style={styles.fabText}>Reached Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: '#EF4444' }]}
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
    backgroundColor: '#F0F4F8',
  },
  topPanel: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A8A',
    marginTop: 2,
  },
  userLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 4,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 25,
    width: 100,
    justifyContent: 'center',
  },
  callText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  mapContainer: {
    flex: 1,
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
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/features/store';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { Toast } from 'toastify-react-native';
import { router } from 'expo-router';

const RideCompleted = () => {
  const ride = useSelector((state: RootState) => state.ride);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('cash');

  const paymentOptions: { id: 'cash' | 'upi' | 'card'; label: string; icon: string }[] = [
    { id: 'cash', label: 'Cash', icon: 'cash-outline' },
    { id: 'upi', label: 'UPI', icon: 'qr-code-outline' },
  ];

  const handlePaymentComplete = async () => {
    console.log(ride._id)
    if (!ride._id) return
    
    try {
      const res = await axios.patch(`http://192.168.31.248:4000/ride/rides/complete/${ride._id}`, {paymentMode: paymentMethod})
      if (res.data.success) {
        setTimeout(() => {
          Toast.success('ride completed')
          router.push('/home')
        }, 3000);
      }
    } catch (error) {
      console.log('error in payment completion')
    }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.header}>Ride Completed 🎉</Text>
        <Text style={styles.subHeader}>Thank you for riding with us!</Text>

        {/* Ride Info Card */}
        <View style={styles.rideCard}>
          <View style={styles.row}>
            <Ionicons name="location-sharp" size={22} color="#0284c7" />
            <Text style={styles.locationText}>{ride.origin?.description}</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="flag-sharp" size={22} color="#f97316" />
            <Text style={styles.locationText}>{ride.destination?.description}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="currency-inr" size={22} color="#28a745" />
            <Text style={styles.fareText}>{ride.fare}</Text>
          </View>
        </View>

        {/* QR Section */}
        <View style={styles.qrContainer}>
          <Text style={styles.qrLabel}>Scan QR to pay</Text>
          <Image source={require('../../assets/images/qr.jpg')} style={styles.qrImage} />
        </View>

        {/* Payment Method Selection */}
        <Text style={styles.paymentTitle}>Select Payment Method</Text>
        <View style={styles.paymentOptionsContainer}>
          {paymentOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.paymentOption,
                paymentMethod === option.id && styles.selectedPaymentOption,
              ]}
              onPress={() => setPaymentMethod(option.id)}
            >
              <Ionicons
                name={option.icon as any}
                size={24}
                color={paymentMethod === option.id ? '#fff' : '#0284c7'}
              />
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === option.id && { color: '#fff', fontWeight: '700' },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Completed Button */}
        <TouchableOpacity style={styles.payBtn} onPress={handlePaymentComplete}>
          <Text style={styles.payBtnText}>Payment Completed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RideCompleted;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
  },
  header: { fontSize: 26, fontWeight: '700', color: '#003366', marginBottom: 5 },
  subHeader: { fontSize: 16, color: '#555', marginBottom: 20 },

  rideCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { marginLeft: 10, fontSize: 16, color: '#333', flexShrink: 1 },
  fareText: { marginLeft: 10, fontSize: 18, fontWeight: '700', color: '#28a745' },

  qrContainer: { alignItems: 'center', marginBottom: 25 },
  qrLabel: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 },
  qrImage: { width: 180, height: 180, resizeMode: 'contain', borderRadius: 12 },

  paymentTitle: { fontSize: 18, fontWeight: '700', color: '#003366', marginBottom: 15 },
  paymentOptionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },

  paymentOption: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#0284c7',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  selectedPaymentOption: { backgroundColor: '#0284c7', borderColor: '#0284c7' },
  paymentLabel: { marginTop: 6, fontSize: 14, color: '#0284c7' },

  payBtn: {
    width: '100%',
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    elevation: 4,
  },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

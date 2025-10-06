import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import io from "socket.io-client";
import { backendURL } from "@/constants/url";
import RiderHeader from "../components/riderHeader";
import RideCard from "../components/rideCard";
import NoRideCard from "../components/noRideCard";
import QuickActions from "../components/quickActions";
import { socket } from "@/utils/socket";
import { useRouter } from "expo-router";
import { useDispatch } from 'react-redux'
import { setRideDetails } from '@/features/riderSlice/riderSlice'


const Home = () => {
  const [rider, setRider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState<any>(null);
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    // dispatch(setRideDetails({
    //   user: {
    //     name: 'Aravind',
    //     email: 'aravind@gmail.com',
    //     phone: '8088276220'
    //   },
    //   origin: {
    //     location: { lat: 12.9931407, lng: 77.749486 },
    //     description: '193, Bengaluru'
    //   },
    //   destination: {
    //     location: { lat: 12.9379593, lng: 77.6999365 },
    //     description: 'Kadubeesanahalli Road, Kaverappa Layout, Kadubeesanahalli, Panathur, Bengaluru, Karnataka, India'
    //   },
    //   fare: 150,
    //   ride: {
    //     id: 'bike',
    //     title: 'Bike',
    //     baseFare: 30,
    //     pricePerKm: 10,
    //     image: 26,
    //     badge: 'Fastest'
    //   },
    // }))
    // router.push('/screens/confirmedBooking')
  }, [dispatch, ride])


  useEffect(() => {
    const fetchRider = async () => {
      try {
        const email = await AsyncStorage.getItem("rider");
        if (!email) return;
        const res = await axios.post(`${backendURL}/get-rider`, { email });
        if (res.data.success) {
          setRider(res.data.user);
          // socket.emit("register_rider", { riderId: res.data.user._id, name: res.data.user.name });
        }
      } catch (err) {
        console.log("❌ Rider fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRider();
  }, []);

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const email = await AsyncStorage.getItem("rider");
        if (!email) return;
        const res = await axios.post(`${backendURL}/get-rider`, { email });
        if (res.data.success) {
          setRider(res.data.user);
          // Optionally register rider with socket
          // socket.emit("register_rider", { riderId: res.data.user._id, name: res.data.user.name });
        }
      } catch (err) {
        console.log("❌ Rider fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRider();
  }, []);

  // separate effect that runs whenever rider changes
  useEffect(() => {
    const listener = (rideData: any) => {
      console.log("🚖 New ride received:", rideData);

      if (rider && rideData.ride.id === rider.vehicle?.type) {
        setRide(rideData);
      } else {
        console.log("❌ Ride type mismatch, ignoring");
      }
    };

    socket.on("user_request", listener);

    return () => {
      socket.off("user_request", listener);
    };
  }, [rider]);


  const handleAccept = () => {
    socket.emit('ride_accept', {
      msg: "ride accepted",
      riderId: rider._id,
      riderName: rider.name,
      rideId: ride?.id,
    })
    dispatch(setRideDetails({
      user: ride.user,
      origin: ride.origin,
      destination: ride.destination,
      fare: ride.fare,
      ride: ride.ride
    }))
    router.push('/screens/confirmedBooking')
  };

  const handleReject = () => {
    try {
      Alert.alert("Reject ride", "Are you sure you want to reject the ride?", [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => setRide(null)
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'failed in ride rejecting')
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#50c9c3" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <RiderHeader name={rider?.name?.split(" ")[0]} />
      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Ongoing Rides</Text>
        {ride ? (
          <RideCard
            title="Ride Request"
            pickup={ride.origin.description}
            price={ride.fare}
            drop={ride.destination.description} // ✅ make sure matches backend
            onAccept={handleAccept}
            onReject={handleReject}
          />
        ) : (
          <NoRideCard />
        )}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <QuickActions />
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6fa" },
  body: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 12 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

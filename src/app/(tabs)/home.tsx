import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Dimensions } from "react-native";
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
import { useDispatch, useSelector } from 'react-redux'
import { setRideDetails } from '@/features/riderSlice/riderSlice'
import { selectOrigin } from "@/features/mapSlice/mapSlice";
import ShareOtp from "../components/shareOtp";

const Home = () => {
  const [rider, setRider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState<any>(null);
  const router = useRouter()
  const dispatch = useDispatch()
  const riderLocation = useSelector(selectOrigin)


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
    console.log(Math.floor(1000 + Math.random() * 9000))
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



  const handleAccept = async () => {
    if (!ride || !rider) return;
    const otp = Math.floor(1000 + Math.random() * 9000)
    dispatch(setRideDetails({
      user: ride.user,
      origin: ride.origin,
      destination: ride.destination,
      fare: ride.fare,
      ride: ride.ride,
      otp: otp
    }));
    try {
      const payload = {
        userId: ride.user._id,
        riderId: rider._id,
        pickup: { address: ride.origin.description, lat: ride.origin.location.lat, lng: ride.origin.location.lng },
        destination: { address: ride.destination.description, lat: ride.destination.location.lat, lng: ride.destination.location.lng },
        fare: ride.fare,
        rideOtp: otp
      };

      const res = await axios.post(`http://192.168.31.248:4000/ride/rides/create`, payload);
      if (res.data.success) {
        console.log("✅ Ride created:");
        socket.emit("ride_accept", {
          riderDetails: {
            rider: {
              name: rider.name,
              email: rider.email,
              phone: rider.phone,
              type: rider.vehicle.type,
              plate: rider.vehicle.plateNumber
            },
            riderLocation: {
              lat: riderLocation?.location?.lat,
              lng: riderLocation?.location?.lng,
              desc: riderLocation?.description
            },
            rideOtp: otp
            // ride: data.ride
          }
        });

        router.push("/screens/confirmedBooking");
      } else {
        return console.error('Ride create error');

      }
    } catch (error) {
      console.error("❌ Ride creation error:", error);
    }
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
  // map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height }
});

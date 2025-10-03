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

const socket = io(backendURL, { transports: ["websocket"] });

const Home = () => {
  const [rider, setRider] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ride, setRide] = useState<any>(null);

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const email = await AsyncStorage.getItem("rider");
        if (!email) return;
        const res = await axios.post(`${backendURL}/get-rider`, { email });
        if (res.data.success) {
          setRider(res.data.user);
          socket.emit("register_rider", { riderId: res.data.user._id, name: res.data.user.name });
        }
      } catch (err) {
        console.log("❌ Rider fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRider();

    socket.on("new_ride", (rideData) => {
      console.log("🚖 New ride received:", rideData);
      setRide(rideData);
    });

    return () => {
      socket.off("new_ride");
    };
  }, []);

  const handleAccept = () => {
    socket.emit("ride_response", { rideId: ride.id, riderId: rider._id, accept: true }, (res: { success: boolean }) => {
      if (res.success) {
        console.log("✅ Ride accepted");
        Alert.alert("Ride Accepted", "You accepted the ride.");
      }
    });
  };

  const handleReject = () => {
    socket.emit("ride_response", { rideId: ride.id, riderId: rider._id, accept: false }, (res: { success: boolean }) => {
      if (res.success) {
        console.log("❌ Ride rejected");
        setRide(null);
      }
    });
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
            pickup={ride.pickup}
            drop={ride.destination} // ✅ make sure matches backend
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

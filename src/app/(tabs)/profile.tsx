import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendURL } from "@/constants/url";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "toastify-react-native";

const { width } = Dimensions.get("window");

// Map vehicle type to image
const vehicleImages: Record<string, any> = {
  car: require("@/assets/icons/taxi.png"),
  bike: require("@/assets/icons/bike.png"),
  auto: require("@/assets/icons/auto.png"),
};

const RiderProfile = () => {
  const router = useRouter();
  const [rider, setRider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRider = async () => {
      try {
        const email = await AsyncStorage.getItem("rider");
        if (!email) return router.push("/");

        const res = await axios.post(`${backendURL}/get-rider`, { email });
        if (res.data.success) {
          setRider(res.data.user);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRider();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post(`${backendURL}/logout`);
      if (res.data.success) {
        Toast.show({ type: "success", text1: res.data.message });
        await AsyncStorage.clear();
        router.replace("/login");
      } else Toast.error(res.data.message);
    } catch (err: any) {
      Toast.error(`Error logging out: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#50c9c3" />
      </View>
    );
  }

  if (!rider) {
    return (
      <View style={styles.loader}>
        <Text style={{ color: "#555" }}>Rider not found</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={["#50c9c3", "#4a90e2"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>Rider Profile</Text>
          <TouchableOpacity style={styles.logoutIcon} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Avatar & Name */}
          <View style={styles.header}>
            <Image
              source={{
                uri:
                  rider.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
              }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{rider.name}</Text>
            <Text style={styles.email}>{rider.email}</Text>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.row}>
              <Ionicons name="call" size={20} color="#50c9c3" />
              <Text style={styles.infoText}>{rider.phone}</Text>
            </View>

            {rider.vehicle && (
              <View style={[styles.row, { marginTop: 10 }]}>
                <Image
                  source={vehicleImages[rider.vehicle.type.toLowerCase()]}
                  style={styles.vehicleImg}
                  resizeMode="contain"
                />
                <Text style={styles.infoText}>
                  {rider.vehicle.type.toUpperCase()} - {rider.vehicle.plateNumber}
                </Text>
                
              </View>
            )}
            <View style={{ marginTop: 10, flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="checkmark-circle" color={'#9932CC'} size={30} />
              {rider.isVerified && <Text style={styles.infoText}>Verified</Text>}
            </View>
          </View>

          {/* Options */}
          <View style={styles.options}>
            <LinearGradient
              colors={["#ffffff", "#e6f7ff"]}
              style={styles.optionCard}
            >
              <TouchableOpacity style={styles.option}>
                <FontAwesome5 name="car" size={22} color="#50c9c3" />
                <Text style={styles.optionText}>My Rides</Text>
              </TouchableOpacity>
            </LinearGradient>

            {/* <LinearGradient
              colors={["#ffffff", "#f0f5ff"]}
              style={styles.optionCard}
            >
              <TouchableOpacity style={styles.option}>
                <Ionicons name="location" size={22} color="#50c9c3" />
                <Text style={styles.optionText}>Saved Places</Text>
              </TouchableOpacity>
            </LinearGradient> */}

            <LinearGradient
              colors={["#ffffff", "#fef9f0"]}
              style={styles.optionCard}
            >
              <TouchableOpacity style={styles.option}>
                <Ionicons name="settings" size={22} color="#50c9c3" />
                <Text style={styles.optionText}>Settings</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default RiderProfile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingBottom: 40 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },

  // Top Bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  topTitle: { fontSize: 24, fontWeight: "700", color: "#fff" },
  logoutIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },

  // Header
  header: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  name: { fontSize: 26, fontWeight: "800", color: "#fff", marginBottom: 4 },
  email: { fontSize: 14, color: "#f1f1f1" },

  // Info Card
  infoCard: {
    backgroundColor: "#fff",
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  row: { flexDirection: "row", alignItems: "center" },
  infoText: { marginLeft: 12, fontSize: 16, color: "#333", fontWeight: "500" },
  vehicleImg: { width: 30, height: 30 },

  // Options
  options: { width: width * 0.9 },
  optionCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionText: { marginLeft: 14, fontSize: 16, color: "#333", fontWeight: "600" },
});

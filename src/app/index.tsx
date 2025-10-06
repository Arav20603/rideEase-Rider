import 'react-native-get-random-values';
import React, { useEffect } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  View,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToastManager from "toastify-react-native";
import { setOrigin } from "@/features/mapSlice/mapSlice";

const Main = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { width, height } = Dimensions.get("window");

  // 🧭 Fetch location and handle geocoding safely
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "We need location access to continue. Enable it in Settings."
          );
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude, longitude } = loc.coords;

        let description = "Current Location";

        try {
          const places = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });

          if (places && places.length > 0) {
            const place = places[0];
            description = `${place.name || "Unknown"}, ${place.city || ""}`;
          }
        } catch (geoErr: any) {
          console.warn("⚠️ Reverse geocoding failed:", geoErr.message);
          description = "Current Location";
        }

        dispatch(
          setOrigin({
            location: { lat: latitude, lng: longitude },
            description,
          })
        );

        console.log("✅ Rider location set:", latitude, longitude, description);
      } catch (err: any) {
        console.error("❌ Location fetch error:", err.message);
        Alert.alert("Error", "Failed to fetch location. Please try again later.");
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const store = await AsyncStorage.getItem("rider");
        if (store) {
          router.replace("/home");
        }
      } catch (e: any) {
        console.error("Error checking AsyncStorage:", e.message);
      }
    };

    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <ImageBackground
          source={require("@/assets/images/landing.png")}
          style={{ width, height: "100%" }}
        />
      </View>

      <View style={[{ height: height / 3 }, styles.buttonContainer]}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </View>

      <ToastManager />
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#000", // fallback for image loading
  },
  buttonContainer: {
    justifyContent: "center",
  },
  button: {
    backgroundColor: "rgba(17, 36, 42, 0.5)",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
  },
});

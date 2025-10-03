import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Toast } from "toastify-react-native";
import { backendURL } from "@/constants/url";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get("window");

const Register = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [plateNo, setPlateNo] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const togglePasswordVisibility = () => setSecureTextEntry(!secureTextEntry);

  const handleSignup = async () => {
    try {
      const res = await axios.post(`${backendURL}/register`, {
        name,
        email,
        phone,
        password,
        vehicle: {
          type: vehicleType,
          plateNumber: plateNo,
        },
      });

      if (res.data.success) {
        Toast.show({
          type: "success",
          text1: res.data.message,
          position: "top",
          visibilityTime: 2000,
          autoHide: true,
        });
        router.push({ pathname: "/verify-email", params: { email } });
      } else {
        Toast.error(`Signup Failed: ${res.data.message}`);
      }
      setPassword("");
    } catch (err: any) {
      console.log(err);
      Toast.error(`Error in registration: ${err.message}`);
      setPassword("");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}>
          <View style={styles.card}>
            <Text style={styles.title}>Welcome! 👋</Text>
            <Text style={styles.subtitle}>Create an account</Text>

            {/* Name */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            {/* Phone */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter phone"
                value={phone}
                onChangeText={setPhone}
                style={styles.input}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            {/* Vehicle Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Select Vehicle Type</Text>
              <Picker
                selectedValue={vehicleType}
                onValueChange={(itemValue) => setVehicleType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select vehicle type" value="" />
                <Picker.Item label="Bike" value="bike" />
                <Picker.Item label="Auto" value="auto" />
                <Picker.Item label="Car" value="car" />
              </Picker>
            </View>

            {/* Vehicle Plate No */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter plate no."
                value={plateNo}
                onChangeText={setPlateNo}
                style={styles.input}
                autoCapitalize="characters"
                placeholderTextColor="#888"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#888"
              />
              <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                <Ionicons
                  name={secureTextEntry ? "eye-off" : "eye"}
                  size={22}
                  color="gray"
                />
              </Pressable>
            </View>

            {/* Signup Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerText}>
                Already have an account? <Text style={styles.link}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: width * 0.9,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
    position: "relative",
  },
  label: {
    marginLeft: 10,
    marginBottom: 4,
    fontSize: 14,
    color: "#555",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fafafa",
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "#fafafa",
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  button: {
    backgroundColor: "#4a90e2",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    color: "#444",
  },
  link: {
    color: "#4a90e2",
    fontWeight: "600",
  },
});

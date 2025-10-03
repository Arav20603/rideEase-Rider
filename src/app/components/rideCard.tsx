import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface RideCardProps {
  title: string;
  pickup: string;
  drop: string;
  onAccept: () => void;
  onReject: () => void;
}

const RideCard: React.FC<RideCardProps> = ({ title, pickup, drop, onAccept, onReject }) => {
  return (
    <View style={styles.rideCard}>
      <Text style={styles.rideTitle}>{title}</Text>
      <Text style={styles.rideInfo}>Pickup: {pickup}</Text>
      <Text style={styles.rideInfo}>Drop: {drop}</Text>

      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.accept]} onPress={onAccept}>
          <Text style={styles.btnText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.reject]} onPress={onReject}>
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RideCard;

const styles = StyleSheet.create({
  rideCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  rideTitle: { fontSize: 16, fontWeight: "700", color: "#222", marginBottom: 6 },
  rideInfo: { fontSize: 14, color: "#555", marginBottom: 4 },
  btnRow: { flexDirection: "row", marginTop: 12, justifyContent: "space-between" },
  btn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: "center", marginHorizontal: 4 },
  accept: { backgroundColor: "#4CAF50" },
  reject: { backgroundColor: "#E74C3C" },
  btnText: { color: "#fff", fontWeight: "600" },
});

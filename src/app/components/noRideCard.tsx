import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NoRideCard = () => {
  return (
    <View style={styles.noRideCard}>
      <Text style={styles.noRideText}>No rides at the moment</Text>
      <Text style={styles.noRideSubText}>
        Waiting for requests... You’ll see them pop up here.
      </Text>
    </View>
  );
};

export default NoRideCard;

const styles = StyleSheet.create({
  noRideCard: {
    backgroundColor: "#eef3fd",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  noRideText: { fontSize: 16, fontWeight: "700", color: "#4a90e2", marginBottom: 6 },
  noRideSubText: { fontSize: 14, color: "#555", textAlign: "center" },
});

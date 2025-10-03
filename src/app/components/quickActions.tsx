import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const QuickActions = () => {
  return (
    <View style={styles.actionsContainer}>
      {["History", "Wallet", "Support"].map((item) => (
        <TouchableOpacity style={styles.actionCard} key={item}>
          <Text style={styles.actionText}>{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: { fontSize: 16, fontWeight: "600", color: "#4a90e2" },
});

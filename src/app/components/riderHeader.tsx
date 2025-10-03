import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface RiderHeaderProps {
  name: string;
}

const RiderHeader: React.FC<RiderHeaderProps> = ({ name }) => {
  return (
    <LinearGradient
      colors={["#4a90e2", "#357ABD"]}
      style={styles.header}
      start={[0, 0]}
      end={[1, 1]}
    >
      <Text style={styles.headerText}>Hello, {name || "Rider"}! 👋</Text>
      <Text style={styles.subHeaderText}>Ready for your next ride?</Text>
    </LinearGradient>
  );
};

export default RiderHeader;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerText: { fontSize: 26, fontWeight: "700", color: "#fff" },
  subHeaderText: { fontSize: 16, color: "#dbe6f1", marginTop: 6 },
});

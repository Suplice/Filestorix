import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    minWidth: "47%",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  content: {},
  value: {
    fontSize: 20,
    fontWeight: "800",
    color: "white",
  },
});

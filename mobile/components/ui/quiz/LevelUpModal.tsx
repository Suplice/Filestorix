import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { RNButton } from "@/components/nativeComponents";
import { ArrowUp, PartyPopper } from "lucide-react-native";

export function LevelUpModal({ isOpen, onClose, newLevel }: any) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={{ alignItems: "center" }}>
            <PartyPopper
              size={48}
              color="#eab308"
              style={{ marginBottom: 16 }}
            />
            <Text style={styles.title}>Gratulacje!</Text>
            <ArrowUp size={64} color="#22c55e" style={{ marginVertical: 20 }} />
            <Text style={{ color: "#94a3b8" }}>Osiągnięto nowy poziom!</Text>
            <Text style={styles.levelText}>Poziom {newLevel}</Text>
          </View>
          <RNButton
            title="Super!"
            onPress={onClose}
            style={{ marginTop: 20, width: "100%" }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  levelText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#6366f1",
    marginVertical: 10,
  },
});

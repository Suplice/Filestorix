import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface Props {
  onPress?: () => void;
  title: string;
  variant?: "primary" | "outline" | "link";
  isLoading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export const NativeButton = ({
  onPress,
  title,
  variant = "primary",
  isLoading,
  style,
  icon,
}: Props) => {
  const getContainerStyle = () => {
    switch (variant) {
      case "outline":
        return styles.containerOutline;
      case "link":
        return styles.containerLink;
      default:
        return styles.containerPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "outline":
        return styles.textOutline;
      case "link":
        return styles.textLink;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.baseContainer, getContainerStyle(), style]}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  containerPrimary: {
    backgroundColor: "#4f46e5",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  textPrimary: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  containerOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#334155",
  },
  textOutline: {
    color: "#cbd5e1",
    fontWeight: "600",
    fontSize: 18,
    marginLeft: 8,
  },
  containerLink: {
    backgroundColor: "transparent",
    height: "auto",
    padding: 0,
  },
  textLink: {
    color: "#818cf8",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { Control, Controller } from "react-hook-form";
import { Feather } from "@expo/vector-icons";

interface Props extends TextInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  error?: string;
  iconName?: keyof typeof Feather.glyphMap;
}

export const AuthInput = ({
  control,
  name,
  label,
  error,
  iconName,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View
            style={[
              styles.container,
              isFocused && styles.containerFocused,
              !!error && styles.containerError,
            ]}
          >
            {iconName && (
              <Feather
                name={iconName}
                size={20}
                color={isFocused ? "#6366f1" : "#94a3b8"}
                style={styles.icon}
              />
            )}

            <TextInput
              style={styles.input}
              placeholderTextColor="#64748b"
              onBlur={() => {
                setIsFocused(false);
                onBlur();
              }}
              onFocus={() => setIsFocused(true)}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              {...props}
            />
          </View>
        )}
      />
      {error && (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={12} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  label: {
    color: "#cbd5e1",
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 2,
    borderColor: "#1e293b",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  containerFocused: {
    borderColor: "#6366f1",
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  containerError: {
    borderColor: "#ef4444",
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    height: "100%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "bold",
  },
});

import React, { useState } from "react";
import {
  TouchableOpacity,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { ChevronDown, X } from "lucide-react-native";

export const RNButton = ({
  onPress,
  title,
  variant = "primary",
  size = "default",
  disabled,
  loading,
  icon,
  style,
}: any) => {
  let bg = "#4f46e5";
  let borderWidth = 0;
  let borderColor = "transparent";

  if (variant === "destructive") {
    bg = "#ef4444";
  } else if (variant === "outline") {
    bg = "transparent";
    borderWidth = 1;
    borderColor = "#475569";
  } else if (variant === "ghost") {
    bg = "transparent";
  } else if (variant === "secondary") {
    bg = "#1e293b";
  }

  const textColor = "#ffffff";

  const isInteractive = !disabled && !loading;

  return (
    <TouchableOpacity
      onPress={isInteractive ? onPress : undefined}
      activeOpacity={0.7}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: size === "sm" ? 8 : 14,
          paddingHorizontal: size === "sm" ? 14 : 20,
          borderRadius: 12,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: borderWidth,
          borderColor: borderColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={{ marginRight: title ? 8 : 0 }}
        />
      ) : (
        icon
      )}
      {title && (
        <Text
          style={{
            color: textColor,
            fontWeight: "600",
            fontSize: size === "sm" ? 13 : 16,
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const RNInput = (props: any) => (
  <TextInput
    placeholderTextColor="#64748b"
    style={[
      {
        height: 52,
        borderColor: "#334155",
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        backgroundColor: "#1e293b",
        color: "#ffffff",
        fontSize: 16,
      },
      props.style,
    ]}
    {...props}
  />
);

export const RNAvatar = ({ src, fallback, size = 40 }: any) => {
  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <Image
        source={{ uri: src }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "#334155",
        }}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#334155",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: size * 0.4,
          fontWeight: "bold",
          color: "#cbd5e1",
        }}
      >
        {fallback}
      </Text>
    </View>
  );
};

export const RNSkeleton = ({ style }: any) => (
  <View
    style={[
      { backgroundColor: "#334155", borderRadius: 8, opacity: 0.5 },
      style,
    ]}
  />
);

export const RNBadge = ({ text, style }: any) => (
  <View
    style={[
      {
        backgroundColor: "#1e293b",
        borderColor: "#334155",
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
      },
      style,
    ]}
  >
    <Text style={{ fontSize: 10, color: "#94a3b8" }}>{text}</Text>
  </View>
);

export const RNProgress = ({
  value,
  style,
}: {
  value: number;
  style?: any;
}) => (
  <View
    style={[
      {
        height: 6,
        backgroundColor: "#334155",
        borderRadius: 3,
        overflow: "hidden",
      },
      style,
    ]}
  >
    <View
      style={{
        width: `${Math.max(0, Math.min(100, value))}%`,
        height: "100%",
        backgroundColor: "#6366f1",
      }}
    />
  </View>
);

export const RNSelect = ({
  value,
  options,
  onValueChange,
  placeholder,
  label,
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel =
    options.find((opt: any) => opt.value === value)?.label || placeholder;

  return (
    <View style={{ marginBottom: 12 }}>
      {label && (
        <Text style={{ color: "#94a3b8", marginBottom: 6, fontSize: 12 }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1e293b",
          borderWidth: 1,
          borderColor: "#334155",
          padding: 12,
          borderRadius: 12,
          height: 52,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>{selectedLabel}</Text>
        <ChevronDown size={20} color="#94a3b8" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#1e293b",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "60%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 20,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
                {placeholder}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "#334155",
                  }}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={{
                      color: item.value === value ? "#6366f1" : "#fff",
                      fontWeight: item.value === value ? "bold" : "normal",
                      fontSize: 16,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

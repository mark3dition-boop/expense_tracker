import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AddExpenseButton({ onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="add"
          size={20}
          color="#FFFFFF"
        />
      </View>

      <Text style={styles.title}>
        Add Expense
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3B82F6",
    borderRadius: 22,
    paddingVertical: 26,
    alignItems: "center",
    paddingHorizontal: 70,
    height: 70,
    flexDirection: "row",
    justifyContent:"flex-start"
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },

  iconContainer: {
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    width: 30
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 12
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
});
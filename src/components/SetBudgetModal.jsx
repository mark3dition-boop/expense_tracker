import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function SetBudgetModal({
  visible,
  budget = 0,
  onClose,
  onSave,
}) {
  const today = new Date();

  const [amount, setAmount] = useState(
    budget > 0 ? budget.toString() : ""
  );

  const handleSave = async () => {
    const numericAmount = Number(amount.replace(/\D/g, ""));

    if (!numericAmount || numericAmount <= 0) {
      return;
    }

    onSave(numericAmount);

    const { error } = await supabase
    .from("monthly_budget")
    .upsert(
      {
        month: today.getMonth(),
        year: today.getFullYear(),
        budget: numericAmount,
      },
      {
        onConflict: "user_id,month,year",
      }
    )

    if (error) {
      console.log(error);
      alert("Failed to save data");
      return;
    }

    setAmount("");
    onClose();
  
  };

  const formatInput = (value) => {
    const numericValue = value.replace(/\D/g, "");

    if (!numericValue) {
      setAmount("");
      return;
    }

    setAmount(Number(numericValue).toLocaleString("id-ID"));
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modal}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {budget > 0 ? "Edit Budget" : "Set Budget"}
              </Text>

              <Text style={styles.subtitle}>
                Set your spending limit for this month
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
              hitSlop={8}
            >
              <Ionicons
                name="close"
                size={22}
                color="#555"
              />
            </Pressable>
          </View>

          {/* Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.currency}>Rp</Text>

            <TextInput
              value={amount}
              onChangeText={formatInput}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#B0B0B0"
              style={styles.input}
              autoFocus
            />
          </View>

          <Text style={styles.helper}>
            This budget will apply to your current month.
          </Text>

          {/* Save */}
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.saveButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.saveText}>
              Save Budget
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modal: {
    width: "88%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    elevation: 8,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 5,
    maxWidth: 260,
  },

  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 24,
    height: 64,
  },

  currency: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },

  helper: {
    fontSize: 12,
    color: "#999",
    marginTop: 10,
  },

  saveButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  pressed: {
    opacity: 0.8,
  },
});

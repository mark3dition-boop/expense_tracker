import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function AddExpense() {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const router = useRouter();

  const formatCurrency = (value: any) => {
    const number = value.replace(/\D/g, "");

    if (!number) return "";

    return Number(number).toLocaleString("id-ID");
  };

  const handleAmountChange = (value: any) => {
    const formatted = formatCurrency(value);
    setAmount(formatted);
  };

  const handleSave = async () => {
    if (!amount) {
      Alert.alert("Missing amount", "Please enter the expense amount.");
      return;
    }

    const expense = {
      amount: Number(amount.replace(/\./g, "")),
      note
    };

     const { error } = await supabase
        .from("expenses")
        .insert({
            title: expense.note,
            amount: expense.amount
        });

        if (error) {
            console.log(error);
            alert("Failed to save data");
            return;
        }

    console.log("Expense:", expense);

    Alert.alert("Success", "Expense has been saved.");

    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <SafeAreaView>
        {/* Header */}
        <View style={styles.header}>
          <Pressable 
          style={styles.backButton}
          onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </Pressable>

          <Text style={styles.title}>Add Expense</Text>

          <View style={styles.headerPlaceholder} />
        </View>

        {/* Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.currency}>Rp</Text>

            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="0"
              placeholderTextColor="#B5B5B5"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Note */}
        <View style={styles.section}>
          <Text style={styles.label}>Note</Text>

          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="Add a note"
            placeholderTextColor="#A5A5A5"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={handleSave}
        >
          <Ionicons name="checkmark" size={22} color="#FFF" />

          <Text style={styles.saveButtonText}>Save Expense</Text>
        </Pressable>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },

  header: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },

  headerPlaceholder: {
    width: 42,
  },

  section: {
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222222",
    marginBottom: 10,
  },

  amountContainer: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  currency: {
    fontSize: 22,
    fontWeight: "600",
    color: "#555555",
    marginRight: 10,
  },

  amountInput: {
    flex: 1,
    fontSize: 30,
    fontWeight: "700",
    color: "#111111",
    padding: 0,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  categoryItem: {
    width: "31.5%",
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  categoryItemSelected: {
    borderColor: "#111111",
    backgroundColor: "#111111",
  },

  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },

  categoryIconSelected: {
    backgroundColor: "#333333",
  },

  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#555555",
  },

  categoryTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  inputButton: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  inputLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  inputText: {
    fontSize: 15,
    color: "#333333",
  },

  noteInput: {
    minHeight: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 16,
    fontSize: 15,
    color: "#222222",
  },

  saveButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 5,
  },

  saveButtonPressed: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput
} from "react-native";

interface YearPickerProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export default function YearPicker({
  selectedYear,
  onYearChange,
}: YearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [yearInput, setYearInput] = useState(selectedYear.toString());

  const handleYearSubmit = () => {
    const year = Number(yearInput);

    if (!Number.isInteger(year)) {
      return;
    }

    if (year < 1 || year > 9999) {
      return;
    }

    onYearChange(year);
    setIsOpen(false);
  };

  return (
    <>
      {/* YEAR PICKER */}
      <Pressable
        style={styles.yearPicker}
        onPress={() => {
          setYearInput(selectedYear.toString());
          setIsOpen(true);
        }}
      >
        <Text style={styles.yearText}>{selectedYear}</Text>

        <Ionicons
          name="chevron-down"
          size={16}
          color="#333"
        />
      </Pressable>

      {/* MODAL */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            style={styles.dropdown}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.title}>
              Select Year
            </Text>

            <TextInput
              value={yearInput}
              onChangeText={setYearInput}
              keyboardType="number-pad"
              placeholder="Enter year"
              maxLength={4}
              style={styles.input}
              autoFocus
              onSubmitEditing={handleYearSubmit}
            />

            <Pressable
              style={styles.button}
              onPress={handleYearSubmit}
            >
              <Text style={styles.buttonText}>
                Select
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  yearPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },

  yearText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },

  dropdown: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 14,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#222",
  },

  button: {
    marginTop: 12,
    height: 45,
    borderRadius: 10,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
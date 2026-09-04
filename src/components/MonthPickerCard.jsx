import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const months = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function MonthPickerCard({ value, onChange }) {
  const [visible, setVisible] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(
    value.getMonth()
  );

  const [selectedYear, setSelectedYear] = useState(
    value.getFullYear()
  );

  const openPicker = () => {
    setSelectedMonth(value.getMonth());
    setSelectedYear(value.getFullYear());
    setVisible(true);
  };

  const save = () => {
    onChange(new Date(selectedYear, selectedMonth, 1));
    setVisible(false);
  };

  return (
    <>
      {/* CARD */}
      <Pressable style={styles.card} onPress={openPicker}>
        <View style={styles.left}>
          <View style={styles.icon}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#4F46E5"
            />
          </View>

          <View>
            <Text style={styles.label}>Transaction Month</Text>
            <Text style={styles.month}>
              {months[value.getMonth()]} {value.getFullYear()}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* MODAL */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
      >
        <Pressable
          style={styles.overlay}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.sheet}>
            <View style={styles.handle} />

            <Text style={styles.title}>
              Choose Month
            </Text>

            <FlatList
              data={months}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Pressable
                  style={[
                    styles.monthItem,
                    selectedMonth === index &&
                      styles.monthSelected,
                  ]}
                  onPress={() =>
                    setSelectedMonth(index)
                  }
                >
                  <Text
                    style={[
                      styles.monthText,
                      selectedMonth === index &&
                        styles.monthTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              )}
            />

            <View style={styles.yearRow}>
              <Pressable
                onPress={() =>
                  setSelectedYear(selectedYear - 1)
                }
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={36}
                  color="#4F46E5"
                />
              </Pressable>

              <Text style={styles.year}>
                {selectedYear}
              </Text>

              <Pressable
                onPress={() =>
                  setSelectedYear(selectedYear + 1)
                }
              >
                <Ionicons
                  name="chevron-forward-circle"
                  size={36}
                  color="#4F46E5"
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.saveButton}
              onPress={save}
            >
              <Text style={styles.saveText}>
                Save
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#3B82F6",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  label: {
    color: "white",
    fontSize: 13,
  },

  month: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 3,
    color: "white",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    maxHeight: "80%",
  },

  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DDD",
    alignSelf: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    alignSelf: "center",
    marginBottom: 20,
  },

  monthItem: {
    paddingVertical: 14,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 6,
  },

  monthSelected: {
    backgroundColor: "#EEF2FF",
  },

  monthText: {
    fontSize: 18,
  },

  monthTextSelected: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  yearRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },

  year: {
    fontSize: 26,
    fontWeight: "700",
    marginHorizontal: 24,
  },

  saveButton: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },

  saveText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
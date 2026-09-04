import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  type: "highest" | "lowest";
  amount: number | string | null;
  category?: string | null;
  date?: string | null;
}

export default function ExpenseHighlightCard({
  type,
  amount,
  category,
  date,
}: Props) {
  const isHighest = type === "highest";
  const isEmpty = amount == null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons
          name={isHighest ? "trending-up" : "trending-down"}
          size={22}
          color={isHighest ? "#EF4444" : "#22C55E"}
        />

        <Text style={styles.title}>
          {isHighest ? "Highest Expense" : "Lowest Expense"}
        </Text>
      </View>

      {isEmpty ? (
        <Text>
          There is no expense
        </Text>
      ) : (
        <>
          <Text style={styles.amount}>
            {typeof amount === "number"
              ? amount.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                })
              : amount}
          </Text>

          {category && (
            <Text style={styles.category}>
              {category}
            </Text>
          )}

          {date && (
            <Text style={styles.date}>
              {date}
            </Text>
          )}
        </>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 4,
    maxWidth: 180
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },

  amount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },

  category: {
    fontSize: 12,
    marginTop: 6,
    color: "#374151",
  },

  date: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 10
  },
});
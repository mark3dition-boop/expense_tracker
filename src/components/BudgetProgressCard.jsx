import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BudgetProgressCard({
  spent = 0,
  budget = 0,
  onPressSetBudget,
  onPressRemoveBudget,
}) {
  const percentage =
    budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const remaining = Math.max(budget - spent, 0);

  const formatCurrency = (value) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  const getProgressColor = (value) => {
    if (value >= 90) return "#EF4444";
    if (value >= 70) return "#FACC15";
    return "#3B82F6";
  };

  return (
    <View style={styles.container}>
      {budget === 0 ? (
        <>
          <Text style={styles.label}>Total Expense</Text>

          <Text style={styles.totalExpense}>
            {formatCurrency(spent)}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.description}>
            No spending limit has been set for this month.
          </Text>

          <Pressable
            onPress={onPressSetBudget}
            style={styles.setBudgetButton}
          >
            <Text style={styles.link}>Set Budget</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color="#3B82F6"
            />
          </Pressable>
        </>
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Budget Progress</Text>

            <View style={styles.actions}>
              <Pressable
                onPress={onPressSetBudget}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color="#666"
                />
              </Pressable>

              <Pressable
                onPress={onPressRemoveBudget}
                style={styles.actionButton}
                hitSlop={8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#EF4444"
                />
              </Pressable>
            </View>
          </View>

          {/* Spent / Budget */}
          <View style={styles.row}>
            <Text style={styles.spent}>
              {formatCurrency(spent)}
            </Text>

            <Text style={styles.budget}>
              / {formatCurrency(budget)}
            </Text>
          </View>

          {/* Progress */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${percentage}%`,
                  backgroundColor: getProgressColor(percentage),
                },
              ]}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.remaining}>
              Remaining {formatCurrency(remaining)}
            </Text>

            <Text
              style={[
                styles.percent,
                {
                  color: getProgressColor(percentage),
                },
              ]}
            >
              {percentage.toFixed(0)}% Used
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 20,
    marginTop: 8,
    elevation: 4,
  },

  /* Budget header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  /* No budget */
  label: {
    fontSize: 14,
    color: "#888",
  },

  totalExpense: {
    fontSize: 30,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 18,
  },

  description: {
    fontSize: 12,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },

  setBudgetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  link: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
  },

  /* Budget progress */
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
  },

  spent: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
  },

  budget: {
    fontSize: 16,
    color: "#777",
    marginLeft: 6,
    marginBottom: 2,
  },

  progressBackground: {
    width: "100%",
    height: 10,
    borderRadius: 100,
    backgroundColor: "#ECECEC",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 100,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  remaining: {
    fontSize: 14,
    color: "#666",
  },

  percent: {
    fontSize: 14,
    fontWeight: "700",
  },
});

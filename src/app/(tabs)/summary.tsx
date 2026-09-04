import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";
import { supabase } from "../../lib/supabase";

import { useFocusEffect } from "expo-router";
import MonthPickerCard from "../../components/MonthPickerCard";

export default function Summary() {
  const { profile } = useAuth()

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const startOfNextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1);

  const [totalExpense, settotalExpense] = useState(0);
  const [lowestExpense, setLowestExpense] = useState<any>(null);
  const [highestExpense, setHighestExpense] = useState<any>(null);
  const [budgetData, setBudgetData] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);

  // =====================================================
  // FETCHING DATA
  // =====================================================

  async function fetchData(){
      const {data: expenses, error: error_expenses} = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", profile?.user_id)
      .gte("created_at", startOfMonth.toISOString())
      .lt("created_at", startOfNextMonth.toISOString());

      if (error_expenses) {
        console.log(error_expenses);
        Alert.alert("Error, can't fetch expense data", error_expenses.message);
        return;
      }


      if (expenses.length > 0) {
        const totalExpenseCl = expenses.reduce(
          (total, expense) => total + Number(expense.amount),
          0
        );

        const minExpense = expenses.reduce(
          (min, expense) =>
            Number(expense.amount) < Number(min.amount) ? expense : min,
          expenses[0]
        );

        const maxExpense = expenses.reduce(
          (max, expense) =>
            Number(expense.amount) > Number(max.amount) ? expense : max,
          expenses[0]
        );

        setTotalTransaction(expenses.length);
        settotalExpense(totalExpenseCl);
        setHighestExpense(maxExpense);
        setLowestExpense(minExpense);
      }
      else {
        setTotalTransaction(0);
        settotalExpense(0);
        setHighestExpense(null);
        setLowestExpense(null);
      }

      const {data: budget_d, error: error_budget} = await supabase
      .from("monthly_budget")
      .select("budget")
      .eq("user_id", profile?.user_id)
      .eq("month", selectedDate.getMonth())
      .eq("year", selectedDate.getFullYear())
      .limit(1)

      if (error_budget) {
        console.log(error_budget);
        Alert.alert("Error, can't fetch budget data", error_budget.message)
        return;
      }

      if (budget_d.length > 0) {
        setBudgetData(budget_d[0]?.budget);
      }
      else {
        setBudgetData(0);
      }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [selectedDate])
  );

  // =====================================================
  // DUMMY DATA
  // =====================================================

  const selectedMonth = 8;
  const selectedYear = 2026;

  const transactions = [
    {
      id: 1,
      amount: 150000,
      category: "Food",
      created_at: "2026-08-02",
    },
    {
      id: 2,
      amount: 50000,
      category: "Transportation",
      created_at: "2026-08-04",
    },
    {
      id: 3,
      amount: 300000,
      category: "Shopping",
      created_at: "2026-08-08",
    },
    {
      id: 4,
      amount: 75000,
      category: "Food",
      created_at: "2026-08-10",
    },
    {
      id: 5,
      amount: 450000,
      category: "Entertainment",
      created_at: "2026-08-12",
    },
    {
      id: 6,
      amount: 100000,
      category: "Transportation",
      created_at: "2026-08-15",
    },
    {
      id: 7,
      amount: 250000,
      category: "Food",
      created_at: "2026-08-18",
    },
  ];

  // Ubah nilai ini untuk mencoba kondisi budget
  const budget = 1500000;

  // =====================================================
  // SUMMARY CALCULATION
  // =====================================================

  const amounts = transactions.map(
    (transaction) => transaction.amount
  );

  // Total expense
  const totalExpenseDummy = amounts.reduce(
    (total, amount) => total + amount,
    0
  );

  // Number of expenses
  const numberOfExpenses = transactions.length;

  // Lowest expense
  const lowestExpenseDummy =
    amounts.length > 0 ? Math.min(...amounts) : 0;

  // Highest expense
  const highestExpenseDummy =
    amounts.length > 0 ? Math.max(...amounts) : 0;

  // =====================================================
  // BUDGET CALCULATION
  // =====================================================

  const hasBudget = budgetData > 0;

  const budgetPercentage = hasBudget
    ? (totalExpense / budgetData) * 100
    : 0;

  const isOverBudget =
    hasBudget && totalExpense > budgetData;

  // Progress bar maksimal 100%
  const progressPercentage = Math.min(
    budgetPercentage,
    100
  );

  const remainingBudget = Math.max(
    budgetData - totalExpense,
    0
  );

  const overBudgetAmount = Math.max(
    totalExpense - budgetData,
    0
  );

  // =====================================================
  // MONTH
  // =====================================================

  const monthName = new Date(
    selectedYear,
    selectedMonth - 1
  ).toLocaleString("en-US", {
    month: "long",
  });

  // =====================================================
  // FORMAT RUPIAH
  // =====================================================

  const formatRupiah = (value: any) => {
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        >
        {/* HEADER */}

        <View style={styles.header}>
            <Text style={styles.title}>
            Monthly Summary
            </Text>

            <Text style={styles.month}>
            {selectedDate.toLocaleDateString('en-US', { month: 'long' })} {selectedDate.getFullYear()}
            </Text>
        </View>

        {/* TOTAL EXPENSE */}

        <View style={styles.totalCard}>
            <View>
            <Text style={styles.label}>
                Total Expense
            </Text>

            <Text style={styles.totalExpense}>
                {formatRupiah(totalExpense)}
            </Text>
            </View>

            <View style={styles.iconCircle}>
            <Ionicons
                name="wallet-outline"
                size={23}
                color="#333"
            />
            </View>
        </View>

        {/* LOWEST & HIGHEST */}

        <View style={styles.row}>
            {/* Lowest */}

            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                  <Ionicons
                      name="arrow-down-outline"
                      size={18}
                      color="#333"
                  />

                  <Text style={styles.label}>
                      Lowest Expense
                  </Text>
              </View>
              
              {!(totalTransaction) ? (
                <Text style={{marginTop: 7}}>
                  There is no expense
                </Text>
                
              ) : (
                <>
                  <Text style={styles.statValue}>
                    {formatRupiah(lowestExpense?.amount)}
                  </Text>

                  <Text style={styles.label}>
                      {lowestExpense.title}
                  </Text>
                </>
              )}
            </View>

            {/* Highest */}

            <View style={styles.statCard}>
            <View style={styles.statHeader}>
                <Ionicons
                name="arrow-up-outline"
                size={18}
                color="#333"
                />

                <Text style={styles.label}>
                Highest Expense
                </Text>
            </View>

            {!(totalTransaction) ? (
                <Text style={{marginTop: 7}}>
                  There is no expense
                </Text>
                
              ) : (
                <>
                  <Text style={styles.statValue}>
                      {formatRupiah(highestExpense?.amount)}
                  </Text>

                  <Text style={styles.label}>
                      {highestExpense?.title}
                  </Text>
                </>
              )}
            </View>
        </View>

        {/* NUMBER OF EXPENSES */}

        <View style={styles.card}>
            <View>
            <Text style={styles.label}>
                Number of Expenses
            </Text>

            <Text style={styles.numberValue}>
                {totalTransaction}
            </Text>
            </View>

            <Ionicons
            name="receipt-outline"
            size={25}
            color="#333"
            />
        </View>

        {/* BUDGET */}

        <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
            <View>
                <Text style={styles.label}>
                Monthly Budget
                </Text>

                {hasBudget ? (
                <Text style={styles.budgetValue}>
                    {formatRupiah(budgetData)}
                </Text>
                ) : (
                <Text style={styles.noBudgetValue}>
                    No budget set
                </Text>
                )}
            </View>

            {hasBudget && (
                <Text
                style={[
                    styles.percentage,
                    isOverBudget && styles.overBudgetText,
                ]}
                >
                {budgetPercentage.toFixed(0)}%
                </Text>
            )}
            </View>

            {/* BUDGET EXISTS */}

            {hasBudget && (
            <>
                {/* Progress */}

                <View style={styles.progressBackground}>
                <View
                    style={[
                    styles.progress,
                    {
                        width: `${progressPercentage}%`,
                    },
                    isOverBudget &&
                        styles.overBudgetProgress,
                    ]}
                />
                </View>

                {/* NORMAL */}

                {!isOverBudget && (
                <View style={styles.budgetStatus}>
                    <Ionicons
                    name="checkmark-circle-outline"
                    size={17}
                    color="#555"
                    />

                    <Text style={styles.statusText}>
                    {formatRupiah(remainingBudget)} remaining
                    </Text>
                </View>
                )}

                {/* OVER BUDGET */}

                {isOverBudget && (
                <View style={styles.budgetStatus}>
                    <Ionicons
                    name="alert-circle-outline"
                    size={17}
                    color="#D64545"
                    />

                    <Text
                    style={[
                        styles.statusText,
                        styles.overBudgetText,
                    ]}
                    >
                    {formatRupiah(overBudgetAmount)} over budget
                    </Text>
                </View>
                )}
            </>
            )}

            {/* NO BUDGET */}

            {!hasBudget && (
            <View style={styles.noBudgetContainer}>
                <Text style={styles.noBudgetText}>
                You haven't set a budget for this month.
                </Text>

                <Text style={styles.setBudgetText}>
                Set a budget to track your spending.
                </Text>
            </View>
            )}
        </View>
        <View>
            <MonthPickerCard
                value={selectedDate}
                onChange={setSelectedDate}
            />
        </View>
        </ScrollView>
    </SafeAreaView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    gap: 12,
  },

  // Header

  header: {
    marginBottom: 8,
  },

  title: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
  },

  month: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  // General

  label: {
    fontSize: 12,
    color: "#777",
  },

  // Total Expense

  totalCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    padding: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  totalExpense: {
    fontSize: 26,
    fontWeight: "700",
    color: "#222",
    marginTop: 6,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E7E7E7",

    alignItems: "center",
    justifyContent: "center",
  },

  // Lowest / Highest

  row: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    padding: 18,
  },

  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginTop: 12,
  },

  // Number

  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    padding: 18,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  numberValue: {
    fontSize: 25,
    fontWeight: "700",
    color: "#222",
    marginTop: 5,
  },

  // Budget

  budgetCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    padding: 20,
  },

  budgetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  budgetValue: {
    fontSize: 19,
    fontWeight: "600",
    color: "#222",
    marginTop: 5,
  },

  noBudgetValue: {
    fontSize: 17,
    fontWeight: "600",
    color: "#999",
    marginTop: 5,
  },

  percentage: {
    fontSize: 23,
    fontWeight: "700",
    color: "#333",
  },

  overBudgetText: {
    color: "#D64545",
  },

  // Progress

  progressBackground: {
    height: 9,
    backgroundColor: "#E1E1E1",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 20,
  },

  progress: {
    height: "100%",
    backgroundColor: "#333",
    borderRadius: 10,
  },

  overBudgetProgress: {
    backgroundColor: "#D64545",
  },

  // Budget status

  budgetStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 11,
  },

  statusText: {
    fontSize: 12,
    color: "#777",
  },

  // No budget

  noBudgetContainer: {
    marginTop: 14,
  },

  noBudgetText: {
    fontSize: 13,
    color: "#555",
  },

  setBudgetText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
});

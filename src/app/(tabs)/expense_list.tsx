import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/authContext";
import { useFocusEffect } from "expo-router";
import { Alert } from "react-native";
import { supabase } from "../../lib/supabase";

import YearPicker from "../../components/YearPicker";

// =======================
// HELPER FUNCTIONS
// =======================

const formatCurrency = (value: Number) => {
  return `Rp ${value.toLocaleString("id-ID")}`;
};

const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

const extractDate = (created_at: any) => {
  return created_at.slice(0, 10);
};

const extractTime = (created_at: any) => {
  return new Date(created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ExpenseListPage() {

  const { profile } = useAuth();

  const today = new Date();
  const year = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(year);

  const startOfYear = new Date(selectedYear, 0, 1);
  const startOfNextYear= new Date(selectedYear + 1, 0, 1);

  const [search, setSearch] = useState("");

  const [expenseData, setExpenseData] = useState<any[]>([]);

  // =======================
  // FETCHING DATA
  // =======================

  async function fetchData(){
      const {data: expenses, error: error_expenses} = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", profile?.user_id)
      .gte("created_at", startOfYear.toISOString())
      .lt("created_at", startOfNextYear.toISOString());

      if (error_expenses) {
        console.log(error_expenses);
        Alert.alert("Error, can't fetch expense data", error_expenses.message);
        return;
      }

      setExpenseData(expenses ?? []);
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [profile?.user_id])
  );

  // ---------------------
  // Filtering
  // ---------------------

  const filteredExpenses = useMemo(() => {
    return expenseData.filter((expense:any) => {
      const matchesYear =
        new Date(expense.created_at).getFullYear() === selectedYear;


      const matchesSearch = expense.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesYear && matchesSearch;
    });
  }, [selectedYear, search, expenseData]);

  const groupedExpenses = useMemo(() => {
    const groups: Record<string, typeof filteredExpenses> = {};

    filteredExpenses.forEach((expense:any) => {
      const date = extractDate(expense.created_at);

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(expense);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items
    }));
  }, [filteredExpenses]);

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Expenses</Text>
          <Text style={styles.subtitle}>Track your spending</Text>
        </View>

        {/* YEAR PICKER */}
        <YearPicker
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
        />
      </View>

      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#8A8A8A"
        />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search expenses..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        {search.length > 0 && (
          <Pressable onPress={() => setSearch("")}>
            <Ionicons
              name="close-circle"
              size={19}
              color="#999"
            />
          </Pressable>
        )}
      </View>

      {/* EXPENSE LIST */}
      <FlatList
        data={groupedExpenses}
        keyExtractor={(item) => item.date}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.expenseList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="receipt-outline"
              size={42}
              color="#B5B5B5"
            />

            <Text style={styles.emptyTitle}>
              No expenses found
            </Text>

            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.dateSection}>
            {/* DATE */}
            <Text style={styles.dateTitle}>
              {formatDate(item.date)}
            </Text>

            {/* TRANSACTIONS */}
            <View style={styles.transactionContainer}>
              {item.items.map((expense:any) => (
                <Pressable
                  key={expense.id}
                  style={styles.transaction}
                >
                  {/* INFO */}
                  <View style={styles.expenseInfo}>
                    <Text
                      style={styles.expenseTitle}
                      numberOfLines={1}
                    >
                      {expense.title}
                    </Text>

                    <Text style={styles.expenseMeta}>
                       {extractTime(expense.created_at)}
                    </Text>
                  </View>

                  {/* AMOUNT */}
                  <Text style={styles.amount}>
                    -{formatCurrency(expense.amount)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#171717",
  },

  subtitle: {
    fontSize: 14,
    color: "#8A8A8A",
    marginTop: 4,
  },

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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAEAEA",
    marginBottom: 21
  },

  searchInput: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    color: "#222",
  },

  categoryList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },

  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E7E7",
  },

  categoryButtonActive: {
    backgroundColor: "#171717",
    borderColor: "#171717",
  },

  categoryText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },

  categoryTextActive: {
    color: "#FFFFFF",
  },

  expenseList: {
    paddingHorizontal: 20,
    paddingBottom: 110,
  },

  dateSection: {
    marginBottom: 24,
  },

  dateTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#888",
    marginBottom: 10,
  },

  transactionContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },

  transaction: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 15,
    minHeight: 72,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#F3F3F3",
    alignItems: "center",
    justifyContent: "center",
  },

  expenseInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 10,
  },

  expenseTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  expenseMeta: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  amount: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 12,
  },

  emptyText: {
    fontSize: 13,
    color: "#999",
    marginTop: 5,
  },

});
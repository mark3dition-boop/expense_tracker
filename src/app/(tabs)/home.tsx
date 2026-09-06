import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/authContext";
import { supabase } from "../../lib/supabase.js";

import AddExpenseButton from "../../components/AddExpenseButton";
import BudgetProgressCard from "../../components/BudgetProgressCard";
import ExpenseHighlightCard from "../../components/ExpenseHighlightCard";
import SetBudgetModal from "../../components/SetBudgetModal";

// -------------------
// Helper Functions
// -------------------

const formatDate = (dateString: any) => {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  });
};

export default function Home() {
  const { profile } = useAuth();
  const router = useRouter();

  const [showBudgetModal, setShowBudgetModal] = useState(false);

  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();
  const startOfMonth = new Date(thisYear, thisMonth, 1);
  const startOfNextMonth = new Date(thisYear, thisMonth + 1, 1);

  const [totalExpense, settotalExpense] = useState(0);
  const [lowestExpense, setLowestExpense] = useState<any>(null);
  const [highestExpense, setHighestExpense] = useState<any>(null);
  const [budgetData, setBudgetData] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [profilePicture, setProfilePicture] = useState(null);
  // -------------
  // Fetching Data 
  // -------------

  async function fetchData(){
    if (profile){
      const {data: expenses, error: error_expenses} = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", profile?.user_id)
      .gte("created_at", startOfMonth.toISOString())
      .lt("created_at", startOfNextMonth.toISOString());

      if (error_expenses) {
        console.log(error_expenses);
        Alert.alert("Error expense data", error_expenses.message)
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


      const {data: budget_d, error: error_budget} = await supabase
      .from("monthly_budget")
      .select("budget")
      .eq("user_id", profile?.user_id)
      .eq("month", thisMonth)
      .eq("year", thisYear)
      .limit(1)

      if (error_budget) {
        console.log(error_budget);
        Alert.alert("Error budget data", error_budget.message);
        return;
      }

      if (budget_d.length > 0) {
        setBudgetData(budget_d[0].budget);
      }

      const {data, error} = await supabase
      .from("users")
      .select("img_url")
      .eq("user_id", profile?.user_id)
      .limit(1)
      .single()

      if (error) {
        console.log(error)
        Alert.alert("Error", error.message)
        return;
      }

      setProfilePicture(data.img_url)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [profile?.user_id])
  );

  async function deleteBudgetData(){
    const { error } = await supabase
    .from('monthly_budget')
    .delete()
    .eq("year", today.getFullYear())
    .eq("month", today.getMonth())
    .eq("user_id", profile?.user_id);

    if (error) {
      console.log(error)
      Alert.alert("Error", error.message);
    }

  }

  console.log("profile.id:", profile?.user_id);
  console.log("profile.username:", profile?.username);
  console.log("----------------------------------------")


  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>

        <View>
          <Text style={styles.welcome}>Welcome, {profile?.username || "dummy"}!</Text>
          <Text style={styles.subtitle}>
            Manage your finances today
          </Text>
        </View>

        <Pressable
          style={styles.avatarContainer}
          onPress={() => router.push("/profile")}
        >
          {profilePicture ? (
            <Image
              source={{ uri: profilePicture}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Ionicons name="person" size={45} color="#9CA3AF" />
            </View>
          )}
        </Pressable>



      </View>

      {/* Today */}
      <View style={styles.dateCard}>
        <View style={styles.dateNumberContainer}>
          <Text style={styles.dateNumber}>
            {today.getDate()}
          </Text>
        </View>

        <View>
          <Text style={styles.todayLabel}>TODAY</Text>

          <Text style={styles.dateText}>
            {today.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      {/* Expense Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Expense Overview
        </Text>

        <View style={styles.highlightRow}>
          <ExpenseHighlightCard
            type="highest"
            amount={highestExpense?.amount}
            category={highestExpense?.title}
            date={formatDate(highestExpense?.created_at)}
          />

          <ExpenseHighlightCard
            type="lowest"
            amount={lowestExpense?.amount}
            category={lowestExpense?.title}
            date={formatDate(lowestExpense?.created_at)}
          />
        </View>
      </View>

      {/* Budget */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Monthly Budget
        </Text>

        <BudgetProgressCard
          spent={totalExpense}
          budget={budgetData}
          onPressSetBudget={() => {
            setShowBudgetModal(true);
          }}
          onPressRemoveBudget={() => {
            setBudgetData(0);
            deleteBudgetData();
          }}
        />

        <SetBudgetModal
          visible={showBudgetModal}
          budget={budgetData}
          onClose={() => {
            setShowBudgetModal(false);
          }}
          onSave={(newBudget: number) => {
            setBudgetData(newBudget);
          }}
        />
      </View>

      <View style={{marginTop: -5, alignItems: "center", marginBottom: 8}}>
        <Text>There are {totalTransaction} transactions this month</Text>
      </View>

      {/* Bottom Actions */}
      <View style={styles.actionRow}>
        <AddExpenseButton
          onPress={() => router.push({
              pathname: '/addExpense',
            })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 20,
  },

  /* Header */

  header: {
    paddingTop: 20,
    paddingBottom: 18,
    flexDirection: "row",
    // backgroundColor: "blue",
    justifyContent: "space-between"
  },

  welcome: {
    fontSize: 25,
    fontWeight: "700",
    color: "#141E61",
  },

  subtitle: {
    fontSize: 14,
    color: "#787A91",
    marginTop: 4,
  },

  /* Date */

  dateCard: {
    minHeight: 105,
    backgroundColor: "#141E61",
    borderRadius: 20,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
    marginBottom: 24,

    shadowColor: "#141E61",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },

  dateNumberContainer: {
    width: 60,
    height: 60,

    borderRadius: 16,
    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    marginRight: 16,
  },

  dateNumber: {
    fontSize: 28,
    fontWeight: "700",
    color: "#141E61",
  },

  todayLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#AEB3D8",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  /* Sections */

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#141E61",
    marginBottom: 1,
  },

  /* Expense Highlight */

  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  /* Bottom */

  actionRow: {
    flexDirection: "row",
    // backgroundColor: "blue",
    justifyContent: "space-evenly",
    gap: 12,
    marginBottom: 20,
  },

// -- -- -- 

  avatarContainer: {
    width: 50,
    height: 50,
    marginRight: 20,
    marginTop: 3,
    // backgroundColor: "red"
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
  },

  defaultAvatar: {
    width: 50,
    height: 50,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black"
  },

});
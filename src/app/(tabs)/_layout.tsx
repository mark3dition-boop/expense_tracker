import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#1A56E8",
        tabBarInactiveTintColor: "#666",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          alignItems: "center"
        },

        tabBarItemStyle: {
          flex: 0,
          width: 90,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="summary"
        options={{
          title: "Summary",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="expense_list"
        options={{
          title: "Expenses",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
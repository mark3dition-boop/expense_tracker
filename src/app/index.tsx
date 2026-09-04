import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";

export default function Index() {
  const { session, loading } = useAuth();
  const [timeout, setTimeoutState] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutState(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (loading && !timeout) return null;

  // Loading terlalu lama
  if (timeout) {
    return <Redirect href="/login" />;
  }
  // Auth selesai dan user login
  if (session) {
    return <Redirect href="/(tabs)/home" />;
  }

  // Auth selesai dan user tidak login
  return <Redirect href="/(auth)/login" />;
}
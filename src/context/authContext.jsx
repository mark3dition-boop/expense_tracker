import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userEmail) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.log("Profile error:", error);
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session?.user) {
        await fetchProfile(session.user.email);
      }

      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchProfile(session.user.email);
    } else {
      setProfile(null);
    }
  }, [session]);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        profile,
        loading,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
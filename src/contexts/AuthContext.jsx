import { createContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

export const AuthContext = createContext(null);

function clearSupabaseClientStorage() {
  const clearKeys = (storage) => {
    if (!storage) return;
    const keys = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (key && key.startsWith("sb-")) keys.push(key);
    }
    keys.forEach((key) => storage.removeItem(key));
  };

  clearKeys(window.localStorage);
  clearKeys(window.sessionStorage);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("role, full_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      setProfile(null);
      return;
    }

    setProfile(data || null);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session ?? null);
      await loadProfile(data.session?.user?.id);
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      await loadProfile(nextSession?.user?.id);
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const isAdmin =
    profile?.role === "admin" ||
    session?.user?.app_metadata?.role === "admin" ||
    session?.user?.user_metadata?.role === "admin";

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      profile,
      session,
      loading,
      isAuthenticated: Boolean(session?.user),
      isAdmin: Boolean(isAdmin),
      signInWithGoogle: async () => {
        if (!supabase) return;
        await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL || window.location.origin,
          },
        });
      },
      signOut: async () => {
        try {
          if (supabase) {
            await Promise.race([
              supabase.auth.signOut({ scope: "local" }),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Sign out timeout")), 2500)),
            ]);
          }
        } catch {
          // Fall through to hard local cleanup.
        }

        setSession(null);
        setProfile(null);
        clearSupabaseClientStorage();
        window.location.replace("/");
      },
    }),
    [loading, profile, session, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

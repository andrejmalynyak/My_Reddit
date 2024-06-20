import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export function signIn(redirectTo?: string) {
  const redirectLocation = new URL(
    redirectTo ?? "/create-profile",
    window.location.href
  );
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectLocation.origin + redirectLocation.pathname,
    },
  });
}

export function logOut() {
  const doLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Failed to log out: ", error);
    }
  };
  doLogout();
}

export function useAuthSession(keepLoggedIn: boolean = false): Session | null {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserExists = async () => {
    if (!session) {
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .single();

    if (!data && !keepLoggedIn) {
      logOut();
    }
  };

  useEffect(() => {
    checkUserExists();
  }, [session]);

  return session;
}

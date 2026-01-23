"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface RoleContextType {
  user: User | null | undefined;
  role: string | null | undefined;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType>({ user: undefined, role: undefined, loading: true });

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user ?? null);
      if (user) {
        setRole(undefined);
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        setRole(profile?.role || null);
      } else {
        setRole(null);
      }
      setLoading(false);
    });
  }, []);

  return (
    <RoleContext.Provider value={{ user, role, loading }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

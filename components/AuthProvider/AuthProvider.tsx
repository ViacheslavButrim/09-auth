"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const user = await checkSession();

      if (user) {
        setUser(user);
      } else {
        clearIsAuthenticated();
      }

      setLoading(false);
    };

    verify();
  }, [setUser, clearIsAuthenticated]);

  if (loading) return null; 

  return <>{children}</>;
}

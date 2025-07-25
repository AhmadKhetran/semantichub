"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
export function Provider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <SessionProvider refetchInterval={30} refetchOnWindowFocus={true}>
      <div className="w-full">{children}</div>
    </SessionProvider>
  );
}

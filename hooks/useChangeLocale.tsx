
"use client";

import { usePathname, useRouter } from "@/i18n/routing";
// Ensure you're using the correct import
import { useState, useTransition } from "react";

export const useChangeLocale = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (nextLocale: "te" | "en") => {
    setIsLoading(true);
    startTransition(() => {
      // Replace current route with the same path but with a different locale
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return { isLoading, isPending, onSelectChange };
};

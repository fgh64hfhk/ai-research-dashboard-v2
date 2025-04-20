import { useEffect, useState } from "react";

export function useLoadingGuard(timeout = 800): boolean {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  return isLoading;
}

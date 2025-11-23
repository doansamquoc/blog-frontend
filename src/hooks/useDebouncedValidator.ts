import { useEffect, useState } from "react";

export function useDebouncedValidator<T>(
  value: T,
  validator: (v: T) => Promise<boolean>,
  delay: number = 500
) {
  const [checking, setChecking] = useState(false);
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (!value || String(value).length < 3) {
      setChecking(false);
      setConflict(false);
      return;
    }

    setChecking(true);
    const timer = setTimeout(async () => {
      try {
        const isValid = await validator(value);
        setConflict(!isValid);
      } finally {
        setChecking(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [value, validator, delay]);

  return { checking, conflict };
}

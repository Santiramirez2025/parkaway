"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "parkaway:booking-progress";
const STORAGE_VERSION = 1;
const MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 horas

interface StoredProgress<T> {
  v: number;
  ts: number;
  step: number;
  data: T;
}

export function useBookingPersistence<T>(data: T, step: number) {
  const isFirstLoad = useRef(true);
  const [hasStoredProgress, setHasStoredProgress] = useState(false);
  const [restored, setRestored] = useState<{ data: T; step: number } | null>(
    null
  );

  // Detectar si hay progreso guardado en mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed: StoredProgress<T> = JSON.parse(raw);
      // Validar version y antiguedad
      if (parsed.v !== STORAGE_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      if (Date.now() - parsed.ts > MAX_AGE_MS) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      // Solo mostrar banner si hay datos significativos
      const dataObj = parsed.data as Record<string, unknown>;
      const hasData =
        dataObj &&
        Object.values(dataObj).some(
          (v) => v && v !== "" && v !== "06:00"
        );
      if (hasData && parsed.step > 1) {
        setHasStoredProgress(true);
        setRestored({ data: parsed.data, step: parsed.step });
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  // Guardar en cada cambio (excepto el primer render)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    try {
      const payload: StoredProgress<T> = {
        v: STORAGE_VERSION,
        ts: Date.now(),
        step,
        data,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // localStorage lleno o bloqueado: ignorar silenciosamente
    }
  }, [data, step]);

  const clear = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
    setHasStoredProgress(false);
    setRestored(null);
  };

  return { hasStoredProgress, restored, clear };
}

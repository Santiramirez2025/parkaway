import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generador de codigos de reserva tipo PA-XXXXXX (sin caracteres ambiguos)
const codeGen = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function generateReservationCode(): string {
  return `PA-${codeGen()}`;
}

// Token publico para acceder a "Mi reserva" sin login
const tokenGen = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  32
);

export function generatePublicToken(): string {
  return tokenGen();
}

// Formato de plata argentino. Recibe centavos, devuelve "$ 4.000".
export function formatARS(cents: number): string {
  const pesos = cents / 100;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pesos);
}

// Centavos -> numero entero de pesos (para Mercado Pago, que pide pesos)
export function centsToPesos(cents: number): number {
  return Math.round(cents / 100);
}

// Parsea "YYYY-MM-DD" como medianoche en zona local. `new Date("2026-05-10")`
// se interpreta como UTC y en GMT-3 da el dia anterior, lo que rompe la
// validacion "el retiro no puede ser en el pasado" para el dia de hoy.
export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

// Date object correspondiente a medianoche local del dia de hoy.
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

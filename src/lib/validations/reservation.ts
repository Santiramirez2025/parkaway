import { z } from "zod";

// Helpers
const phoneRegex = /^\+?54\s?9?\s?\d{2,4}\s?\d{6,8}$/;
const plateRegex = /^[A-Z]{2,3}[\s-]?\d{3}[\s-]?[A-Z]{0,2}$/i;

// Step 1: Fechas
export const datesSchema = z
  .object({
    pickupDate: z.string().min(1, "Elegi la fecha de retiro"),
    pickupHour: z.string().min(1, "Elegi el horario"),
    returnDate: z.string().min(1, "Elegi la fecha de retorno"),
  })
  .refine(
    (data) => {
      const pickup = new Date(data.pickupDate);
      const ret = new Date(data.returnDate);
      return ret > pickup;
    },
    {
      message: "La fecha de retorno tiene que ser posterior al retiro",
      path: ["returnDate"],
    }
  )
  .refine(
    (data) => {
      const pickup = new Date(data.pickupDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return pickup >= today;
    },
    {
      message: "El retiro no puede ser en el pasado",
      path: ["pickupDate"],
    }
  );

// (Legacy) Step domicilio: el modelo actual no requiere domicilio del cliente,
// el auto se deja en la cochera. Mantenemos el schema por compatibilidad
// y para reservas viejas, pero ya no se usa en el flow publico.
export const addressSchema = z.object({
  pickupAddress: z
    .string()
    .min(8, "Ingresa la direccion completa con altura")
    .max(200, "Demasiado largo"),
  pickupNeighborhood: z.string().min(2, "Elegi o ingresa tu barrio").max(80),
});

// Step 3: Vehiculo + datos del cliente
export const vehicleSchema = z.object({
  vehicleType: z.enum(["CHICO", "MEDIANO", "SUV"], {
    errorMap: () => ({ message: "Elegi el tipo de vehiculo" }),
  }),
  vehicleModel: z
    .string()
    .min(2, "Indica marca y modelo (ej: Toyota Etios)")
    .max(80),
  vehiclePlate: z
    .string()
    .regex(plateRegex, "Formato invalido (ej: AB123CD o ABC123)")
    .max(10),
  vehicleColor: z.string().max(40).optional().or(z.literal("")),
  customerName: z.string().min(2, "Tu nombre completo").max(80),
  customerEmail: z.string().email("Email invalido"),
  customerPhone: z
    .string()
    .regex(phoneRegex, "Telefono invalido. Ej: +54 9 341 1234567"),
});

// Schema completo (server-side, para crear la reserva)
export const createReservationSchema = z.object({
  pickupDate: z.string(),
  pickupHour: z.string(),
  returnDate: z.string(),
  pickupAddress: z.string().max(200).optional().or(z.literal("")),
  pickupNeighborhood: z.string().max(80).optional().or(z.literal("")),
  vehicleType: z.enum(["CHICO", "MEDIANO", "SUV"]),
  vehicleModel: z.string().min(2).max(80),
  vehiclePlate: z.string().regex(plateRegex).max(10),
  vehicleColor: z.string().max(40).optional(),
  customerName: z.string().min(2).max(80),
  customerEmail: z.string().email(),
  customerPhone: z.string().regex(phoneRegex),
});

// Schema para el endpoint de pricing
export const pricingQuerySchema = z.object({
  pickupDate: z.string(),
  returnDate: z.string(),
  vehicleType: z.enum(["CHICO", "MEDIANO", "SUV"]),
});

// Tipos derivados
export type DatesData = z.infer<typeof datesSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type VehicleData = z.infer<typeof vehicleSchema>;
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

// Estado del form completo (cliente)
export interface BookingFormData {
  pickupDate: string;
  pickupHour: string;
  returnDate: string;
  pickupAddress: string;
  pickupNeighborhood: string;
  vehicleType: "CHICO" | "MEDIANO" | "SUV" | "";
  vehicleModel: string;
  vehiclePlate: string;
  vehicleColor: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export const emptyBookingForm: BookingFormData = {
  pickupDate: "",
  pickupHour: "06:00",
  returnDate: "",
  pickupAddress: "",
  pickupNeighborhood: "",
  vehicleType: "",
  vehicleModel: "",
  vehiclePlate: "",
  vehicleColor: "",
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

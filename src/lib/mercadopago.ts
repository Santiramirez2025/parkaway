import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { centsToPesos } from "@/lib/utils";

const accessToken = process.env.MP_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    "[mercadopago] MP_ACCESS_TOKEN no configurado. Los pagos no van a funcionar."
  );
}

const client = new MercadoPagoConfig({
  accessToken: accessToken || "",
  options: { timeout: 5000 },
});

export const preference = new Preference(client);
export const payment = new Payment(client);

export interface CreatePreferenceInput {
  reservationId: string;
  reservationCode: string;
  totalAmount: number; // centavos
  customerEmail: string;
  customerName: string;
  publicToken: string;
}

export async function createMercadoPagoPreference(
  input: CreatePreferenceInput
): Promise<{ id: string; initPoint: string }> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const result = await preference.create({
    body: {
      items: [
        {
          id: input.reservationId,
          title: `Reserva ParkAway · ${input.reservationCode}`,
          description: "Estacionamiento puerta a puerta",
          quantity: 1,
          unit_price: centsToPesos(input.totalAmount),
          currency_id: "ARS",
          category_id: "services",
        },
      ],
      payer: {
        name: input.customerName.split(" ")[0],
        surname: input.customerName.split(" ").slice(1).join(" ") || "—",
        email: input.customerEmail,
      },
      external_reference: input.reservationId,
      back_urls: {
        success: `${baseUrl}/reserva/${input.publicToken}/confirmacion`,
        pending: `${baseUrl}/reserva/${input.publicToken}/pago-pendiente`,
        failure: `${baseUrl}/reserva/${input.publicToken}/pagar?error=1`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/webhooks/mercadopago`,
      statement_descriptor: "PARKAWAY",
      // Idempotencia: usamos el id de la reserva como referencia unica
      metadata: {
        reservation_id: input.reservationId,
        reservation_code: input.reservationCode,
      },
    },
  });

  if (!result.id || !result.init_point) {
    throw new Error("No se pudo crear la preferencia de pago");
  }

  return {
    id: result.id,
    initPoint: result.init_point,
  };
}

export async function getPaymentDetails(paymentId: string) {
  return payment.get({ id: paymentId });
}

// Mapeo de estados MP -> nuestro enum
export function mapMpStatus(
  mpStatus: string | undefined
): "PENDING" | "APPROVED" | "REJECTED" | "REFUNDED" {
  switch (mpStatus) {
    case "approved":
      return "APPROVED";
    case "rejected":
    case "cancelled":
      return "REJECTED";
    case "refunded":
    case "charged_back":
      return "REFUNDED";
    case "pending":
    case "in_process":
    case "in_mediation":
    case "authorized":
    default:
      return "PENDING";
  }
}

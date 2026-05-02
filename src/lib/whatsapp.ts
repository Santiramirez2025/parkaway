/**
 * Adapter de WhatsApp Cloud API (Meta).
 *
 * Si no hay credenciales configuradas, loguea el mensaje en consola.
 * Esto permite desarrollar local sin configurar Meta Business primero.
 *
 * Para produccion:
 * 1. Crear app en https://developers.facebook.com
 * 2. Agregar producto "WhatsApp"
 * 3. Copiar Phone Number ID y Access Token a .env
 * 4. Aprobar templates en Business Manager (en Etapa 2)
 */

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const API_VERSION = "v21.0";

export interface WhatsAppMessage {
  to: string; // sin "+", solo digitos. Ej: "5493411234567"
  body: string;
}

export interface WhatsAppResult {
  ok: boolean;
  messageId?: string;
  error?: string;
}

function normalizePhone(phone: string): string {
  // Remueve "+", espacios, guiones, parentesis
  return phone.replace(/[\s+\-()]/g, "");
}

export async function sendWhatsAppMessage(
  msg: WhatsAppMessage
): Promise<WhatsAppResult> {
  const to = normalizePhone(msg.to);

  // Modo dev sin credenciales
  if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
    console.log("[whatsapp] Modo dev. Mensaje simulado:");
    console.log(`  To: ${to}`);
    console.log(`  Body: ${msg.body}`);
    return { ok: true, messageId: "dev-mode" };
  }

  try {
    const url = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: msg.body },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[whatsapp] error:", data);
      return {
        ok: false,
        error: data.error?.message || "Error enviando WhatsApp",
      };
    }

    return {
      ok: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("[whatsapp] excepcion:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Templates predefinidos para mantener consistencia.
 *
 * Importante: WhatsApp Cloud API solo permite mandar mensajes "free-form"
 * dentro de las 24hs de la ultima interaccion del cliente. Para mensajes
 * fuera de esa ventana hay que usar templates aprobados (lo armamos en Etapa 2).
 */
export const whatsappTemplates = {
  reservationConfirmed: (params: {
    customerName: string;
    code: string;
    pickupDate: string;
    pickupHour: string;
    cocheraAddress: string;
    cocheraHours: string;
  }) =>
    `Hola ${params.customerName}, tu reserva ${params.code} en ParkAway esta confirmada.\n\n` +
    `Te esperamos el ${params.pickupDate} a las ${params.pickupHour} hs en nuestra cochera:\n` +
    `${params.cocheraAddress}\n` +
    `Atencion: ${params.cocheraHours}\n\n` +
    `Cualquier duda, responde este mensaje.`,

  reminder24h: (params: {
    customerName: string;
    pickupHour: string;
    cocheraAddress: string;
  }) =>
    `Hola ${params.customerName}, te recordamos que manana te esperamos a las ${params.pickupHour} hs en nuestra cochera:\n${params.cocheraAddress}\n\n` +
    `Si necesitas ajustar el horario, escribinos.`,

  reminder1h: (params: {
    customerName: string;
    pickupHour: string;
    cocheraAddress: string;
  }) =>
    `${params.customerName}, en una hora te esperamos en la cochera (${params.pickupHour} hs).\n${params.cocheraAddress}\n\n` +
    `Estas en camino?`,

  cancellation: (params: { code: string; refunded: boolean }) =>
    `Tu reserva ${params.code} fue cancelada.\n\n` +
    (params.refunded
      ? "El reembolso se acreditara en tu medio de pago en los proximos dias habiles."
      : "Si esperas un reembolso, contactanos por este chat."),
};

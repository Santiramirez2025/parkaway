import { Resend } from "resend";
import { render } from "@react-email/render";
import type { ReactElement } from "react";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "ParkAway <onboarding@resend.dev>";

if (!apiKey) {
  console.warn("[email] RESEND_API_KEY no configurado.");
}

const resend = apiKey ? new Resend(apiKey) : null;

interface SendEmailInput {
  to: string | string[];
  subject: string;
  react: ReactElement;
  replyTo?: string;
}

export async function sendEmail(input: SendEmailInput): Promise<{
  ok: boolean;
  id?: string;
  error?: string;
}> {
  if (!resend) {
    console.log("[email] Modo dev sin Resend. Email simulado:", input.subject);
    return { ok: true, id: "dev-mode" };
  }

  try {
    const html = await render(input.react);

    const result = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html,
      replyTo: input.replyTo,
    });

    if (result.error) {
      console.error("[email] error:", result.error);
      return { ok: false, error: result.error.message };
    }

    return { ok: true, id: result.data?.id };
  } catch (error) {
    console.error("[email] excepcion:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error enviando email",
    };
  }
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface Result {
  ok: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const settingsSchema = z.object({
  // Precios en pesos (los convertimos a centavos al guardar)
  pricePerDayPesos: z.coerce.number().int().min(0).max(1_000_000),
  // Multiplicadores como porcentaje (100 = 1.00x)
  multiplierChico: z.coerce.number().int().min(50).max(300),
  multiplierMedio: z.coerce.number().int().min(50).max(300),
  multiplierSuv: z.coerce.number().int().min(50).max(300),
  cocheraAddress: z.string().min(5, "La dirección es muy corta").max(200),
  cocheraHours: z.string().min(1, "Indicá los horarios").max(80),
  whatsappNumber: z.string().min(5).max(30),
  contactEmail: z.string().email(),
  companyName: z.string().min(1).max(80),
  companyCuit: z.string().max(20).optional().or(z.literal("")),
});

export async function updateSettings(formData: FormData): Promise<Result> {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    pricePerDayPesos: formData.get("pricePerDayPesos"),
    multiplierChico: formData.get("multiplierChico"),
    multiplierMedio: formData.get("multiplierMedio"),
    multiplierSuv: formData.get("multiplierSuv"),
    cocheraAddress: formData.get("cocheraAddress"),
    cocheraHours: formData.get("cocheraHours"),
    whatsappNumber: formData.get("whatsappNumber"),
    contactEmail: formData.get("contactEmail"),
    companyName: formData.get("companyName"),
    companyCuit: formData.get("companyCuit") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Datos invalidos",
    };
  }

  try {
    const data = parsed.data;
    await prisma.settings.update({
      where: { id: "singleton" },
      data: {
        pricePerDay: data.pricePerDayPesos * 100, // pesos -> centavos
        multiplierChico: data.multiplierChico,
        multiplierMedio: data.multiplierMedio,
        multiplierSuv: data.multiplierSuv,
        cocheraAddress: data.cocheraAddress.trim(),
        cocheraHours: data.cocheraHours.trim(),
        whatsappNumber: data.whatsappNumber.trim(),
        contactEmail: data.contactEmail.toLowerCase().trim(),
        companyName: data.companyName.trim(),
        companyCuit: data.companyCuit || "",
      },
    });

    revalidatePath("/admin/configuracion");
    revalidatePath("/");

    return { ok: true };
  } catch (error) {
    console.error("[updateSettings]", error);
    return { ok: false, error: "Error guardando" };
  }
}

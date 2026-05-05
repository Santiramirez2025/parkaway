"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { parseLocalDate } from "@/lib/utils";

interface Result {
  ok: boolean;
  error?: string;
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
}

const blockSchema = z.object({
  date: z.string().min(1),
  reason: z.string().max(200).optional(),
});

export async function blockDate(formData: FormData): Promise<Result> {
  await requireAdmin();

  const parsed = blockSchema.safeParse({
    date: formData.get("date"),
    reason: formData.get("reason") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Fecha invalida" };
  }

  try {
    const date = parseLocalDate(parsed.data.date);
    if (isNaN(date.getTime())) {
      return { ok: false, error: "Fecha invalida" };
    }

    await prisma.blockedDate.upsert({
      where: { date },
      update: { reason: parsed.data.reason || null },
      create: { date, reason: parsed.data.reason || null },
    });

    revalidatePath("/admin/bloqueos");
    revalidatePath("/admin/calendario");

    return { ok: true };
  } catch (error) {
    console.error("[blockDate]", error);
    return { ok: false, error: "Error bloqueando la fecha" };
  }
}

export async function unblockDate(id: string): Promise<Result> {
  await requireAdmin();

  try {
    await prisma.blockedDate.delete({
      where: { id },
    });

    revalidatePath("/admin/bloqueos");
    revalidatePath("/admin/calendario");

    return { ok: true };
  } catch (error) {
    console.error("[unblockDate]", error);
    return { ok: false, error: "Error desbloqueando" };
  }
}

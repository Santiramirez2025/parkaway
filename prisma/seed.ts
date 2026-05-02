import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Sembrando settings...");

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      pricePerDay: 400000,
      logisticsPrice: 300000,
      multiplierChico: 100,
      multiplierMedio: 120,
      multiplierSuv: 140,
      coverageRadiusKm: 20,
      airportLat: -32.9036,
      airportLng: -60.7850,
      whatsappNumber: "+5493410000000",
      contactEmail: "hola@parkaway.com.ar",
      companyName: "ParkAway",
      companyCuit: "",
    },
  });

  console.log("Sembrando admin user...");

  const hashedPassword = await bcrypt.hash("parkaway2026", 10);

  await prisma.adminUser.upsert({
    where: { email: "admin@parkaway.com.ar" },
    update: {},
    create: {
      email: "admin@parkaway.com.ar",
      name: "Pichu",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Listo. Admin: admin@parkaway.com.ar / parkaway2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

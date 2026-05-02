-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "pickupAddress" DROP NOT NULL,
ALTER COLUMN "pickupNeighborhood" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "cocheraAddress" TEXT NOT NULL DEFAULT 'Próximamente — zona cercana al Aeropuerto Islas Malvinas',
ADD COLUMN     "cocheraHours" TEXT NOT NULL DEFAULT '24/7',
ALTER COLUMN "logisticsPrice" SET DEFAULT 0;


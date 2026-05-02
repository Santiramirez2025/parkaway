import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Check,
  MessageCircle,
  Calendar,
  MapPin,
  Car,
  Navigation,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/shared/logo";
import { getReservationByToken } from "@/server/repositories/reservation";
import { prisma } from "@/lib/prisma";
import { formatARS } from "@/lib/utils";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function ConfirmationPage({ params }: Props) {
  const { token } = await params;
  const reservation = await getReservationByToken(token);
  if (!reservation) notFound();

  const settings = await prisma.settings.findUniqueOrThrow({
    where: { id: "singleton" },
  });

  const isPending = reservation.status === "PENDING_PAYMENT";
  const isConfirmed = reservation.status === "CONFIRMED";

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  const whatsappLink = `https://wa.me/${settings.whatsappNumber.replace(/\+|\s/g, "")}?text=${encodeURIComponent(
    `Hola, soy ${reservation.customerName}. Mi reserva es ${reservation.code}.`
  )}`;

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.cocheraAddress
  )}`;

  return (
    <main className="min-h-screen flex flex-col">
      <header className="container py-6">
        <Link href="/">
          <Logo />
        </Link>
      </header>

      <div className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          {/* Estado */}
          <div className="text-center space-y-4 mb-10">
            {isConfirmed ? (
              <>
                <div className="inline-flex size-16 rounded-full bg-lime/10 border border-lime/30 items-center justify-center">
                  <Check className="size-8 text-lime" />
                </div>
                <Badge variant="success">Reserva confirmada</Badge>
                <h1 className="text-3xl md:text-4xl font-semibold">
                  Listo, {reservation.customerName.split(" ")[0]}!
                </h1>
                <p className="text-ink-400 max-w-md mx-auto text-pretty">
                  Tu pago se aprobó y la reserva está confirmada. Te enviamos
                  los detalles a {reservation.customerEmail}.
                </p>
              </>
            ) : isPending ? (
              <>
                <div className="inline-flex size-16 rounded-full bg-warning/10 border border-warning/30 items-center justify-center">
                  <Calendar className="size-8 text-warning" />
                </div>
                <Badge variant="warning">Pago pendiente</Badge>
                <h1 className="text-3xl md:text-4xl font-semibold">
                  Estamos esperando la confirmación del pago
                </h1>
                <p className="text-ink-400 max-w-md mx-auto text-pretty">
                  En cuanto Mercado Pago nos confirme, vas a recibir un email
                  con los detalles. Esto puede tomar unos minutos.
                </p>
              </>
            ) : (
              <>
                <Badge variant="default">{reservation.status}</Badge>
                <h1 className="text-3xl md:text-4xl font-semibold">
                  Tu reserva
                </h1>
              </>
            )}
          </div>

          {/* Codigo + QR */}
          <div className="rounded-3xl border border-ink-800 bg-white p-6 mb-4 shadow-soft-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="shrink-0">
                <QRPlaceholder code={reservation.code} />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="text-xs uppercase tracking-wider text-ink-500 mb-1">
                  Código de reserva
                </div>
                <div className="text-3xl font-semibold font-mono text-lime mb-2">
                  {reservation.code}
                </div>
                <p className="text-xs text-ink-500">
                  Mostrá este código cuando llegues a la cochera.
                </p>
              </div>
            </div>
          </div>

          {/* === BLOQUE DESTACADO: dónde dejás el auto === */}
          <div className="rounded-3xl border border-accent/30 bg-accent/5 p-6 sm:p-7 mb-4 shadow-soft-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="size-10 rounded-2xl bg-accent/15 flex items-center justify-center shrink-0">
                <MapPin className="size-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-accent font-medium">
                  Dónde dejás el auto
                </div>
                <h2 className="text-lg font-semibold mt-0.5">
                  Te esperamos en la cochera
                </h2>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5 text-sm">
                <MapPin className="size-4 text-ink-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-ink-500 text-xs uppercase tracking-wider mb-0.5">
                    Dirección
                  </div>
                  <div className="text-foreground">
                    {settings.cocheraAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-sm">
                <Clock className="size-4 text-ink-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-ink-500 text-xs uppercase tracking-wider mb-0.5">
                    Atención
                  </div>
                  <div className="text-foreground">{settings.cocheraHours}</div>
                </div>
              </div>
            </div>

            <Button asChild variant="accent" size="lg" className="w-full mt-5">
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">
                <Navigation />
                Cómo llegar
              </a>
            </Button>

            <p className="text-xs text-ink-500 mt-3 text-center">
              Estamos a 5 minutos del Aeropuerto Islas Malvinas.
            </p>
          </div>

          {/* Detalles */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            <DetailCard
              icon={Calendar}
              title="Fechas"
              rows={[
                {
                  label: "Llegada a cochera",
                  value: `${formatDate(reservation.pickupDate)} · ${reservation.pickupHour} hs`,
                },
                { label: "Retiro", value: formatDate(reservation.returnDate) },
              ]}
            />
            {(reservation.pickupAddress || reservation.pickupNeighborhood) && (
              <DetailCard
                icon={MapPin}
                title="Domicilio"
                rows={[
                  { label: "Barrio", value: reservation.pickupNeighborhood ?? "" },
                  { label: "Direccion", value: reservation.pickupAddress ?? "" },
                ]}
              />
            )}
            <DetailCard
              icon={Car}
              title="Vehiculo"
              rows={[
                { label: "Modelo", value: reservation.vehicleModel },
                { label: "Patente", value: reservation.vehiclePlate },
              ]}
            />
            <div className="rounded-2xl border border-lime/30 bg-lime/5 p-5 flex flex-col justify-center">
              <div className="text-xs uppercase tracking-wider text-lime mb-1">
                Total {isConfirmed ? "pagado" : "a pagar"}
              </div>
              <div className="text-3xl font-semibold text-lime">
                {formatARS(reservation.totalAmount)}
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" size="lg">
              <Link href={`/reserva/${reservation.publicToken}`}>
                Gestionar mi reserva
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="flex-1">
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle />
                Hablar por WhatsApp
              </a>
            </Button>
          </div>

          {isPending && (
            <p className="text-center text-xs text-ink-500 mt-6">
              Esta pagina se actualiza sola cuando se confirme el pago.
              <br />
              Refresca si pasaron mas de 5 minutos.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

function DetailCard({
  icon: Icon,
  title,
  rows,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-ink-800 bg-white p-5">
      <div className="flex items-center gap-2 mb-3 text-ink-400 text-xs uppercase tracking-wider">
        <Icon className="size-3.5" />
        {title}
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div key={i} className="text-sm">
            <span className="text-ink-500">{r.label}: </span>
            <span className="text-foreground">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QRPlaceholder({ code }: { code: string }) {
  // Pseudo-aleatorio deterministico basado en el codigo
  const cells = Array.from({ length: 49 }, (_, i) => {
    const seed = code.charCodeAt(i % code.length) + i * 7;
    return seed % 3 !== 0;
  });

  return (
    <div className="size-32 p-3 rounded-2xl bg-foreground">
      <div className="grid grid-cols-7 gap-px h-full">
        {cells.map((on, i) => (
          <div
            key={i}
            className={on ? "bg-ink-950" : "bg-foreground"}
          />
        ))}
      </div>
    </div>
  );
}

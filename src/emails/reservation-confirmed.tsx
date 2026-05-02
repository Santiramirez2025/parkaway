import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as s from "./_styles";

interface Props {
  customerName: string;
  reservationCode: string;
  pickupDate: string;
  pickupHour: string;
  returnDate: string;
  vehicleModel: string;
  vehiclePlate: string;
  totalFormatted: string;
  manageUrl: string;
  whatsappNumber: string;
  cocheraAddress: string;
  cocheraHours: string;
}

export default function ReservationConfirmedEmail({
  customerName,
  reservationCode,
  pickupDate,
  pickupHour,
  returnDate,
  vehicleModel,
  vehiclePlate,
  totalFormatted,
  manageUrl,
  whatsappNumber,
  cocheraAddress,
  cocheraHours,
}: Props) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cocheraAddress
  )}`;

  return (
    <Html>
      <Head />
      <Preview>Tu reserva {reservationCode} esta confirmada</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>
              Park<span style={s.logoAccent}>Away</span>
            </Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>Reserva confirmada</Heading>
            <Text style={s.paragraph}>
              Hola {customerName.split(" ")[0]}, recibimos tu pago. Te
              esperamos en la cochera el dia y horario que elegiste.
            </Text>

            <Section style={s.codeBox}>
              <Text style={s.codeLabel}>Codigo de reserva</Text>
              <Text style={s.codeValue}>{reservationCode}</Text>
            </Section>

            <Heading as="h2" style={s.h2}>
              Detalles de tu reserva
            </Heading>

            <Section style={s.card}>
              <Row label="Llegada a cochera" value={`${pickupDate} a las ${pickupHour} hs`} />
              <Row label="Retiro" value={returnDate} />
              <Row label="Vehiculo" value={`${vehicleModel} · ${vehiclePlate}`} />
              <Row label="Total pagado" value={totalFormatted} highlight />
            </Section>

            <Heading as="h2" style={s.h2}>
              Donde dejas el auto
            </Heading>

            <Section style={s.card}>
              <Row label="Direccion" value={cocheraAddress} />
              <Row label="Atencion" value={cocheraHours} />
              <Section style={{ marginTop: "16px" }}>
                <a href={mapsHref} style={s.button}>
                  Como llegar
                </a>
              </Section>
              <Text style={s.smallText}>
                Estamos a 5 minutos del Aeropuerto Islas Malvinas.
              </Text>
            </Section>

            <Hr style={s.hr} />

            <Heading as="h2" style={s.h2}>
              Que sigue
            </Heading>
            <Text style={s.paragraph}>
              El dia del viaje vas a la cochera con el auto a la hora
              acordada. Te recibimos, te entregamos el comprobante y dejas
              las llaves. Cuando aterrices y vuelvas, retiras el auto en el
              mismo lugar.
            </Text>

            <Section style={{ textAlign: "center", margin: "24px 0 8px" }}>
              <a href={manageUrl} style={s.buttonSecondary}>
                Ver mi reserva
              </a>
            </Section>

            <Text style={s.smallText}>
              Cualquier consulta, escribinos por WhatsApp al{" "}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\+|\s/g, "")}`}
                style={s.link}
              >
                {whatsappNumber}
              </a>
              .
            </Text>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>
              ParkAway · Cochera privada cerca del Aeropuerto Islas Malvinas
              <br />
              Rosario, Argentina
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Section style={{ marginBottom: "12px" }}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={highlight ? s.rowValueHighlight : s.rowValue}>{value}</Text>
    </Section>
  );
}

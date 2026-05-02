import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as s from "./_styles";

interface Props {
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  pickupDate: string;
  pickupHour: string;
  returnDate: string;
  vehicleModel: string;
  vehiclePlate: string;
  totalFormatted: string;
}

export default function AdminNewReservationEmail(props: Props) {
  return (
    <Html>
      <Head />
      <Preview>Nueva reserva paga: {props.reservationCode}</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>
              Park<span style={s.logoAccent}>Away</span>
            </Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>Nueva reserva paga</Heading>
            <Text style={s.paragraph}>
              Codigo:{" "}
              <strong style={{ color: s.palette.primary }}>
                {props.reservationCode}
              </strong>
            </Text>

            <Section style={s.card}>
              <Row label="Cliente" value={props.customerName} />
              <Row label="Telefono" value={props.customerPhone} />
              <Row label="Email" value={props.customerEmail} />
            </Section>

            <Section style={s.card}>
              <Row
                label="Llegada a cochera"
                value={`${props.pickupDate} · ${props.pickupHour} hs`}
              />
              <Row label="Retiro" value={props.returnDate} />
              <Row
                label="Vehiculo"
                value={`${props.vehicleModel} · ${props.vehiclePlate}`}
              />
              <Row label="Cobrado" value={props.totalFormatted} highlight />
            </Section>
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>ParkAway · Notificacion interna</Text>
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
    <Section style={{ marginBottom: "10px" }}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={highlight ? s.rowValueHighlight : s.rowValue}>{value}</Text>
    </Section>
  );
}

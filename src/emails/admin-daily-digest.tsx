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

interface ReservationItem {
  code: string;
  customerName: string;
  customerPhone: string;
  pickupHour: string;
  vehicleModel: string;
  vehiclePlate: string;
}

interface Props {
  date: string;
  reservations: ReservationItem[];
}

export default function AdminDailyDigestEmail({ date, reservations }: Props) {
  const count = reservations.length;

  return (
    <Html>
      <Head />
      <Preview>
        {`Manana: ${count} ${count === 1 ? "reserva" : "reservas"}`}
      </Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>
              Park<span style={s.logoAccent}>Away</span>
            </Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>Reporte para {date}</Heading>
            <Text style={s.paragraph}>
              {count === 0
                ? "No hay reservas programadas para manana."
                : `Tenes ${count} ${count === 1 ? "reserva" : "reservas"} para operar manana.`}
            </Text>

            {reservations.map((r, i) => (
              <Section key={i} style={s.card}>
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    color: s.palette.fg,
                    margin: "0 0 6px",
                  }}
                >
                  <span
                    style={{
                      color: s.palette.primary,
                      fontFamily:
                        "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    {r.code}
                  </span>{" "}
                  · {r.pickupHour} hs
                </Text>
                <Text style={{ ...s.rowValue, margin: "0 0 4px" }}>
                  {r.customerName} ({r.customerPhone})
                </Text>
                <Text
                  style={{
                    ...s.rowValue,
                    fontSize: "13px",
                    color: s.palette.fgMuted,
                    margin: 0,
                  }}
                >
                  {r.vehicleModel} · {r.vehiclePlate}
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={s.footer}>
            <Text style={s.footerText}>ParkAway · Reporte diario</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

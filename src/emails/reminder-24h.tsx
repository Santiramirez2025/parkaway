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
  customerName: string;
  reservationCode: string;
  pickupHour: string;
  cocheraAddress: string;
  cocheraHours: string;
  whatsappNumber: string;
}

export default function Reminder24hEmail({
  customerName,
  reservationCode,
  pickupHour,
  cocheraAddress,
  cocheraHours,
  whatsappNumber,
}: Props) {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    cocheraAddress
  )}`;

  return (
    <Html>
      <Head />
      <Preview>Manana te esperamos en la cochera · {reservationCode}</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>
              Park<span style={s.logoAccent}>Away</span>
            </Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>Manana te esperamos</Heading>
            <Text style={s.paragraph}>
              Hola {customerName.split(" ")[0]}, te recordamos que manana
              traes el auto a nuestra cochera. Atendemos {cocheraHours} asi
              que podes llegar tranquilo.
            </Text>

            <Section style={s.card}>
              <Row label="Reserva" value={reservationCode} />
              <Row label="Horario acordado" value={`${pickupHour} hs`} />
              <Row label="Direccion de la cochera" value={cocheraAddress} />
              <Section style={{ marginTop: "16px" }}>
                <a href={mapsHref} style={s.button}>
                  Como llegar
                </a>
              </Section>
            </Section>

            <Text style={s.paragraph}>
              <strong style={{ color: s.palette.fg }}>
                Antes de salir de tu casa
              </strong>
            </Text>
            <ul style={s.list}>
              <li style={s.listItem}>Tene la documentacion del auto a mano</li>
              <li style={s.listItem}>
                Sacale tus pertenencias importantes del baul y la guantera
              </li>
              <li style={s.listItem}>
                Estamos a 5 min del aeropuerto: si vas a viajar, podes pedir
                un Uber desde la cochera
              </li>
            </ul>

            <Text style={s.smallText}>
              Si necesitas cambiar el horario o tenes alguna duda, escribinos
              por WhatsApp al{" "}
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
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <Section style={{ marginBottom: "10px" }}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </Section>
  );
}

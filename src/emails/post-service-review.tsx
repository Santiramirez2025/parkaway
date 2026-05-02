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
  whatsappNumber: string;
  reviewUrl?: string;
}

export default function PostServiceReviewEmail({
  customerName,
  reservationCode,
  whatsappNumber,
  reviewUrl,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Como te fue con ParkAway?</Preview>
      <Body style={s.main}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Text style={s.logo}>
              Park<span style={s.logoAccent}>Away</span>
            </Text>
          </Section>

          <Section style={s.content}>
            <Heading style={s.h1}>Como te fue?</Heading>
            <Text style={s.paragraph}>
              Hola {customerName.split(" ")[0]}, esperamos que hayas tenido
              un gran viaje. Le dimos el cuidado que merece a tu auto y ya
              te lo entregamos.
            </Text>

            <Text style={s.paragraph}>
              Tu opinion vale oro. Si tenes 30 segundos, contanos como te
              fue: nos ayuda a mejorar y a que mas viajeros se animen a
              probar el servicio.
            </Text>

            {reviewUrl && (
              <Section style={{ textAlign: "center", margin: "24px 0" }}>
                <a href={reviewUrl} style={s.button}>
                  Dejar mi opinion
                </a>
              </Section>
            )}

            <Text style={s.paragraph}>
              Tambien podes responder este email directamente o escribirnos
              por WhatsApp.
            </Text>

            <Text style={s.smallText}>
              Tu reserva fue {reservationCode}. Cuando vuelvas a viajar, ya
              sabes donde dejarlo.{" "}
              <a
                href={`https://wa.me/${whatsappNumber.replace(/\+|\s/g, "")}`}
                style={s.link}
              >
                WhatsApp
              </a>
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

import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ token: string }>;
}

// MP redirige aca si el pago quedo pendiente (transferencia, rapipago, etc).
// Lo mandamos a la pagina de confirmacion que ya maneja ambos estados.
export default async function PaymentPendingPage({ params }: Props) {
  const { token } = await params;
  redirect(`/reserva/${token}/confirmacion`);
}

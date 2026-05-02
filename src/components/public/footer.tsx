import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-800 py-16">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 text-sm text-ink-400 max-w-sm text-pretty">
              Cochera privada a 5 minutos del Aeropuerto Islas Malvinas. Dejá
              el auto, viajá tranquilo, lo retirás cuando volvés.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Navegacion</h4>
            <ul className="space-y-2.5 text-sm text-ink-400">
              <li>
                <Link href="#como-funciona" className="hover:text-foreground transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#ubicacion" className="hover:text-foreground transition-colors">
                  Ubicación
                </Link>
              </li>
              <li>
                <Link href="#preguntas" className="hover:text-foreground transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
              <li>
                <Link href="#reservar" className="hover:text-foreground transition-colors">
                  Reservar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Contacto</h4>
            <ul className="space-y-2.5 text-sm text-ink-400">
              <li className="flex items-center gap-2">
                <Phone className="size-3.5" />
                <a href="https://wa.me/5493410000000" className="hover:text-foreground transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-3.5" />
                <a href="mailto:hola@parkaway.com.ar" className="hover:text-foreground transition-colors">
                  hola@parkaway.com.ar
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-3.5" />
                <span>Rosario, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ink-800 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs text-ink-500">
          <div>(c) {new Date().getFullYear()} ParkAway. Todos los derechos reservados.</div>
          <div className="flex gap-6">
            <Link href="/terminos" className="hover:text-ink-300 transition-colors">
              Terminos
            </Link>
            <Link href="/privacidad" className="hover:text-ink-300 transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

# ParkAway

Estacionamiento puerta a puerta cerca del Aeropuerto Islas Malvinas (Rosario).

## Stack

- Next.js 15 (App Router)
- TypeScript estricto
- Tailwind + shadcn/ui
- Prisma + Neon (PostgreSQL serverless)
- NextAuth v5
- Mercado Pago Checkout Pro
- Resend (emails) + WhatsApp Cloud API
- Vercel

## Setup

```bash
# 1. Clonar e instalar
npm install

# 2. Variables de entorno
cp .env.example .env.local
# Completar las vars (ver seccion abajo)

# 3. Base de datos
npm run db:push      # crea tablas en Neon
npm run db:seed      # crea admin + settings

# 4. Dev
npm run dev
```

## Variables de entorno minimas para Etapa 1

- `DATABASE_URL` y `DIRECT_URL` -> Neon
- `NEXTAUTH_SECRET` -> `openssl rand -base64 32`
- `NEXT_PUBLIC_SITE_URL` -> `http://localhost:3000` en dev
- `MP_ACCESS_TOKEN` y `MP_PUBLIC_KEY` -> sandbox de Mercado Pago

El resto se completan en su mensaje correspondiente.

## Credenciales seed

- **Admin:** admin@parkaway.com.ar / parkaway2026 (cambiar despues del primer login)

## Probar pago en sandbox

Tarjeta de prueba (forzar aprobacion):
- Numero: `5031 7557 3453 0604`
- CVV: `123`
- Vencimiento: `11/30`
- Nombre: `APRO`

## Webhook de MP en dev

Para que MP llegue al webhook desde tu local, usa ngrok:

```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3000
```

Copia la URL `https://xxx.ngrok-free.app` a `NEXT_PUBLIC_SITE_URL` en `.env.local`,
reinicia el dev server, y configura ese mismo URL + `/api/webhooks/mercadopago`
en el panel de webhooks de MP.

## Deploy a Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git push  # a tu repo de GitHub
```

Importa el repo en https://vercel.com/new, agrega las variables de entorno
(las mismas de `.env.local` pero con URLs de produccion), y listo.
# parkaway

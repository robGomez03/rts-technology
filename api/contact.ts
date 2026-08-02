/**
 * Adaptador de VERCEL para el formulario de contacto.
 *
 * Solo traduce entre la plataforma y la lógica compartida de
 * `server/contact.ts`. El gemelo para Cloudflare es `functions/api/contact.ts`.
 *
 * Variables de entorno (Settings -> Environment Variables):
 *   RESEND_API_KEY   obligatoria. Clave de https://resend.com (empieza por re_)
 *   CONTACT_TO       opcional. Destinatario
 *   CONTACT_FROM     opcional. Remitente
 */

import {
  MAX_CUERPO,
  demasiadasPeticiones,
  procesarSolicitud,
  type Solicitud,
} from '../server/contact'

export const config = { runtime: 'edge' }

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405)
  }

  // Rechaza cuerpos desmesurados antes siquiera de leerlos.
  if (Number(request.headers.get('content-length') ?? 0) > MAX_CUERPO) {
    return json({ error: 'Solicitud demasiado grande' }, 413)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'desconocida'

  if (demasiadasPeticiones(ip)) {
    return json({ error: 'Demasiadas solicitudes. Espera unos minutos.' }, 429)
  }

  let datos: Solicitud
  try {
    datos = (await request.json()) as Solicitud
  } catch {
    return json({ error: 'Cuerpo JSON inválido' }, 400)
  }

  const { status, body } = await procesarSolicitud(datos, {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO: process.env.CONTACT_TO,
    CONTACT_FROM: process.env.CONTACT_FROM,
  })

  return json(body, status)
}

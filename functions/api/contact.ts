/**
 * Adaptador de CLOUDFLARE PAGES para el formulario de contacto.
 *
 * Cloudflare enruta automáticamente `functions/api/contact.ts` a la URL
 * `/api/contact`, igual que Vercel hace con `api/contact.ts`. Ambos comparten
 * la misma lógica en `server/contact.ts`, así que el sitio funciona en las dos
 * plataformas sin duplicar reglas de validación ni de antispam.
 *
 * Variables de entorno (Pages -> Settings -> Environment variables):
 *   RESEND_API_KEY   obligatoria. Marcarla como "Secret" (cifrada)
 *   CONTACT_TO       opcional. Destinatario
 *   CONTACT_FROM     opcional. Remitente
 */

import {
  MAX_CUERPO,
  demasiadasPeticiones,
  procesarSolicitud,
  type Entorno,
  type Solicitud,
} from '../../server/contact'

/*
 * Tipos mínimos de Cloudflare Pages, escritos a mano para no añadir
 * `@cloudflare/workers-types` como dependencia solo por esto.
 */
interface ContextoPages {
  request: Request
  env: Entorno
}

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/*
 * Se exporta UN solo manejador (`onRequest`, que atiende todos los métodos) y
 * el método se comprueba dentro. Exportar a la vez `onRequest` y
 * `onRequestPost` deja la precedencia sujeta a interpretación, y si se
 * resolviera al revés el formulario respondería 405 a todos los envíos.
 */
export async function onRequest(context: ContextoPages): Promise<Response> {
  const { request, env } = context

  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405)
  }

  if (Number(request.headers.get('content-length') ?? 0) > MAX_CUERPO) {
    return json({ error: 'Solicitud demasiado grande' }, 413)
  }

  /*
   * En Cloudflare la IP real del visitante viene en `CF-Connecting-IP`.
   * `x-forwarded-for` queda como respaldo.
   */
  const ip =
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
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

  const { status, body } = await procesarSolicitud(datos, env)
  return json(body, status)
}

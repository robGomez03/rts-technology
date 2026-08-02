/**
 * Función Serverless que recibe el formulario de contacto y envía el correo.
 *
 * Vive en el mismo dominio que la web, así que:
 *   - No hay CORS ni preflight que puedan fallar.
 *   - Las extensiones que bloquean dominios de terceros no la bloquean.
 *   - La clave de API se queda en el servidor y nunca llega al navegador.
 *
 * Configuración necesaria en Vercel (Settings -> Environment Variables):
 *   RESEND_API_KEY   obligatoria. Clave de https://resend.com (empieza por re_)
 *   CONTACT_TO       opcional. Destinatario. Por defecto rtstechnologyrd@gmail.com
 *   CONTACT_FROM     opcional. Remitente. Por defecto onboarding@resend.dev
 *
 * Sin RESEND_API_KEY responde 503 y el formulario cae al modo `mailto:`, de
 * forma que nunca se pierde una solicitud en silencio.
 */

export const config = { runtime: 'edge' }

const DESTINO_POR_DEFECTO = 'rtstechnologyrd@gmail.com'

/*
 * `onboarding@resend.dev` es el remitente de pruebas de Resend: funciona sin
 * verificar dominio, pero SOLO puede enviar al correo con el que se creó la
 * cuenta de Resend. Para enviar a cualquier otra dirección hay que verificar
 * un dominio propio y usar algo como `web@rtstechnology.do`.
 */
const REMITENTE_POR_DEFECTO = 'RTS Technology <onboarding@resend.dev>'

interface Solicitud {
  nombre?: string
  email?: string
  empresa?: string
  servicio?: string
  mensaje?: string
  origen?: string
  /** Trampa antispam: si viene con contenido, es un bot. */
  web?: string
}

const json = (data: unknown, status: number) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/** Evita que el contenido del formulario pueda inyectar HTML en el correo. */
const escapar = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405)
  }

  let datos: Solicitud
  try {
    datos = await request.json()
  } catch {
    return json({ error: 'Cuerpo JSON inválido' }, 400)
  }

  // Bot detectado: se responde OK para no darle pistas, pero no se envía nada.
  if (datos.web) return json({ ok: true }, 200)

  const nombre = (datos.nombre ?? '').trim()
  const email = (datos.email ?? '').trim()
  const mensaje = (datos.mensaje ?? '').trim()

  if (nombre.length < 2 || mensaje.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ error: 'Faltan datos obligatorios o el correo no es válido' }, 400)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // El frontend interpreta este código y abre el cliente de correo.
    return json({ error: 'Envío de correo no configurado', codigo: 'SIN_CONFIGURAR' }, 503)
  }

  const empresa = (datos.empresa ?? '').trim() || 'No indicada'
  const servicio = (datos.servicio ?? '').trim() || 'No indicado'
  const origen = (datos.origen ?? '').trim() || 'No indicado'

  const filas = [
    ['Nombre', nombre],
    ['Correo', email],
    ['Empresa', empresa],
    ['Servicio de interés', servicio],
  ]
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#666;white-space:nowrap">${escapar(k)}</td>
           <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111"><strong>${escapar(v)}</strong></td>
         </tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0a0a0a;padding:20px 24px;border-radius:10px 10px 0 0">
        <h1 style="margin:0;color:#fff;font-size:18px">
          Nueva solicitud desde la <span style="color:#e63030">web</span>
        </h1>
      </div>
      <div style="border:1px solid #e5e5e5;border-top:none;border-radius:0 0 10px 10px;padding:4px 0 20px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">${filas}</table>
        <div style="padding:16px 14px 0">
          <p style="margin:0 0 6px;color:#666;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Mensaje</p>
          <p style="margin:0;color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapar(mensaje)}</p>
        </div>
        <p style="margin:20px 14px 0;color:#999;font-size:12px">
          Enviado desde ${escapar(origen)} · Responde a este correo para contestarle directamente.
        </p>
      </div>
    </div>`

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || REMITENTE_POR_DEFECTO,
        to: [process.env.CONTACT_TO || DESTINO_POR_DEFECTO],
        // Al responder en Gmail, la respuesta va directa al cliente.
        reply_to: email,
        subject: `Nueva solicitud web — ${nombre}`,
        html,
      }),
    })

    if (!respuesta.ok) {
      const detalle = await respuesta.text()
      console.error('Resend falló:', respuesta.status, detalle)
      return json({ error: 'El proveedor de correo rechazó el envío' }, 502)
    }

    return json({ ok: true }, 200)
  } catch (e) {
    console.error('Error de red al contactar con Resend:', e)
    return json({ error: 'No se pudo contactar con el proveedor de correo' }, 502)
  }
}

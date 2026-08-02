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

/**
 * Límite de peticiones por IP. Protege la cuota del plan gratuito de Resend
 * (100 correos/día, 3.000/mes): sin esto, un bot puede agotarla en minutos y
 * dejar el formulario inservible el resto del día.
 *
 * Es "best effort": el runtime Edge no tiene almacenamiento compartido, así
 * que el contador vive en memoria de cada instancia y no es global. Frena el
 * abuso normal, no un ataque distribuido. Para un límite estricto haría falta
 * Vercel KV o Upstash.
 */
const VENTANA_MS = 10 * 60 * 1000
const MAX_POR_VENTANA = 5
const vistas = new Map<string, number[]>()

function demasiadasPeticiones(ip: string): boolean {
  const ahora = Date.now()
  const previas = (vistas.get(ip) ?? []).filter(t => ahora - t < VENTANA_MS)
  previas.push(ahora)
  vistas.set(ip, previas)

  // Evita que el Map crezca sin control en instancias de larga vida.
  if (vistas.size > 5000) {
    for (const [k, v] of vistas) {
      if (v.every(t => ahora - t >= VENTANA_MS)) vistas.delete(k)
    }
  }
  return previas.length > MAX_POR_VENTANA
}

/** Longitudes máximas. Evitan correos gigantes y payloads de abuso. */
const LIMITES = {
  nombre: 100,
  email: 200,
  empresa: 150,
  servicio: 120,
  mensaje: 5000,
  origen: 500,
} as const

const recortar = (v: string | undefined, max: number) => (v ?? '').trim().slice(0, max)

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Método no permitido' }, 405)
  }

  // Rechaza cuerpos desmesurados antes siquiera de leerlos.
  const longitud = Number(request.headers.get('content-length') ?? 0)
  if (longitud > 20_000) {
    return json({ error: 'Solicitud demasiado grande' }, 413)
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'desconocida'

  if (demasiadasPeticiones(ip)) {
    return json({ error: 'Demasiadas solicitudes. Espera unos minutos.' }, 429)
  }

  let datos: Solicitud
  try {
    datos = await request.json()
  } catch {
    return json({ error: 'Cuerpo JSON inválido' }, 400)
  }

  // Bot detectado: se responde OK para no darle pistas, pero no se envía nada.
  if (datos.web) return json({ ok: true }, 200)

  const nombre = recortar(datos.nombre, LIMITES.nombre)
  const email = recortar(datos.email, LIMITES.email)
  const mensaje = recortar(datos.mensaje, LIMITES.mensaje)

  if (nombre.length < 2 || mensaje.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ error: 'Faltan datos obligatorios o el correo no es válido' }, 400)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // El frontend interpreta este código y abre el cliente de correo.
    return json({ error: 'Envío de correo no configurado', codigo: 'SIN_CONFIGURAR' }, 503)
  }

  const empresa = recortar(datos.empresa, LIMITES.empresa) || 'No indicada'
  const servicio = recortar(datos.servicio, LIMITES.servicio) || 'No indicado'
  const origen = recortar(datos.origen, LIMITES.origen) || 'No indicado'

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
        // Sin saltos de línea: un asunto multilínea puede confundir a algunos
        // clientes de correo.
        subject: `Nueva solicitud web — ${nombre.replace(/[\r\n]+/g, ' ')}`,
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

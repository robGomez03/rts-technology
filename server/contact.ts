/**
 * Lógica del formulario de contacto, sin depender de la plataforma.
 *
 * No importa nada de Vercel ni de Cloudflare: recibe datos planos y devuelve
 * un resultado plano. Los adaptadores de cada plataforma viven aparte:
 *
 *   api/contact.ts            -> Vercel (Edge Functions)
 *   functions/api/contact.ts  -> Cloudflare Pages Functions
 *
 * Así el sitio puede cambiar de hosting sin reescribir el formulario.
 */

export interface Solicitud {
  nombre?: string
  email?: string
  empresa?: string
  servicio?: string
  mensaje?: string
  origen?: string
  /** Trampa antispam: si viene con contenido, es un bot. */
  web?: string
}

export interface Entorno {
  RESEND_API_KEY?: string
  CONTACT_TO?: string
  CONTACT_FROM?: string
}

export interface Resultado {
  status: number
  body: Record<string, unknown>
}

const DESTINO_POR_DEFECTO = 'rtstechnologyrd@gmail.com'

/*
 * `onboarding@resend.dev` es el remitente compartido de Resend: funciona sin
 * verificar dominio. Para enviar desde `web@rtstechnology.do` hay que verificar
 * el dominio en Resend y definir CONTACT_FROM.
 */
const REMITENTE_POR_DEFECTO = 'RTS Technology <onboarding@resend.dev>'

/**
 * Límite de peticiones por IP. Protege la cuota del plan gratuito de Resend
 * (100 correos/día, 3.000/mes): sin esto un bot la agota en minutos y deja el
 * formulario inservible el resto del día.
 *
 * Es "best effort": el contador vive en memoria de cada instancia y no se
 * comparte entre ellas. Frena el abuso normal, no un ataque distribuido. Para
 * un límite estricto haría falta un almacén compartido (Cloudflare KV, Upstash).
 */
const VENTANA_MS = 10 * 60 * 1000
const MAX_POR_VENTANA = 5
const vistas = new Map<string, number[]>()

export function demasiadasPeticiones(ip: string): boolean {
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

/** Evita que el contenido del formulario inyecte HTML en el correo. */
const escapar = (v: string) =>
  v
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function construirHtml(campos: {
  nombre: string
  email: string
  empresa: string
  servicio: string
  mensaje: string
  origen: string
}): string {
  const filas = [
    ['Nombre', campos.nombre],
    ['Correo', campos.email],
    ['Empresa', campos.empresa],
    ['Servicio de interés', campos.servicio],
  ]
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#666;white-space:nowrap">${escapar(k)}</td>
           <td style="padding:8px 14px;border-bottom:1px solid #eee;color:#111"><strong>${escapar(v)}</strong></td>
         </tr>`,
    )
    .join('')

  return `
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
          <p style="margin:0;color:#111;font-size:14px;line-height:1.6;white-space:pre-wrap">${escapar(campos.mensaje)}</p>
        </div>
        <p style="margin:20px 14px 0;color:#999;font-size:12px">
          Enviado desde ${escapar(campos.origen)} · Responde a este correo para contestarle directamente.
        </p>
      </div>
    </div>`
}

/**
 * Valida la solicitud y la envía por correo con Resend.
 * El control de IP se hace fuera, en el adaptador, porque cada plataforma
 * expone la IP en una cabecera distinta.
 */
export async function procesarSolicitud(datos: Solicitud, env: Entorno): Promise<Resultado> {
  // Bot detectado: se responde OK para no darle pistas, pero no se envía nada.
  if (datos.web) return { status: 200, body: { ok: true } }

  const nombre = recortar(datos.nombre, LIMITES.nombre)
  const email = recortar(datos.email, LIMITES.email)
  const mensaje = recortar(datos.mensaje, LIMITES.mensaje)

  if (nombre.length < 2 || mensaje.length < 10 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { status: 400, body: { error: 'Faltan datos obligatorios o el correo no es válido' } }
  }

  if (!env.RESEND_API_KEY) {
    // El frontend interpreta este código y abre el cliente de correo.
    return { status: 503, body: { error: 'Envío de correo no configurado', codigo: 'SIN_CONFIGURAR' } }
  }

  const html = construirHtml({
    nombre,
    email,
    mensaje,
    empresa: recortar(datos.empresa, LIMITES.empresa) || 'No indicada',
    servicio: recortar(datos.servicio, LIMITES.servicio) || 'No indicado',
    origen: recortar(datos.origen, LIMITES.origen) || 'No indicado',
  })

  try {
    const respuesta = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || REMITENTE_POR_DEFECTO,
        to: [env.CONTACT_TO || DESTINO_POR_DEFECTO],
        // Al responder en Gmail, la respuesta va directa al cliente.
        reply_to: email,
        // Sin saltos de línea: un asunto multilínea confunde a algunos clientes.
        subject: `Nueva solicitud web — ${nombre.replace(/[\r\n]+/g, ' ')}`,
        html,
      }),
    })

    if (!respuesta.ok) {
      // Nunca se registra la clave, solo lo que responde Resend.
      console.error('Resend falló:', respuesta.status, await respuesta.text())
      return { status: 502, body: { error: 'El proveedor de correo rechazó el envío' } }
    }

    return { status: 200, body: { ok: true } }
  } catch (e) {
    console.error('Error de red al contactar con Resend:', e)
    return { status: 502, body: { error: 'No se pudo contactar con el proveedor de correo' } }
  }
}

/** Tamaño máximo del cuerpo aceptado, en bytes. */
export const MAX_CUERPO = 20_000

/**
 * Datos de contacto del negocio.
 *
 * Estaban escritos a mano dentro del JSX. Centralizarlos aquí evita que un
 * cambio de teléfono obligue a buscar por todo el código.
 *
 * ─────────────────────────────────────────────────────────────────────
 *  TODO: los valores de abajo son de ejemplo. Sustitúyelos antes de
 *  publicar o los clientes no podrán contactarte.
 * ─────────────────────────────────────────────────────────────────────
 */

export const contacto = {
  /** Correo que recibe las solicitudes del formulario. */
  email: 'rtstechnologyrd@gmail.com',

  /** E.164, sin espacios ni guiones. Se usa en el enlace `tel:`. */
  telefonoE164: '+18090000000', // TODO: teléfono real
  /** Cómo se muestra en pantalla. */
  telefonoVisible: '+1 (809) 000-0000', // TODO: teléfono real

  /** Internacional sin '+' ni signos. Se usa en el enlace de WhatsApp. */
  whatsapp: '18090000000', // TODO: WhatsApp Business real

  ubicacion: 'Santo Domingo, República Dominicana',
  horario: 'Lunes a viernes · 8:00 AM – 6:00 PM AST',

  /** Promesa de respuesta que se repite en los textos de la web. */
  tiempoRespuesta: '4 horas hábiles',
} as const

/** Servicios que aparecen en el desplegable del formulario. */
export const serviciosContacto = [
  'Venta de Equipos',
  'Soporte Técnico N2',
  'Redes y Seguridad',
  'CCTV y Cableado Estructurado',
  'Seguridad de la Información',
  'Automatización de Procesos',
  'Desarrollo Web',
  'Asesoría Tecnológica',
] as const

/**
 * Endpoint que recibe el formulario.
 *
 * Por defecto es `/api/contact`, una función Serverless del propio proyecto
 * (ver `api/contact.ts`) que envía el correo con Resend. Al estar en el mismo
 * dominio no hay CORS que falle, ningún bloqueador de anuncios la corta, y la
 * clave de API se queda en el servidor.
 *
 * Requiere definir `RESEND_API_KEY` en Vercel. Si falta, la función responde
 * 503 y el formulario abre el cliente de correo del visitante como respaldo,
 * de modo que nunca se pierde una solicitud.
 *
 * `VITE_CONTACT_ENDPOINT` permite apuntar a otro servicio sin tocar código.
 */
export const endpointContacto =
  (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim() || '/api/contact'

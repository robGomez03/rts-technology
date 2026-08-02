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
 * Servicio que entrega el formulario al correo de arriba.
 *
 * Por defecto usa FormSubmit, que no requiere cuenta ni clave de API: recibe
 * el POST y reenvía el contenido a `contacto.email`.
 *
 * ⚠ PASO OBLIGATORIO, UNA SOLA VEZ
 * La primera solicitud que se envíe hará que FormSubmit mande un correo de
 * confirmación a rtstechnologyrd@gmail.com. Hasta que se pulse el enlace de
 * ese correo, los mensajes NO se entregan. Revisa también la carpeta de spam.
 *
 * ⚠ DÓNDE VAN LOS DATOS
 * Las solicitudes (nombre, correo y mensaje de tus clientes) pasan por los
 * servidores de formsubmit.co antes de llegar a tu bandeja. Si prefieres otro
 * proveedor —o tu propio backend— basta con definir `VITE_CONTACT_ENDPOINT`
 * en Vercel: esa variable tiene prioridad y no hay que tocar código.
 */
const ENDPOINT_POR_DEFECTO = 'https://formsubmit.co/ajax/rtstechnologyrd@gmail.com'

export const endpointContacto =
  (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim() || ENDPOINT_POR_DEFECTO

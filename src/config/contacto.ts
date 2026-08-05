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

/**
 * Servicios del desplegable del formulario.
 * Deben coincidir con los titulos de src/components/Services.tsx.
 */
export const serviciosContacto = [
  'Cámaras de Seguridad y CCTV',
  'Soporte Técnico Empresarial',
  'Redes y WiFi Empresarial',
  'Venta y Mantenimiento de Equipos',
  'Ciberseguridad y Respaldo de Datos',
  'Automatización de Procesos',
  'Diseño y Desarrollo Web',
  'Asesoría Tecnológica',
  'Otro / No estoy seguro',
] as const

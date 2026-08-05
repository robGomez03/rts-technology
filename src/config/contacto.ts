/**
 * Datos de contacto del negocio.
 *
 * Centralizados aquí para que un cambio de teléfono no obligue a buscar por
 * todo el código.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  TELÉFONO Y WHATSAPP: DEJAR VACÍO OCULTA EL CANAL
 *
 *  Si un campo está vacío (''), la web no lo muestra: no aparece la fila de
 *  teléfono ni el botón de WhatsApp. Es preferible a publicar un número que
 *  no se atiende, porque un cliente que marca y no recibe respuesta no vuelve.
 *
 *  Al conseguir la línea de empresa, basta con rellenarlos y volver a
 *  publicar: los botones reaparecen solos.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const contacto = {
  /** Correo que recibe las solicitudes del formulario. */
  email: 'rtstechnologyrd@gmail.com',

  /** E.164, sin espacios ni guiones. Ejemplo: '+18095551234'. */
  telefonoE164: '',
  /** Cómo se muestra en pantalla. Ejemplo: '+1 (809) 555-1234'. */
  telefonoVisible: '',

  /** Internacional sin '+' ni signos. Ejemplo: '18095551234'. */
  whatsapp: '',

  ubicacion: 'Santo Domingo, República Dominicana',
  horario: 'Lunes a viernes · 8:00 AM – 6:00 PM AST',

  /** Promesa de respuesta que se repite en los textos de la web. */
  tiempoRespuesta: '4 horas hábiles',
} as const

/** ¿Hay teléfono publicable? */
export const hayTelefono = contacto.telefonoE164 !== '' && contacto.telefonoVisible !== ''

/** ¿Hay WhatsApp publicable? */
export const hayWhatsapp = contacto.whatsapp !== ''

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

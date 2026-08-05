/**
 * Endpoint que recibe el formulario.
 *
 * Vive separado de `contacto.ts` a proposito: esto usa `import.meta.env`, que
 * solo existe cuando Vite compila el codigo del navegador. `vite.config.ts`
 * importa `contacto.ts` para generar los datos estructurados, y al hacerlo se
 * evalua en Node, donde `import.meta.env` no esta definido. Manteniendo los
 * datos del negocio libres de dependencias de Vite, ambos usos conviven.
 *
 * Por defecto es `/api/contact`, la funcion Serverless del propio proyecto
 * (`functions/api/contact.ts`) que envia el correo con Resend. Al estar en el
 * mismo dominio no hay CORS que falle, ningun bloqueador la corta, y la clave
 * de API se queda en el servidor.
 *
 * Si falta `RESEND_API_KEY`, la funcion responde 503 y el formulario abre el
 * cliente de correo del visitante como respaldo: nunca se pierde una solicitud.
 *
 * `VITE_CONTACT_ENDPOINT` permite apuntar a otro servicio sin tocar codigo.
 */
export const endpointContacto =
  (import.meta.env.VITE_CONTACT_ENDPOINT ?? '').trim() || '/api/contact'

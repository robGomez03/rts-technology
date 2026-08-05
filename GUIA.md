# Guía de la web de RTS Technology

Todo lo que necesitas para cambiar cualquier cosa de la web, sin saber
programar. El `README.md` es la parte técnica; esta guía es la práctica.

**La web está en:** https://rts-technology.pages.dev

---

## Índice

1. [Lo primero: cómo se publica un cambio](#1-lo-primero-cómo-se-publica-un-cambio)
2. [Cambiar teléfono, correo o WhatsApp](#2-cambiar-teléfono-correo-o-whatsapp)
3. [Cambiar los servicios](#3-cambiar-los-servicios)
4. [Cambiar los testimonios](#4-cambiar-los-testimonios-importante)
5. [Cambiar textos y cifras](#5-cambiar-textos-y-cifras)
6. [Cambiar el logo](#6-cambiar-el-logo)
7. [Los colores de la marca](#7-los-colores-de-la-marca)
8. [Conectar tu dominio propio](#8-conectar-tu-dominio-propio)
9. [El formulario: cómo funciona y qué revisar](#9-el-formulario-cómo-funciona-y-qué-revisar)
10. [Seguridad: qué está protegido y qué no](#10-seguridad-qué-está-protegido-y-qué-no)
11. [Qué NO tocar](#11-qué-no-tocar)
12. [Si algo se rompe](#12-si-algo-se-rompe)

---

## 1. Lo primero: cómo se publica un cambio

Los ficheros están en `C:\Users\rober\rts-check`. Después de **cualquier**
cambio, se publica con dos comandos:

```bash
cd C:\Users\rober\rts-check && pnpm build
```

```bash
cd C:\Users\rober\rts-check && npx wrangler pages deploy dist --project-name=rts-technology --branch=main
```

El primero compila; el segundo sube. En menos de un minuto está en línea.

Y para guardar el cambio en GitHub (recomendable, es tu copia de seguridad):

```bash
cd C:\Users\rober\rts-check && git add -A && git commit -m "describe el cambio" && git push
```

> **Ojo:** subir a GitHub **no** publica la web. El proyecto se creó como
> *direct upload*, así que publicar es siempre el comando de `wrangler`. Si
> prefieres que cada `git push` publique solo, hay que reconectar el proyecto
> desde el panel de Cloudflare — pídemelo y lo montamos.

---

## 2. Cambiar teléfono, correo o WhatsApp

Fichero: **`src/config/contacto.ts`**

Es el único sitio donde hay que tocarlo. Se usa a la vez en la sección de
contacto, en el botón de WhatsApp y en los enlaces para llamar.

```ts
export const contacto = {
  email: 'rtstechnologyrd@gmail.com',

  telefonoE164: '+18090000000',        // para el enlace de llamada, sin espacios
  telefonoVisible: '+1 (809) 000-0000', // como se ve en pantalla

  whatsapp: '18090000000',              // sin '+', sin espacios, sin guiones

  ubicacion: 'Santo Domingo, República Dominicana',
  horario: 'Lunes a viernes · 8:00 AM – 6:00 PM AST',
  tiempoRespuesta: '4 horas hábiles',
}
```

**Ahora mismo el teléfono y el WhatsApp son inventados.** Hay que cambiarlos.

Si cambias el **correo**, cámbialo también en dos sitios más:
- `index.html`, en el bloque de datos estructurados (busca `"email"`)
- El destinatario real del formulario, con:
  ```bash
  cd C:\Users\rober\rts-check && npx wrangler pages secret put CONTACT_TO --project-name=rts-technology
  ```

---

## 3. Cambiar los servicios

Fichero: **`src/components/Services.tsx`**

Cada servicio es un bloque así:

```tsx
{
  icon: Camera,
  title: 'CCTV y Cableado',
  desc: 'Instalación de sistemas de videovigilancia IP...',
  tag: 'Infraestructura'
},
```

- `title` — el nombre que se ve
- `desc` — la descripción
- `tag` — la etiqueta roja pequeña de arriba
- `icon` — el icono; los nombres salen de [lucide.dev/icons](https://lucide.dev/icons).
  Si usas uno nuevo, hay que añadirlo al `import` de arriba del fichero.

Para **quitar** un servicio, borra su bloque entero (desde `{` hasta `},`).
Para **añadir** uno, copia un bloque y cámbiale los valores.

Si cambias los servicios, actualiza también la lista del desplegable del
formulario en `src/config/contacto.ts` (`serviciosContacto`).

---

## 4. Cambiar los testimonios (IMPORTANTE)

Fichero: **`src/components/Testimonials.tsx`**

⚠ **Los cuatro testimonios actuales son inventados.** Carlos Mejía, María Elena
Santos, Roberto Fernández y Ana Jiménez no existen.

Publicar testimonios falsos con nombre y cargo es publicidad engañosa (Ley
358-05 de Protección al Consumidor) y, si un cliente potencial intenta
verificarlos, destruye la confianza justo cuando ibas a cerrar la venta.

Sustitúyelos por testimonios reales con autorización del cliente. Y mientras
no los tengas, **es mejor dejar la sección vacía**: borra todos los bloques y
la sección desaparece sola.

---

## 4b. Cambiar las preguntas frecuentes

Fichero: **`src/config/faqs.ts`**

```ts
{
  q: '¿Cuánto cuesta instalar cámaras de seguridad en mi empresa?',
  a: 'El costo depende de la cantidad de cámaras...',
},
```

Esta sección hace dos cosas a la vez:

1. **Vende.** Responde justo las dudas que frenan a alguien antes de escribir.
2. **Posiciona.** Google puede mostrar estas preguntas desplegadas debajo de tu
   resultado, lo que ocupa más espacio en la página de búsqueda.

No hay que tocar nada más: el bloque de datos estructurados se **genera solo**
en cada compilación desde ese fichero (lo hace `vite.config.ts`). Antes estaba
escrito a mano en `index.html` y era fácil que los dos textos se desincronizaran
sin que nadie se enterara.

> Las respuestas cerradas **siguen estando en el HTML**, solo se ocultan. Es a
> propósito: si se borraran del documento al cerrarlas, Google no las leería y
> perderías justo las palabras por las que quieres que te encuentren.

Añade preguntas que te hagan de verdad por teléfono o WhatsApp. Son las que la
gente también escribe en Google.

## 5. Cambiar textos y cifras

| Qué | Dónde |
| --- | --- |
| Titular principal y subtítulo | `src/components/Hero.tsx` |
| Cifras del inicio (200+, 99.9%, 10+) | `src/components/Hero.tsx` |
| "Por qué elegirnos" | `src/components/WhyUs.tsx` |
| Textos del formulario | `src/components/Contact.tsx` |
| Pie de página | `src/components/Footer.tsx` |
| Título y descripción en Google | `index.html` |

⚠ Las cifras **200+ proyectos**, **99.9% uptime** y **10+ años** son
afirmaciones comerciales. Asegúrate de poder sustentarlas si un cliente
pregunta.

### Las redes sociales del pie

En `src/components/Footer.tsx`:

```ts
const socials = [
  { icon: Linkedin, href: '', label: 'LinkedIn' },
  ...
].filter(s => s.href !== '')
```

Están vacías, así que **no se muestran**. Es a propósito: un icono que no lleva
a ningún sitio molesta al visitante. Pon la URL entre las comillas y aparecerá
solo.

---

## 6. Cambiar el logo

1. Sustituye `src/assets/rts-logo.png` por el nuevo (mismo nombre, con fondo
   transparente).
2. Regenera los iconos del navegador y la imagen para compartir. Pídemelo y lo
   hago, o usa cualquier editor para crear:
   - `public/favicon-32.png`, `-48`, `-192`, `-512`
   - `public/apple-touch-icon.png` (180×180)
   - `public/og-image.png` (1200×630)
3. Publica con los comandos del punto 1.

> **No le pongas filtros CSS al logo.** El PNG ya tiene transparencia (el 95%
> de sus píxeles son transparentes). Antes llevaba `mix-blend-mode: screen` y
> `brightness-200`, que le cambiaban los colores: el gris se iba a blanco puro
> y el rojo se sobresaturaba. Si algún día lo ves apagado sobre el fondo
> oscuro, la solución es pedirle al diseñador una **versión para fondos
> oscuros**, no volver a poner filtros.

---

## 7. Los colores de la marca

| Color | Código | Dónde se usa |
| --- | --- | --- |
| Rojo principal | `#cc2020` | Botones, acentos |
| Rojo claro | `#e63030` | Degradados, foco del teclado |
| Gris de marca | `#8a8a8a` | Detalles del logo |
| Fondo | `#0a0a0a` | Toda la web |
| Fondo del pie | `#070707` | Pie de página |

Están definidos en `src/index.css`. Si algún día los cambias, hay que
cambiarlos también en `public/404.html`, que tiene sus propios estilos porque
va aparte.

### Un detalle que da muchos problemas

En este proyecto, las transparencias tipo `border-white/7` o `bg-red-600/12`
**solo funcionan porque están declaradas** en `tailwind.config.js`:

```js
opacity: { 2, 3, 4, 6, 7, 8, 12, 18, 22, 38 }
```

Tailwind solo genera las transparencias que estén en esa lista (de fábrica solo
los múltiplos de 5). Cualquier otra **se descarta sin avisar**: no da error, la
clase simplemente no existe y el borde no se pinta.

Así estaba la web antes: las tarjetas de servicios y testimonios **no tenían
borde** y varios resplandores no se veían. Si usas una transparencia nueva
(por ejemplo `/9`), añádela a esa lista.

---

## 8. Conectar tu dominio propio

Cuando tengas `rtstechnology.do`:

1. Cloudflare → **Workers & Pages** → `rts-technology` → *Custom domains* →
   *Set up a domain*.
2. Sigue las instrucciones de DNS que te dé.
3. Avísame y actualizo las direcciones del SEO (`index.html`,
   `public/robots.txt`, `public/sitemap.xml`), que ahora apuntan a
   `rts-technology.pages.dev`.

Conectar un dominio propio además **desbloquea el WAF de Cloudflare**, que
permite reglas de límite de peticiones reales — hoy no están disponibles
porque las reglas no aplican a los dominios `*.pages.dev`.

---

## 9. El formulario: cómo funciona y qué revisar

Cuando alguien lo envía:

1. El navegador manda los datos a `/api/contact`, en tu propio dominio.
2. Esa función valida, descarta bots y envía el correo con **Resend**.
3. El correo llega a **rtstechnologyrd@gmail.com**.
4. Al **responder desde Gmail, le llegas directamente al cliente** — el
   `reply_to` es su correo, no el tuyo.

### Verificado en producción

Se envió una solicitud real desde el dominio publicado y respondió `{"ok":true}`.

### Si dejaran de llegar correos

Comprueba en este orden:

```bash
cd C:\Users\rober\rts-check && npx wrangler pages secret list --project-name=rts-technology
```

Debe aparecer `RESEND_API_KEY: Value Encrypted`. Si no está, ponla:

```bash
cd C:\Users\rober\rts-check && npx wrangler pages secret put RESEND_API_KEY --project-name=rts-technology
```

Y después **vuelve a publicar** (punto 1): los secrets solo entran en vigor en
despliegues nuevos.

Otras causas posibles:
- **Pasaste de 100 correos en un día** o 3.000 en el mes (límite del plan
  gratuito de Resend). Míralo en [resend.com](https://resend.com) → *Logs*.
- **La clave caducó o se borró.** Crea otra en *API Keys*.

> El formulario nunca se traga una solicitud en silencio: si el envío falla,
> muestra un aviso con tu correo directo. Y si faltara la clave, abre el
> programa de correo del visitante con el mensaje ya escrito.

### Cambiar el remitente

Hoy los correos salen de `onboarding@resend.dev`, el remitente compartido de
Resend. Para que salgan de `web@rtstechnology.do`, verifica el dominio en
Resend (*Domains → Add Domain*) y luego:

```bash
cd C:\Users\rober\rts-check && npx wrangler pages secret put CONTACT_FROM --project-name=rts-technology
```

---

## 10. Seguridad: qué está protegido y qué no

### Lo que está protegido

| Protección | Estado |
| --- | --- |
| La clave de Resend nunca llega al navegador | **Verificado** en el JS publicado |
| Ningún secreto en el repositorio de GitHub | Verificado |
| Cabeceras de seguridad (6) | Verificadas en producción |
| CSP: solo se ejecuta JavaScript propio | Verificada, cero violaciones |
| La web no se puede meter en un iframe | `X-Frame-Options: DENY` |
| El contenido del formulario no puede inyectar HTML | Verificado |
| Solo se acepta `POST` | Verificado: `GET`/`PUT`/`DELETE` → `405` |
| Cuerpos mayores de 20 KB | Verificado → `413` |
| Datos incompletos o correo inválido | Verificado → `400` |
| Dependencias con vulnerabilidades conocidas | Ninguna |

### Lo que NO está protegido

**El límite de 5 envíos por IP no funciona.** El contador vive en la memoria de
cada instancia, y Cloudflare reparte las peticiones entre muchas. Lo comprobé
contra el sitio publicado: 8 peticiones seguidas, ningún bloqueo.

Lo que sí acota el daño: el honeypot descarta los bots simples, y el tope de
100 correos/día de Resend limita el peor caso a **perder la cuota de un día**.
No es un riesgo grave, pero conviene saberlo.

**La solución gratuita es Cloudflare Turnstile** (el sustituto de los CAPTCHA,
ilimitado y casi siempre invisible). No está implementado todavía. Cuando lo
quieras, pídemelo: son unos 20 minutos y necesitarás crear un widget en
Cloudflare para obtener dos claves.

### Reglas de oro con las claves

1. **Nunca escribas una clave en un chat**, ni conmigo ni con nadie. La que
   pegaste antes (`re_CFPRVjoe...`) quedó comprometida y hay que darla de baja
   en Resend si no lo has hecho.
2. Las claves se ponen **siempre** con `wrangler pages secret put`, que te la
   pide por teclado y la guarda cifrada.
3. Nunca pongas una clave en un fichero del proyecto. `.gitignore` ya bloquea
   `.env` y `.env.*`, pero la regla es no escribirla.
4. Si dudas de si una clave se filtró, **bórrala y crea otra**. Es gratis e
   instantáneo.

---

## 11. Qué NO tocar

Cosas que parecen mejorables pero se decidieron a propósito:

| No hagas esto | Por qué |
| --- | --- |
| Quitar los valores de `opacity` en `tailwind.config.js` | Desaparecen los bordes de las tarjetas y varios fondos, **sin dar ningún error** |
| Poner `mix-blend-mode` o `brightness` al logo | Le cambia los colores de marca. El PNG ya es transparente |
| Volver a poner `onload="..."` en `index.html` | Obliga a abrir la CSP por donde entra un XSS |
| Meter el contenido dentro de `{loaded && ...}` en `App.tsx` | Google y WhatsApp verían una página vacía |
| Usar `respuesta.ok` como única comprobación al enviar el formulario | Hay servicios que responden `200` con un error dentro, y la web diría "enviado" sin enviar |
| Poner una clave con el prefijo `VITE_` | Todo lo que empieza por `VITE_` acaba en el JavaScript público |
| Volver a Vercel en plan gratuito | Su plan Hobby **prohíbe el uso comercial** |

---

## 12. Si algo se rompe

**Volver a la versión anterior** (lo más rápido): Cloudflare → Workers & Pages
→ `rts-technology` → *Deployments* → busca uno que funcionaba → *Rollback*.

**Ver qué falla en el formulario:** Cloudflare → tu proyecto → *Functions* →
*Real-time logs*, y envía una solicitud de prueba mientras miras.

**Comprobar que la web compila antes de publicar:**

```bash
cd C:\Users\rober\rts-check && pnpm build
```

Si sale `✓ built in ...`, está bien. Si sale `error`, **no publiques**: el
error dice qué fichero y qué línea.

**Recuperar el proyecto entero** si borras algo sin querer:

```bash
cd C:\Users\rober && git clone https://github.com/robGomez03/rts-technology.git rts-nuevo
```

---

## Resumen de lo que te queda pendiente

- [ ] Rotar la clave de Resend que quedó expuesta en el chat
- [ ] Poner el teléfono y el WhatsApp reales en `src/config/contacto.ts`
- [ ] Sustituir o borrar los cuatro testimonios inventados
- [ ] Verificar que puedes sustentar las cifras (200+, 99.9%, 10+ años)
- [ ] Poner las URL reales de tus redes sociales, o dejarlas vacías
- [ ] Conectar `rtstechnology.do` cuando lo tengas
- [ ] Opcional: Turnstile, para cerrar el hueco del límite de envíos

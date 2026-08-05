# RTS Technology Solutions — Sitio web

Landing corporativa de RTS Technology Solutions (Santo Domingo, República
Dominicana). React 19 + TypeScript + Vite + Tailwind CSS, desplegada en Vercel.

---

## Puesta en marcha

```bash
pnpm install
```

```bash
pnpm dev
```

| Comando        | Qué hace                                         |
| -------------- | ------------------------------------------------ |
| `pnpm dev`     | Servidor de desarrollo                           |
| `pnpm build`   | Comprueba tipos y genera `dist/` para producción |
| `pnpm preview` | Sirve `dist/` para revisar el resultado real     |
| `pnpm lint`    | ESLint                                           |

---

## Lo primero que hay que rellenar

Los datos de contacto están centralizados en
**[`src/config/contacto.ts`](src/config/contacto.ts)**.

| Dato     | Valor actual                | Estado                  |
| -------- | --------------------------- | ----------------------- |
| Correo   | `rtstechnologyrd@gmail.com` | ✅ real                 |
| Teléfono | `+1 (809) 000-0000`         | ❌ **ficticio, cambiar** |
| WhatsApp | `18090000000`               | ❌ **ficticio, cambiar** |

También quedan pendientes:

- **Redes sociales** (`src/components/Footer.tsx`): sin URL. Mientras estén
  vacías no se pintan, para no mostrar iconos que no llevan a ningún sitio.
- **Dominio**: `index.html`, `public/robots.txt` y `public/sitemap.xml` apuntan
  a la URL de Vercel. Actualízalos si conectas un dominio propio.
- **Testimonios** (`src/components/Testimonials.tsx`): los cuatro nombres son
  inventados. Sustitúyelos por testimonios reales con autorización del cliente.
- **Cifras** (`200+ proyectos`, `99.9% uptime`, `10+ años`): son afirmaciones
  comerciales y conviene poder sustentarlas.

---

## El formulario de contacto

El formulario envía a **[`api/contact.ts`](api/contact.ts)**, una función
Serverless del propio proyecto que manda el correo a
**rtstechnologyrd@gmail.com** usando [Resend](https://resend.com).

Al estar en el mismo dominio que la web, no hay CORS que pueda fallar, ningún
bloqueador de anuncios la corta, y la clave de API se queda en el servidor sin
llegar nunca al navegador.

### Puesta en marcha (una sola vez)

1. Crea una cuenta en **[resend.com](https://resend.com)** usando
   **rtstechnologyrd@gmail.com**. Es importante que sea ese correo: el
   remitente de pruebas solo puede enviar a la dirección del titular.
2. Ve a **API Keys → Create API Key**, permiso *Sending access*, y copia la
   clave (empieza por `re_`).
3. En Vercel: **Project `rts-technology` → Settings → Environment Variables**.
   Añade `RESEND_API_KEY` con esa clave, marcada para *Production*.
4. **Redeploy** (Deployments → ⋯ → Redeploy). Las variables solo se aplican en
   despliegues nuevos.
5. Envía una solicitud de prueba desde la web.

### Enviar desde tu propio dominio

Mientras uses el remitente por defecto `onboarding@resend.dev`, Resend solo
entrega al correo del titular de la cuenta. Para enviar a cualquier dirección
—o para que el correo salga como `web@rtstechnology.do`— hay que verificar un
dominio en Resend (*Domains → Add Domain*) y luego definir `CONTACT_FROM`.

### Variables disponibles

| Variable                | Dónde     | Para qué                                       |
| ----------------------- | --------- | ---------------------------------------------- |
| `RESEND_API_KEY`        | Servidor  | **Obligatoria** para enviar                    |
| `CONTACT_TO`            | Servidor  | Destinatario (por defecto el Gmail de RTS)      |
| `CONTACT_FROM`          | Servidor  | Remitente (requiere dominio verificado)         |
| `VITE_CONTACT_ENDPOINT` | Navegador | Apuntar a otro servicio en vez de `/api/contact` |

### Si algo falla, no se pierde la solicitud

- **Sin `RESEND_API_KEY`** la función responde `503` y el formulario abre el
  cliente de correo del visitante con el mensaje ya redactado.
- **Si el envío falla** se muestra un aviso con el correo directo, en vez de
  fingir que se envió.

Esto último importa: hay servicios de formularios que responden `HTTP 200` con
un `success: "false"` en el cuerpo. Mirar solo el código de estado hace que la
web diga "¡Mensaje enviado!" sin haber enviado nada, así que el formulario
comprueba **también el cuerpo de la respuesta**.

### Protecciones

Pensadas para el **plan gratuito de Resend** (100 correos/día, 3.000/mes): sin
ellas, un bot podría agotar la cuota en minutos y dejarte sin formulario el
resto del día.

| Protección                          | Detalle                                  |
| ----------------------------------- | ---------------------------------------- |
| Tamaño máximo de petición           | 20 KB → `413`                            |
| Recorte de campos                   | mensaje 5.000 car., nombre 100, resto según `LIMITES` |
| Trampa antispam (campo oculto)      | validada en cliente **y** en servidor    |
| Envíos en menos de 2 segundos       | rechazados (comportamiento de bot)       |
| Escapado de HTML                    | el contenido no puede inyectar marcado en el correo |
| Asunto sin saltos de línea          | evita asuntos malformados                |
| Métodos distintos de POST           | `405`                                    |
| JSON inválido o campos que faltan   | `400`                                    |

> ### ⚠ El límite por IP no funciona en producción
>
> El código tiene un contador de 5 envíos por IP cada 10 minutos, pero vive en
> la memoria de cada isolate. Cloudflare reparte las peticiones entre muchos,
> así que el contador no se acumula. **Comprobado contra el sitio desplegado:
> 8 peticiones seguidas, ningún `429`.** No cuentes con él.
>
> Lo que sí acota el daño hoy: el honeypot descarta los bots simples, y el
> tope de **100 correos/día del plan gratuito de Resend** limita el peor caso a
> perder la cuota de un día.
>
> La solución correcta y gratuita es **Cloudflare Turnstile** (ver abajo).

El `reply_to` es el correo del cliente: puedes responder directamente desde
Gmail y le llega a él.

### Siguiente paso recomendado: Cloudflare Turnstile

Es el reemplazo gratuito e ilimitado de los CAPTCHA, y es lo que de verdad
cierra el hueco del límite por IP. La mayoría de visitantes ni ve el widget.

Aún no está implementado. Cuando quieras montarlo:

1. Cloudflare → **Turnstile** → *Add widget*, dominio `rts-technology.pages.dev`.
2. Te da una **Site Key** (pública, va en el HTML) y una **Secret Key**
   (privada, va como secret igual que `RESEND_API_KEY`).
3. Hay que añadir el widget al formulario y verificar el token en
   `server/contact.ts` contra
   `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
4. La CSP necesitará `script-src` y `frame-src` para
   `https://challenges.cloudflare.com`.

### Seguridad de la clave

`RESEND_API_KEY` es una variable **de servidor**: la lee `api/contact.ts` y
nunca llega al navegador. No la pongas nunca con el prefijo `VITE_`, porque
todo lo que empieza por `VITE_` se incrusta en el JavaScript público.

`.gitignore` cubre `.env`, `.env.*` y `*.local`, así que la clave no puede
acabar en el repositorio por accidente.

Si una clave se expone alguna vez (un pantallazo, un chat, un commit), bórrala
en *resend.com → API Keys* y crea otra: rotarla es inmediato y gratis.

---

## Detalles que conviene no romper

### La escala de opacidades de Tailwind

`tailwind.config.js` amplía `theme.opacity` con los valores `2, 3, 4, 6, 7, 8,
12, 18, 22, 38`. **No los quites.**

Tailwind solo genera modificadores de opacidad cuyo valor esté en esa escala
(por defecto solo múltiplos de 5). Cualquier otro se descarta **en silencio**:
no hay error, la clase simplemente no existe. El diseño usa `border-white/7`,
`bg-red-600/12`, `text-white/38`, etc., así que sin esos valores desaparecían
los bordes de las tarjetas, los fondos de los iconos y varios resplandores.

### El logo no lleva filtros

`src/assets/rts-logo.png` ya tiene canal alfa (el 95% de sus píxeles son
transparentes). Se usaba `mix-blend-mode: screen` —y `brightness-200` en el
Hero— para "quitarle el fondo", pero el fondo ya no estaba: lo único que hacían
esos filtros era aclarar la imagen y desviar el gris y el rojo corporativos.
Ahora el logo se muestra tal cual.

Si en algún momento el logo se ve apagado sobre el fondo oscuro, la solución
correcta es pedir al diseñador una **versión para fondos oscuros**, no volver a
poner filtros CSS encima.

### El Loader no puede bloquear el contenido

En `src/App.tsx`, el contenido se renderiza **siempre**; el Loader solo lo tapa
por encima (`position: fixed`, `z-index: 100`). Antes iba detrás de
`{loaded && ...}`, así que durante los ~5 segundos del arranque el HTML estaba
vacío y Google, WhatsApp y LinkedIn no veían nada de la web.

El arranque se muestra **una vez por sesión** (`sessionStorage`), se salta si
el visitante llega con un ancla (`/#contact`) y también si tiene activado
"reducir movimiento" en su sistema.

---

## Regenerar los iconos

`public/favicon-*.png`, `apple-touch-icon.png` y `og-image.png` se generan a
partir de `src/assets/rts-logo.png`. Si cambias el logo, hay que regenerarlos
(con cualquier editor, o con un script y `sharp`). Las plataformas sociales no
renderizan SVG, por eso la imagen de previsualización es PNG de 1200×630.

---

## Componentes de interfaz sin usar

`src/components/ui/` trae el catálogo completo de shadcn/ui (unos 50 ficheros)
del que **la web no importa ninguno**, y `src/hooks/use-toast.ts` tampoco se
usa. No molestan al build, pero son la única causa de que `pnpm lint` falle.

Si quieres limpiarlos, se pueden borrar junto con las dependencias asociadas;
`components.json` sigue configurado, así que volver a añadir uno cuando haga
falta es un comando:

```bash
pnpm dlx shadcn@latest add dialog
```

---

## Hosting: por qué Cloudflare Pages y no Vercel Hobby

Las [Fair Use Guidelines](https://vercel.com/docs/limits/fair-use-guidelines) de
Vercel dicen literalmente:

> "Hobby teams are restricted to non-commercial personal use only. All
> commercial usage of the platform requires either a Pro or Enterprise plan."

Y entre los ejemplos de uso comercial está *"Advertising the sale of a product
or service"*. Esta web anuncia venta de equipos, soporte y consultoría, así que
en el plan gratuito de Vercel está **fuera de los términos** y el proyecto es
suspendible. El plan Pro son 20 $/mes.

Cloudflare Pages no tiene esa restricción: su acuerdo self-serve no prohíbe el
uso comercial en el plan gratuito (lo único que veta es procesar tarjetas de
crédito, que aquí no aplica).

| | Vercel Hobby | Cloudflare Pages Free |
| --- | --- | --- |
| Uso comercial | **Prohibido** | Permitido |
| Funciones | 1 M/mes | 100.000/día |
| Estáticos | 100 GB/mes | Ilimitado |
| Builds | — | 500/mes |
| Dominios propios | Producción pública solo con dominio | 100 por proyecto |

**El código funciona en las dos plataformas**, así que cambiar de hosting no
obliga a reescribir nada:

```
server/contact.ts           <- toda la logica (validacion, antispam, Resend)
api/contact.ts              <- adaptador de Vercel
functions/api/contact.ts    <- adaptador de Cloudflare Pages
```

### Desplegar en Cloudflare Pages

El repo ya trae todo lo necesario, así que la configuración se reduce a
conectar y añadir la clave:

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** →
   *Create* → **Pages** → *Connect to Git* → elige `robGomez03/rts-technology`.
2. Deja el build command en `npm run build`. El directorio de salida lo lee de
   [`wrangler.jsonc`](wrangler.jsonc) (`pages_build_output_dir: "./dist"`), así
   que no depende de lo que se teclee en el panel.
3. **Settings → Variables and Secrets** → añade `RESEND_API_KEY` como
   **Secret** (queda cifrada y no se puede volver a leer).
4. *Retry deployment* para que la clave entre en vigor.

Qué se despliega solo, sin configurar nada:

| Fichero | Efecto |
| --- | --- |
| `functions/api/contact.ts` | Publica `/api/contact` |
| `public/_headers` | Cabeceras de seguridad y caché |
| `public/404.html` | Página de error propia, con la marca |
| `public/robots.txt`, `sitemap.xml` | SEO |

En Pages las Functions se resuelven **antes** que los assets estáticos, así que
`/api/contact` siempre llega a la función y nunca al HTML.

Las rutas inexistentes devuelven un **404 real**, no la portada con estado 200.
Un "soft 404" hace que Google indexe páginas fantasma.

### Sobre la protección de despliegue de Vercel

Si mantienes también el proyecto en Vercel: en Hobby, *Standard Protection*
protege los **deployment URLs generados** (`*.vercel.app`) y solo un **dominio
propio** queda público. Por eso una URL `.vercel.app` sin dominio conectado
devuelve `302` al login de Vercel con `X-Robots-Tag: noindex`. Se desactiva en
*Settings → Deployment Protection* (la documentación confirma que las cuentas
Hobby pueden activarlo y desactivarlo).

## Seguridad

Cabeceras aplicadas en ambas plataformas — [`public/_headers`](public/_headers)
para Cloudflare y la sección `headers` de [`vercel.json`](vercel.json). **Hay
que mantener los dos ficheros sincronizados.**

| Cabecera | Para qué |
| --- | --- |
| `Content-Security-Policy` | Solo se ejecuta JS propio; bloquea recursos externos |
| `X-Content-Type-Options: nosniff` | El navegador no "adivina" tipos de fichero |
| `X-Frame-Options: DENY` | Nadie puede incrustar la web en un iframe |
| `Referrer-Policy` | No filtra la ruta completa a sitios externos |
| `Permissions-Policy` | Deniega cámara, micrófono, geolocalización y pagos |
| `Strict-Transport-Security` | Fuerza HTTPS durante un año |

Dos decisiones que conviene no revertir sin pensarlo:

- **`script-src 'self'` sin `'unsafe-inline'`.** Por eso `index.html` ya no usa
  el truco `media="print" onload="this.media='all'"` para cargar las fuentes:
  era JavaScript en línea y habría obligado a abrir la CSP justo por donde
  entra un XSS. Con `preconnect` el coste de la hoja normal es pequeño.
- **`style-src` sí lleva `'unsafe-inline'`.** Framer Motion anima escribiendo
  en el atributo `style`; sin esto no habría ninguna animación. Permitir
  estilos en línea es mucho menos peligroso que permitir scripts.

## Despliegue

Vercel detecta el preset de Vite y publica `dist/`.

Si un despliegue falla con `ERR_PNPM_OUTDATED_LOCKFILE`, es que
`pnpm-lock.yaml` no está sincronizado con `package.json`: ejecuta
`pnpm install` y sube el lockfile actualizado. Comprueba antes de subir con:

```bash
pnpm install --frozen-lockfile
```

El repo tiene además un `package-lock.json` heredado. Vercel usa pnpm porque
existe `pnpm-lock.yaml`; mantener los dos lockfiles a la vez es una fuente
habitual de despliegues fallidos.

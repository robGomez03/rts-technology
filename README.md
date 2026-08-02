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

Las solicitudes llegan a **rtstechnologyrd@gmail.com** a través de
[FormSubmit](https://formsubmit.co), que no necesita cuenta ni clave de API.

> ### ⚠ Hay que confirmar el correo una vez
>
> La **primera** solicitud que se envíe desde la web hará que FormSubmit mande
> un correo de confirmación a `rtstechnologyrd@gmail.com`. **Hasta que se pulse
> el enlace de ese correo, los mensajes no se entregan.** Mira también en spam.
>
> Envía tú mismo una solicitud de prueba nada más desplegar, confirma, y a
> partir de ahí ya llega todo.

Ten en cuenta que las solicitudes de tus clientes (nombre, correo y mensaje)
pasan por los servidores de formsubmit.co antes de llegar a tu bandeja.

### Cambiar de proveedor

Define `VITE_CONTACT_ENDPOINT` en Vercel (*Settings → Environment Variables*) y
esa URL tiene prioridad sobre FormSubmit, sin tocar código. Vale cualquier
servicio que acepte JSON (Formspree, Web3Forms, Getform, o una función propia).
El cuerpo del `POST` es:

```json
{ "nombre": "…", "email": "…", "empresa": "…", "servicio": "…", "mensaje": "…", "origen": "https://…" }
```

En local, copia `.env.example` a `.env.local`.

Si el envío falla, el formulario muestra un aviso con el correo directo: nunca
se traga una solicitud en silencio.

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

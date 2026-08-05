/* Validacion completa del sitio en produccion. */
const U = 'https://rts-technology.pages.dev'
const ok = [], mal = [], avisos = []

const check = (cond, texto, aviso = false) =>
  cond ? ok.push(texto) : (aviso ? avisos : mal).push(texto)

// ---------- Portada ----------
const r = await fetch(U + '/')
const html = await r.text()
check(r.status === 200, `La web responde (${r.status})`)

const h = Object.fromEntries([...r.headers].map(([k, v]) => [k.toLowerCase(), v]))

// ---------- Seguridad ----------
check(!!h['content-security-policy'], 'Content-Security-Policy')
check(h['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff')
check(h['x-frame-options'] === 'DENY', 'X-Frame-Options: DENY')
check(!!h['referrer-policy'], 'Referrer-Policy')
check(!!h['permissions-policy'], 'Permissions-Policy')
check(!!h['strict-transport-security'], 'Strict-Transport-Security')
check(!/unsafe-inline/.test((h['content-security-policy'] || '').split('script-src')[1]?.split(';')[0] || ''),
  "CSP: script-src sin 'unsafe-inline'")

// ---------- SEO ----------
/*
 * Los atributos de <meta> pueden ir repartidos en varias lineas, asi que el
 * patron tiene que cruzar saltos de linea ([\s\S]). Con [^>]* fallaba en
 * silencio y daba "0 caracteres" en metas que si existian.
 */
const meta = (n) => html.match(new RegExp(`<meta[\\s\\S]{0,80}?name="${n}"[\\s\\S]{0,40}?content="([^"]*)"`))?.[1]
const prop = (p) => html.match(new RegExp(`<meta[\\s\\S]{0,80}?property="${p}"[\\s\\S]{0,40}?content="([^"]*)"`))?.[1]
const titulo = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
const desc = meta('description') ?? ''

check(titulo.length > 0 && titulo.length <= 75, `Título (${titulo.length} car.)`)
check(desc.length >= 120 && desc.length <= 175, `Meta description (${desc.length} car.)`, true)
check(/camara|cámara/i.test(titulo + desc), 'El título/descripción menciona "cámaras"')
check(html.includes('rel="canonical"'), 'URL canónica')
check(!!prop('og:image'), 'Imagen para compartir (Open Graph)')
check(!!meta('twitter:card'), 'Twitter card')
check(!!meta('google-site-verification'), 'Verificación de Search Console')
check((html.match(/hreflang|lang="es/) || []).length > 0, 'Idioma declarado')
check(!/noindex/.test(meta('robots') || ''), 'La página es indexable')

// ---------- Datos estructurados ----------
const bloques = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
let tipos = []
for (const b of bloques) {
  try { tipos.push(JSON.parse(b[1])['@type']) } catch { mal.push('JSON-LD inválido') }
}
check(tipos.includes('ProfessionalService'), 'Datos estructurados del negocio')
check(tipos.includes('FAQPage'), 'Datos estructurados de preguntas frecuentes')

// ---------- Ficheros de rastreo ----------
for (const f of ['/robots.txt', '/sitemap.xml', '/og-image.png', '/favicon-32.png', '/site.webmanifest']) {
  const res = await fetch(U + f)
  check(res.status === 200, `${f} (${res.status})`)
}

// ---------- 404 ----------
const r404 = await fetch(U + '/pagina-que-no-existe')
check(r404.status === 404, `Rutas inexistentes devuelven 404 (no un falso 200)`)

// ---------- API del formulario ----------
const api = await fetch(U + '/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: 'x', email: 'malo', mensaje: 'corto' }),
})
check(api.status === 400, `El formulario valida los datos (${api.status})`)
const apiGet = await fetch(U + '/api/contact')
check(apiGet.status === 405, `El formulario solo acepta POST (${apiGet.status})`)

// ---------- La clave no viaja al navegador ----------
const jsPath = html.match(/\/assets\/[^"]*\.js/)?.[0]
if (jsPath) {
  const js = await (await fetch(U + jsPath)).text()
  check(!/re_[A-Za-z0-9_]{15,}/.test(js) && !js.includes('RESEND_API_KEY'),
    'La clave de Resend NO está en el JavaScript público')
}

/*
 * Datos ficticios pendientes.
 *
 * La comprobacion anterior buscaba "809) 000-0000", el formato que se ve en
 * pantalla, pero ese texto lo pinta React en el navegador y NO esta en el HTML
 * que llega del servidor. Resultado: daba siempre por bueno un telefono que
 * seguia siendo falso. Ahora se busca cualquier variante de 809-000-0000 en
 * todo el HTML, incluidos los datos estructurados que lee Google.
 */
check(!/809[)\s.-]*0{3}[\s.-]*0{4}/.test(html),
  'Sin teléfono de ejemplo en el HTML ni en los datos estructurados', true)

// El fichero de configuracion es la fuente real de los datos de contacto
const cfg = await import('node:fs').then(m => m.readFileSync('src/config/contacto.ts', 'utf8'))
check(!cfg.includes('18090000000'), 'Teléfono real en src/config/contacto.ts', true)

// ---------- Salida ----------
const linea = '─'.repeat(58)
console.log('\n' + linea)
console.log(`  CORRECTO (${ok.length})`)
console.log(linea)
ok.forEach(t => console.log('  ✓ ' + t))

if (avisos.length) {
  console.log('\n' + linea)
  console.log(`  REVISAR (${avisos.length})`)
  console.log(linea)
  avisos.forEach(t => console.log('  ! ' + t))
}

if (mal.length) {
  console.log('\n' + linea)
  console.log(`  FALLA (${mal.length})`)
  console.log(linea)
  mal.forEach(t => console.log('  ✗ ' + t))
}

console.log('\n' + linea)
console.log(`  RESULTADO: ${mal.length === 0 ? 'TODO EN ORDEN' : mal.length + ' problema(s)'}`)
console.log(linea + '\n')

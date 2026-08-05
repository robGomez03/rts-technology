import { useId, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Send, MapPin, Mail, Phone, CheckCircle, AlertTriangle, Loader2, MessageCircle,
} from 'lucide-react'
import { contacto, hayTelefono, hayWhatsapp, serviciosContacto } from '../config/contacto'
import { endpointContacto } from '../config/endpoint'

type Estado = 'inicial' | 'enviando' | 'enviado' | 'correo' | 'error'

interface Formulario {
  name: string
  email: string
  company: string
  service: string
  message: string
}

type Errores = Partial<Record<keyof Formulario, string>>

const VACIO: Formulario = { name: '', email: '', company: '', service: '', message: '' }

/** Solo se valida lo que de verdad impide responder a la solicitud. */
function validar(form: Formulario): Errores {
  const errores: Errores = {}
  if (form.name.trim().length < 2) errores.name = 'Escribe tu nombre.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errores.email = 'Escribe un correo electrónico válido.'
  }
  if (form.message.trim().length < 10) {
    errores.message = 'Cuéntanos un poco más (mínimo 10 caracteres).'
  }
  return errores
}

/** Correo ya redactado, para cuando no hay endpoint configurado. */
function construirMailto(form: Formulario): string {
  const cuerpo = [
    `Nombre: ${form.name}`,
    `Correo: ${form.email}`,
    `Empresa: ${form.company || 'No indicada'}`,
    `Servicio de interés: ${form.service || 'No indicado'}`,
    '',
    form.message,
  ].join('\n')

  const params = new URLSearchParams({
    subject: `Solicitud de asesoría — ${form.name}`,
    body: cuerpo,
  })
  return `mailto:${contacto.email}?${params.toString()}`
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const [form, setForm] = useState<Formulario>(VACIO)
  const [errores, setErrores] = useState<Errores>({})
  const [estado, setEstado] = useState<Estado>('inicial')

  /** Trampa antispam: invisible para personas, irresistible para bots. */
  const honeypot = useRef('')
  const montadoEn = useRef(Date.now())

  const uid = useId()
  const idCampo = (n: string) => `${uid}-${n}`
  const idError = (n: string) => `${uid}-${n}-error`

  const actualizar = <K extends keyof Formulario>(clave: K, valor: Formulario[K]) => {
    setForm(prev => ({ ...prev, [clave]: valor }))
    setErrores(prev => (prev[clave] ? { ...prev, [clave]: undefined } : prev))
  }

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()

    // Bot: campo oculto relleno o envío en menos de 2 segundos.
    if (honeypot.current || Date.now() - montadoEn.current < 2000) {
      setEstado('enviado')
      return
    }

    const encontrados = validar(form)
    if (Object.keys(encontrados).length > 0) {
      setErrores(encontrados)
      document.getElementById(idCampo(Object.keys(encontrados)[0]))?.focus()
      return
    }

    setEstado('enviando')

    // Sin endpoint, la solicitud no se pierde: se abre el correo del visitante.
    if (!endpointContacto) {
      window.location.href = construirMailto(form)
      setEstado('correo')
      return
    }

    try {
      const respuesta = await fetch(endpointContacto, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: form.name,
          email: form.email,
          empresa: form.company,
          servicio: form.service,
          mensaje: form.message,
          origen: window.location.href,
        }),
      })

      /*
       * El servidor todavia no sabe enviar correo (falta RESEND_API_KEY).
       * Antes de dar la solicitud por perdida, se abre el correo del visitante.
       */
      if (respuesta.status === 503) {
        window.location.href = construirMailto(form)
        setEstado('correo')
        return
      }

      /*
       * No basta con mirar `respuesta.ok`. Algunos servicios contestan HTTP 200
       * con un `success: "false"` en el cuerpo; fiandonos solo del codigo de
       * estado le diriamos al visitante "mensaje enviado" sin haber enviado
       * nada. Hay que leer tambien el cuerpo.
       */
      const cuerpo = await respuesta.json().catch(() => null)
      const falloEnElCuerpo =
        cuerpo &&
        typeof cuerpo === 'object' &&
        (cuerpo.error !== undefined || String(cuerpo.success) === 'false')

      if (!respuesta.ok || falloEnElCuerpo) {
        throw new Error(cuerpo?.error ?? cuerpo?.message ?? `El servidor respondió ${respuesta.status}`)
      }

      setEstado('enviado')
      setForm(VACIO)
    } catch (e) {
      console.error('No se pudo enviar el formulario:', e)
      setEstado('error')
    }
  }

  const inputClass =
    'w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white placeholder-white/50 text-sm focus:outline-none focus:bg-white/[0.06] transition-all duration-200'

  const bordeDe = (campo: keyof Formulario) =>
    errores[campo] ? 'border-red-400' : 'border-white/8 focus:border-red-600/50'

  const enlaceWhatsapp =
    `https://wa.me/${contacto.whatsapp}?text=` +
    encodeURIComponent('Hola, me gustaría solicitar una asesoría tecnológica.')

  /*
   * El telefono solo aparece si esta configurado en src/config/contacto.ts.
   * Mientras no haya linea de empresa, es mejor no mostrar ninguno: un cliente
   * que marca y no recibe respuesta no vuelve a intentarlo.
   */
  const datos = [
    { icon: MapPin, label: 'Ubicación', value: contacto.ubicacion, href: null },
    { icon: Mail, label: 'Email', value: contacto.email, href: `mailto:${contacto.email}` },
    ...(hayTelefono
      ? [{
          icon: Phone,
          label: 'Teléfono',
          value: contacto.telefonoVisible,
          href: `tel:${contacto.telefonoE164}`,
        }]
      : []),
  ]

  return (
    <section id="contact" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/6 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-xs font-medium text-red-500 tracking-widest uppercase">Contacto</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Hablemos de tu<br /><span className="red-gradient">próximo proyecto</span>
          </h2>
          <p className="text-white/60 text-lg max-w-lg mx-auto">
            Cuéntanos qué necesitas y nuestro equipo te contactará en menos de {contacto.tiempoRespuesta}.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Datos de contacto */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2 space-y-8">
            <ul className="space-y-8">
              {datos.map(item => (
                <li key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={16} className="text-red-400" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-white/55 uppercase tracking-wide mb-1">{item.label}</div>
                    {item.href ? (
                      <a href={item.href} className="text-white/85 text-sm hover:text-red-400 transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <div className="text-white/85 text-sm">{item.value}</div>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {hayWhatsapp ? (
              <a
                href={enlaceWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 text-sm font-semibold hover:bg-emerald-400/20 transition-colors"
              >
                <MessageCircle size={16} aria-hidden="true" />
                Escríbenos por WhatsApp
              </a>
            ) : (
              /*
               * Sin WhatsApp configurado, se refuerza el canal que SI funciona.
               * Dejar el hueco vacio haria pensar que no hay forma rapida de
               * contactar; decir cuanto se tarda en responder sostiene la
               * confianza mientras no haya telefono.
               */
              <div className="rounded-xl border border-white/8 bg-white/[0.025] px-5 py-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <MessageCircle size={15} className="text-red-400" aria-hidden="true" />
                  <span className="text-sm font-semibold text-white">
                    Escríbenos y te respondemos
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">
                  Usa el formulario o escríbenos a{' '}
                  <a href={`mailto:${contacto.email}`} className="text-red-400 hover:text-red-300 underline underline-offset-2">
                    {contacto.email}
                  </a>
                  . Toda solicitud recibe respuesta en menos de {contacto.tiempoRespuesta}.
                </p>
              </div>
            )}

            <div className="mt-8 p-5 bg-red-600/5 border border-red-600/15 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span className="text-xs font-medium text-emerald-400">Disponibles ahora</span>
              </div>
              <p className="text-white/60 text-sm">{contacto.horario}</p>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
            {estado === 'enviado' || estado === 'correo' ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} role="status" className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle size={48} className="text-red-400 mb-4" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {estado === 'enviado' ? '¡Mensaje enviado!' : 'Ya casi está'}
                </h3>
                <p className="text-white/60 text-sm max-w-sm">
                  {estado === 'enviado'
                    ? `Nuestro equipo revisará tu solicitud y te contactará en menos de ${contacto.tiempoRespuesta}.`
                    : 'Hemos abierto tu programa de correo con la solicitud ya redactada. Solo tienes que pulsar enviar.'}
                </p>
                <button
                  type="button"
                  onClick={() => setEstado('inicial')}
                  className="mt-6 text-sm text-red-400 hover:text-red-300 underline underline-offset-4"
                >
                  Enviar otra solicitud
                </button>
              </motion.div>
            ) : (
              <form onSubmit={enviar} noValidate className="space-y-4">
                {/* Trampa antispam, fuera de pantalla y fuera del orden de tabulación */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor={idCampo('web')}>No rellenar</label>
                  <input
                    id={idCampo('web')}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={e => (honeypot.current = e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={idCampo('name')} className="block text-xs text-white/70 mb-1.5">
                      Nombre completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={idCampo('name')}
                      name="name"
                      autoComplete="name"
                      placeholder="Juan Pérez"
                      value={form.name}
                      onChange={e => actualizar('name', e.target.value)}
                      aria-invalid={!!errores.name}
                      aria-describedby={errores.name ? idError('name') : undefined}
                      className={`${inputClass} ${bordeDe('name')}`}
                    />
                    {errores.name && (
                      <p id={idError('name')} className="mt-1.5 text-xs text-red-300">{errores.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={idCampo('email')} className="block text-xs text-white/70 mb-1.5">
                      Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={idCampo('email')}
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="juan@empresa.com"
                      value={form.email}
                      onChange={e => actualizar('email', e.target.value)}
                      aria-invalid={!!errores.email}
                      aria-describedby={errores.email ? idError('email') : undefined}
                      className={`${inputClass} ${bordeDe('email')}`}
                    />
                    {errores.email && (
                      <p id={idError('email')} className="mt-1.5 text-xs text-red-300">{errores.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor={idCampo('company')} className="block text-xs text-white/70 mb-1.5">
                    Empresa <span className="text-white/50">(opcional)</span>
                  </label>
                  <input
                    id={idCampo('company')}
                    name="company"
                    autoComplete="organization"
                    placeholder="Nombre de tu empresa"
                    value={form.company}
                    onChange={e => actualizar('company', e.target.value)}
                    className={`${inputClass} ${bordeDe('company')}`}
                  />
                </div>

                <div>
                  <label htmlFor={idCampo('service')} className="block text-xs text-white/70 mb-1.5">
                    Servicio de interés <span className="text-white/50">(opcional)</span>
                  </label>
                  <select
                    id={idCampo('service')}
                    name="service"
                    value={form.service}
                    onChange={e => actualizar('service', e.target.value)}
                    className={`${inputClass} ${bordeDe('service')} select-flecha appearance-none cursor-pointer`}
                  >
                    <option value="">Selecciona un servicio</option>
                    {serviciosContacto.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={idCampo('message')} className="block text-xs text-white/70 mb-1.5">
                    ¿Qué necesitas? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id={idCampo('message')}
                    name="message"
                    rows={4}
                    placeholder="Cuéntanos brevemente qué necesitas..."
                    value={form.message}
                    onChange={e => actualizar('message', e.target.value)}
                    aria-invalid={!!errores.message}
                    aria-describedby={errores.message ? idError('message') : undefined}
                    className={`${inputClass} ${bordeDe('message')} resize-none`}
                  />
                  {errores.message && (
                    <p id={idError('message')} className="mt-1.5 text-xs text-red-300">{errores.message}</p>
                  )}
                </div>

                {estado === 'error' && (
                  <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                    <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <span>
                      No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos a{' '}
                      <a href={`mailto:${contacto.email}`} className="underline underline-offset-2">{contacto.email}</a>.
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={estado === 'enviando'}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl font-semibold text-base hover:bg-red-500 transition-all duration-200 shadow-[0_0_30px_rgba(204,32,32,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {estado === 'enviando' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      Enviando...
                    </>
                  ) : (
                    <>Enviar solicitud <Send size={16} aria-hidden="true" /></>
                  )}
                </button>

                <p className="text-center text-xs text-white/55">
                  Los campos con <span className="text-red-500">*</span> son obligatorios.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

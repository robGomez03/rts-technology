import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, MapPin, Mail, Phone, CheckCircle } from 'lucide-react'

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', service: '', message: '' })

  const inputClass = "w-full bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-red-600/50 focus:bg-white/[0.06] transition-all duration-200"

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
          <p className="text-white/45 text-lg max-w-lg mx-auto">Cuéntanos qué necesitas y nuestro equipo te contactará en menos de 4 horas hábiles.</p>
        </motion.div>
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2 space-y-8">
            {[{ icon: MapPin, label: 'Ubicación', value: 'Santo Domingo, República Dominicana' }, { icon: Mail, label: 'Email', value: 'info@rtstechnology.do' }, { icon: Phone, label: 'Teléfono', value: '+1 (809) 000-0000' }].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/12 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <item.icon size={16} className="text-red-400" />
                </div>
                <div>
                  <div className="text-xs text-white/35 uppercase tracking-wide mb-1">{item.label}</div>
                  <div className="text-white/75 text-sm">{item.value}</div>
                </div>
              </div>
            ))}
            <div className="mt-8 p-5 bg-red-600/5 border border-red-600/15 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Disponibles ahora</span>
              </div>
              <p className="text-white/45 text-sm">Lunes a viernes · 8:00 AM – 6:00 PM EST</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-3">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle size={48} className="text-red-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>¡Mensaje enviado!</h3>
                <p className="text-white/45 text-sm max-w-sm">Nuestro equipo revisará tu solicitud y te contactará en las próximas horas hábiles.</p>
              </motion.div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input required placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputClass} />
                  <input required type="email" placeholder="Correo electrónico" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <input placeholder="Empresa (opcional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputClass} />
                <select value={form.service} onChange={e => setForm({ ...form, service: e.target.value })} className={inputClass + ' appearance-none cursor-pointer'}>
                  <option value="" disabled>Servicio de interés</option>
                  {['Venta de Equipos','Soporte Técnico N2','Redes y Seguridad','CCTV y Cableado Estructurado','Seguridad de la Información','Automatización de Procesos','Desarrollo Web','Asesoría Tecnológica'].map(s => <option key={s}>{s}</option>)}
                </select>
                <textarea required rows={4} placeholder="Cuéntanos brevemente qué necesitas..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className={inputClass + ' resize-none'} />
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl font-semibold text-base hover:bg-red-500 transition-all duration-200 shadow-[0_0_30px_rgba(204,32,32,0.3)]">
                  Enviar solicitud <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

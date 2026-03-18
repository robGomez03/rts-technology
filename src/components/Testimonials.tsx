import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Carlos Mejía', role: 'Gerente TI · Grupo Empresarial Mejía', avatar: 'CM', color: 'from-red-700 to-red-900', stars: 5, text: 'RTS Technology transformó nuestra infraestructura en 3 semanas. Pasamos de constantes caídas a un uptime del 99.9%. Su equipo domina cada detalle técnico y se comunica con claridad.' },
  { name: 'María Elena Santos', role: 'Directora de Operaciones · Logística del Caribe', avatar: 'MS', color: 'from-gray-600 to-gray-800', stars: 5, text: 'El sistema de CCTV y cableado estructurado que instalaron superó nuestras expectativas. Todo documentado, certificado y con garantía. El soporte post-instalación es excepcional.' },
  { name: 'Roberto Fernández', role: 'CEO · Inversiones RF & Asociados', avatar: 'RF', color: 'from-red-800 to-gray-800', stars: 5, text: 'Nos asesoraron para optimizar nuestra inversión tecnológica y reducimos costos un 35% sin sacrificar capacidad. Su asesoría estratégica vale cada peso invertido.' },
  { name: 'Ana Jiménez', role: 'Administradora · Clínica Especialidades Plus', avatar: 'AJ', color: 'from-gray-700 to-red-900', stars: 5, text: 'La automatización de nuestros procesos administrativos eliminó errores y ahorró horas de trabajo diario. El equipo de RTS entendió perfectamente nuestras necesidades desde el inicio.' },
]

export default function Testimonials() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-red-900/5 blur-[150px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-xs font-medium text-red-500 tracking-widest uppercase">Testimonios</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Lo que dicen nuestros<br /><span className="red-gradient">clientes</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-red bg-white/[0.025] border border-white/7 rounded-2xl p-7"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.stars }).map((_, s) => (
                  <Star key={s} size={12} className="fill-red-500 text-red-500" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold`}>{t.avatar}</div>
                <div>
                  <div className="text-sm font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{t.name}</div>
                  <div className="text-xs text-white/35">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

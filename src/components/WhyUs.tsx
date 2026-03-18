import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingDown, Layers, HeartHandshake, Clock4, Award, Users } from 'lucide-react'

const reasons = [
  { icon: TrendingDown, title: 'Optimización de Inversión', desc: 'Analizamos tu infraestructura y proponemos soluciones que maximizan el retorno sin gastos innecesarios.' },
  { icon: Layers, title: 'Escalabilidad Real', desc: 'Arquitecturas que crecen contigo. Lo que implementamos hoy soporta el doble de operaciones mañana.' },
  { icon: HeartHandshake, title: 'Soporte Experto 24/7', desc: 'Equipo certificado disponible cuando lo necesitas. Incidentes resueltos antes de que impacten tu operación.' },
  { icon: Clock4, title: 'Respuesta Ágil', desc: 'Tiempos de respuesta garantizados en contrato. Técnicos en sitio o remoto según la urgencia.' },
  { icon: Award, title: 'Experiencia Certificada', desc: 'Ingenieros con certificaciones Cisco, Microsoft y CompTIA. Conocimiento aplicado en proyectos reales.' },
  { icon: Users, title: 'Relación a Largo Plazo', desc: 'No somos un proveedor, somos tu departamento de IT externo. Conocemos tu negocio y crecemos juntos.' },
]

export default function WhyUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="whyus" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-800/6 blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}>
            <span className="text-xs font-medium text-red-500 tracking-widest uppercase">Por qué elegirnos</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-6 leading-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
              Tu tecnología,<br /><span className="red-gradient">nuestra responsabilidad</span>
            </h2>
            <p className="text-white/45 text-lg leading-relaxed mb-8">
              Empresas que dependen de su tecnología necesitan un socio estratégico que anticipe problemas y garantice continuidad operativa.
            </p>
            <div className="flex items-center gap-6">
              {[['200+', 'Clientes satisfechos'], ['10+', 'Años en el mercado'], ['4h', 'Tiempo resp. promedio']].map(([val, label], i) => (
                <>
                  {i > 0 && <div key={`div-${i}`} className="w-px h-12 bg-white/10" />}
                  <div key={val}>
                    <div className="text-3xl font-bold text-red-400" style={{ fontFamily: 'Syne, sans-serif' }}>{val}</div>
                    <div className="text-sm text-white/35 mt-1">{label}</div>
                  </div>
                </>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group p-5 rounded-xl border border-white/6 bg-white/[0.02] hover:border-red-600/25 transition-all duration-300"
              >
                <r.icon size={20} className="text-red-400 mb-3" />
                <h4 className="text-sm font-semibold text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{r.title}</h4>
                <p className="text-xs text-white/38 leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

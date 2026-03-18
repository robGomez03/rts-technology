import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Headphones, Network, Camera, Lock, Bot, Globe, Lightbulb } from 'lucide-react'

const services = [
  { icon: Monitor, title: 'Venta de Equipos', desc: 'Computadoras, laptops, impresoras y periféricos de marcas líderes. Asesoría personalizada en cada compra.', tag: 'Hardware' },
  { icon: Headphones, title: 'Soporte Técnico N2', desc: 'Resolución avanzada de incidencias. SLA garantizado con tiempos de respuesta definidos para tu operación.', tag: 'Soporte' },
  { icon: Network, title: 'Redes & Seguridad', desc: 'Configuración de firewalls, routers y switches enterprise. VPN y políticas de acceso segmentadas.', tag: 'Redes' },
  { icon: Camera, title: 'CCTV & Cableado', desc: 'Sistemas de videovigilancia IP y cableado estructurado certificado Cat 6/6A para máxima transferencia.', tag: 'Infraestructura' },
  { icon: Lock, title: 'Seguridad de la Info', desc: 'Auditorías, gestión de identidades y protección de datos conforme a estándares internacionales.', tag: 'Ciberseguridad' },
  { icon: Bot, title: 'Automatización', desc: 'RPA e integraciones que reducen costos operativos y eliminan errores humanos en tus procesos.', tag: 'Eficiencia' },
  { icon: Globe, title: 'Desarrollo Web', desc: 'Sitios y aplicaciones a medida con diseño profesional, SEO y hosting de alta disponibilidad.', tag: 'Digital' },
  { icon: Lightbulb, title: 'Asesoría Tecnológica', desc: 'Consultoría estratégica para alinear tu inversión tecnológica con los objetivos del negocio.', tag: 'Consultoría' },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref} className="py-28 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
          <span className="text-xs font-medium text-red-500 tracking-widest uppercase">Nuestros Servicios</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Todo lo que tu empresa<br /><span className="red-gradient">necesita en tecnología</span>
          </h2>
          <p className="text-white/45 max-w-xl text-lg leading-relaxed">Un portafolio completo para que no tengas que buscar múltiples proveedores.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((svc, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-red group bg-white/[0.025] border border-white/7 rounded-2xl p-6 cursor-default"
            >
              <div className="w-10 h-10 rounded-xl bg-red-600/12 flex items-center justify-center mb-4 group-hover:bg-red-600/22 transition-colors duration-300">
                <svc.icon size={18} className="text-red-400" />
              </div>
              <span className="text-[10px] font-medium text-red-500/70 tracking-widest uppercase">{svc.tag}</span>
              <h3 className="text-base font-semibold mt-1 mb-2 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{svc.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

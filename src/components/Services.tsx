import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Monitor, Headphones, Network, Camera, Lock, Bot, Globe, Lightbulb } from 'lucide-react'

/*
 * Los titulos y descripciones usan las palabras que un cliente escribe en
 * Google, no jerga interna. Ejemplo: la gente busca "camaras de seguridad",
 * casi nadie busca "videovigilancia IP" ni "CCTV" a secas.
 *
 * TODO: revisa que cada descripcion coincida con lo que de verdad ofreces.
 * Prometer un servicio que no das trae solicitudes que luego hay que rechazar.
 */
const services = [
  {
    icon: Camera,
    title: 'Cámaras de Seguridad y CCTV',
    desc: 'Instalación de cámaras de seguridad IP y sistemas CCTV con acceso remoto desde tu celular. Incluye cableado estructurado certificado categoría 6/6A, montaje, configuración y capacitación de uso.',
    tag: 'Videovigilancia',
  },
  {
    icon: Headphones,
    title: 'Soporte Técnico Empresarial',
    desc: 'Soporte técnico nivel 2 para empresas: incidencias de sistemas, conectividad y servidores, resueltas en remoto o en sitio. Con SLA y tiempos de respuesta definidos por contrato.',
    tag: 'Soporte',
  },
  {
    icon: Network,
    title: 'Redes y WiFi Empresarial',
    desc: 'Instalación y configuración de redes para empresas: firewalls, routers, switches y puntos de acceso WiFi. Redes segmentadas con VPN y políticas de acceso para que tu información no quede expuesta.',
    tag: 'Redes',
  },
  {
    icon: Monitor,
    title: 'Venta y Mantenimiento de Equipos',
    desc: 'Computadoras, laptops, impresoras, servidores y periféricos de marcas líderes. Te asesoramos según el uso real de tu operación y damos mantenimiento preventivo para alargar la vida útil de los equipos.',
    tag: 'Hardware',
  },
  {
    icon: Lock,
    title: 'Ciberseguridad y Respaldo de Datos',
    desc: 'Auditorías de seguridad, gestión de accesos, respaldo de información y protección contra ransomware. Protegemos los datos de tu empresa conforme a estándares internacionales.',
    tag: 'Ciberseguridad',
  },
  {
    icon: Bot,
    title: 'Automatización de Procesos',
    desc: 'Automatizamos tareas repetitivas con RPA e integraciones entre tus sistemas. Menos horas de trabajo manual, menos errores humanos y menos costos operativos cada mes.',
    tag: 'Eficiencia',
  },
  {
    icon: Globe,
    title: 'Diseño y Desarrollo Web',
    desc: 'Páginas web y aplicaciones a medida con diseño profesional, optimización SEO y hosting de alta disponibilidad, para que tus clientes te encuentren en Google y confíen en tu marca.',
    tag: 'Digital',
  },
  {
    icon: Lightbulb,
    title: 'Asesoría Tecnológica',
    desc: 'Consultoría para alinear tu inversión en tecnología con los objetivos del negocio. Levantamos requerimientos y entregamos una propuesta con alcance, cronograma y presupuesto, sin compromiso.',
    tag: 'Consultoría',
  },
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
          <p className="text-white/65 max-w-2xl text-lg leading-relaxed">
            Instalación, soporte y mantenimiento de infraestructura tecnológica para
            empresas en Santo Domingo y toda la República Dominicana. Un solo proveedor
            para todo, en lugar de coordinar cinco.
          </p>
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
              <span className="text-[10px] font-medium text-red-500 tracking-widest uppercase">{svc.tag}</span>
              <h3 className="text-base font-semibold mt-1 mb-2 text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{svc.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{svc.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

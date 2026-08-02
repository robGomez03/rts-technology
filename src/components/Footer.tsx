import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'
import rtsLogo from '../assets/rts-logo.png'

/*
 * TODO: pon aqui las URL reales de tus perfiles. Las redes sin URL no se
 * pintan: es preferible no mostrar el icono a que el visitante lo pulse y no
 * pase nada.
 */
const socials = [
  { icon: Linkedin, href: '', label: 'LinkedIn' },
  { icon: Twitter, href: '', label: 'Twitter' },
  { icon: Instagram, href: '', label: 'Instagram' },
  { icon: Facebook, href: '', label: 'Facebook' },
].filter(s => s.href !== '')

/*
 * Los enlaces de servicios llevan a la seccion correspondiente. Las paginas
 * que todavia no existen (Nosotros, Blog, Legal...) se listan como texto
 * plano en vez de como enlaces `href="#"` que no llevan a ningun sitio: un
 * enlace roto molesta al visitante y Google lo penaliza.
 */
const columnaServicios = [
  'Venta de Equipos',
  'Soporte Técnico',
  'Redes y Seguridad',
  'CCTV',
  'Automatización',
  'Desarrollo Web',
]

const columnaNavegacion = [
  { label: 'Servicios', href: '#services' },
  { label: 'Por qué nosotros', href: '#whyus' },
  { label: 'Testimonios', href: '#testimonials' },
  { label: 'Contacto', href: '#contact' },
]

/** TODO: crear estas paginas y convertirlas en enlaces reales. */
const columnaLegal = ['Política de privacidad', 'Términos de servicio']

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={rtsLogo}
                alt="RTS Technology Solutions"
                width={40}
                height={40}
                loading="lazy"
                className="w-10 h-10 object-contain"
              />
              <span className="font-bold text-white text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                RTS <span className="text-red-500">Technology</span>
              </span>
            </div>
            <p className="text-white/55 text-sm leading-relaxed mb-6 max-w-[220px]">
              Soluciones tecnológicas integrales para empresas en República Dominicana y el Caribe.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`RTS Technology en ${label}`}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/7 flex items-center justify-center text-white/55 hover:text-red-400 hover:border-red-600/30 transition-all duration-200"
                  >
                    <Icon size={15} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Servicios: llevan a la seccion de servicios */}
          <nav aria-labelledby="pie-servicios">
            <h2 id="pie-servicios" className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
              Servicios
            </h2>
            <ul className="space-y-3">
              {columnaServicios.map(item => (
                <li key={item}>
                  <a href="#services" className="text-sm text-white/55 hover:text-red-400 transition-colors duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navegacion real del sitio */}
          <nav aria-labelledby="pie-navegacion">
            <h2 id="pie-navegacion" className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
              Empresa
            </h2>
            <ul className="space-y-3">
              {columnaNavegacion.map(item => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm text-white/55 hover:text-red-400 transition-colors duration-200">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal: todavia sin pagina, por eso no son enlaces */}
          <div>
            <h2 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>
              Legal
            </h2>
            <ul className="space-y-3">
              {columnaLegal.map(item => (
                <li key={item} className="text-sm text-white/50">{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">© {new Date().getFullYear()} RTS Technology Solutions. Todos los derechos reservados.</p>
          <p className="text-xs text-white/50">Santo Domingo, República Dominicana</p>
        </div>
      </div>
    </footer>
  )
}

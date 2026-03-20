import { Linkedin, Twitter, Instagram, Facebook } from 'lucide-react'
import rtsLogo from '../assets/rts-logo.png'

const socials = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
]

const links = {
  Servicios: ['Venta de Equipos', 'Soporte Técnico', 'Redes y Seguridad', 'CCTV', 'Automatización', 'Desarrollo Web'],
  Empresa: ['Nosotros', 'Casos de éxito', 'Certificaciones', 'Blog técnico'],
  Legal: ['Política de privacidad', 'Términos de servicio'],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#070707]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src={rtsLogo} alt="RTS Technology" className="w-10 h-10 object-contain [mix-blend-mode:screen]" />
              <span className="font-bold text-white text-base" style={{ fontFamily: 'Syne, sans-serif' }}>
                RTS <span className="text-red-500">Technology</span>
              </span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed mb-6 max-w-[220px]">
              Soluciones tecnológicas integrales para empresas en República Dominicana y el Caribe.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/7 flex items-center justify-center text-white/35 hover:text-red-400 hover:border-red-600/30 transition-all duration-200">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h5 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-5" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h5>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}><a href="#" className="text-sm text-white/30 hover:text-red-400 transition-colors duration-200">{item}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} RTS Technology Solutions. Todos los derechos reservados.</p>
          <p className="text-xs text-white/15">Santo Domingo, República Dominicana</p>
        </div>
      </div>
    </footer>
  )
}

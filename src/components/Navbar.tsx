import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import rtsLogo from '../assets/rts-logo.png'

const links = ['Servicios', 'Por qué nosotros', 'Testimonios', 'Contacto']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (section: string) => {
    const map: Record<string, string> = {
      'Servicios': 'services', 'Por qué nosotros': 'whyus',
      'Testimonios': 'testimonials', 'Contacto': 'contact'
    }
    document.getElementById(map[section])?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/92 backdrop-blur-xl border-b border-white/5 py-3' : 'py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src={rtsLogo} alt="RTS Technology" className="w-10 h-10 object-contain" />
          <span className="font-bold text-white text-base tracking-tight hidden sm:block" style={{ fontFamily: 'Syne, sans-serif' }}>
            RTS <span className="text-red-500">Technology</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <button key={link} onClick={() => scrollTo(link)} className="text-sm text-white/55 hover:text-red-400 transition-colors duration-200 tracking-wide">
              {link}
            </button>
          ))}
          <button onClick={() => scrollTo('Contacto')} className="ml-4 px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 shadow-[0_0_20px_rgba(204,32,32,0.35)]">
            Solicitar asesoría
          </button>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-white/70 hover:text-white">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0a0a0a]/98 border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            {links.map(link => (
              <button key={link} onClick={() => scrollTo(link)} className="text-left text-white/60 hover:text-red-400 py-1 text-sm">{link}</button>
            ))}
            <button onClick={() => scrollTo('Contacto')} className="mt-2 px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold text-center">
              Solicitar asesoría
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import rtsLogo from '../assets/rts-logo.png'

/*
 * Los ids apuntan a las secciones ya existentes. No se renombran a proposito:
 * cambiarlos romperia cualquier enlace del tipo .../#contact ya compartido.
 */
const links = [
  { label: 'Servicios', id: 'services' },
  { label: 'Por qué nosotros', id: 'whyus' },
  { label: 'Testimonios', id: 'testimonials' },
  { label: 'Contacto', id: 'contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  /*
   * `passive: true` avisa al navegador de que nunca llamaremos a
   * preventDefault, para que no tenga que esperar al handler antes de
   * desplazar. El trabajo se agrupa en un requestAnimationFrame para no
   * provocar un recalculo de estilos en cada evento de scroll.
   */
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40)
        frame = 0
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Cerrar el menu movil con la tecla Escape. */
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open ? 'bg-[#0a0a0a]/92 backdrop-blur-xl border-b border-white/5 py-3' : 'py-5'
      }`}
    >
      <nav aria-label="Navegación principal" className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/*
          Era un <div onClick>: no se podia enfocar con el teclado ni abrir en
          otra pestaña. Un enlace real resuelve las dos cosas.
        */}
        <a href="#inicio" className="flex items-center gap-2 rounded-lg" aria-label="RTS Technology — Ir al inicio">
          {/*
            El PNG ya tiene canal alfa (95% de sus pixeles son transparentes),
            asi que no hace falta `mix-blend-mode:screen`. Ese modo de fusion
            aclaraba los colores contra el fondo y desviaba el gris y el rojo
            corporativos. Sin el, el logo se ve en sus colores reales.
          */}
          <img
            src={rtsLogo}
            alt="RTS Technology Solutions"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-white text-base tracking-tight hidden sm:block" style={{ fontFamily: 'Syne, sans-serif' }}>
            RTS <span className="text-red-500">Technology</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="text-sm text-white/70 hover:text-red-400 transition-colors duration-200 tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-4 px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-500 transition-all duration-200 shadow-[0_0_20px_rgba(204,32,32,0.35)]"
          >
            Solicitar asesoría
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          className="md:hidden text-white/80 hover:text-white rounded-lg p-1"
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu-movil"
            id="menu-movil"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#0a0a0a]/98 border-t border-white/5"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map(link => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setOpen(false)}
                  className="text-white/75 hover:text-red-400 py-2.5 text-sm rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-3 px-5 py-3 bg-red-600 text-white rounded-lg text-sm font-semibold text-center"
              >
                Solicitar asesoría
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

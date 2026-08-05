import { useEffect, useState } from 'react'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import WhyUs from './components/WhyUs'
import Testimonials from './components/Testimonials'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

/** Marca en sessionStorage para no repetir el arranque en cada visita. */
const BOOT_KEY = 'rts:boot-visto'

/**
 * Decide si toca mostrar la secuencia de arranque.
 * Se evalúa una sola vez, al montar, para que el primer render ya sea correcto.
 */
function debeMostrarLoader(): boolean {
  if (typeof window === 'undefined') return false

  // Quien pide menos movimiento no debería tragarse una intro animada.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false

  // Si el visitante llega directo a una sección (#contact), no lo entretengas.
  if (window.location.hash) return false

  try {
    return sessionStorage.getItem(BOOT_KEY) === null
  } catch {
    // Modo privado o almacenamiento bloqueado: no es motivo para romper la web.
    return true
  }
}

export default function App() {
  const [showLoader, setShowLoader] = useState(debeMostrarLoader)

  /*
   * Bloquea el scroll del fondo mientras el arranque está encima, para que no
   * se pueda desplazar una página que todavía no se ve.
   */
  useEffect(() => {
    if (!showLoader) return
    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previo
    }
  }, [showLoader])

  const cerrarLoader = () => {
    try {
      sessionStorage.setItem(BOOT_KEY, '1')
    } catch {
      /* sin persistencia: como mucho se vuelve a ver en la próxima visita */
    }
    setShowLoader(false)
  }

  return (
    <>
      {/*
        El contenido se renderiza SIEMPRE, desde el primer momento. Antes iba
        detrás de `{loaded && ...}`, así que durante los ~5 s del arranque el
        HTML estaba vacío: Google, WhatsApp y LinkedIn no veían absolutamente
        nada de la web. El Loader ahora se limita a taparlo por encima
        (position: fixed, z-index 100) mientras dura.
      */}
      <div className="bg-[#0a0a0a] text-white overflow-x-hidden">
        <Navbar />
        <main id="contenido">
          <Hero />
          <Services />
          <WhyUs />
          <Testimonials />
          <Faq />
          <Contact />
        </main>
        <Footer />
      </div>

      {showLoader && <Loader onDone={cerrarLoader} />}
    </>
  )
}

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { contacto } from '../config/contacto'
import { faqs } from '../config/faqs'

export default function Faq() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [abierta, setAbierta] = useState<number | null>(0)

  return (
    <section id="preguntas" ref={ref} className="py-28 relative overflow-hidden">
      <div className="absolute right-0 top-1/3 w-[500px] h-[500px] rounded-full bg-red-900/5 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-medium text-red-500 tracking-widest uppercase">
            Preguntas frecuentes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
            Lo que más nos<br />
            <span className="red-gradient">preguntan</span>
          </h2>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            Y si tu duda no está aquí, escríbenos: respondemos en menos de {contacto.tiempoRespuesta}.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const activa = abierta === i
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border border-white/7 rounded-2xl bg-white/[0.025] overflow-hidden"
              >
                {/*
                  Un <button> real con aria-expanded: se puede usar con teclado
                  y los lectores de pantalla anuncian si esta abierta o cerrada.
                */}
                <h3>
                  <button
                    type="button"
                    onClick={() => setAbierta(activa ? null : i)}
                    aria-expanded={activa}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-boton-${i}`}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="text-base font-semibold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      aria-hidden="true"
                      className={`flex-shrink-0 text-red-400 transition-transform duration-300 ${activa ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>

                {/*
                  El panel se mantiene SIEMPRE en el HTML y solo se oculta con
                  `hidden`. Si se desmontara al cerrarlo, el texto no estaria en
                  la pagina para Google, y son justo las palabras por las que
                  queremos que nos encuentren.
                */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-boton-${i}`}
                  hidden={!activa}
                  className="px-6 pb-5 -mt-1"
                >
                  <p className="text-sm text-white/65 leading-relaxed">{faq.a}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Zap, Server } from 'lucide-react'
import rtsLogo from '../assets/rts-logo.png'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-red-700/6 blur-[140px]" />
      </div>
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-red-900/8 blur-[100px] pointer-events-none" />
      <div className="absolute left-0 top-1/2 w-full h-px bg-gradient-to-r from-transparent via-red-600/15 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-600/25 bg-red-600/8 text-red-400 text-xs font-medium mb-8 tracking-widest uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Soluciones Tecnológicas · República Dominicana
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-[3.6rem] font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Impulsamos tu negocio con{' '}
              <span className="red-gradient glow-red">tecnología estable,</span>
              {' '}segura y escalable
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25 }}
              className="text-lg text-white/45 max-w-xl mb-10 leading-relaxed"
            >
              Diseñamos, implementamos y mantenemos infraestructura tecnológica para empresas que necesitan operar sin interrupciones.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-semibold text-base hover:bg-red-500 transition-all duration-200 shadow-[0_0_30px_rgba(204,32,32,0.35)]"
              >
                Solicitar asesoría <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-white/60 rounded-xl font-medium text-base hover:border-red-600/40 hover:text-white transition-all duration-200"
              >
                Ver servicios
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 flex items-center gap-8"
            >
              {[['200+', 'Proyectos'], ['99.9%', 'Uptime'], ['10+', 'Años exp.']].map(([val, label]) => (
                <div key={label}>
                  <div className="text-2xl font-bold text-red-400" style={{ fontFamily: 'Syne, sans-serif' }}>{val}</div>
                  <div className="text-xs text-white/35 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — logo with orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer orbit */}
              <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320"
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
                <circle cx="160" cy="160" r="148" fill="none" stroke="rgba(204,32,32,0.12)" strokeWidth="1" strokeDasharray="6 10" />
                {[0, 90, 180, 270].map((a, i) => {
                  const rad = (a * Math.PI) / 180
                  return <circle key={i} cx={160 + 148 * Math.cos(rad)} cy={160 + 148 * Math.sin(rad)} r="5" fill="#cc2020" opacity="0.8" />
                })}
              </motion.svg>
              {/* Inner orbit */}
              <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320"
                animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
                <circle cx="160" cy="160" r="110" fill="none" stroke="rgba(136,136,136,0.1)" strokeWidth="1" strokeDasharray="3 8" />
                {[45, 135, 225, 315].map((a, i) => {
                  const rad = (a * Math.PI) / 180
                  return <rect key={i} x={160 + 110 * Math.cos(rad) - 4} y={160 + 110 * Math.sin(rad) - 4} width="8" height="8" fill="#666" opacity="0.6" transform={`rotate(${a}, ${160 + 110 * Math.cos(rad)}, ${160 + 110 * Math.sin(rad)})`} />
                })}
              </motion.svg>
              {/* Glow */}
              <div className="absolute w-48 h-48 rounded-full bg-red-700/10 blur-2xl" />
              {/* Logo */}
              <img src={rtsLogo} alt="RTS Technology" className="relative z-10 w-44 h-44 object-contain" />
              {/* Floating badges */}
              {[
                { icon: Shield, label: 'Seguridad', pos: '-top-4 -right-4' },
                { icon: Server, label: 'Infraestructura', pos: '-bottom-4 -left-4' },
                { icon: Zap, label: 'Alta velocidad', pos: 'top-1/2 -right-16' },
              ].map(({ icon: Icon, label, pos }) => (
                <div key={label} className={`absolute ${pos} flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg backdrop-blur-sm text-[11px] text-white/50`}>
                  <Icon size={10} className="text-red-400" />{label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  )
}

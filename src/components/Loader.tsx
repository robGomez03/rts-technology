import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import rtsLogo from '../assets/rts-logo.png'

const BOOT_LINES = [
  '> Iniciando RTS Technology OS v3.1.0...',
  '> Verificando módulos de seguridad.............. [OK]',
  '> Cargando firewall enterprise.................. [OK]',
  '> Estableciendo conexiones seguras.............. [OK]',
  '> Montando infraestructura de red............... [OK]',
  '> Validando certificados SSL.................... [OK]',
  '> Sincronizando CCTV nodes...................... [OK]',
  '> Activando protocolos de cifrado............... [OK]',
  '> Sistema listo. Bienvenido.',
]

export default function Loader({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'boot' | 'logo' | 'exit'>('boot')
  const [lines, setLines] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const termRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (phase !== 'boot') return
    if (currentLine >= BOOT_LINES.length) {
      setTimeout(() => setPhase('logo'), 400)
      return
    }
    const delay = currentLine === 0 ? 300 : 180 + Math.random() * 120
    const t = setTimeout(() => {
      setLines(prev => [...prev, BOOT_LINES[currentLine]])
      setProgress(Math.round(((currentLine + 1) / BOOT_LINES.length) * 100))
      setCurrentLine(prev => prev + 1)
    }, delay)
    return () => clearTimeout(t)
  }, [currentLine, phase])

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight
  }, [lines])

  useEffect(() => {
    if (phase !== 'logo') return
    const t = setTimeout(() => {
      setPhase('exit')
      setTimeout(onDone, 800)
    }, 1800)
    return () => clearTimeout(t)
  }, [phase, onDone])

  const segments = Array.from({ length: 16 })

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
            <div className="scanline absolute left-0 right-0 h-[2px] bg-red-500" />
          </div>
          <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full blur-[120px] transition-all duration-1000"
              style={{ width: phase === 'logo' ? 500 : 200, height: phase === 'logo' ? 500 : 200, background: 'rgba(204,32,32,0.12)' }}
            />
          </div>

          <AnimatePresence mode="wait">
            {phase === 'boot' && (
              <motion.div
                key="boot"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-xl px-6"
              >
                <div className="rounded-xl border border-white/10 bg-black/80 overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-white/8 bg-white/[0.03]">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                    <div className="w-3 h-3 rounded-full bg-green-500/40" />
                    <span className="ml-3 text-xs text-white/30 font-mono">rts-system-boot — bash</span>
                  </div>
                  <div ref={termRef} className="h-52 overflow-y-auto px-5 py-4 font-mono text-xs space-y-1">
                    {lines.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className={line.includes('[OK]') ? 'text-green-400' : line.includes('Bienvenido') ? 'text-red-400 font-bold' : 'text-white/60'}
                      >
                        {line}
                      </motion.div>
                    ))}
                    {currentLine < BOOT_LINES.length && (
                      <span className="inline-block w-2 h-3 bg-red-500 animate-pulse ml-0.5" />
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-white/30 font-mono mb-2">
                    <span>CARGANDO SISTEMA</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-700 to-red-500 rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'logo' && (
              <motion.div
                key="logo"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex flex-col items-center gap-6"
              >
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 200 200"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    {segments.map((_, i) => {
                      const angle = (i / segments.length) * 360
                      const rad = (angle * Math.PI) / 180
                      const r = 92
                      const cx = 100 + r * Math.cos(rad)
                      const cy = 100 + r * Math.sin(rad)
                      return <circle key={i} cx={cx} cy={cy} r={i % 2 === 0 ? 5 : 3} fill={i % 2 === 0 ? '#cc2020' : '#666'} opacity={0.4 + (i / segments.length) * 0.6} />
                    })}
                  </motion.svg>
                  <motion.svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 200 200"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  >
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i / 8) * 360
                      const rad = (angle * Math.PI) / 180
                      const r = 75
                      const cx = 100 + r * Math.cos(rad)
                      const cy = 100 + r * Math.sin(rad)
                      return <rect key={i} x={cx - 4} y={cy - 1.5} width={8} height={3} fill={i % 2 === 0 ? '#cc2020' : '#888'} opacity={0.5} transform={`rotate(${angle + 90}, ${cx}, ${cy})`} />
                    })}
                  </motion.svg>
                  <motion.img
                    src={rtsLogo}
                    alt="RTS Technology"
                    className="w-28 h-28 object-contain relative z-10 [mix-blend-mode:screen]"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="text-xs font-mono text-red-500 tracking-[0.3em] uppercase mb-1">Sistema Inicializado</div>
                  <div className="text-white/40 text-sm font-mono">Tecnología estable · Segura · Escalable</div>
                </motion.div>
                <div className="flex gap-2">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

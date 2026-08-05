import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { faqs } from './src/config/faqs'

/**
 * Inyecta el structured data FAQPage en index.html durante el build,
 * generandolo desde `src/config/faqs.ts` (la misma fuente que pinta la
 * seccion de preguntas en la web).
 *
 * Antes el bloque JSON-LD estaba escrito a mano en index.html y habia que
 * acordarse de actualizarlo al editar una pregunta. Si los dos textos no
 * coinciden, Google puede descartar el bloque entero y se pierden los
 * resultados enriquecidos, sin ningun aviso. Generandolo aqui, divergir es
 * imposible.
 */
function faqStructuredData(): Plugin {
  return {
    name: 'rts-faq-structured-data',
    transformIndexHtml(html) {
      const datos = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }

      return {
        html,
        tags: [
          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            // `</` se escapa para que el JSON no pueda cerrar el <script>.
            children: JSON.stringify(datos, null, 2).replace(/<\//g, '<\\/'),
            injectTo: 'head',
          },
        ],
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), faqStructuredData()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

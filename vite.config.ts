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

/**
 * Quita los comentarios HTML del index.html publicado.
 *
 * El fichero fuente lleva bastantes comentarios explicando por que las cosas
 * estan como estan, y eso es deseable para quien mantenga el proyecto. Pero no
 * hay razon para enviarlos a cada visitante: ocupan sitio y dejan a la vista
 * notas internas como "TODO: telefono real" a cualquiera que mire el codigo
 * fuente de la pagina.
 *
 * Se aplica solo al compilar; en desarrollo los comentarios se conservan.
 */
function limpiarComentariosHtml(): Plugin {
  return {
    name: 'rts-limpiar-comentarios-html',
    apply: 'build',
    enforce: 'post',
    transformIndexHtml(html) {
      return html
        .replace(/\n?[ \t]*<!--[\s\S]*?-->/g, '')
        // Compacta las lineas en blanco que deja el borrado.
        .replace(/\n{3,}/g, '\n\n')
    },
  }
}

export default defineConfig({
  plugins: [react(), faqStructuredData(), limpiarComentariosHtml()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

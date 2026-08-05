import { contacto } from './contacto'

/**
 * Preguntas frecuentes. Cumplen dos funciones:
 *
 * 1. Resuelven las objeciones que frenan una solicitud ("cuánto cuesta",
 *    "trabajan en mi zona", "cuánto tardan").
 * 2. Alimentan el bloque FAQPage de datos estructurados de index.html, con el
 *    que Google puede mostrar las preguntas desplegables en los resultados.
 *
 * Están en un fichero .ts sin JSX a propósito: así el script `check-faq.mts`
 * puede importarlas y comprobar que coinciden LITERALMENTE con el JSON-LD de
 * index.html. Si los dos textos divergen, Google puede descartar el bloque.
 *
 * Si editas algo aquí, ejecuta:  node check-faq.mts
 *
 * TODO: verifica que las respuestas reflejen tus condiciones reales.
 */
export const faqs = [
  {
    q: '¿Cuánto cuesta instalar cámaras de seguridad en mi empresa?',
    a: 'El costo depende de la cantidad de cámaras, si son interiores o exteriores, la distancia del cableado y los días de grabación que necesites. Hacemos una visita de evaluación sin costo y entregamos una cotización detallada, sin compromiso.',
  },
  {
    q: '¿En cuánto tiempo responden una solicitud?',
    a: `Respondemos toda solicitud que llega por la web en menos de ${contacto.tiempoRespuesta}. Para clientes con contrato de soporte, los tiempos de respuesta ante incidentes están definidos por SLA según la criticidad del caso.`,
  },
  {
    q: '¿Trabajan con empresas fuera de Santo Domingo?',
    a: 'Sí. Damos servicio en todo el territorio dominicano. El soporte remoto cubre cualquier provincia el mismo día, y coordinamos visitas presenciales al interior según el alcance del proyecto.',
  },
  {
    q: '¿Puedo contratar un solo servicio o tengo que tomar todo el paquete?',
    a: 'Puedes contratar servicios por separado. Muchos clientes empiezan con un proyecto puntual (cámaras de seguridad, cableado de red o una auditoría) y más adelante amplían a un contrato de soporte mensual.',
  },
  {
    q: '¿Atienden empresas pequeñas o solo grandes?',
    a: 'Atendemos desde oficinas de pocos empleados hasta empresas con varias sucursales. El alcance se ajusta al tamaño: una PYME no necesita la misma infraestructura que una operación de cien puestos, y no tiene sentido que pague por ella.',
  },
  {
    q: '¿Qué incluye el soporte técnico empresarial?',
    a: 'Diagnóstico y resolución de incidencias de computadoras, servidores, redes y conectividad; escalamiento al fabricante cuando aplica; y documentación de cada caso. Se presta en remoto o en sitio según la urgencia.',
  },
  {
    q: '¿Entregan garantía y documentación de los trabajos?',
    a: 'Sí. Todo proyecto de infraestructura se entrega con documentación técnica, certificación de los puntos cuando corresponde y garantía sobre la instalación. Los equipos conservan además la garantía del fabricante.',
  },
  {
    q: '¿Puedo ver las cámaras desde mi celular?',
    a: 'Sí. Los sistemas que instalamos permiten acceso remoto desde celular o computadora, con usuarios y permisos separados para que cada persona vea solo lo que le corresponde. La configuración y la capacitación van incluidas.',
  },
] as const

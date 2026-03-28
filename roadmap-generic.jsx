import { useState } from "react";
import {
  Layers, Activity, Cpu, Code2, Globe,
  BookMarked, BookOpen, ExternalLink, Info,
  Sparkles, Terminal, Hexagon,
  ChevronDown, ChevronRight,
  Check, X,
  RefreshCw, Target, FileText, Zap,
  BarChart2, CalendarDays, Map,
  BookText, LayoutDashboard,
} from "lucide-react";

// Area icon components keyed by area id
const AREA_ICON_MAP = {
  "system-design":  Layers,
  "observabilidad": Activity,
  "ai-engineering": Cpu,
  "algoritmos":     Code2,
  "ingles-tecnico": Globe,
};
const AreaIcon = ({ id, size = 15, style = {} }) => {
  const Icon = AREA_ICON_MAP[id];
  return Icon ? <Icon size={size} style={style} /> : null;
};

const roadmapData = [
  {
    id: "system-design",
    icon: "⬡",
    color: "#00D4FF",
    title: "System Design",
    subtitle: "De implementador a arquitecto de sistemas",
    period: "6 meses",
    periodLabel: "3 meses te dan el vocabulario; 6 meses te dan la intuición para decir 'esto va a fallar en producción' antes de escribir una línea de código.",
    phases: [
      {
        label: "Mes 1–2",
        title: "Fundamentos & Vocabulario",
        deliverable: "Repositorio GitHub con 8+ diagramas de sistema comentados, cada uno con sección de decisiones y trade-offs.",
        metric: "Puedes explicar sin notas: CAP theorem, trade-offs SQL vs NoSQL, cuándo usar colas vs llamadas síncronas, y qué es un percentil p99.",
        resources: [
          { name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer", free: true },
          { name: "ByteByteGo YouTube", url: "https://www.youtube.com/@ByteByteGo", free: true },
          { name: "DDIA — Kleppmann (1ª ed.) Cap. 1–4", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", owned: true },
          { name: "SDI Vol. 1 — Alex Xu (cap. 1–6)", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", owned: true },
        ],
        objectives: [
          {
            topic: "Scalability & Load — métricas de carga y percentiles (DDIA cap. 1)",
            why: "Antes de diseñar cualquier sistema necesitas entender qué significa que 'no escala'. Los percentiles (p95, p99) reemplazan al promedio como medida de performance: un sistema que responde en 50ms en promedio puede estar fallando al 5% de los usuarios más frecuentes. El capítulo 1 de DDIA establece el vocabulario fundamental — throughput, latency, load parameters — que usarás en cada decisión de arquitectura del resto del roadmap.",
            resource: { name: "DDIA 1ª ed. — Cap. 1: Reliable, Scalable, Maintainable", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Calcular el throughput estimado (requests/sec, reads vs writes ratio) de un sistema que usas a diario (ej: Twitter, WhatsApp) y documentarlo con los mismos parámetros de carga que describe Kleppmann en el cap. 1.",
          },
          {
            topic: "Back-of-the-envelope estimation: estimar capacidad antes de diseñar (SDI Vol.1 cap. 2)",
            why: "El capítulo 2 del libro de Alex Xu enseña el skill más subestimado de system design: estimar capacidad con números aproximados antes de elegir arquitectura. ¿Cuánto storage necesito para almacenar 10 años de tweets? ¿Cuántos servidores para manejar 1 millón de usuarios activos? Las estimaciones back-of-the-envelope no necesitan ser exactas — necesitan descartar malas ideas y justificar decisiones de diseño.",
            resource: { name: "SDI Vol. 1 — Cap. 2: Back-of-the-envelope Estimation", owned: true, url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF" },
            miniDeliverable: "Hacer estimaciones de capacidad para Twitter siguiendo el framework del cap. 2 de Xu: usuarios activos, QPS de lectura/escritura, storage por año, bandwidth. Documentar todos los supuestos explícitamente.",
          },
          {
            topic: "Modelos de datos: relacional vs documental vs grafos (DDIA cap. 2)",
            why: "La elección del modelo de datos es una de las decisiones más costosas de revertir. El cap. 2 de DDIA explica cuándo SQL garantiza consistencia en relaciones complejas, cuándo un documento store como MongoDB es correcto para datos heterogéneos con locality de lectura, y cuándo una base de grafos resuelve problemas que SQL hace tortuosos. La mayoría de los errores de arquitectura nacen de elegir mal el modelo de datos al inicio.",
            resource: { name: "DDIA 1ª ed. — Cap. 2: Data Models and Query Languages", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Tomar un sistema real que conoces y escribir un documento de una página justificando qué modelo de datos usarías hoy y por qué rechazarías los otros dos, usando el vocabulario del cap. 2 de Kleppmann.",
          },
          {
            topic: "Storage & Retrieval: índices, B-Trees y LSM-Trees (DDIA cap. 3)",
            why: "El cap. 3 de DDIA es uno de los capítulos más densos y valiosos del libro: explica cómo funciona por dentro el storage engine de una base de datos. Un B-Tree optimiza lecturas (PostgreSQL, MySQL); un LSM-Tree optimiza escrituras (Cassandra, RocksDB). Entender esto te permite razonar sobre performance sin adivinar y elegir la base de datos correcta para cada patrón de acceso.",
            resource: { name: "DDIA 1ª ed. — Cap. 3: Storage and Retrieval", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Ejecutar EXPLAIN ANALYZE en 3 queries (PostgreSQL) antes y después de agregar un índice. Documentar la diferencia de costo de query y explicar por qué el índice ayuda usando el vocabulario de B-Trees del cap. 3.",
          },
          {
            topic: "Encoding & Evolution: JSON, Protobuf, Avro (DDIA cap. 4)",
            why: "El cap. 4 de DDIA cubre uno de los problemas más silenciosos de los sistemas distribuidos: los datos evolucionan pero el código de múltiples servicios cambia a distinto ritmo. JSON es conveniente pero costoso y sin schema. Protobuf y Avro permiten backward/forward compatibility de forma segura. El concepto clave: durante cualquier deploy, múltiples versiones de tu servicio corren simultáneamente — el encoding debe soportarlo.",
            resource: { name: "DDIA 1ª ed. — Cap. 4: Encoding and Evolution", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Implementar un schema simple en Protobuf y demostrar backward compatibility: la versión 1 puede leer datos escritos por la versión 2 con un campo nuevo. Documentar qué pasa si intentas lo mismo con JSON.",
          },
          {
            topic: "Framework de diseño paso a paso (SDI Vol.1 cap. 3)",
            why: "El cap. 3 de Alex Xu establece el framework de 4 pasos que usarás en cada diseño: (1) entender el problema y el alcance — hacer las preguntas correctas antes de proponer nada, (2) proponer un diseño de alto nivel, (3) hacer deep dive en los componentes críticos, (4) revisar y resumir los trade-offs. Este framework evita el error más común: proponer una solución antes de entender el problema.",
            resource: { name: "SDI Vol. 1 — Cap. 3: A Framework for System Design Interviews", owned: true, url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF" },
            miniDeliverable: "Diseñar el sistema URL shortener clásico (tipo bit.ly) siguiendo estrictamente el framework de 4 pasos del cap. 3 de Xu: scoping con preguntas, diseño de alto nivel, deep dive en los componentes críticos, y lista de trade-offs.",
          },
          {
            topic: "CAP Theorem & Consistency Models",
            why: "El CAP Theorem dice que ante una partición de red debes elegir entre Consistency (todos ven los mismos datos) o Availability (el sistema sigue respondiendo). Aprenderás también los modelos intermedios que DDIA describe en detalle: eventual consistency, read-your-writes, monotonic reads, causal consistency — y cuándo cada uno es aceptable para tu caso de negocio.",
            resource: { name: "Martin Kleppmann — CAP Theorem talk (YouTube)", url: "https://www.youtube.com/watch?v=EYJnWttrC9k", free: true },
            miniDeliverable: "Escribir un documento de 300 palabras con dos ejemplos concretos: uno donde elegirías Consistency sobre Availability, y otro al revés. Incluir el razonamiento de negocio y qué modelo de consistency usarías en cada caso.",
          },
          {
            topic: "Caching strategies: read-through, write-through, write-behind, cache-aside",
            why: "El caching es la herramienta más poderosa y más mal usada en sistemas distribuidos. Cache-aside es simple pero puede quedar stale; write-through garantiza consistencia pero agrega latencia en escrituras. El libro de SDI Vol. 1 usa el diseño de un sistema de caché distribuido como uno de sus casos de estudio centrales, aplicando exactamente estas estrategias en el contexto de sistemas reales.",
            resource: { name: "Redis — Caching Architecture Patterns (docs)", url: "https://redis.io/docs/manual/patterns/", free: true },
            miniDeliverable: "Implementar cache-aside con Redis o un diccionario en memoria para una función que simula una query lenta (sleep de 200ms). Medir y documentar la mejora de latencia con y sin caché.",
          },
        ],
      },
      {
        label: "Mes 3–4",
        title: "Replicación, Particionamiento & Transacciones",
        deliverable: "Architecture Decision Records (ADRs) publicados en GitHub con al menos 5 decisiones documentadas con contexto, alternativas y justificación.",
        metric: "Puedes leer el esquema de una base de datos de producción y explicar las implicaciones de consistency y performance de sus decisiones de diseño.",
        resources: [
          { name: "ADR GitHub Examples", url: "https://github.com/joelparkerhenderson/architecture-decision-record", free: true },
          { name: "High Scalability Blog", url: "http://highscalability.com", free: true },
          { name: "DDIA 1ª ed. — Cap. 5–7", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", owned: true },
          { name: "SDI Vol. 1 — Cap. 5–15 (casos de estudio)", url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF", owned: true },
          { name: "SDI Vol. 2 — Alex Xu (cap. 1–6)", url: "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119", owned: true },
        ],
        objectives: [
          {
            topic: "Replicación: single-leader, multi-leader y leaderless (DDIA cap. 5)",
            why: "El cap. 5 de DDIA es uno de los más importantes del libro para alta disponibilidad. Single-leader es simple pero si el líder cae el sistema deja de aceptar escrituras. Multi-leader permite múltiples centros de datos escribir simultáneamente pero requiere resolución de conflictos — un problema notoriamente difícil. Leaderless (Cassandra) usa quorums. Kleppmann explica con claridad los problemas de replication lag y por qué 'eventual consistency' no es una garantía suficiente para muchos casos de negocio.",
            resource: { name: "DDIA 1ª ed. — Cap. 5: Replication", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Dibujar en Excalidraw los 3 modelos de replicación con sus trade-offs, y escribir 1 párrafo explicando en qué escenario de negocio concreto usarías cada uno. Incluir el problema de replication lag y cómo cada modelo lo enfrenta.",
          },
          {
            topic: "Particionamiento (Sharding): por rango vs por hash (DDIA cap. 6)",
            why: "El cap. 6 de DDIA explica el particionamiento como la solución cuando un solo nodo no puede almacenar o procesar los datos. Particionamiento por rango es intuitivo pero crea hot spots si las keys son secuenciales. Particionamiento por hash distribuye uniformemente pero hace ineficientes las range queries. Kleppmann también explica cómo combinar particionamiento con índices secundarios — uno de los problemas más complejos en bases de datos distribuidas.",
            resource: { name: "DDIA 1ª ed. — Cap. 6: Partitioning", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Diseñar el esquema de particionamiento para una tabla de mensajes de chat con 1 billón de registros. Documentar qué clave elegirías, por qué, y cuáles serían los hot spots potenciales si eliges una key secuencial.",
          },
          {
            topic: "Transacciones ACID y sus garantías reales (DDIA cap. 7)",
            why: "El cap. 7 de DDIA es conocido entre ingenieros como la mejor explicación de transacciones que existe. ACID esconde complejidad real: los niveles de isolation (read committed, repeatable read, serializable) permiten anomalías distintas. Kleppmann explica con rigor qué es un dirty read, un nonrepeatable read, un phantom read, y cuáles puede sufrir tu sistema dependiendo del nivel de isolation — información que la mayoría de los libros de bases de datos omite.",
            resource: { name: "DDIA 1ª ed. — Cap. 7: Transactions", owned: true, url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/" },
            miniDeliverable: "Escribir 3 scripts SQL que demuestren dirty read, nonrepeatable read y phantom read en diferentes niveles de isolation en PostgreSQL. Documentar qué nivel de isolation previene cada anomalía.",
          },
          {
            topic: "Problemas de concurrencia: race conditions y cómo prevenirlos (DDIA cap. 7)",
            why: "La segunda mitad del cap. 7 de DDIA cubre los problemas de concurrencia más insidiosos: lost updates (dos transacciones leen y escriben el mismo valor simultáneamente), write skew (dos transacciones leen un estado compartido y actúan de forma que crea inconsistencia), y phantoms. Las soluciones — atomic operations, explicit locking, optimistic concurrency control — tienen trade-offs de performance muy distintos.",
            resource: { name: "Martin Fowler — Optimistic Offline Lock pattern", url: "https://martinfowler.com/eaaCatalog/optimisticOfflineLock.html", free: true },
            miniDeliverable: "Implementar un ejemplo de lost update (dos procesos leen y escriben el mismo valor simultáneamente) y resolverlo con optimistic locking. Documentar el bug con código que lo reproduce y la solución.",
          },
          {
            topic: "Casos de estudio SDI Vol.1: diseñar 5 sistemas del libro (cap. 5–15)",
            why: "Los capítulos 5–15 del libro de Alex Xu presentan el diseño de sistemas reales: rate limiter, consistent hashing, key-value store, unique ID generator, URL shortener, web crawler, notification system, news feed, chat system, search autocomplete, YouTube. Cada capítulo sigue el framework de 4 pasos. El ejercicio más valioso: diseñar cada sistema de forma independiente antes de leer la solución de Xu, luego comparar y documentar las diferencias.",
            resource: { name: "SDI Vol. 1 — Cap. 5–15: System Design Cases", owned: true, url: "https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF" },
            miniDeliverable: "Diseñar 5 sistemas del libro de forma independiente, comparar con la solución de Xu, y publicar los 5 diagramas en un repositorio de GitHub con una sección de 'diferencias encontradas' por cada sistema.",
          },
          {
            topic: "Documentar decisiones como RFC + ADRs",
            why: "Un RFC articula el problema, las alternativas y la decisión con sus justificaciones. Los ADRs capturan el contexto para que en 6 meses alguien entienda por qué se tomó esa decisión. Es la diferencia entre un sistema mantenible y uno que nadie entiende.",
            resource: { name: "joelparkerhenderson — ADR Templates (GitHub)", url: "https://github.com/joelparkerhenderson/architecture-decision-record", free: true },
            miniDeliverable: "Escribir tu primer ADR sobre una decisión técnica real o hipotética. Formato: Contexto → Decisión → Consecuencias → Alternativas consideradas.",
          },
        ],
      },
      {
        label: "Mes 5–6",
        title: "Sistemas Distribuidos & Exposición Pública",
        deliverable: "Post técnico publicado sobre una decisión de arquitectura real + diagrama de sistema complejo con throughput estimado y justificación de componentes.",
        metric: "Puedes diseñar cualquier sistema estándar en 45 minutos con estimaciones de capacidad, decisiones de storage y trade-offs explícitos.",
        resources: [
          { name: "Interviewing.io", url: "https://interviewing.io", free: true },
          { name: "Pramp", url: "https://www.pramp.com", free: true },
          { name: "Discord Engineering Blog", url: "https://discord.com/blog/engineering", free: true },
          { name: "DDIA 1ª ed. — Cap. 9–11", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", owned: true },
          { name: "SDI Vol. 2 — Alex Xu (cap. 7–13)", url: "https://www.amazon.com/System-Design-Interview-Insiders-Guide/dp/1736049119", owned: true },
        ],
        objectives: [
          {
            topic: "Consistencia distribuida y consenso: Raft y por qué importan (Kleppmann cap. 9)",
            why: "Raft es el algoritmo detrás de etcd, CockroachDB y otros sistemas distribuidos críticos. Resuelve el problema de cómo múltiples nodos llegan a un acuerdo sobre el estado del sistema cuando la red puede fallar. No necesitas implementarlo, pero entender cómo funciona leader election y log replication te permite evaluar las garantías reales de cualquier sistema distribuido que uses.",
            resource: { name: "The Secret Lives of Data — Raft Visualization (interactivo)", url: "http://thesecretlivesofdata.com/raft/", free: true },
            miniDeliverable: "Explicar en un documento de 400 palabras cómo Raft mantiene consistencia cuando un nodo líder falla, incluyendo un diagrama del proceso de leader election.",
          },
          {
            topic: "Batch vs Stream processing: cuándo usar cada uno (Kleppmann cap. 10–11)",
            why: "Batch procesa grandes volúmenes en diferido (reportes nocturnos, pipelines de ETL). Stream procesa eventos en tiempo real (detección de fraude, feeds). El error más común es over-engineerar con streaming cuando batch sería suficiente y mucho más simple. Saber distinguir cuándo el tiempo real agrega valor real vs complejidad innecesaria es criterio de arquitecto.",
            resource: { name: "Confluent — What is Apache Kafka? (docs + blog)", url: "https://www.confluent.io/what-is-apache-kafka/", free: true },
            miniDeliverable: "Diseñar la arquitectura de un pipeline para un sistema de detección de fraude. Justificar con argumentos técnicos si usarías batch o stream, y qué componentes necesitarías.",
          },
          {
            topic: "Mock system design interviews: práctica con feedback real",
            why: "El system design en entrevistas es un skill separado: no solo debes diseñar bien, sino comunicar el proceso — hacer las preguntas correctas para acotar el alcance, estimar capacidad, proponer una solución simple primero y escalarla. Las entrevistas mock con feedback real son insustituibles para identificar tus gaps de comunicación técnica.",
            resource: { name: "Pramp — Free peer mock interviews", url: "https://www.pramp.com", free: true },
            miniDeliverable: "Completar al menos 2 mock interviews y documentar los gaps identificados por el entrevistador. Crear un plan de mejora específico para cada gap.",
          },
          {
            topic: "Estudiar arquitecturas públicas: Figma, Discord, Cloudflare, Notion",
            why: "Las empresas top publican post-mortems y artículos sobre sus decisiones reales. Discord migró de Cassandra a ScyllaDB con trillones de mensajes. Figma migró de monolito a microservicios. Cloudflare explica cómo funciona su red global. Estudiar estos casos da intuición sobre problemas a escala que ningún libro puede replicar.",
            resource: { name: "Discord — How We Store Trillions of Messages (blog)", url: "https://discord.com/blog/how-discord-stores-trillions-of-messages", free: true },
            miniDeliverable: "Leer el post de Discord sobre Cassandra→ScyllaDB y escribir un resumen de 300 palabras con las 3 decisiones técnicas más importantes y qué las motivó.",
          },
          {
            topic: "Publicar 2 posts técnicos sobre decisiones de arquitectura",
            why: "Escribir sobre lo que aprendiste consolida el conocimiento y construye tu reputación pública. Un post técnico bien escrito sobre un trade-off de arquitectura demuestra criterio técnico de una forma que ningún CV puede replicar. Es tu portafolio intelectual visible para cualquier equipo en el mundo.",
            resource: { name: "Hashnode — Blog técnico gratuito", url: "https://hashnode.com", free: true },
            miniDeliverable: "Publicar el primer post en Dev.to o Hashnode con al menos 600 palabras sobre una decisión de arquitectura real o hipotética. Incluir un diagrama y al menos 2 trade-offs explícitos.",
          },
        ],
      },
    ],
  },

  {
    id: "observabilidad",
    icon: "◈",
    color: "#FFB800",
    title: "Observabilidad",
    subtitle: "Ver dentro de sistemas distribuidos",
    period: "3 meses",
    periodLabel: "La observabilidad es práctica por definición — no se aprende leyendo, se aprende instrumentando sistemas reales y respondiendo preguntas que antes eran imposibles de responder.",
    phases: [
      {
        label: "Mes 1",
        title: "Los tres pilares: Logs, Métricas y Trazas",
        deliverable: "Sistema distribuido de práctica (2–3 servicios) con trazas end-to-end visibles en Grafana Cloud o Honeycomb, mostrando latencia por servicio y error rate.",
        metric: "Dado un trace de un request lento, puedes identificar exactamente qué servicio o query causó la latencia sin revisar logs línea por línea.",
        resources: [
          { name: "OpenTelemetry Docs", url: "https://opentelemetry.io/docs", free: true },
          { name: "Grafana Cloud (free tier)", url: "https://grafana.com/products/cloud", free: true },
          { name: "Honeycomb.io (free tier)", url: "https://www.honeycomb.io", free: true },
          { name: "Observability Engineering — O'Reilly", url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/", free: false },
        ],
        objectives: [
          {
            topic: "Logs estructurados vs logs de texto plano",
            why: "La diferencia entre console.log('Error') y logger.error({ userId, errorCode, duration }, 'Fallo') parece cosmética pero es fundamental. Los logs estructurados (JSON) son consultables: 'muéstrame todos los errores del userId X en los últimos 30 minutos'. Los logs de texto plano solo sirven para leer línea por línea. Un sistema sin logs estructurados es opaco en producción.",
            resource: { name: "Grafana — Structured Logging Guide", url: "https://grafana.com/blog/2022/06/07/how-to-do-structured-logging-right/", free: true },
            miniDeliverable: "Migrar los logs de un servicio de práctica de console.log a logs JSON estructurados con al menos 5 campos (timestamp, level, service, userId, duration). Verificar que son consultables en Grafana Loki o similar.",
          },
          {
            topic: "Métricas: contadores, gauges, histogramas y summary",
            why: "Un counter cuenta eventos totales. Un gauge mide valores que suben y bajan. Un histograma agrupa valores en buckets para calcular percentiles. El promedio de latencia miente — un histograma que muestra p95 y p99 te dice cuánto están sufriendo los usuarios reales, no el promedio optimista.",
            resource: { name: "Prometheus — Metric Types (docs oficiales)", url: "https://prometheus.io/docs/concepts/metric_types/", free: true },
            miniDeliverable: "Instrumentar un servicio con al menos 3 tipos de métricas: un counter (requests totales), un gauge (conexiones activas), y un histograma (distribución de latencia). Crear un dashboard básico en Grafana.",
          },
          {
            topic: "Trazas distribuidas: Spans, Traces y propagación de contexto",
            why: "En un sistema distribuido, un request puede pasar por 5 servicios antes de devolver respuesta. Si tarda 800ms, ¿en cuál está el cuello de botella? Las trazas responden exactamente eso: cada operación es un Span, el conjunto de Spans es un Trace, y el trace ID se propaga entre servicios. Sin trazas, debuggear sistemas distribuidos es adivinar.",
            resource: { name: "Jaeger — Getting Started Tutorial", url: "https://www.jaegertracing.io/docs/latest/getting-started/", free: true },
            miniDeliverable: "Crear un sistema de 2 servicios donde A llama a B, instrumentar ambos con OTel, y verificar que el trace end-to-end muestra la latencia de cada servicio por separado en Jaeger o Grafana Tempo.",
          },
          {
            topic: "OpenTelemetry: la spec universal de observabilidad",
            why: "OTel es el estándar abierto que unifica logs, métricas y trazas bajo una sola API. Antes de OTel, instrumentar significaba quedar atado al vendor (Datadog SDK, New Relic SDK). Con OTel, instrumentas una vez y envías a cualquier backend. SDK, Collector, Exporters, Semantic Conventions — este es el vocabulario del campo.",
            resource: { name: "OpenTelemetry — Getting Started (docs)", url: "https://opentelemetry.io/docs/getting-started/", free: true },
            miniDeliverable: "Instrumentar un servicio con el OTel SDK, configurar un Collector que exporte a Grafana Cloud, y documentar el diagrama de componentes (SDK → Collector → Backend) con anotaciones.",
          },
          {
            topic: "Setup práctico: sistema de 2–3 servicios con Grafana Cloud o Honeycomb",
            why: "Ver tu primer trace end-to-end en un dashboard, con cada span coloreado por duración, es el momento donde la observabilidad deja de ser abstracta y se convierte en una superpotencia. Sin un sistema real donde practicar, todo lo anterior es solo teoría.",
            resource: { name: "Grafana Cloud — Quickstart Guide", url: "https://grafana.com/docs/grafana-cloud/quickstart/", free: true },
            miniDeliverable: "Dashboard funcional en Grafana Cloud con latencia p50/p95, error rate, y al menos un trace end-to-end visible. Captura de pantalla incluida en el README del proyecto de práctica.",
          },
        ],
      },
      {
        label: "Mes 2",
        title: "Instrumentación Avanzada & SLIs",
        deliverable: "Dashboard con latencia (p50, p95, p99), error rate y trazas por servicio; al menos 3 alertas configuradas sobre síntomas de experiencia de usuario.",
        metric: "Puedes simular un incidente (introducir latencia o errores artificiales) y diagnosticar la causa raíz usando solo el dashboard en menos de 5 minutos.",
        resources: [
          { name: "W3C TraceContext Spec", url: "https://www.w3.org/TR/trace-context", free: true },
          { name: "OTel Semantic Conventions", url: "https://opentelemetry.io/docs/specs/semconv", free: true },
          { name: "Grafana Alerting Docs", url: "https://grafana.com/docs/grafana/latest/alerting", free: true },
        ],
        objectives: [
          {
            topic: "W3C TraceContext: propagación de contexto entre servicios",
            why: "Para que un trace funcione entre servicios, el trace ID debe viajar con cada request. W3C TraceContext define exactamente cómo hacerlo en headers HTTP: traceparent y tracestate. Si no propagas el contexto correctamente, cada servicio crea un trace separado y pierdes la visión end-to-end. Es el 20% del trabajo que da el 80% del valor.",
            resource: { name: "W3C TraceContext — Especificación oficial", url: "https://www.w3.org/TR/trace-context/", free: true },
            miniDeliverable: "Implementar propagación de contexto manual entre 2 servicios usando los headers traceparent y tracestate. Verificar que ambos servicios aparecen bajo el mismo Trace ID en el dashboard.",
          },
          {
            topic: "Custom spans: instrumentar operaciones críticas del negocio",
            why: "OTel genera spans automáticos para HTTP y queries a BD, pero los problemas de negocio son más sutiles: ¿cuánto tarda validar permisos? ¿cuánto tarda parsear un archivo? Los custom spans te permiten responder estas preguntas y convierten el dashboard en un mapa de tu sistema de negocio, no solo de tu infraestructura.",
            resource: { name: "OpenTelemetry — Custom Instrumentation (docs)", url: "https://opentelemetry.io/docs/instrumentation/", free: true },
            miniDeliverable: "Agregar custom spans para las 3 operaciones más lentas en tu sistema de práctica. Cada span debe tener atributos relevantes al dominio (ej: userId, queryType, fileSize).",
          },
          {
            topic: "SLIs: Service Level Indicators — las métricas que importan",
            why: "Un SLI mide directamente la experiencia del usuario: latencia, error rate, availability. La distinción clave: métricas de infraestructura (CPU usage) vs métricas de experiencia (p95 de latencia). Las segundas son las que importan cuando hay un incidente, porque son las que el usuario siente.",
            resource: { name: "Google SRE Book — Monitoring Distributed Systems (gratis online)", url: "https://sre.google/sre-book/monitoring-distributed-systems/", free: true },
            miniDeliverable: "Definir 3 SLIs para tu sistema de práctica con su fórmula de cálculo. Ej: 'Latency SLI = proporción de requests que responden en <300ms en los últimos 30 días'.",
          },
          {
            topic: "Alertas inteligentes: alertar sobre síntomas, no causas",
            why: "Una alerta mal configurada es ruido que te desensibiliza. En lugar de 'CPU > 80%' (causa, puede no importar), alertas sobre 'p95 latencia > 500ms' (síntoma, el usuario lo siente). El concepto de alert fatigue es real — un sistema de alertas que grita demasiado termina siendo ignorado.",
            resource: { name: "Grafana — Alerting Best Practices", url: "https://grafana.com/docs/grafana/latest/alerting/best-practices/", free: true },
            miniDeliverable: "Configurar 3 alertas sobre síntomas: latencia p95 > threshold, error rate > threshold, y availability < threshold. Para cada alerta, documentar qué acción debe tomar el ingeniero cuando se dispara.",
          },
        ],
      },
      {
        label: "Mes 3",
        title: "SLOs, Error Budgets & Cultura SRE",
        deliverable: "SLO document con 3 SLOs definidos y medidos + runbook completo + post técnico publicado sobre la experiencia de implementar observabilidad desde cero.",
        metric: "Un ingeniero nuevo puede entender la salud del sistema y responder a un incidente leyendo solo tu documentación.",
        resources: [
          { name: "Google SRE Book (gratis online)", url: "https://sre.google/sre-book/table-of-contents", free: true },
          { name: "Google SRE Workbook (gratis online)", url: "https://sre.google/workbook/table-of-contents", free: true },
          { name: "Art of SLOs — Google", url: "https://sre.google/resources/practices-and-processes/art-of-slos", free: true },
          { name: "Implementing Service Level Objectives — O'Reilly", url: "https://www.oreilly.com/library/view/implementing-service-level/9781492076803/", free: false },
        ],
        objectives: [
          {
            topic: "SLOs: Service Level Objectives — el contrato de confiabilidad",
            why: "Un SLO es un objetivo cuantificable: 'el 99.5% de los requests deben responder en <300ms'. No es un número arbitrario — es la diferencia entre lo que el usuario espera y lo que tu infraestructura puede sostener económicamente. Definir SLOs realistas y comunicarlos internamente sin crear falsas expectativas es una habilidad de liderazgo técnico.",
            resource: { name: "Google — Art of SLOs Workshop (slides + video)", url: "https://sre.google/resources/practices-and-processes/art-of-slos/", free: true },
            miniDeliverable: "Definir un SLO document formal para tu sistema de práctica con al menos 2 SLOs, su SLI correspondiente, y la justificación del target (por qué 99.5% y no 99.9%).",
          },
          {
            topic: "Error budgets: el trade-off entre innovación y confiabilidad",
            why: "El error budget hace explícito el trade-off entre velocidad de desarrollo y confiabilidad. Si tu SLO es 99.9% de availability, tu error budget mensual es ~43 minutos. Si quemas el budget, frenas deployments. Si sobra budget, puedes innovar más agresivamente. Es el mecanismo que convierte la confiabilidad en una conversación de negocio, no solo técnica.",
            resource: { name: "Google SRE Book — Embracing Risk (gratis online)", url: "https://sre.google/sre-book/embracing-risk/", free: true },
            miniDeliverable: "Calcular el error budget mensual para cada uno de tus SLOs. Simular un incidente que consume el 40% del budget y escribir el análisis de impacto con las implicaciones para el equipo de desarrollo.",
          },
          {
            topic: "Runbooks: documentación operacional que funciona bajo presión",
            why: "Un runbook es la documentación que se usa durante un incidente — cuando hay presión, cuando el experto está dormido, cuando alguien nuevo tiene que actuar. Describe síntomas, causas posibles, pasos de diagnóstico y acciones de mitigación. La prueba real: ¿puede un ingeniero nuevo resolver el incidente leyendo solo este documento?",
            resource: { name: "PagerDuty — Runbook Template (gratis)", url: "https://www.pagerduty.com/resources/learn/what-is-a-runbook/", free: true },
            miniDeliverable: "Escribir un runbook completo para el incidente más probable en tu sistema de práctica. Validarlo pidiéndole a alguien (o a un LLM) que siga el runbook para resolver un incidente simulado.",
          },
          {
            topic: "SRE Book — Eliminating Toil y Postmortem Culture",
            why: "'Toil' es el trabajo repetitivo y automatable que consume tiempo sin agregar valor. La Postmortem Culture es cómo analizar fallos sin culpabilizar personas y convertir cada incidente en aprendizaje sistémico. Son los dos pilares culturales que separan a un equipo que mejora continuamente de uno que repite los mismos errores.",
            resource: { name: "Google SRE Book — Eliminating Toil (gratis online)", url: "https://sre.google/sre-book/eliminating-toil/", free: true },
            miniDeliverable: "Escribir un postmortem de un incidente real o simulado siguiendo el formato de Google: timeline, causa raíz, impacto, acciones correctivas. Sin mencionar nombres de personas — el foco es en sistemas, no en culpas.",
          },
        ],
      },
    ],
  },

  {
    id: "ai-engineering",
    icon: "◎",
    color: "#7C3AED",
    title: "AI Engineering",
    subtitle: "De usuario de LLMs a constructor de sistemas IA",
    period: "8 meses",
    periodLabel: "Pre-módulo de 2 meses para base conceptual sólida. Con nociones de ML y data science ya tienes ventaja real. El objetivo no es entrenar modelos — es entender cómo funcionan para tomar mejores decisiones como ingeniero que los usa y los integra.",
    phases: [
      {
        label: "Pre-módulo · Mes 1–2",
        title: "Fundamentos de Deep Learning & LLMs",
        isPremodule: true,
        deliverable: "Notebook en GitHub con 3 experimentos: (1) clasificación de texto con transformer, (2) generación de texto con LLM local, (3) búsqueda semántica por similitud de embeddings.",
        metric: "Puedes explicar sin notas: qué es un token, cómo funciona la atención en términos intuitivos, diferencia entre pre-training y fine-tuning, y para qué sirve un embedding.",
        resources: [
          { name: "Fast.ai — Practical Deep Learning", url: "https://course.fast.ai", free: true },
          { name: "The Illustrated Transformer — Jay Alammar", url: "https://jalammar.github.io/illustrated-transformer", free: true },
          { name: "Andrej Karpathy — Zero to Hero", url: "https://karpathy.ai/zero-to-hero.html", free: true },
          { name: "Deep Learning Specialization (Coursera)", url: "https://www.coursera.org/specializations/deep-learning", free: false },
        ],
        objectives: [
          {
            topic: "Redes neuronales: perceptrón, backpropagation y gradient descent",
            why: "Con tu base de ML ya sabes que un modelo aprende de datos, pero entender cómo importa para ser un buen AI engineer. El perceptrón recibe inputs, los pondera con pesos, y produce un output. Backpropagation ajusta esos pesos calculando gradientes. Entender esto te permite razonar sobre por qué un modelo no aprende — learning rate mal calibrado, gradientes que explotan — sin necesidad de ser matemático.",
            resource: { name: "3Blue1Brown — Neural Networks series (YouTube)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", free: true },
            miniDeliverable: "Implementar un perceptrón desde cero en Python (sin librerías de ML) que aprenda la función XOR. Documentar cómo cambian los pesos en cada iteración de entrenamiento.",
          },
          {
            topic: "La arquitectura Transformer: atención y self-attention",
            why: "Todos los LLMs modernos — Claude, GPT-4, Gemini, Llama — son Transformers. La intuición clave es el mecanismo de atención: en lugar de procesar palabras en secuencia, un Transformer mira todas simultáneamente y aprende qué palabras son relevantes entre sí. 'The bank by the river' vs 'the bank rejected my card' — la atención aprende que 'bank' significa cosas distintas según su contexto.",
            resource: { name: "The Illustrated Transformer — Jay Alammar (blog)", url: "https://jalammar.github.io/illustrated-transformer/", free: true },
            miniDeliverable: "Dibujar en Excalidraw el diagrama de un Transformer encoder con sus componentes: embeddings, positional encoding, multi-head attention, feed-forward. Agregar una anotación en cada componente explicando qué hace.",
          },
          {
            topic: "Tokenización: cómo los LLMs ven el texto realmente",
            why: "Los LLMs no procesan caracteres ni palabras — procesan tokens (fragmentos de texto). 'Tokenization' en inglés son 3 tokens; 'tokenización' en español puede ser 5. Esto importa porque: el costo de la API se calcula en tokens, los límites de contexto se miden en tokens, y ciertos problemas matemáticos fallan porque números como '9.11' se tokenizan de formas que confunden al modelo.",
            resource: { name: "OpenAI — Tokenizer Tool (interactivo)", url: "https://platform.openai.com/tokenizer", free: true },
            miniDeliverable: "Tokenizar 10 oraciones equivalentes en inglés y español usando el tokenizer de OpenAI o Hugging Face. Documentar cuántos tokens usa cada idioma para el mismo contenido y las implicaciones de costo.",
          },
          {
            topic: "Cómo se entrena un LLM: pre-training, fine-tuning y RLHF",
            why: "Pre-training: el modelo aprende a predecir el siguiente token en billones de textos — así adquiere conocimiento general. Fine-tuning: se ajusta con instrucciones y respuestas específicas — así aprende a ser asistente. RLHF: humanos califican respuestas y esas señales enseñan al modelo a preferir respuestas más útiles y seguras. Entender estas etapas explica por qué el modelo tiene sesgos y límites específicos.",
            resource: { name: "Andrej Karpathy — Let's Build GPT (YouTube)", url: "https://www.youtube.com/watch?v=kCc8FmEb1nY", free: true },
            miniDeliverable: "Escribir un documento de 400 palabras explicando las 3 etapas de entrenamiento con un ejemplo concreto de cómo cada etapa moldea el comportamiento observable del modelo.",
          },
          {
            topic: "Embeddings: representaciones vectoriales del significado",
            why: "Un embedding es un vector numérico que representa significado semántico. 'Rey' y 'Reina' tienen embeddings más cercanos entre sí que 'Rey' y 'Automóvil'. Esta propiedad es la base de la búsqueda semántica, RAG, y detección de similaridad. Como AI engineer, usarás embeddings constantemente — entender qué son y qué propiedades tienen permite diseñar sistemas de búsqueda mucho más inteligentes.",
            resource: { name: "Hugging Face — Sentence Transformers Docs", url: "https://www.sbert.net/docs/quickstart.html", free: true },
            miniDeliverable: "Crear un script Python que calcule embeddings para 20 oraciones y visualice su similitud semántica en un heatmap. Verificar que oraciones semánticamente similares tienen embeddings cercanos.",
          },
          {
            topic: "Experimentar con Hugging Face: cargar modelos, inferencia y embeddings",
            why: "Hugging Face es el GitHub de los modelos de ML: miles de modelos open source listos para usar. Cargar un modelo de clasificación, generar texto con un LLM local, y calcular embeddings — todo con pocas líneas de Python — te ancla a la práctica y te da vocabulario real para hablar con data scientists y ML engineers.",
            resource: { name: "Hugging Face — NLP Course (gratis, interactivo)", url: "https://huggingface.co/learn/nlp-course", free: true },
            miniDeliverable: "Notebook publicado en GitHub con los 3 experimentos del entregable de esta fase: clasificación, generación, y búsqueda semántica. Cada experimento con un párrafo de conclusiones propias.",
          },
        ],
      },
      {
        label: "Mes 3–4",
        title: "Evals & RAG — El núcleo del AI Engineering",
        deliverable: "Sistema de evals funcionando para un caso de uso propio con al menos 3 métricas visibles, y un pipeline RAG con hybrid search evaluado con RAGAS.",
        metric: "Puedes cambiar un prompt o una estrategia de chunking y medir cuantitativamente si el sistema mejoró o empeoró, con números, no con intuición.",
        resources: [
          { name: "RAGAS Docs", url: "https://docs.ragas.io", free: true },
          { name: "Anthropic Cookbook (GitHub)", url: "https://github.com/anthropics/anthropic-cookbook", free: true },
          { name: "LlamaIndex Docs", url: "https://docs.llamaindex.ai", free: true },
          { name: "LangChain Academy", url: "https://academy.langchain.com", free: false },
        ],
        objectives: [
          {
            topic: "Evals: el sistema de pruebas de un producto de IA",
            why: "En software tradicional, los tests te dicen si tu código funciona. En sistemas de IA, las evals hacen lo mismo: te dicen si tu sistema se comporta como esperas. Sin evals, cambiar un prompt es como deployar código sin tests — no sabes si mejoraste o empeoraste. Las evals son la diferencia entre un prototipo y un producto de IA en producción.",
            resource: { name: "Anthropic — Evaluations Guide (docs oficiales)", url: "https://docs.anthropic.com/en/docs/test-and-evaluate/eval-tools", free: true },
            miniDeliverable: "Definir un suite de evals para un caso de uso simple (ej: clasificador de sentimientos, Q&A sobre un documento). Al menos 20 casos de prueba con input, expected output y criterio de evaluación.",
          },
          {
            topic: "Tipos de evals: exact match, LLM-as-judge, human evals",
            why: "Exact match sirve para preguntas con respuesta única. LLM-as-judge usa otro LLM para evaluar calidad de respuestas abiertas — escala bien. Human evals son el gold standard pero no escalan. Saber combinar los tres según el tipo de tarea y el presupuesto de evaluación es criterio de AI engineer experimentado.",
            resource: { name: "RAGAS — Metrics Overview (docs)", url: "https://docs.ragas.io/en/stable/concepts/metrics/index.html", free: true },
            miniDeliverable: "Implementar los 3 tipos de evals para el mismo caso de uso. Comparar los resultados: ¿concuerdan el exact match, el LLM-as-judge y la revisión humana? Documentar las discrepancias y sus causas.",
          },
          {
            topic: "RAG: Retrieval-Augmented Generation en profundidad",
            why: "RAG permite a un LLM responder sobre información que no estaba en su entrenamiento: tus documentos, la documentación de tu empresa, datos recientes. El flujo: pregunta → búsqueda de documentos relevantes por similitud → documentos en el prompt → respuesta basada en esos documentos. La calidad del retrieval determina la calidad de la respuesta.",
            resource: { name: "LlamaIndex — RAG from Scratch Tutorial", url: "https://docs.llamaindex.ai/en/stable/getting_started/starter_example/", free: true },
            miniDeliverable: "Implementar un sistema RAG sobre un conjunto de documentos propios (PDFs, markdown). El sistema debe responder preguntas y citar los fragmentos específicos de documentos usados en cada respuesta.",
          },
          {
            topic: "Chunking strategies: cómo dividir documentos para RAG",
            why: "Chunk demasiado pequeño: pierdes contexto. Chunk demasiado grande: incluyes información irrelevante. Estrategias: por caracteres (simple), por oraciones (semánticamente mejor), por secciones (para documentos estructurados), jerárquico (chunks pequeños para retrieval, grandes para contexto). La estrategia de chunking es una de las variables con mayor impacto en la calidad del RAG.",
            resource: { name: "LlamaIndex — Node Parsers & Chunking (docs)", url: "https://docs.llamaindex.ai/en/stable/module_guides/loading/node_parsers/", free: true },
            miniDeliverable: "Implementar 3 estrategias de chunking (por caracteres, por oraciones, por secciones) sobre el mismo conjunto de documentos y evaluar con RAGAS cuál produce mejores métricas. Documentar los hallazgos.",
          },
          {
            topic: "Hybrid search: semántica + palabras clave combinadas",
            why: "La búsqueda puramente semántica falla con nombres propios, IDs y términos técnicos específicos. 'Error código 4829' se busca mejor con BM25 (keywords) que con embeddings. Hybrid search combina ambos y usa re-ranking para combinar los scores. Los sistemas RAG de producción casi siempre usan hybrid search — la búsqueda pura semántica es para prototipos.",
            resource: { name: "Pinecone — Hybrid Search Tutorial", url: "https://docs.pinecone.io/guides/data/understanding-hybrid-search", free: true },
            miniDeliverable: "Implementar hybrid search (BM25 + semántica) en tu sistema RAG. Comparar con búsqueda puramente semántica usando RAGAS. Documentar en qué tipo de queries mejora y en cuáles no.",
          },
          {
            topic: "RAGAS: métricas específicas para evaluar sistemas RAG",
            why: "RAGAS tiene métricas diseñadas para cada componente de un RAG: faithfulness (¿la respuesta se basa en los documentos recuperados?), answer relevancy (¿es relevante a la pregunta?), context precision (¿recuperó los documentos correctos?). Sin estas métricas, no sabes qué parte del sistema está fallando — el retrieval, el prompt, o el modelo.",
            resource: { name: "RAGAS — Quickstart Guide (docs)", url: "https://docs.ragas.io/en/stable/getstarted/index.html", free: true },
            miniDeliverable: "Evaluar tu sistema RAG con las 4 métricas principales de RAGAS sobre un dataset de al menos 20 preguntas. Identificar cuál métrica está más baja y proponer 2 hipótesis de por qué.",
          },
        ],
      },
      {
        label: "Mes 5–6",
        title: "Sistemas Agénticos en Producción",
        deliverable: "Sistema agéntico funcional con herramientas reales, evals automatizadas en CI, y documento de decisiones de diseño explicando por qué se eligió cada patrón.",
        metric: "Puedes decir 'la versión 2 del prompt mejoró la tasa de éxito de 71% a 84%' con datos reales de tus evals.",
        resources: [
          { name: "LangGraph Docs", url: "https://langchain-ai.github.io/langgraph", free: true },
          { name: "Anthropic — Building Effective Agents (guide)", url: "https://www.anthropic.com/research/building-effective-agents", free: true },
          { name: "AI Agents in LangGraph — DeepLearning.AI", url: "https://www.deeplearning.ai/short-courses/ai-agents-in-langgraph", free: false },
        ],
        objectives: [
          {
            topic: "Qué es un agente y por qué es diferente a un LLM con un prompt",
            why: "Un LLM con prompt responde y termina. Un agente toma acciones en el mundo: busca en la web, ejecuta código, llama APIs, lee archivos, y decide qué hacer a continuación. La diferencia es el loop: percibe → razona → actúa → percibe de nuevo. Esta capacidad hace a los agentes útiles para tareas de múltiples pasos, pero también más difíciles de controlar.",
            resource: { name: "Anthropic — Building Effective Agents (blog)", url: "https://www.anthropic.com/research/building-effective-agents", free: true },
            miniDeliverable: "Implementar el agente más simple posible: un LLM con acceso a una herramienta de búsqueda web o calculadora. Documentar el loop perceive→reason→act con ejemplos de output real del sistema.",
          },
          {
            topic: "Patrones de orquestación: orchestrator-worker, reflection, plan-and-execute",
            why: "Orchestrator-worker: un agente central delega subtareas a agentes especializados. Reflection: el agente evalúa su propio output y se corrige antes de entregarlo. Plan-and-execute: primero crea un plan explícito y luego lo ejecuta, permitiendo revisión antes de actuar. Cada patrón resuelve un tipo distinto de problema — elegir mal genera sistemas frágiles.",
            resource: { name: "LangGraph — Multi-agent Tutorials", url: "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/", free: true },
            miniDeliverable: "Implementar los 3 patrones para la misma tarea. Documentar las diferencias en calidad de output, número de llamadas al LLM, latencia total y costo aproximado.",
          },
          {
            topic: "HITL: Human-in-the-Loop — cuándo el agente debe pedir permiso",
            why: "Algunos errores de agentes son irreversibles: borrar un archivo, enviar un email, hacer una compra. HITL inserta puntos de aprobación humana antes de acciones de alto impacto. Demasiado HITL y el agente no ahorra trabajo; muy poco y el agente destruye datos en producción. Este equilibrio es uno de los problemas más importantes del AI engineering en 2026.",
            resource: { name: "LangGraph — Human in the Loop Guide", url: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/", free: true },
            miniDeliverable: "Agregar un punto de aprobación HITL en tu agente antes de cualquier acción irreversible. Implementar una interfaz mínima (CLI o web simple) donde el humano puede aprobar o rechazar la acción propuesta.",
          },
          {
            topic: "CI/CD para prompts: evaluar cambios de prompts como cambios de código",
            why: "Un prompt es código. Cambiarlo sin evaluar el impacto es como deployar sin tests. El pipeline de CI/CD para prompts ejecuta automáticamente el suite de evals ante cada cambio: si la tasa de éxito baja más del 5%, el cambio no pasa. Este proceso es lo que separa los equipos que iteran rápido con confianza de los que rompen producción al cambiar un prompt.",
            resource: { name: "Anthropic — Prompt Engineering Guide (docs)", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", free: true },
            miniDeliverable: "Crear un script que ejecute el suite de evals automáticamente y falle si la tasa de éxito baja más del 5% respecto a la versión anterior. Integrarlo como GitHub Action o script pre-commit.",
          },
          {
            topic: "RAG vs Fine-tuning vs Prompting puro: el framework de decisión",
            why: "Prompting puro: el modelo ya sabe y solo necesita instrucciones. RAG: necesita información específica y reciente. Fine-tuning: necesitas estilo muy específico o comportamientos que el prompting no captura, o quieres reducir el costo de prompts largos a escala. El error más común es hacer fine-tuning cuando RAG habría bastado — es costoso, lento y difícil de actualizar.",
            resource: { name: "Hamel Husain — A Practical Guide to LLM Fine-Tuning (blog)", url: "https://hamel.dev/blog/posts/finetune/", free: true },
            miniDeliverable: "Escribir un documento de decisión de 500 palabras para un caso de uso real o hipotético: analizar si usarías prompting, RAG o fine-tuning, con la justificación técnica y económica de cada opción descartada.",
          },
          {
            topic: "Construir un side project agéntico completo con evals",
            why: "El conocimiento sin aplicación es académico. Un agente completo de principio a fin — definición del problema, diseño de herramientas, implementación, suite de evals, documentación — es tu demostración pública de que sabes construir sistemas de IA en producción, no solo hacer demos bonitas que fallan en el primer edge case real.",
            resource: { name: "LangGraph + Anthropic API — Docs combinadas", url: "https://langchain-ai.github.io/langgraph/tutorials/introduction/", free: true },
            miniDeliverable: "Agente publicado en GitHub con: README profesional, suite de evals con al menos 30 casos, documento de decisiones de diseño, y un demo video de 3–5 minutos mostrando el sistema en acción.",
          },
        ],
      },
      {
        label: "Mes 7–8",
        title: "Papers Fundamentales & Presencia Pública",
        deliverable: "Proyecto OSS publicado con docs profesionales + 2 posts técnicos en inglés + resúmenes propios de al menos 3 papers fundamentales.",
        metric: "Tienes contribuciones públicas — código, posts, comentarios — que demuestran criterio técnico propio en AI Engineering, no reproducción de tutoriales.",
        resources: [
          { name: "Latent Space Podcast", url: "https://www.latent.space", free: true },
          { name: "Papers With Code", url: "https://paperswithcode.com", free: true },
          { name: "AI Engineer Discord", url: "https://discord.gg/aiengineers", free: true },
          { name: "The AI Engineer Newsletter", url: "https://www.theaiengineer.news", free: true },
        ],
        objectives: [
          {
            topic: "ReAct: Reasoning + Acting (paper 2022)",
            why: "ReAct formalizó el patrón de agentes que razonan en voz alta antes de actuar: el modelo escribe 'Thought: necesito buscar X', luego 'Action: search(X)', luego 'Observation: los resultados son...', y así iterativamente. Este patrón hace al agente más interpretable y más robusto. Es la base conceptual de la mayoría de los frameworks agénticos actuales.",
            resource: { name: "ReAct Paper — arxiv.org", url: "https://arxiv.org/abs/2210.03629", free: true },
            miniDeliverable: "Implementar el patrón ReAct manualmente (sin framework) para una tarea simple. Cada paso del loop debe ser visible: Thought, Action, Observation. Publicar el código con ejemplos de output real.",
          },
          {
            topic: "Chain-of-Thought: por qué 'piensa paso a paso' funciona",
            why: "Wei et al. (2022) descubrieron que agregar 'Let's think step by step' mejora drásticamente la performance en razonamiento. La intuición: el modelo genera tokens de forma autoregresiva — al generar pasos intermedios de razonamiento, se 'da pistas' a sí mismo que mejoran la calidad de la respuesta final. Este paper justifica por qué los prompts con razonamiento estructurado funcionan mejor.",
            resource: { name: "Chain-of-Thought Paper — arxiv.org", url: "https://arxiv.org/abs/2201.11903", free: true },
            miniDeliverable: "Diseñar un experimento: tomar 10 preguntas de razonamiento matemático o lógico y comparar la tasa de éxito con y sin Chain-of-Thought prompting. Publicar los resultados con el dataset y el código.",
          },
          {
            topic: "Constitutional AI: cómo se entrenan modelos seguros",
            why: "Constitutional AI es el método de Anthropic para entrenar modelos útiles, honestos e inofensivos sin depender solo de etiquetado humano. El modelo critica sus propias respuestas contra un conjunto de principios y se autocorrige. Entender este paper da una visión del estado del arte en alignment de LLMs — crucial para cualquier ingeniero que construya productos de IA con responsabilidad.",
            resource: { name: "Constitutional AI Paper — Anthropic (arxiv)", url: "https://arxiv.org/abs/2212.08073", free: true },
            miniDeliverable: "Escribir un resumen de 400 palabras del paper en tus propias palabras: qué problema resuelve, cómo funciona el mecanismo de autocrítica, y qué limitaciones reconocen los autores.",
          },
          {
            topic: "Contribuir a OSS: eval framework, MCP server, o utilidades de agentes",
            why: "Contribuir a proyectos open source en AI engineering tiene retorno excepcional en 2026: el campo es joven, hay pocos expertos, y una contribución significativa puede darte visibilidad internacional. El proceso — escribir tests, documentar la API, responder issues — te hace un ingeniero más riguroso.",
            resource: { name: "GitHub — Finding Good First Issues", url: "https://github.com/explore", free: true },
            miniDeliverable: "Al menos 1 PR mergeado en un proyecto de OSS relacionado con AI Engineering (eval framework, vector DB, agent library, MCP server). Documentar qué problema resuelve la contribución y el link al PR.",
          },
          {
            topic: "Publicar 2 posts técnicos de profundidad en inglés",
            why: "Los posts que documentan decisiones de diseño reales con datos son el contenido más valioso y más escaso en el ecosistema de AI engineering. Un post como 'Por qué migré de RAG naïve a hybrid search y qué gané' con métricas reales puede llegar a miles de ingenieros resolviendo el mismo problema. Es tu contribución intelectual al campo.",
            resource: { name: "Dev.to — Publicar posts técnicos (gratis)", url: "https://dev.to", free: true },
            miniDeliverable: "2 posts publicados en inglés con al menos 800 palabras cada uno, código real, resultados medibles, y al menos 1 diagrama. Compartir en AI Engineer Discord y Latent Space para obtener feedback.",
          },
        ],
      },
    ],
  },

  {
    id: "ingles-tecnico",
    icon: "◇",
    color: "#00C896",
    title: "Inglés Técnico Escrito",
    subtitle: "Tu voz en el mercado global",
    period: "3 meses",
    periodLabel: "La escritura técnica en inglés no es un problema de gramática — es un problema de hábito y confianza. 3 meses de práctica constante eliminan el bloqueo y establecen una rutina. La fluidez real llega con 12–18 meses de escritura pública sostenida.",
    phases: [
      {
        label: "Mes 1",
        title: "Descomponer cómo escriben los mejores",
        deliverable: "1 post técnico publicado en inglés en Dev.to o Hashnode con al menos 500 palabras, sobre un tema técnico que dominas profundamente.",
        metric: "Publicas el post sin postergarlo. La calidad no tiene que ser perfecta — tiene que estar publicado y ser técnicamente preciso.",
        resources: [
          { name: "Cloudflare Blog", url: "https://blog.cloudflare.com", free: true },
          { name: "Google Technical Writing Course", url: "https://developers.google.com/tech-writing", free: true },
          { name: "HemingwayApp", url: "https://hemingwayapp.com", free: true },
          { name: "Grammarly", url: "https://grammarly.com", free: false },
        ],
        objectives: [
          {
            topic: "Anatomía de un post técnico excelente: hook, contexto, desarrollo, takeaways",
            why: "Los mejores posts técnicos no son documentación — son narrativas. Abren con un problema concreto que el lector reconoce. Explican el contexto sin asumir conocimiento previo. Desarrollan la solución con suficiente detalle para ser reproducible. Y cierran con takeaways explícitos. Analizar esta estructura en posts reales te da un template mental que reduce el bloqueo de la página en blanco.",
            resource: { name: "Cloudflare Blog — ejemplos de posts técnicos de alta calidad", url: "https://blog.cloudflare.com", free: true },
            miniDeliverable: "Analizar 3 posts de referencia completando una plantilla: ¿Cuál es el hook de apertura? ¿Cómo introduce el contexto? ¿Qué estructura tiene el desarrollo? ¿Cuáles son los takeaways explícitos? Documentar los patrones comunes.",
          },
          {
            topic: "Cómo explican conceptos complejos los mejores escritores técnicos",
            why: "Un buen escritor técnico contextualiza antes de profundizar, usa analogías para anclar conceptos nuevos, incluye ejemplos de código mínimos y funcionales, y sabe cuándo un diagrama vale más que tres párrafos. Estudiar estos patrones conscientemente — diseccionar posts, no solo leerlos — te da un repertorio de técnicas aplicables desde el primer artículo.",
            resource: { name: "Julia Evans — Blog (jvns.ca) — maestra de explicar lo complejo simplemente", url: "https://jvns.ca", free: true },
            miniDeliverable: "Elegir un concepto técnico que dominas y escribir una explicación de 200 palabras usando al menos 1 analogía y 1 ejemplo concreto. Pedirle a alguien sin contexto técnico que la lea y explique con sus palabras qué entendió.",
          },
          {
            topic: "Escribir tu primer post: 500–800 palabras sobre algo que ya dominas",
            why: "El primer post es el más difícil por razones psicológicas, no técnicas: la 'maldición del conocimiento'. Todo lo que sabes bien te parece obvio, y crees que nadie querrá leerlo. Pero lo que es obvio para ti es valioso para alguien 6 meses atrás en el camino. La restricción de 500–800 palabras te fuerza a elegir un tema específico y desarrollarlo con profundidad.",
            resource: { name: "Hashnode — Blog técnico gratuito con buena distribución", url: "https://hashnode.com", free: true },
            miniDeliverable: "El post publicado. No borrador, no 'casi listo' — publicado y con link. Mínimo 500 palabras. Compartir el link con al menos una persona para obtener feedback real.",
          },
          {
            topic: "Usar un LLM como editor, no como escritor",
            why: "Pedirle a Claude que mejore la claridad de un párrafo es usar la IA como herramienta de edición — legítimo y útil. Pedirle que escriba el post por ti destruye el propósito: no desarrollas tu voz ni internalizas los conceptos. La regla: tú escribes el borrador completo con tus palabras, luego el LLM identifica oraciones confusas, párrafos que asumen demasiado contexto, o transiciones que no fluyen.",
            resource: { name: "Anthropic Claude — Para edición y feedback de estilo (free tier)", url: "https://claude.ai", free: true },
            miniDeliverable: "Tomar el borrador del post antes y después de la edición con LLM. Documentar los 5 cambios más importantes que el LLM sugirió, y cuáles aceptaste o rechazaste con tu justificación.",
          },
        ],
      },
      {
        label: "Mes 2",
        title: "Cadencia, Threads y Comunidad",
        deliverable: "2 posts publicados + al menos 3 threads técnicos en X + participación documentada en 2 discusiones técnicas en inglés (links a los comentarios).",
        metric: "Recibes al menos 1 respuesta o comentario de alguien fuera de LATAM — evidencia de que tu escritura llegó a la audiencia global.",
        resources: [
          { name: "r/ExperiencedDevs (Reddit)", url: "https://www.reddit.com/r/ExperiencedDevs", free: true },
          { name: "Google Technical Writing Two", url: "https://developers.google.com/tech-writing/two", free: true },
          { name: "Write of Passage", url: "https://writeofpassage.com", free: false },
        ],
        objectives: [
          {
            topic: "Publicar con cadencia: 1 post cada 2 semanas sin excepción",
            why: "La cadencia importa más que la calidad en esta etapa. Publicar regularmente entrena la habilidad de terminar — uno de los mayores obstáculos es el perfeccionismo que nunca deja publicar. 'Publicado e imperfecto' es infinitamente más valioso que 'perfecto en tu cabeza'. Los algoritmos de plataformas como Dev.to también favorecen a los creadores consistentes.",
            resource: { name: "Dev.to — Plataforma de publicación con buena comunidad técnica", url: "https://dev.to", free: true },
            miniDeliverable: "2 posts publicados en el mes, con fechas de publicación que demuestren cadencia real (no ambos el mismo día). Documentar el tiempo que tardaste en cada uno para ver si mejoró.",
          },
          {
            topic: "Threads técnicos en X/Twitter: el post comprimido",
            why: "Un thread técnico de 5–8 tweets es un post comprimido a su esencia. La restricción de caracteres te obliga a eliminar todo lo que no es absolutamente necesario — una disciplina de escritura brutal y valiosa. Además, X tiene una audiencia técnica global activa: un thread sobre un problema interesante puede llegar a miles de ingenieros en horas.",
            resource: { name: "X / Twitter — Para construir audiencia técnica global", url: "https://x.com", free: true },
            miniDeliverable: "3 threads técnicos publicados con al menos 5 tweets cada uno. Documentar el engagement: impresiones, respuestas, reposts. Identificar qué tipo de contenido resonó más.",
          },
          {
            topic: "Participar en discusiones técnicas en inglés: GitHub, Discord, Reddit",
            why: "Leer en inglés es pasivo. Escribir en respuesta a otros — en un issue de GitHub, en Reddit r/ExperiencedDevs, en un Discord técnico — es activo y mucho más formativo. Te fuerza a ser preciso, conciso, y a recibir feedback inmediato sobre si te entendieron. Es la forma más rápida de calibrar tu nivel de comunicación técnica.",
            resource: { name: "r/ExperiencedDevs — Comunidad global de senior engineers", url: "https://www.reddit.com/r/ExperiencedDevs/", free: true },
            miniDeliverable: "Links a 2 comentarios en inglés en comunidades técnicas donde hayas contribuido con valor real (no solo 'gracias' o '+1'). Cada comentario con al menos 100 palabras de contenido técnico propio.",
          },
          {
            topic: "Google Technical Writing Course: estructura y claridad como disciplina",
            why: "El Technical Writing Course de Google enseña las reglas que los mejores escritores técnicos siguen inconscientemente: voz activa en lugar de pasiva, palabras cortas a palabras largas, una idea por oración, listas para información paralela. En 2–3 horas te da un checklist concreto para revisar tus borradores y mejorar la claridad de forma sistemática.",
            resource: { name: "Google Technical Writing Course (gratis, ~3 horas)", url: "https://developers.google.com/tech-writing/one", free: true },
            miniDeliverable: "Certificado de completación del curso + lista de las 5 reglas que más impacto tuvieron, con ejemplos de antes y después de aplicarlas en tus propios textos.",
          },
        ],
      },
      {
        label: "Mes 3",
        title: "Portfolio, Presentación y Hábito Permanente",
        deliverable: "Portfolio de 5 posts en inglés + README profesional de un proyecto en GitHub + grabación de presentación técnica de 5–10 minutos publicada.",
        metric: "Escribes un borrador técnico en inglés sin bloqueo en menos de 2 horas. El inglés es una herramienta fluida, no un obstáculo que requiere energía mental extra.",
        resources: [
          { name: "GitHub Pages (portfolio gratis)", url: "https://pages.github.com", free: true },
          { name: "Loom (grabar presentaciones)", url: "https://www.loom.com", free: true },
          { name: "HemingwayApp", url: "https://hemingwayapp.com", free: true },
          { name: "Ship 30 for 30", url: "https://www.ship30for30.com", free: false },
        ],
        objectives: [
          {
            topic: "Documentar un proyecto propio en inglés: README y arquitectura profesional",
            why: "El README de un proyecto es la primera impresión que tiene cualquier ingeniero global de tu trabajo. Un README profesional incluye: qué hace en una oración, por qué existe, cómo instalarlo en 5 minutos, un ejemplo de uso real, y la arquitectura a alto nivel con un diagrama. Es la pieza de escritura técnica más revisada del mundo.",
            resource: { name: "Awesome README — Ejemplos de README excelentes (GitHub)", url: "https://github.com/matiassingers/awesome-readme", free: true },
            miniDeliverable: "README del proyecto con: descripción en 1 oración, problema que resuelve, instalación en 5 pasos, ejemplo de uso con output real, y diagrama de arquitectura con leyenda.",
          },
          {
            topic: "Presentación técnica corta en inglés: 5–10 minutos grabados",
            why: "La presentación oral en inglés es un skill diferente a la escritura — requiere hablar con fluidez bajo presión y manejar el ritmo. Empezar con una grabación de 5–10 minutos sobre un tema que dominas elimina la presión de la audiencia en vivo. Publicarlo en YouTube o Loom te da un artefacto permanente que demuestra capacidad de comunicación técnica en inglés a cualquier equipo internacional.",
            resource: { name: "Loom — Grabar y compartir presentaciones (free tier)", url: "https://www.loom.com", free: true },
            miniDeliverable: "Grabación de 5–10 minutos publicada en YouTube o Loom, con link compartible. Estructura: intro del problema (1 min), demo de la solución (5 min), takeaways (1–2 min).",
          },
          {
            topic: "Establecer el hábito: 30 minutos de escritura técnica en inglés, 3 veces por semana",
            why: "La escritura técnica en inglés no se domina en 3 meses — se establece como hábito en 3 meses. El objetivo no es producir más contenido: es construir la rutina que seguirá funcionando en el Mes 4, el Mes 12 y el Año 3. 30 minutos tres veces por semana es una cantidad pequeña suficiente para no resistirse, y consistente suficiente para generar progreso acumulativo real.",
            resource: { name: "Ali Abdaal — How to Build a Writing Habit (YouTube)", url: "https://www.youtube.com/@aliabdaal", free: true },
            miniDeliverable: "Log de escritura de 4 semanas: fecha, tema trabajado, tiempo invertido. Demostrar al menos 10 sesiones de 30 minutos durante el mes con fechas verificables.",
          },
          {
            topic: "Reflexión de los 3 meses: qué mejoró, qué sigue siendo difícil",
            why: "Articular tu propio progreso — qué te sigue costando, qué ya fluye, qué temas evitas porque se sienten débiles — es un ejercicio metacognitivo que acelera el aprendizaje. Muchos ingenieros trabajan durante años en sus debilidades sin nombrarlas explícitamente. Nombrarlas es el primer paso para atacarlas con intención.",
            resource: { name: "Notion — Para documentar retrospectivas personales (free)", url: "https://www.notion.com", free: true },
            miniDeliverable: "Documento de retrospectiva de 300 palabras: qué mejoró, qué sigue siendo difícil, qué evitas aún, y plan concreto de acción para los próximos 3 meses de escritura en inglés.",
          },
        ],
      },
    ],
  },
  {
    id: "algoritmos",
    icon: "△",
    color: "#FF6B35",
    title: "Algoritmos & DSA",
    subtitle: "Razonar sobre complejidad y resolver problemas con criterio",
    period: "6 meses",
    periodLabel: "El objetivo no es memorizar soluciones — es desarrollar el patrón mental para descomponer problemas nuevos. Los libros que tienes (Skiena + CTCI) son complementarios: Skiena explica el por qué profundo, CTCI provee el contexto de entrevistas, y LeetCode es el gimnasio de práctica diaria.",
    phases: [
      {
        label: "Mes 1–2",
        title: "Complejidad, Estructuras Fundamentales & Strings",
        deliverable: "Repositorio GitHub con 40+ problemas resueltos (LeetCode Easy/Medium) organizados por estructura de datos, con comentarios explicando el razonamiento detrás de cada solución.",
        metric: "Puedes analizar la complejidad temporal y espacial de cualquier solución sin ayuda, y elegir entre array, linked list, stack, queue o hash table justificando el trade-off.",
        resources: [
          { name: "CTCI — Cracking the Coding Interview (cap. 1–4, 7)", owned: true, url: "https://www.crackingthecodinginterview.com" },
          { name: "Algorithm Design Manual — Skiena (cap. 1–3)", owned: true, url: "https://www.algorist.com" },
          { name: "LeetCode — Suscripción activa", owned: true, url: "https://leetcode.com" },
          { name: "NeetCode — Roadmap gratuito (YouTube)", url: "https://www.youtube.com/@NeetCode", free: true },
        ],
        objectives: [
          {
            topic: "Big-O: complejidad temporal y espacial (Skiena cap. 2 + CTCI intro)",
            why: "La complejidad algorítmica es el vocabulario con el que los ingenieros razonan sobre la performance antes de medir. O(n²) vs O(n log n) puede ser la diferencia entre un sistema que funciona y uno que colapsa a escala. El cap. 2 de Skiena explica la notación Big-O con rigor matemático pero sin perder la intuición práctica. El intro de CTCI añade el contexto de cómo se usa en entrevistas: analizar tiempo y espacio de cualquier solución es el primer paso de toda evaluación técnica.",
            resource: { name: "CTCI — Big-O Notation (VI. Big O)", owned: true, url: "https://www.crackingthecodinginterview.com" },
            miniDeliverable: "Analizar la complejidad temporal y espacial de 10 funciones distintas (con loops anidados, recursión, operaciones de hash). Documentar cada análisis con la justificación paso a paso, no solo el resultado final.",
            leetcodeProblems: [
              { num: 217, name: "Contains Duplicate", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
              { num: 242, name: "Valid Anagram", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
              { num: 169, name: "Majority Element", difficulty: "Easy", url: "https://leetcode.com/problems/majority-element/" },
              { num: 268, name: "Missing Number", difficulty: "Easy", url: "https://leetcode.com/problems/missing-number/" },
            ],
          },
          {
            topic: "Arrays y Strings — el pan de cada día (CTCI cap. 1)",
            why: "El cap. 1 de CTCI cubre los problemas de arrays y strings que aparecen en casi toda entrevista técnica: is unique, check permutation, URLify, palindrome permutation, one away, string compression, rotate matrix, zero matrix, string rotation. Son problemas aparentemente simples que esconden trade-offs importantes entre tiempo y espacio. Dominarlos en código limpio y con análisis de complejidad correcto es el baseline de cualquier entrevista.",
            resource: { name: "CTCI — Chapter 1: Arrays and Strings", owned: true, url: "https://www.crackingthecodinginterview.com" },
            miniDeliverable: "Resolver todos los ejercicios del cap. 1 de CTCI en LeetCode o como scripts independientes. Para cada uno: solución bruta O(n²), solución optimizada con hash table O(n), y análisis de complejidad explícito.",
            leetcodeProblems: [
              { num: 125, name: "Valid Palindrome", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
              { num: 344, name: "Reverse String", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-string/" },
              { num: 443, name: "String Compression", difficulty: "Medium", url: "https://leetcode.com/problems/string-compression/" },
              { num: 48,  name: "Rotate Image", difficulty: "Medium", url: "https://leetcode.com/problems/rotate-image/" },
              { num: 73,  name: "Set Matrix Zeroes", difficulty: "Medium", url: "https://leetcode.com/problems/set-matrix-zeroes/" },
              { num: 238, name: "Product of Array Except Self", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
            ],
          },
          {
            topic: "Linked Lists: operaciones, punteros y problemas clásicos (CTCI cap. 2)",
            why: "Las linked lists son la estructura de datos que más revelan si un candidato realmente entiende los punteros. El cap. 2 de CTCI cubre: remove duplicates, return kth to last, delete middle node, partition, sum lists, palindrome, intersection, loop detection. Estos problemas requieren manipular punteros con precisión y visualizar la estructura en tu cabeza — una habilidad que también se transfiere a árboles, grafos y cualquier estructura con referencias.",
            resource: { name: "CTCI — Chapter 2: Linked Lists", owned: true, url: "https://www.crackingthecodinginterview.com" },
            miniDeliverable: "Implementar una linked list doblemente enlazada desde cero con todas sus operaciones (insert, delete, find, reverse). Resolver los ejercicios del cap. 2 y documentar en cuáles usaste el patrón de dos punteros (slow/fast pointer).",
            leetcodeProblems: [
              { num: 206, name: "Reverse Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
              { num: 141, name: "Linked List Cycle", difficulty: "Easy", url: "https://leetcode.com/problems/linked-list-cycle/" },
              { num: 876, name: "Middle of Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/middle-of-the-linked-list/" },
              { num: 19,  name: "Remove Nth Node From End", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
              { num: 2,   name: "Add Two Numbers", difficulty: "Medium", url: "https://leetcode.com/problems/add-two-numbers/" },
              { num: 143, name: "Reorder List", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
              { num: 146, name: "LRU Cache", difficulty: "Medium", url: "https://leetcode.com/problems/lru-cache/" },
            ],
          },
          {
            topic: "Stacks y Queues: cuándo y por qué (CTCI cap. 3)",
            why: "Stack y Queue son simples en concepto pero críticos en la práctica: el stack es la estructura detrás de DFS, la evaluación de expresiones, el call stack del lenguaje, y el undo/redo. La queue es la base de BFS, los sistemas de mensajería, y el procesamiento de trabajos. El cap. 3 de CTCI enseña cómo implementarlos desde cero y problemas clásicos como 'three in one' (3 stacks en un array), queue via stacks, y sort stack.",
            resource: { name: "CTCI — Chapter 3: Stacks and Queues", owned: true, url: "https://www.crackingthecodinginterview.com" },
            miniDeliverable: "Implementar un stack con getMin() en O(1) y una queue usando dos stacks, ambos desde cero. Resolver los 6 ejercicios del cap. 3 y documentar en cuáles la elección de estructura de datos fue la clave de la solución.",
            leetcodeProblems: [
              { num: 20,  name: "Valid Parentheses", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
              { num: 232, name: "Implement Queue using Stacks", difficulty: "Easy", url: "https://leetcode.com/problems/implement-queue-using-stacks/" },
              { num: 155, name: "Min Stack", difficulty: "Medium", url: "https://leetcode.com/problems/min-stack/" },
              { num: 150, name: "Evaluate Reverse Polish Notation", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
              { num: 22,  name: "Generate Parentheses", difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/" },
              { num: 739, name: "Daily Temperatures", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
            ],
          },
          {
            topic: "Hash Tables: implementación y aplicaciones (CTCI + LeetCode)",
            why: "El hash table es la estructura de datos más versátil y más subutilizada por ingenieros sin base sólida. Convierte operaciones O(n) en O(1): búsqueda de duplicados, frecuencia de elementos, two-sum, grouping. El peligro es no entender las colisiones y los casos donde la complejidad O(1) amortizada se convierte en O(n) en el peor caso. Entender la implementación interna te permite diseñar mejor y evitar sorpresas de performance en producción.",
            resource: { name: "Skiena — Cap. 3.7: Hashing (Algorithm Design Manual)", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Implementar un hash table con separate chaining desde cero en el lenguaje de tu preferencia. Demostrar que funciona con colisiones. Luego resolver los problemas de LeetCode: Two Sum (1), Group Anagrams (49), Top K Frequent Elements (347).",
            leetcodeProblems: [
              { num: 1,   name: "Two Sum", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
              { num: 49,  name: "Group Anagrams", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
              { num: 347, name: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
              { num: 36,  name: "Valid Sudoku", difficulty: "Medium", url: "https://leetcode.com/problems/valid-sudoku/" },
              { num: 128, name: "Longest Consecutive Sequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
            ],
          },
          {
            topic: "Two Pointers y Sliding Window: patrones fundamentales (LeetCode)",
            why: "Two Pointers y Sliding Window son los primeros 'patrones' de resolución de problemas que transforman soluciones O(n²) en O(n). Two Pointers es el patrón detrás de problemas de arrays ordenados: valid palindrome, container with most water, 3Sum. Sliding Window es el patrón para problemas de subarrays o substrings: longest substring without repeating characters, minimum window substring, maximum sliding window. Reconocer estos patrones es una habilidad que se construye con práctica sistemática.",
            resource: { name: "NeetCode — Two Pointers Pattern (YouTube)", url: "https://www.youtube.com/watch?v=jJ4awOToB6k", free: true },
            miniDeliverable: "Resolver en LeetCode: Valid Palindrome (125), 3Sum (15), Container With Most Water (11), Longest Substring Without Repeating Characters (3), Minimum Window Substring (76). Para cada uno, documentar por qué el patrón aplica.",
            leetcodeProblems: [
              { num: 125, name: "Valid Palindrome", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
              { num: 167, name: "Two Sum II", difficulty: "Medium", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
              { num: 15,  name: "3Sum", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
              { num: 11,  name: "Container With Most Water", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
              { num: 3,   name: "Longest Substring Without Repeating Characters", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
              { num: 424, name: "Longest Repeating Character Replacement", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
              { num: 76,  name: "Minimum Window Substring", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
              { num: 239, name: "Sliding Window Maximum", difficulty: "Hard", url: "https://leetcode.com/problems/sliding-window-maximum/" },
            ],
          },
        ],
      },
      {
        label: "Mes 3–4",
        title: "Árboles, Grafos & Algoritmos de Búsqueda",
        deliverable: "40+ problemas adicionales resueltos (LeetCode Medium/Hard) con énfasis en trees y graphs. Post técnico explicando BFS vs DFS y cuándo usar cada uno.",
        metric: "Dado un problema nuevo de árboles o grafos, puedes identificar en 2 minutos si la solución es BFS, DFS, o un algoritmo de shortest path, y justificarlo.",
        resources: [
          { name: "CTCI — Cap. 4 (Trees & Graphs)", owned: true, url: "https://www.crackingthecodinginterview.com" },
          { name: "Skiena — Cap. 5–7 (Graph Theory)", owned: true, url: "https://www.algorist.com" },
          { name: "LeetCode — Suscripción activa", owned: true, url: "https://leetcode.com" },
          { name: "Visualgo — Visualizaciones interactivas de algoritmos", url: "https://visualgo.net", free: true },
        ],
        objectives: [
          {
            topic: "Árboles binarios: traversal, BST y operaciones (CTCI cap. 4 + Skiena cap. 3)",
            why: "Los árboles binarios son la estructura de datos más frecuente en entrevistas técnicas de nivel senior. El cap. 4 de CTCI cubre: route between nodes, minimal tree, list of depths, check balanced, validate BST, successor, build order, first common ancestor, BST sequences. Skiena complementa con el análisis teórico de por qué los BSTs balanced tienen O(log n) garantizado y cuándo degeneran a O(n). Los traversals (inorder, preorder, postorder) no son solo ejercicios académicos — son la base del 80% de los problemas de árboles.",
            resource: { name: "CTCI — Chapter 4: Trees and Graphs", owned: true, url: "https://www.crackingthecodinginterview.com" },
            miniDeliverable: "Implementar un BST desde cero con insert, search, delete, y los 3 traversals iterativos (sin recursión usando un stack explícito). Resolver en LeetCode: Maximum Depth of Binary Tree (104), Invert Binary Tree (226), Lowest Common Ancestor (235), Validate BST (98).",
            leetcodeProblems: [
              { num: 226, name: "Invert Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
              { num: 104, name: "Maximum Depth of Binary Tree", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
              { num: 100, name: "Same Tree", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
              { num: 572, name: "Subtree of Another Tree", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
              { num: 235, name: "Lowest Common Ancestor of BST", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
              { num: 102, name: "Binary Tree Level Order Traversal", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
              { num: 98,  name: "Validate Binary Search Tree", difficulty: "Medium", url: "https://leetcode.com/problems/validate-binary-search-tree/" },
              { num: 230, name: "Kth Smallest Element in BST", difficulty: "Medium", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
              { num: 124, name: "Binary Tree Maximum Path Sum", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
            ],
          },
          {
            topic: "DFS y BFS: cuándo y cómo usar cada uno (CTCI cap. 4 + Skiena cap. 5)",
            why: "DFS y BFS son los dos algoritmos de traversal de grafos más importantes. DFS usa un stack (o recursión) y es ideal para: detectar ciclos, encontrar componentes conectados, generar permutaciones/combinaciones, pathfinding en laberintos. BFS usa una queue y es ideal para: shortest path en grafos no ponderados, encontrar el nivel de un nodo, problemas que piden 'el mínimo número de pasos'. El error más común es usar DFS cuando BFS es correcto — BFS garantiza shortest path, DFS no.",
            resource: { name: "Skiena — Cap. 5: Graph Traversal (BFS, DFS)", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Resolver en LeetCode: Number of Islands (200) con DFS, Rotting Oranges (994) con BFS, Word Ladder (127) con BFS, Course Schedule (207) con DFS para cycle detection. Para cada uno, documentar por qué elegiste DFS o BFS y qué haría incorrecto el otro.",
            leetcodeProblems: [
              { num: 200, name: "Number of Islands", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
              { num: 133, name: "Clone Graph", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
              { num: 207, name: "Course Schedule", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule/" },
              { num: 417, name: "Pacific Atlantic Water Flow", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
              { num: 994, name: "Rotting Oranges", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
              { num: 210, name: "Course Schedule II", difficulty: "Medium", url: "https://leetcode.com/problems/course-schedule-ii/" },
              { num: 127, name: "Word Ladder", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
            ],
          },
          {
            topic: "Shortest Path: Dijkstra, Bellman-Ford y BFS (Skiena cap. 6)",
            why: "El cap. 6 de Skiena cubre los algoritmos de shortest path con una claridad inigualable. Dijkstra: funciona en grafos con pesos positivos, O((V+E) log V) con heap. Bellman-Ford: funciona con pesos negativos y detecta ciclos negativos, O(VE). BFS: shortest path en grafos no ponderados, O(V+E). Saber cuándo usar cada uno evita uno de los errores más comunes: usar Dijkstra en un grafo con pesos negativos o BFS en un grafo ponderado.",
            resource: { name: "Skiena — Cap. 6: Weighted Graph Algorithms", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Implementar Dijkstra desde cero usando un min-heap. Luego resolver en LeetCode: Network Delay Time (743) con Dijkstra, Cheapest Flights Within K Stops (787) con Bellman-Ford modificado. Documentar la diferencia de complejidad.",
            leetcodeProblems: [
              { num: 743,  name: "Network Delay Time", difficulty: "Medium", url: "https://leetcode.com/problems/network-delay-time/" },
              { num: 1631, name: "Path With Min Effort", difficulty: "Medium", url: "https://leetcode.com/problems/path-with-minimum-effort/" },
              { num: 1334, name: "Find City With Smallest Neighbors", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/" },
              { num: 787,  name: "Cheapest Flights Within K Stops", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
              { num: 778,  name: "Swim in Rising Water", difficulty: "Hard", url: "https://leetcode.com/problems/swim-in-rising-water/" },
            ],
          },
          {
            topic: "Heaps y Priority Queues: aplicaciones prácticas (Skiena cap. 4 + LeetCode)",
            why: "El heap es la estructura de datos detrás del priority queue — fundamental para Dijkstra, scheduling, top-K elements, y merge sorted arrays. Skiena dedica el cap. 4 a sorting y heaps, explicando heap sort y por qué el heap garantiza insert y extract-min en O(log n). Los problemas de 'top K' y 'K closest elements' son una familia entera de problemas de LeetCode que se vuelven triviales una vez que dominas el heap.",
            resource: { name: "Skiena — Cap. 4: Heapsort (Algorithm Design Manual)", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Implementar un min-heap desde cero (sin usar la librería del lenguaje). Luego resolver en LeetCode: Kth Largest Element in Array (215), Top K Frequent Elements (347), Find Median from Data Stream (295). Documentar cómo el heap reduce la complejidad de cada problema.",
            leetcodeProblems: [
              { num: 215, name: "Kth Largest Element in Array", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
              { num: 347, name: "Top K Frequent Elements", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
              { num: 973, name: "K Closest Points to Origin", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
              { num: 1046, name: "Last Stone Weight", difficulty: "Easy", url: "https://leetcode.com/problems/last-stone-weight/" },
              { num: 23,  name: "Merge K Sorted Lists", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
              { num: 295, name: "Find Median from Data Stream", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
            ],
          },
          {
            topic: "Backtracking: generar todas las soluciones posibles (CTCI + LeetCode)",
            why: "Backtracking es el patrón para problemas donde necesitas explorar todas las combinaciones posibles y elegir las que satisfacen ciertos criterios. Es DFS con una condición de poda (pruning) que evita explorar caminos que no pueden llegar a una solución válida. Los problemas de backtracking son reconocibles: permutations, combinations, subsets, N-Queens, Sudoku solver, word search. Sin backtracking, estos problemas parecen imposibles. Con él, siguen una estructura casi idéntica.",
            resource: { name: "NeetCode — Backtracking Playlist (YouTube)", url: "https://www.youtube.com/watch?v=pfiQ_PS1g8E", free: true },
            miniDeliverable: "Resolver en LeetCode usando el template de backtracking: Subsets (78), Permutations (46), Combination Sum (39), N-Queens (51). Para cada uno, dibujar el árbol de decisiones que el algoritmo recorre e identificar en qué puntos se hace pruning.",
            leetcodeProblems: [
              { num: 78,  name: "Subsets", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
              { num: 46,  name: "Permutations", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
              { num: 39,  name: "Combination Sum", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
              { num: 90,  name: "Subsets II", difficulty: "Medium", url: "https://leetcode.com/problems/subsets-ii/" },
              { num: 79,  name: "Word Search", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
              { num: 40,  name: "Combination Sum II", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-ii/" },
              { num: 51,  name: "N-Queens", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/" },
              { num: 37,  name: "Sudoku Solver", difficulty: "Hard", url: "https://leetcode.com/problems/sudoku-solver/" },
            ],
          },
          {
            topic: "Sorting algorithms: merge sort, quick sort y sus trade-offs (Skiena cap. 4)",
            why: "El cap. 4 de Skiena analiza los algoritmos de sorting no como recetas a memorizar sino como decisiones de diseño: merge sort es estable y O(n log n) garantizado pero requiere O(n) de memoria extra. Quick sort es O(n log n) promedio pero O(n²) en el peor caso, y opera in-place. Skiena también explica por qué no puedes ordenar más rápido que O(n log n) con comparaciones — el lower bound de comparison-based sorting — lo que cambia cómo piensas en la posibilidad de optimizar un algoritmo.",
            resource: { name: "Skiena — Cap. 4: Sorting and Searching", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Implementar merge sort y quick sort desde cero. Medir el tiempo de ejecución en arrays de 1K, 10K, y 100K elementos. Generar un reporte con los resultados y explicar por qué quick sort suele ganar en la práctica aunque su peor caso sea O(n²).",
            leetcodeProblems: [
              { num: 75,  name: "Sort Colors", difficulty: "Medium", url: "https://leetcode.com/problems/sort-colors/" },
              { num: 56,  name: "Merge Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
              { num: 148, name: "Sort List", difficulty: "Medium", url: "https://leetcode.com/problems/sort-list/" },
              { num: 215, name: "Kth Largest Element in Array", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
              { num: 179, name: "Largest Number", difficulty: "Medium", url: "https://leetcode.com/problems/largest-number/" },
            ],
          },
        ],
      },
      {
        label: "Mes 5–6",
        title: "Dynamic Programming, Patrones Avanzados & Interview Prep",
        deliverable: "20+ problemas de DP resueltos con análisis de subproblemas documentado + simulación de 4 entrevistas técnicas completas (45 min) con peer review.",
        metric: "Dado un problema de DP nuevo, puedes identificar los subproblemas, formular la recurrencia, y elegir entre top-down (memoization) o bottom-up (tabulation) justificando la elección.",
        resources: [
          { name: "CTCI — Cap. 8: Recursion and DP", owned: true, url: "https://www.crackingthecodinginterview.com" },
          { name: "Skiena — Cap. 8: Dynamic Programming", owned: true, url: "https://www.algorist.com" },
          { name: "LeetCode — Suscripción activa", owned: true, url: "https://leetcode.com" },
          { name: "NeetCode 150 — Curated problem list", url: "https://neetcode.io/practice", free: true },
        ],
        objectives: [
          {
            topic: "Dynamic Programming: la mentalidad de subproblemas (Skiena cap. 8 + CTCI cap. 8)",
            why: "DP es el tema que más diferencia a los ingenieros senior de los mid-level en entrevistas. El cap. 8 de Skiena explica DP como 'recursión más memoization' y te enseña a identificar la estructura de subproblemas que se solapan — la condición que hace que DP sea aplicable. CTCI cap. 8 añade el contexto práctico con problemas clásicos: triple step, robot in a grid, magic index, power set, recursive multiply, towers of hanoi. La clave no es memorizar soluciones — es reconocer la estructura recursiva del problema.",
            resource: { name: "Skiena — Cap. 8: Dynamic Programming", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Resolver Fibonacci con 3 aproximaciones: recursión pura (exponencial), top-down con memoization (O(n)), y bottom-up con tabulation (O(n) tiempo, O(1) espacio). Documentar cómo cada optimización transforma la complejidad y aplicar el mismo análisis a Climbing Stairs (LeetCode 70).",
            leetcodeProblems: [
              { num: 70,  name: "Climbing Stairs", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
              { num: 746, name: "Min Cost Climbing Stairs", difficulty: "Easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
              { num: 198, name: "House Robber", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber/" },
              { num: 213, name: "House Robber II", difficulty: "Medium", url: "https://leetcode.com/problems/house-robber-ii/" },
              { num: 62,  name: "Unique Paths", difficulty: "Medium", url: "https://leetcode.com/problems/unique-paths/" },
              { num: 91,  name: "Decode Ways", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/" },
            ],
          },
          {
            topic: "DP en secuencias: longest common subsequence, edit distance (Skiena cap. 8)",
            why: "Los problemas de DP en secuencias son una familia entera con aplicaciones reales: git diff usa edit distance, los comparadores de DNA usan longest common subsequence, los autocorrectores usan variantes de estas mismas ideas. El cap. 8 de Skiena los trata con una profundidad excepcional — no solo la solución sino el proceso de encontrar la recurrencia correcta y visualizar la tabla de DP. Este proceso de visualización es el que se transfiere a problemas nuevos.",
            resource: { name: "LeetCode — Longest Common Subsequence (1143)", url: "https://leetcode.com/problems/longest-common-subsequence/", free: true },
            miniDeliverable: "Resolver en LeetCode con tablas de DP dibujadas a mano (o en Excalidraw): Longest Common Subsequence (1143), Edit Distance (72), Longest Increasing Subsequence (300). Para cada uno, mostrar la tabla completa y la ecuación de recurrencia.",
            leetcodeProblems: [
              { num: 1143, name: "Longest Common Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
              { num: 300,  name: "Longest Increasing Subsequence", difficulty: "Medium", url: "https://leetcode.com/problems/longest-increasing-subsequence/" },
              { num: 1035, name: "Uncrossed Lines", difficulty: "Medium", url: "https://leetcode.com/problems/uncrossed-lines/" },
              { num: 72,   name: "Edit Distance", difficulty: "Hard", url: "https://leetcode.com/problems/edit-distance/" },
              { num: 115,  name: "Distinct Subsequences", difficulty: "Hard", url: "https://leetcode.com/problems/distinct-subsequences/" },
            ],
          },
          {
            topic: "DP en knapsack y variantes: 0/1 knapsack, coin change (LeetCode + Skiena)",
            why: "El problema del knapsack (0/1) es el arquetipo de los problemas de DP con decisiones binarias: incluir o no un elemento. Coin change es su variante con repetición ilimitada. Estas dos formulaciones cubren una familia enorme de problemas: partition equal subset sum, target sum, last stone weight II. Reconocer el patrón del knapsack en un problema disfrazado es la habilidad que estás construyendo.",
            resource: { name: "NeetCode — 0/1 Knapsack Explained (YouTube)", url: "https://www.youtube.com/watch?v=nLmhmB6NzcM", free: true },
            miniDeliverable: "Resolver en LeetCode: Coin Change (322), Coin Change II (518), Partition Equal Subset Sum (416), Target Sum (494). Para cada uno, implementar tanto top-down con memo como bottom-up con tabla y documentar cuál tiene mejor performance en la práctica.",
            leetcodeProblems: [
              { num: 322,  name: "Coin Change", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
              { num: 518,  name: "Coin Change II", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change-ii/" },
              { num: 416,  name: "Partition Equal Subset Sum", difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
              { num: 494,  name: "Target Sum", difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/" },
              { num: 1049, name: "Last Stone Weight II", difficulty: "Medium", url: "https://leetcode.com/problems/last-stone-weight-ii/" },
              { num: 474,  name: "Ones and Zeroes", difficulty: "Medium", url: "https://leetcode.com/problems/ones-and-zeroes/" },
            ],
          },
          {
            topic: "Interval problems y Greedy algorithms (Skiena cap. 8 + LeetCode)",
            why: "Los algoritmos greedy toman la decisión localmente óptima en cada paso esperando que lleve a la solución globalmente óptima. Funcionan para una clase específica de problemas — y la habilidad está en reconocer cuándo la greedy choice property se cumple. Los problemas de intervals son una subcategoría frecuente: meeting rooms, merge intervals, non-overlapping intervals. Skiena explica formalmente cuándo y por qué funciona un greedy — conocimiento que evita aplicarlo en problemas donde no es correcto.",
            resource: { name: "Skiena — Cap. 8.7: Greedy Algorithms", owned: true, url: "https://www.algorist.com" },
            miniDeliverable: "Resolver en LeetCode: Merge Intervals (56), Non-overlapping Intervals (435), Jump Game (55), Jump Game II (45). Para cada uno, demostrar por qué el greedy es correcto — no solo que funciona, sino por qué no puede haber una solución mejor.",
            leetcodeProblems: [
              { num: 55,  name: "Jump Game", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game/" },
              { num: 45,  name: "Jump Game II", difficulty: "Medium", url: "https://leetcode.com/problems/jump-game-ii/" },
              { num: 56,  name: "Merge Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
              { num: 435, name: "Non-overlapping Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
              { num: 134, name: "Gas Station", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },
              { num: 846, name: "Hand of Straights", difficulty: "Medium", url: "https://leetcode.com/problems/hand-of-straights/" },
              { num: 84,  name: "Largest Rectangle in Histogram", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
            ],
          },
          {
            topic: "Binary Search: más allá del caso simple (LeetCode + CTCI)",
            why: "Binary search parece simple pero esconde una complejidad de implementación que sorprende a ingenieros experimentados: la condición de parada correcta, qué hacer con el mid, cómo evitar overflow en el cálculo del mid. Más importante: binary search no es solo para buscar en un array ordenado — es un patrón para cualquier problema donde el espacio de búsqueda tiene una propiedad monotónica. Search in rotated sorted array, find peak element, y search a 2D matrix son variantes que requieren reconocer esa propiedad.",
            resource: { name: "LeetCode — Binary Search Explore Card", url: "https://leetcode.com/explore/learn/card/binary-search/", free: true },
            miniDeliverable: "Implementar binary search con las 3 variantes de condición de parada (left < right, left <= right, left + 1 < right) y documentar cuándo usar cada una. Resolver: Search in Rotated Sorted Array (33), Find Minimum in Rotated Sorted Array (153), Find Peak Element (162).",
            leetcodeProblems: [
              { num: 704,  name: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
              { num: 74,   name: "Search a 2D Matrix", difficulty: "Medium", url: "https://leetcode.com/problems/search-a-2d-matrix/" },
              { num: 33,   name: "Search in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
              { num: 153,  name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
              { num: 162,  name: "Find Peak Element", difficulty: "Medium", url: "https://leetcode.com/problems/find-peak-element/" },
              { num: 875,  name: "Koko Eating Bananas", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
              { num: 4,    name: "Median of Two Sorted Arrays", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
            ],
          },
          {
            topic: "Interview simulation: 4 entrevistas técnicas completas de 45 minutos",
            why: "El conocimiento técnico y el desempeño en una entrevista son habilidades diferentes. Una entrevista técnica tiene una estructura: clarificar el problema (5 min), proponer un enfoque (5 min), codificar (20 min), testear y optimizar (10 min), discutir trade-offs (5 min). Practicar este formato con tiempo real y un peer que observe y da feedback — no solo resolver el problema solo — es lo que calibra tu desempeño real bajo presión.",
            resource: { name: "Pramp — Free technical interview practice", url: "https://www.pramp.com", free: true },
            miniDeliverable: "4 simulaciones de entrevista técnica de 45 min grabadas o con peer. Para cada una: documentar el problema, la solución propuesta, el feedback recibido, y el plan de mejora específico para la siguiente.",
          },
        ],
      },
    ],
  },

];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );
  useState(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  });
  return isMobile;
};

const getBadge = (resource) => {
  if (resource.owned) return { label: "OWNED", bg: "rgba(120,180,255,0.15)", color: "#78b4ff" };
  if (resource.free)  return { label: "FREE",  bg: "rgba(0,200,150,0.15)",  color: "#00c896" };
  return                     { label: "PAID",  bg: "rgba(255,180,0,0.15)",  color: "#ffb800" };
};

const ResourceChip = ({ resource, color }) => {
  const badge = getBadge(resource);
  const bg = resource.owned ? "rgba(120,180,255,0.07)" : resource.free ? "rgba(255,255,255,0.05)" : color + "14";
  const border = resource.owned ? "1px solid rgba(120,180,255,0.25)" : resource.free ? "1px solid rgba(255,255,255,0.1)" : `1px solid ${color}33`;
  const textColor = resource.owned ? "#78b4ff" : resource.free ? "#a0b0c0" : color;
  return (
    <a href={resource.url} target="_blank" rel="noopener noreferrer"
      style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "4px 10px", background: bg, border, borderRadius: "6px", fontSize: "11.5px", color: textColor, textDecoration: "none", cursor: "pointer", whiteSpace: "nowrap" }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.8"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >
      {resource.owned
        ? <BookMarked size={10} style={{ opacity: 0.7, flexShrink: 0 }} />
        : <ExternalLink size={10} style={{ opacity: 0.6, flexShrink: 0 }} />
      }
      {resource.name}
      <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: badge.bg, color: badge.color, fontWeight: 700 }}>{badge.label}</span>
    </a>
  );
};

// ─── Calendar Data ────────────────────────────────────────────────────────────
const AREA_META = {
  "system-design":  { color: "#00D4FF", label: "System Design",  IconC: Layers },
  "observabilidad": { color: "#FFB800", label: "Observabilidad", IconC: Activity },
  "ai-engineering": { color: "#7C3AED", label: "AI Engineering", IconC: Cpu },
  "algoritmos":     { color: "#FF6B35", label: "DSA / LeetCode", IconC: Code2 },
  "ingles-tecnico": { color: "#00C896", label: "Inglés Técnico", IconC: Globe },
};

const calendarWeek = [
  {
    day: "Lunes", shortDay: "Lun", totalMin: 90,
    focus: "System Design + DSA",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema del tema actual. Sin ver solución hasta intentarlo 20 min.", duration: 30 },
      { area: "system-design", label: "Lectura activa de DDIA o SDI: subraya, toma notas en tu propio lenguaje. Al terminar, dibuja el concepto en Excalidraw.", duration: 60 },
    ],
  },
  {
    day: "Martes", shortDay: "Mar", totalMin: 90,
    focus: "AI Engineering + DSA",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema del tema actual. Si no lo resuelves en 25 min, estudia la solución y resuélvelo desde cero al día siguiente.", duration: 30 },
      { area: "ai-engineering", label: "Avanzar en Fast.ai, Hugging Face Course, o construir en el proyecto agéntico / RAG actual.", duration: 60 },
    ],
  },
  {
    day: "Miércoles", shortDay: "Mié", totalMin: 90,
    focus: "Observabilidad + Inglés",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Priorizar el patrón más débil de la semana.", duration: 30 },
      { area: "observabilidad", label: "Instrumentar, ajustar dashboards, o estudiar el SRE Book. Siempre con el sistema de práctica abierto.", duration: 45 },
      { area: "ingles-tecnico", label: "Escribir un thread técnico en X (5 tweets) o el primer borrador de un párrafo del post en progreso.", duration: 15 },
    ],
  },
  {
    day: "Jueves", shortDay: "Jue", totalMin: 90,
    focus: "System Design + AI",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Documentar el patrón usado en tu repositorio de soluciones.", duration: 30 },
      { area: "system-design", label: "Resolver un system design challenge completo en Excalidraw: back-of-envelope, componentes, trade-offs.", duration: 45 },
      { area: "ai-engineering", label: "Leer 1 post de Latent Space, Anthropic o AI Engineer community. Escribir 3 bullet points de lo aprendido.", duration: 15 },
    ],
  },
  {
    day: "Viernes", shortDay: "Vie", totalMin: 90,
    focus: "Observabilidad + Inglés",
    blocks: [
      { area: "algoritmos",    label: "LeetCode — 1 problema. Si ya terminaste los del tema actual, avanza al siguiente.", duration: 30 },
      { area: "observabilidad", label: "Revisar alertas, ajustar SLIs, o escribir/actualizar el runbook de la semana.", duration: 30 },
      { area: "ingles-tecnico", label: "Editar o continuar el post técnico en inglés. Meta: publicar 1 post cada 2 semanas.", duration: 30 },
    ],
  },
  {
    day: "Sábado", shortDay: "Sáb", totalMin: 120,
    focus: "DSA intensivo + AI proyecto",
    blocks: [
      { area: "algoritmos",    label: "Sesión intensiva: 2 problemas LeetCode + revisar todas las soluciones de la semana. Identificar el patrón que más cuesta.", duration: 60 },
      { area: "ai-engineering", label: "Sesión hands-on larga: construir, iterar y evaluar el proyecto agéntico o RAG actual. Sin saltar entre temas.", duration: 60 },
    ],
  },
  {
    day: "Domingo", shortDay: "Dom", totalMin: 60,
    focus: "Review + Inglés",
    blocks: [
      { area: "ingles-tecnico", label: "Leer 2 posts técnicos en inglés de referentes. Analizar su estructura y tomar notas del estilo.", duration: 30 },
      { area: "system-design", label: "Revisión semanal: actualizar ADRs, notas de system design, o agenda del roadmap de la semana siguiente.", duration: 30 },
    ],
  },
];

// ─── Tracker Page ─────────────────────────────────────────────────────────────

const TrackerPage = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState("weekly"); // "weekly" | "total"
  const [weekChecked, setWeekChecked] = useState({});
  const [phaseChecked, setPhaseChecked] = useState({});
  const px = isMobile ? "16px" : "40px";

  // ── Weekly helpers ──
  const toggleWeek = (key) => setWeekChecked(p => ({ ...p, [key]: !p[key] }));
  const [activeDay, setActiveDay] = useState(null);
  const totalWeekBlocks = calendarWeek.reduce((s, d) => s + d.blocks.length, 0);
  const weekDone = Object.values(weekChecked).filter(Boolean).length;
  const weekPct = Math.round((weekDone / totalWeekBlocks) * 100);
  const totalWeekMin = calendarWeek.reduce((s, d) => s + d.totalMin, 0);
  const hoursPerArea = {};
  calendarWeek.forEach(d => d.blocks.forEach(b => { hoursPerArea[b.area] = (hoursPerArea[b.area] || 0) + b.duration; }));

  // ── Total helpers ──
  const togglePhase = (key) => setPhaseChecked(p => ({ ...p, [key]: !p[key] }));
  const allPhases = roadmapData.flatMap(area => area.phases.map((ph, pi) => ({ areaId: area.id, phaseIdx: pi, key: `${area.id}-${pi}` })));
  const totalPhases = allPhases.length;
  const totalDonePhases = allPhases.filter(p => phaseChecked[p.key]).length;
  const totalPct = Math.round((totalDonePhases / totalPhases) * 100);

  const subBtnStyle = (active) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: isMobile ? "7px 14px" : "8px 20px",
    background: active ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(167,139,250,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "8px", color: active ? "#a78bfa" : "#5a6880",
    fontSize: isMobile ? "12px" : "13px", fontWeight: active ? 700 : 400,
    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "all 0.2s", whiteSpace: "nowrap",
  });

  return (
    <div style={{ minHeight: "60vh", padding: isMobile ? "24px 16px 60px" : "36px 40px 60px", maxWidth: "960px" }}>

      {/* ── Tracker header ── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <BarChart2 size={22} style={{ color: "#a78bfa" }} />
              <h2 style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#e0e6f0" }}>Progress Tracker</h2>
            </div>
            <p style={{ color: "#5a6880", fontSize: "13px", marginLeft: "30px" }}>Seguimiento semanal y total del roadmap</p>
          </div>
          {/* Sub-view switcher */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={subBtnStyle(view === "weekly")} onClick={() => setView("weekly")}>
              <CalendarDays size={13} /> Esta semana
            </button>
            <button style={subBtnStyle(view === "total")} onClick={() => setView("total")}>
              <Map size={13} /> Total roadmap
            </button>
          </div>
        </div>

        {/* Master progress bar — always visible */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#7a8898", fontSize: "12px", display:"flex", alignItems:"center", gap:"5px" }}><CalendarDays size={12}/> Esta semana</span>
              <span style={{ color: "#e0e6f0", fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{weekDone}/{totalWeekBlocks} · {weekPct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${weekPct}%`, background: "linear-gradient(90deg,#7C3AED,#00D4FF)", borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "#7a8898", fontSize: "12px", display:"flex", alignItems:"center", gap:"5px" }}><Map size={12}/> Total roadmap</span>
              <span style={{ color: "#e0e6f0", fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{totalDonePhases}/{totalPhases} fases · {totalPct}%</span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${totalPct}%`, background: "linear-gradient(90deg,#FF6B35,#FFB800)", borderRadius: "3px", transition: "width 0.4s" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          VIEW: ESTA SEMANA
      ══════════════════════════════════════════════════════════ */}
      {view === "weekly" && (
        <div>
          {/* Legend + total hours */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px", alignItems: "center" }}>
            {Object.entries(hoursPerArea).map(([id, mins]) => {
              const m = AREA_META[id];
              return (
                <div key={id} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 9px", background: m.color + "14", border: `1px solid ${m.color}30`, borderRadius: "20px" }}>
                  <m.IconC size={10} style={{ color: m.color, flexShrink: 0 }} />
                  <span style={{ color: m.color, fontSize: "10px", fontWeight: 600 }}>{m.label}</span>
                  <span style={{ color: "#4a5060", fontSize: "10px" }}>{Math.floor(mins/60) > 0 ? `${Math.floor(mins/60)}h` : ""}{mins%60 > 0 ? `${mins%60}m` : ""}</span>
                </div>
              );
            })}
            <span style={{ color: "#3a4a5a", fontSize: "11px", fontFamily: "'Space Mono',monospace", marginLeft: "auto" }}>{Math.floor(totalWeekMin/60)}h {totalWeekMin%60}m / semana</span>
          </div>

          {/* 7-day grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: isMobile ? "6px" : "10px", marginBottom: "16px" }}>
            {calendarWeek.map((day, di) => {
              const dayDone = day.blocks.every((_, bi) => weekChecked[`${di}-${bi}`]);
              const isOpen = activeDay === di;
              return (
                <div key={di} style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {/* 1:1 square */}
                  <div onClick={() => setActiveDay(isOpen ? null : di)} style={{
                    position: "relative", width: "100%", paddingBottom: "100%",
                    borderRadius: isMobile ? "8px" : "12px", cursor: "pointer",
                    background: dayDone ? "rgba(0,200,150,0.12)" : isOpen ? "rgba(167,139,250,0.1)" : "rgba(255,255,255,0.03)",
                    border: dayDone ? "2px solid rgba(0,200,150,0.45)" : isOpen ? "2px solid rgba(167,139,250,0.55)" : "1px solid rgba(255,255,255,0.07)",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: isMobile ? "3px" : "6px", padding: isMobile ? "4px" : "8px" }}>
                      <span style={{ color: dayDone ? "#00c896" : isOpen ? "#a78bfa" : "#6a7888", fontSize: isMobile ? "9px" : "11px", fontWeight: 700, fontFamily: "'Space Mono',monospace", textTransform: "uppercase", letterSpacing: "0.05em" }}>{day.shortDay}</span>
                      {/* Color dots */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "2px", justifyContent: "center" }}>
                        {day.blocks.map((b, bi) => {
                          const m = AREA_META[b.area];
                          const done = !!weekChecked[`${di}-${bi}`];
                          return <div key={bi} style={{ width: isMobile ? "6px" : "8px", height: isMobile ? "6px" : "8px", borderRadius: "2px", background: done ? m.color : m.color + "40", border: `1px solid ${done ? m.color : m.color + "60"}`, transition: "background 0.2s" }} />;
                        })}
                      </div>
                      {dayDone
                        ? <span style={{ color: "#00c896", fontSize: isMobile ? "13px" : "17px" }}>✓</span>
                        : <span style={{ color: "#3a4050", fontSize: isMobile ? "8px" : "9px", fontFamily: "'Space Mono',monospace" }}>{Math.floor(day.totalMin/60)}h{day.totalMin%60 > 0 ? `${day.totalMin%60}m` : ""}</span>
                      }
                    </div>
                  </div>

                  {/* Task chips — desktop */}
                  {!isMobile && day.blocks.map((b, bi) => {
                    const m = AREA_META[b.area];
                    const done = !!weekChecked[`${di}-${bi}`];
                    return (
                      <div key={bi} onClick={() => toggleWeek(`${di}-${bi}`)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px 7px", borderRadius: "6px", cursor: "pointer", background: done ? m.color + "18" : "rgba(255,255,255,0.02)", border: `1px solid ${done ? m.color + "40" : "rgba(255,255,255,0.05)"}`, transition: "all 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = done ? m.color + "25" : "rgba(255,255,255,0.05)"}
                        onMouseLeave={e => e.currentTarget.style.background = done ? m.color + "18" : "rgba(255,255,255,0.02)"}
                      >
                        <div style={{ width: "9px", height: "9px", borderRadius: "2px", flexShrink: 0, background: done ? m.color : "transparent", border: `1.5px solid ${done ? m.color : "rgba(255,255,255,0.2)"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {done && <Check size={6} strokeWidth={3} style={{ color: "#000" }} />}
                        </div>
                        <m.IconC size={9} style={{ color: m.color, flexShrink: 0 }} />
                        <span style={{ color: "#3a4a5a", fontSize: "9px", fontFamily: "'Space Mono',monospace" }}>{b.duration}m</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Day detail panel */}
          {activeDay !== null && (
            <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid rgba(167,139,250,0.3)", background: "rgba(167,139,250,0.04)", marginBottom: "20px" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: "15px", fontFamily: "'Space Mono',monospace" }}>{calendarWeek[activeDay].day}</span>
                  <span style={{ color: "#5a6880", fontSize: "12px" }}>{calendarWeek[activeDay].focus}</span>
                </div>
                <button onClick={() => setActiveDay(null)} style={{ background: "none", border: "none", color: "#5a6880", cursor: "pointer", lineHeight: 1, padding: "4px", display:"flex", alignItems:"center" }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {calendarWeek[activeDay].blocks.map((block, bi) => {
                  const meta = AREA_META[block.area];
                  const key = `${activeDay}-${bi}`;
                  const done = !!weekChecked[key];
                  return (
                    <div key={bi} onClick={() => toggleWeek(key)} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", borderRadius: "10px", cursor: "pointer", background: done ? meta.color + "12" : "rgba(255,255,255,0.03)", border: `1px solid ${done ? meta.color + "45" : "rgba(255,255,255,0.06)"}`, borderLeft: `3px solid ${done ? meta.color : "rgba(255,255,255,0.1)"}`, transition: "all 0.2s" }}>
                      <div style={{ width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, marginTop: "1px", border: `2px solid ${done ? meta.color : "rgba(255,255,255,0.2)"}`, background: done ? meta.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                        {done && <span style={{ color: "#000", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "5px", flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: meta.color + "1a", border: `1px solid ${meta.color}35`, borderRadius: "5px", padding: "2px 8px", fontSize: "10px", color: meta.color, fontWeight: 700 }}>{meta.icon} {meta.label}</span>
                          <span style={{ color: "#4a5a6a", fontSize: "10px", fontFamily: "'Space Mono',monospace" }}>{block.duration} min</span>
                        </div>
                        <p style={{ color: done ? "#4a6070" : "#c0ccd8", fontSize: "13px", lineHeight: 1.55, margin: 0, textDecoration: done ? "line-through" : "none" }}>{block.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {isMobile && activeDay === null && (
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "16px" }}>
              <p style={{ color: "#4a5a6a", fontSize: "12px", textAlign: "center" }}>Toca un día para ver y marcar sus tareas</p>
            </div>
          )}

          {/* Principles */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: "8px" }}>
            {[
              { icon: "🔁", title: "DSA diario", body: "30 min cada día > 3h esporádicas. La consistencia construye el patrón mental." },
              { icon: "🎯", title: "Una área profunda", body: "60 min concentrado vale más que 4×15 min saltando entre temas." },
              { icon: "📝", title: "Siempre un output", body: "Cada sesión debe producir algo: diagrama, commit, notebook, ADR." },
              { icon: "⚡", title: "Regla 25 min", body: "Si LeetCode no cede en 25 min, estudia la solución. Mañana desde cero." },
            ].map((p, i) => (
              <div key={i} style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                <span style={{ fontSize: "15px" }}>{p.icon}</span>
                <div style={{ color: "#b0bcc8", fontSize: "11.5px", fontWeight: 600, margin: "5px 0 3px" }}>{p.title}</div>
                <div style={{ color: "#4a5a6a", fontSize: "11px", lineHeight: 1.55 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          VIEW: TOTAL ROADMAP
      ══════════════════════════════════════════════════════════ */}
      {view === "total" && (
        <div>
          {/* Per-area overview cards */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(5,1fr)", gap: "8px", marginBottom: "28px" }}>
            {roadmapData.map(area => {
              const totalPh = area.phases.length;
              const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
              const pct = Math.round((donePh / totalPh) * 100);
              const circumference = 2 * Math.PI * 22;
              const dashOffset = circumference - (pct / 100) * circumference;
              return (
                <div key={area.id} style={{ background: area.color + "0c", border: `1px solid ${area.color}30`, borderRadius: "12px", padding: "14px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  {/* Circular progress */}
                  <div style={{ position: "relative", width: "54px", height: "54px" }}>
                    <svg width="54" height="54" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="27" cy="27" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="27" cy="27" r="22" fill="none" stroke={area.color} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.5s" }} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: area.color, fontSize: "13px", fontWeight: 700, fontFamily: "'Space Mono',monospace" }}>{pct}%</span>
                    </div>
                  </div>
                  <span style={{ color: "#dde6f0", fontSize: "11px", fontWeight: 600, textAlign: "center", lineHeight: 1.3 }}>{area.title}</span>
                  <span style={{ color: "#4a5a6a", fontSize: "10px", fontFamily: "'Space Mono',monospace" }}>{donePh}/{totalPh} fases</span>
                </div>
              );
            })}
          </div>

          {/* Per-area phase checklists */}
          {roadmapData.map(area => {
            const totalPh = area.phases.length;
            const donePh = area.phases.filter((_, pi) => phaseChecked[`${area.id}-${pi}`]).length;
            const areaPct = Math.round((donePh / totalPh) * 100);
            return (
              <div key={area.id} style={{ marginBottom: "16px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${area.color}25`, background: "rgba(255,255,255,0.015)" }}>
                {/* Area header */}
                <div style={{ padding: "14px 20px", background: area.color + "0a", borderBottom: `1px solid ${area.color}20`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "18px" }}>{area.icon}</span>
                    <div>
                      <div style={{ color: area.color, fontWeight: 700, fontSize: "14px" }}>{area.title}</div>
                      <div style={{ color: "#4a5a6a", fontSize: "11px" }}>{area.period} · {area.subtitle}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: isMobile ? "80px" : "120px", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${areaPct}%`, background: area.color, borderRadius: "3px", transition: "width 0.4s" }} />
                    </div>
                    <span style={{ color: area.color, fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono',monospace", minWidth: "36px", textAlign: "right" }}>{areaPct}%</span>
                  </div>
                </div>

                {/* Phase rows */}
                <div style={{ padding: "8px 12px" }}>
                  {area.phases.map((phase, pi) => {
                    const key = `${area.id}-${pi}`;
                    const done = !!phaseChecked[key];
                    return (
                      <div key={pi} onClick={() => togglePhase(key)} style={{
                        display: "flex", alignItems: "flex-start", gap: "12px",
                        padding: "10px 12px", marginBottom: pi < area.phases.length - 1 ? "4px" : "0",
                        borderRadius: "9px", cursor: "pointer",
                        background: done ? area.color + "10" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${done ? area.color + "40" : "rgba(255,255,255,0.04)"}`,
                        borderLeft: `3px solid ${done ? area.color : "rgba(255,255,255,0.08)"}`,
                        transition: "all 0.2s", opacity: done ? 0.72 : 1,
                      }}>
                        {/* Checkbox */}
                        <div style={{ width: "20px", height: "20px", borderRadius: "6px", flexShrink: 0, marginTop: "1px", border: `2px solid ${done ? area.color : "rgba(255,255,255,0.18)"}`, background: done ? area.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                          {done && <span style={{ color: "#000", fontSize: "11px", fontWeight: 900 }}>✓</span>}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px", flexWrap: "wrap" }}>
                            <span style={{ background: area.color + "22", color: area.color, border: `1px solid ${area.color}40`, borderRadius: "5px", padding: "1px 8px", fontSize: "10px", fontFamily: "'Space Mono',monospace", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {phase.label}
                            </span>
                            {phase.isPremodule && (
                              <span style={{ background: "rgba(120,180,255,0.12)", color: "#78b4ff", border: "1px solid rgba(120,180,255,0.3)", borderRadius: "5px", padding: "1px 7px", fontSize: "9px", fontWeight: 700 }}>PRE-MÓDULO</span>
                            )}
                          </div>
                          <p style={{ color: done ? "#4a6070" : "#c0ccd8", fontSize: isMobile ? "12px" : "13px", fontWeight: 600, margin: "0 0 3px", textDecoration: done ? "line-through" : "none", lineHeight: 1.3 }}>
                            {phase.title}
                          </p>
                          <p style={{ color: done ? "#3a5060" : "#5a6880", fontSize: "11.5px", margin: 0, lineHeight: 1.45, textDecoration: done ? "line-through" : "none" }}>
                            {phase.deliverable}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: "8px", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", color: "#4a5a6a", fontSize: "12px", lineHeight: 1.6 }}>
            <strong style={{ color: "#6a7888" }}>Cómo usar:</strong> Marca una fase como completada cuando hayas terminado su entregable y puedas cumplir su métrica de éxito — no antes.
          </div>
        </div>
      )}
    </div>
  );
};

const DIFF_STYLE = {
  Easy:   { bg: "rgba(0,200,150,0.12)",  border: "rgba(0,200,150,0.35)",  color: "#00c896" },
  Medium: { bg: "rgba(255,180,0,0.12)",  border: "rgba(255,180,0,0.35)",  color: "#ffb800" },
  Hard:   { bg: "rgba(255,90,90,0.12)",  border: "rgba(255,90,90,0.35)",  color: "#ff6060" },
};

const LCChip = ({ p }) => {
  const d = DIFF_STYLE[p.difficulty] || DIFF_STYLE.Medium;
  return (
    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "4px 9px", borderRadius: "6px", textDecoration: "none",
      background: d.bg, border: `1px solid ${d.border}`, cursor: "pointer",
      transition: "opacity 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <span style={{ color: "#6a7888", fontSize: "10px", fontFamily: "'Space Mono', monospace" }}>#{p.num}</span>
      <span style={{ color: "#dde6f0", fontSize: "11.5px", fontWeight: 500 }}>{p.name}</span>
      <span style={{ color: d.color, fontSize: "9px", fontWeight: 700, letterSpacing: "0.03em" }}>{p.difficulty}</span>
    </a>
  );
};

const ObjectiveItem = ({ obj, color }) => {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div style={{ marginBottom: "6px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${open ? color + "44" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.2s" }}>
      <button onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: isMobile ? "12px" : "10px 14px", background: open ? color + "0d" : "rgba(255,255,255,0.02)", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        {open
          ? <ChevronDown size={13} style={{ color, flexShrink: 0 }} />
          : <ChevronRight size={13} style={{ color, flexShrink: 0 }} />
        }
        <span style={{ color: "#dde6f0", fontSize: isMobile ? "13px" : "13.5px", fontWeight: 500, lineHeight: 1.4 }}>{obj.topic}</span>
      </button>
      {open && (
        <div style={{ padding: isMobile ? "12px" : "12px 14px 16px 38px", background: color + "07", borderTop: `1px solid ${color}1a` }}>
          <p style={{ color: "#9aabb8", fontSize: "13px", lineHeight: 1.75, marginBottom: "14px" }}>{obj.why}</p>

          {/* Recurso + Mini-entregable */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: obj.leetcodeProblems ? "14px" : "0" }}>
            <a href={obj.resource.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "flex-start", gap: "8px", padding: "10px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", textDecoration: "none", cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            >
              <div style={{ flexShrink: 0, marginTop: "2px", color: "#7a8898" }}>
                {obj.resource.owned ? <BookMarked size={14} /> : <BookOpen size={14} />}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <span style={{ color: "#cdd6e0", fontSize: "11.5px", fontWeight: 600 }}>Recurso</span>
                  {(() => { const b = getBadge(obj.resource); return <span style={{ fontSize: "9px", padding: "1px 5px", borderRadius: "4px", background: b.bg, color: b.color, fontWeight: 700 }}>{b.label}</span>; })()}
                </div>
                <span style={{ color, fontSize: "12px", lineHeight: 1.4, display: "block" }}>{obj.resource.name} ↗</span>
              </div>
            </a>
            <div style={{ padding: "10px 12px", background: color + "0d", border: `1px solid ${color}22`, borderRadius: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Sparkles size={13} style={{ color, flexShrink: 0 }} />
                <span style={{ color, fontSize: "11.5px", fontWeight: 600 }}>Mini-entregable</span>
              </div>
              <p style={{ color: "#b0bec8", fontSize: "12px", lineHeight: 1.5, margin: 0 }}>{obj.miniDeliverable}</p>
            </div>
          </div>

          {/* LeetCode problems */}
          {obj.leetcodeProblems && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Terminal size={12} style={{ color: "#FF6B35", flexShrink: 0 }} />
                <span style={{ color: "#7a8898", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Problemas LeetCode</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {obj.leetcodeProblems.map((p, i) => <LCChip key={i} p={p} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PhaseCard = ({ phase, color }) => {
  const [showResources, setShowResources] = useState(false);
  const isMobile = useIsMobile();
  return (
    <div style={{ background: phase.isPremodule ? color + "09" : "rgba(255,255,255,0.025)", border: phase.isPremodule ? `1px solid ${color}44` : `1px solid rgba(255,255,255,0.07)`, borderLeft: `3px solid ${color}`, borderRadius: "12px", padding: isMobile ? "16px" : "20px 24px", marginBottom: "16px" }}>
      {phase.isPremodule && (
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: color + "22", border: `1px solid ${color}55`, borderRadius: "6px", padding: "3px 10px", fontSize: "10px", fontFamily: "'Space Mono', monospace", color, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "10px" }}>
          <Hexagon size={10} /> Pre-módulo recomendado
        </div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: "6px", padding: "2px 10px", fontSize: "11px", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em", fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0 }}>{phase.label}</span>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: isMobile ? "14px" : "15px", lineHeight: 1.4 }}>{phase.title}</span>
      </div>
      <div style={{ marginBottom: "16px" }}>
        {phase.objectives.map((obj, i) => <ObjectiveItem key={i} obj={obj} color={color} />)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: "8px", padding: "10px 14px" }}>
          <div style={{ color: "#888", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>Entregable de fase</div>
          <div style={{ color: "#e0e6f0", fontSize: "12.5px", lineHeight: 1.5 }}>{phase.deliverable}</div>
        </div>
        <div style={{ background: color + "11", borderRadius: "8px", padding: "10px 14px", border: `1px solid ${color}22` }}>
          <div style={{ color: color + "cc", fontSize: "10px", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px", fontFamily: "'Space Mono', monospace" }}>Métrica de éxito</div>
          <div style={{ color: "#e0e6f0", fontSize: "12.5px", lineHeight: 1.5 }}>{phase.metric}</div>
        </div>
      </div>
      <button onClick={() => setShowResources(!showResources)}
        style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: `1px solid rgba(255,255,255,0.1)`, borderRadius: "7px", padding: "6px 12px", color: "#7a8898", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif", marginBottom: showResources ? "12px" : "0" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = color + "66"; e.currentTarget.style.color = color; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#7a8898"; }}
      >
        <span>{showResources ? "▾" : "▸"}</span>
        Recursos generales de la fase
        <span style={{ background: color + "22", color, borderRadius: "4px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>{phase.resources.length}</span>
      </button>
      {showResources && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
          {phase.resources.map((r, i) => <ResourceChip key={i} resource={r} color={color} />)}
        </div>
      )}
    </div>
  );
};

export default function Roadmap() {
  const [page, setPage] = useState("roadmap"); // "roadmap" | "tracker"
  const [active, setActive] = useState("system-design");
  const isMobile = useIsMobile();
  const area = roadmapData.find(a => a.id === active);
  const freeCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => r.free).length, 0) : 0;
  const paidCount  = area ? area.phases.reduce((acc, p) => acc + p.resources.filter(r => !r.free).length, 0) : 0;
  const totalObjectives = area ? area.phases.reduce((acc, p) => acc + p.objectives.length, 0) : 0;

  const navBtnStyle = (isActive, accent) => ({
    display: "flex", alignItems: "center", gap: "6px",
    padding: isMobile ? "7px 14px" : "8px 20px",
    background: isActive ? (accent || "rgba(255,255,255,0.1)") : "transparent",
    border: `1px solid ${isActive ? "rgba(255,255,255,0.2)" : "transparent"}`,
    borderRadius: "8px",
    color: isActive ? "#e0e6f0" : "#5a6880",
    fontSize: isMobile ? "12px" : "13px", fontWeight: isActive ? 700 : 500,
    cursor: "pointer", fontFamily: "'DM Sans', system-ui, sans-serif",
    transition: "all 0.2s", whiteSpace: "nowrap",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0a0d12", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#e0e6f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0d12; }
        ::-webkit-scrollbar-thumb { background: #2a3040; border-radius: 3px; }
        .tab-nav { display: flex; gap: 8px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
        .tab-nav::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.2s ease; }
      `}</style>

      {/* ── HEADER with top-level page nav ── */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: isMobile ? "20px 16px" : "24px 40px", background: "linear-gradient(180deg, #0e1218 0%, transparent 100%)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontFamily: "'Space Mono', monospace", color: "#4a90b8", fontSize: isMobile ? "9px" : "11px", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "6px" }}>
              Roadmap 2026 — Ingeniero de Clase Mundial
            </div>
            <h1 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: 700, background: "linear-gradient(135deg, #ffffff 0%, #8899bb 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
              Skill Upgrade Plan
            </h1>
          </div>
          {/* Page switcher */}
          <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "4px" }}>
            <button style={navBtnStyle(page === "roadmap")} onClick={() => setPage("roadmap")}>
              <BookText size={14} />
              {!isMobile && "Roadmap"}
            </button>
            <button style={navBtnStyle(page === "tracker", "rgba(167,139,250,0.18)")} onClick={() => setPage("tracker")}>
              <BarChart2 size={14} />
              {!isMobile && "Tracker"}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PAGE: ROADMAP
      ══════════════════════════════════════════════ */}
      {page === "roadmap" && (
        <div className="fade-up">
          {/* Area tabs */}
          <div className="tab-nav" style={{ padding: isMobile ? "14px 16px" : "18px 40px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {roadmapData.map(a => (
              <button key={a.id} onClick={() => setActive(a.id)} style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: isMobile ? "8px 12px" : "9px 16px",
                background: active === a.id ? a.color + "18" : "rgba(255,255,255,0.04)",
                border: `1px solid ${active === a.id ? a.color + "55" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "10px", color: active === a.id ? a.color : "#7a8898",
                fontSize: isMobile ? "12px" : "13px", fontWeight: active === a.id ? 700 : 400,
                cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                fontFamily: "'DM Sans', system-ui, sans-serif", flexShrink: 0,
              }}>
                <span style={{ fontSize: isMobile ? "13px" : "15px", display:"flex", alignItems:"center" }}>
                  <AreaIcon id={a.id} size={isMobile ? 13 : 15} />
                </span>
                {isMobile ? (a.id === "algoritmos" ? "DSA" : a.id === "ingles-tecnico" ? "Inglés" : a.title.split(" ")[0]) : a.title}
              </button>
            ))}
          </div>

          {/* Area content */}
          {area && (
            <div style={{ padding: isMobile ? "20px 16px 48px" : "28px 40px 48px", maxWidth: "860px" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                      <span style={{ fontSize: isMobile ? "22px" : "28px", display:"flex", alignItems:"center" }}>
                        <AreaIcon id={area.id} size={isMobile ? 22 : 26} style={{ color: area.color }} />
                      </span>
                      <h2 style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 700, color: area.color }}>{area.title}</h2>
                    </div>
                    <p style={{ color: "#7a8898", fontSize: isMobile ? "13px" : "14px", marginLeft: isMobile ? "32px" : "42px", lineHeight: 1.5 }}>{area.subtitle}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: isMobile ? "row" : "column", alignItems: isMobile ? "center" : "flex-end", gap: "8px", flexShrink: 0 }}>
                    <div style={{ background: area.color + "18", border: `1px solid ${area.color}44`, borderRadius: "8px", padding: "6px 14px", textAlign: "center" }}>
                      <div style={{ color: area.color, fontWeight: 700, fontSize: isMobile ? "15px" : "18px", fontFamily: "'Space Mono', monospace" }}>{area.period}</div>
                      {!isMobile && <div style={{ color: "#5a6880", fontSize: "11px" }}>duración recomendada</div>}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(0,200,150,0.1)", border: "1px solid rgba(0,200,150,0.25)", borderRadius: "5px", color: "#00c896" }}>{freeCount} gratuitos</span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(255,180,0,0.1)", border: "1px solid rgba(255,180,0,0.25)", borderRadius: "5px", color: "#ffb800" }}>{paidCount} de pago</span>
                  <span style={{ fontSize: "11px", padding: "2px 8px", background: "rgba(150,150,255,0.1)", border: "1px solid rgba(150,150,255,0.25)", borderRadius: "5px", color: "#a0a0ff" }}>{totalObjectives} temas</span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "14px", marginBottom: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <Info size={15} style={{ color: "#5a6880", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "#8898aa", fontSize: isMobile ? "12px" : "13px", lineHeight: 1.6 }}>{area.periodLabel}</p>
              </div>
              <div style={{ marginBottom: "16px", padding: "10px 14px", background: area.color + "0a", border: `1px solid ${area.color}22`, borderRadius: "8px" }}>
                <p style={{ color: "#7a8898", fontSize: isMobile ? "11px" : "12px", lineHeight: 1.6 }}>
                  ▸ Toca cada tema para ver <strong style={{ color: "#9aabb8" }}>por qué se estudia</strong>, su <strong style={{ color: "#9aabb8" }}>recurso</strong> y su <strong style={{ color: "#9aabb8" }}>mini-entregable</strong>.{"  "}
                  <span style={{ color: "#78b4ff" }}>📚 OWNED</span> = libro o suscripción que ya tienes.
                </p>
              </div>
              {area.phases.map((phase, i) => <PhaseCard key={i} phase={phase} color={area.color} />)}
              <div style={{ marginTop: "32px", padding: "14px 18px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", color: "#5a6880", fontSize: isMobile ? "12px" : "13px", lineHeight: 1.6 }}>
                <strong style={{ color: "#7a8898" }}>Principio clave:</strong> Los roadmaps no son lineales. Si en el Mes 2 ya tienes el entregable del Mes 3, acelera. Los mini-entregables verifican que el conocimiento es real, no solo leído.
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          PAGE: TRACKER
      ══════════════════════════════════════════════ */}
      {page === "tracker" && (
        <div className="fade-up">
          <TrackerPage />
        </div>
      )}
    </div>
  );
}

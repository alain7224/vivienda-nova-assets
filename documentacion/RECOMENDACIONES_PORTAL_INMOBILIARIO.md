# Recomendaciones prioritarias para Vivienda Nova

**Conclusión.** La siguiente etapa de Vivienda Nova debe reforzar tres recorridos: encontrar una vivienda, valorar una ficha y solicitar contacto. Las mejoras ya incorporadas resuelven la base operativa —precio, referencia, fotos, búsqueda jerárquica, traducciones, mapa privado y administración—. Las propuestas siguientes aumentan la capacidad de descubrimiento, confianza y conversión sin alterar la identidad editorial del diseño.

## Prioridades propuestas

| Prioridad | Mejora | Valor para Vivienda Nova | Estado actual |
|---|---|---|---|
| P0 | Páginas de ficha indexables con datos estructurados | Permite que buscadores entiendan precio, ubicación, fotos, características y tipo real de cada vivienda. | Pendiente de implantar con la versión publicada. |
| P0 | Llamada a la acción de visita persistente en móvil | Reduce la distancia entre interés y contacto, especialmente para usuarios que ven muchas fotos. | El formulario existe; se recomienda una acción móvil más visible. |
| P0 | Auditoría periódica Core Web Vitals y peso de imágenes | Ayuda a evitar carga lenta, saltos visuales y pérdidas de contacto móvil. | Base incorporada: WebP, máximo 2048 px, carga diferida y reserva visual. |
| P0 | Gobierno de mapa de clientes | Evita usar ubicaciones personales más allá de la finalidad consentida. | Base incorporada: mapa privado, solo consentimientos y coordenadas voluntarias. |
| P1 | Favoritos persistentes y comparación | Permite a una persona volver, comparar dos o tres opciones y compartir una lista. | Favoritos temporales existentes; persistencia y comparador pendientes. |
| P1 | Alertas de búsqueda guardada | Informa al usuario cuando aparece una vivienda que coincide con país, provincia, presupuesto o dormitorios. | Pendiente. Requiere consentimientos de contacto y un sistema de envíos. |
| P1 | Páginas de zona tipo “Viviendas en Torrevieja” | Crea recorridos claros por municipio, zona y tipo, sin indexar combinaciones vacías. | Pendiente. |
| P1 | Analítica del embudo de búsqueda | Mide consulta, filtros, resultados, ficha, clic de salida y formulario enviado. | Visitas y clics básicos existentes; embudo de filtros pendiente. |
| P2 | Historial auditable de CRM | Registra propietario del cliente, fuente, estado, consentimiento y cambios. | Estados principales existentes; auditoría ampliada pendiente. |
| P2 | Comparación de mercado y alertas de precio | Permite al administrador detectar precios anómalos o cambios respecto a fuente. | Se guarda precio de fuente; comparación automática pendiente. |

## 1. Búsqueda y navegación

El buscador debe seguir una jerarquía comprensible: **país, provincia, municipio o ciudad, barrio o zona**, tipo, rango de precio y dormitorios. La actualización incorpora esta estructura y selecciona España como país inicial. También permite buscar una referencia o dirección. La siguiente mejora aconsejable es guardar esa búsqueda y mostrar alternativas cuando no haya resultados, por ejemplo ampliando el municipio o el presupuesto.

La estrategia SEO no debe crear una página indexable para cada combinación posible de filtros. Google advierte que la navegación facetada puede producir un número infinito de URL y dificultar el rastreo de páginas relevantes. Las páginas de zona con demanda real deben tener contenido propio y URL estable; las combinaciones sin resultados deben responder de forma adecuada y ofrecer alternativas al usuario. [1]

## 2. Fichas de propiedad y confianza

Cada ficha debe mostrar información visible, coherente y verificable: precio con moneda, localización aproximada, superficie, habitaciones, baños, galería, características reales, código de referencia y acción principal de contacto. El contenido estructurado debe describir solamente lo que está en la página. Google recomienda JSON-LD para comunicar estos datos y su validación mediante Rich Results Test y Search Console, aunque no garantiza que una ficha obtenga un resultado enriquecido. [2]

La mejora siguiente recomendada es una acción “Solicitar visita” visible también en móvil. El formulario debe pedir únicamente nombre, email o teléfono, mensaje y preferencia de visita al comienzo. Los campos deben tener etiquetas visibles, mensajes de error claros y formato internacional para teléfono. Los controles HTML estándar y el atributo `autocomplete` mejoran la accesibilidad y reducen errores de envío. [3] [4]

## 3. Fotografías, rendimiento y accesibilidad

La actualización convierte las fotos administrativas en WebP con calidad 86, aplica rotación según los metadatos y limita el lado mayor a 2048 píxeles sin ampliar fotos pequeñas. Esa combinación conserva detalle útil para una ficha inmobiliaria y evita almacenar imágenes enormes. Las tarjetas que quedan fuera de pantalla usan carga diferida; la imagen principal no debe usar carga diferida de forma indiscriminada porque puede afectar al elemento visual más importante.

Las mediciones deben hacerse sobre páginas de listado y ficha reales. Google y web.dev recomiendan priorizar la imagen LCP visible en el HTML, reservar dimensiones para reducir movimientos visuales y reducir JavaScript o tareas largas que perjudiquen la interacción. [5] Cada foto debe usar un texto alternativo que describa lo relevante, no un conjunto de palabras clave. Las imágenes decorativas deben tener texto alternativo vacío. [6] [7]

## 4. Idiomas y mercados

El sitio ya gestiona 13 variantes de interfaz y genera las traducciones de cada ficha al guardarla o actualizarla. La siguiente fase debe utilizar URL diferenciadas por idioma, enlaces visibles para elegir idioma y región, y anotaciones `hreflang` si se publican rutas independientes. No debe redirigirse automáticamente solo por IP o idioma de navegador; el visitante debe conservar el control. [8]

## 5. Administrador, CRM y mapa de clientes

El administrador debe mantener el mínimo privilegio: una cuenta de marketing no necesita ver todos los datos de clientes, y una cuenta de solo lectura no debe editar fichas ni exportar información. Las comprobaciones deben ocurrir en el servidor para cada petición, no solo al ocultar botones. OWASP recomienda denegación por defecto, verificación de permisos en cada solicitud y revisiones periódicas de accesos. [9]

El mapa debe seguir siendo privado. Las coordenadas de clientes solo son necesarias para solicitudes de construcción y solo cuando el usuario proporcionó esa localización y aceptó el tratamiento de datos. La actualización ya evita mostrar en el mapa contactos sin consentimiento. Antes de habilitar cualquier exportación, geolocalización precisa automática o perfilado, debe revisarse la base jurídica y los plazos de conservación conforme al RGPD. [10]

## Plan sugerido de las próximas cuatro semanas

| Semana | Entregable | Criterio de aceptación |
|---|---|---|
| 1 | Fusión segura de la versión publicada y actualización de 109 fichas | Sin duplicados, sin nombre de agencias fuente, precios/referencias correctos y 16 pruebas superadas. |
| 2 | Validación de fotos, traducciones, mapa y buscador con datos reales | Cinco fichas de prueba, cinco consultas geográficas y dos puntos superpuestos en el mapa. |
| 3 | Datos estructurados por ficha, CTA móvil y medición de embudo | Validación de marcado y eventos de búsqueda → ficha → contacto. |
| 4 | Favoritos persistentes, comparador y política de páginas de zona | Listas guardadas, comparador de 2–3 viviendas y URLs de zona revisadas. |

## References

[1]: https://developers.google.com/crawling/docs/faceted-navigation "Managing crawling of faceted navigation URLs"
[2]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Introduction to structured data markup in Google Search"
[3]: https://web.dev/learn/accessibility/forms "Forms — Learn Accessibility"
[4]: https://www.w3.org/WAI/WCAG22/Understanding/error-identification.html "Understanding SC 3.3.1: Error Identification (Level A) — W3C WAI"
[5]: https://web.dev/articles/top-cwv "The most effective ways to improve Core Web Vitals"
[6]: https://developers.google.com/search/docs/appearance/google-images "Google image SEO best practices"
[7]: https://www.w3.org/WAI/tutorials/images/ "Images Tutorial"
[8]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites "Managing multi-regional and multilingual sites"
[9]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html "Authorization Cheat Sheet — OWASP Cheat Sheet Series"
[10]: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng "Regulation (EU) 2016/679 (GDPR), Articles 5 and 25"

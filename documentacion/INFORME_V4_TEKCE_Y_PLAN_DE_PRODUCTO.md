# Informe v4 — Vivienda Nova: fichas, administrador y proveedores

**Fecha:** 7 de septiembre de 2026  
**Estado:** implementación v4.0 preparada para fusión y publicación.  
**Alcance:** mejora de la ficha de vivienda, controles de administrador, contenido multilingüe, rendimiento de fotos y proceso seguro de proveedores.

## Resumen para decisión

La siguiente actualización resuelve las carencias observadas en las capturas. Cada ficha puede mostrar su ubicación mediante un mapa desplegable, una reserva asociada inequívocamente a esa vivienda, una galería completa, características verificadas y viviendas similares del mismo tipo. El administrador incorpora menús que abren su tarea, carruseles de una a cinco viviendas, dos diseños nuevos de tarjeta y controles de texto largos.

La plataforma queda preparada para distintos proveedores, pero no incorpora ahora ninguna propiedad de TEKCE. Es la decisión correcta porque TEKCE ofrece enlaces de afiliado y una plataforma de socios, pero sus páginas públicas no anuncian una exportación o API que autorice a copiar fotos y textos a Vivienda Nova. La implementación exige guardar la autorización escrita de cada proveedor antes de publicar una ficha nueva.

## Lo implementado

| Necesidad observada | Mejora incluida en v4.0 | Resultado práctico |
|---|---|---|
| El cliente no veía mapa ni reserva en la ficha | Ficha individual completa con mapa bajo demanda y formulario de reserva | El mapa se abre dentro de la ficha y la reserva identifica la vivienda por código, título y enlace. |
| El mensaje de “más información” perdía el enlace de interés | El servidor añade automáticamente la URL canónica de la ficha | El administrador puede conocer qué vivienda consultó cada cliente. |
| Faltaban viviendas similares | Carrusel automático de una a cinco viviendas | Da prioridad a inmuebles del mismo tipo, zona y ciudad. |
| No existían secciones editables | Gestor de secciones para portada o ficha | Se puede elegir, ordenar y mostrar de una a cinco viviendas manualmente. |
| Las tarjetas 3D eran demasiado fuertes | Estilos plano, 3D discreto, sombra editorial y marco premium | El diseño se adapta desde el administrador sin cambiar código. |
| El texto largo no era manejable | Modos automática, ventana con scroll y completa | Se elige el comportamiento y el alto de 120 a 1.200 píxeles por ficha. |
| Las fichas existentes solo estaban en español | Acción “Traducir todas las fichas publicadas” y traducción al guardar | El español es el origen y se actualizan los idiomas habilitados mediante el modelo interno del proyecto. |
| Los menús no llevaban a ninguna función | Navegación por paneles `?panel=` | Todos los accesos laterales abren el formulario, importador, mapa, vendedores, operaciones, idiomas/diseño, secciones o vista previa correspondientes. |
| Muchas fotos podían repetirse en inventario | Miniatura preferente desde la primera foto de galería y respaldo de imagen | El administrador usa la galería cuando existe; las fichas mantienen galería completa. |
| Actividad difícil de leer | Tabla de eventos con encabezado fijo y scroll interno | Conserva hasta cien eventos visibles sin alargar de forma ilimitada el panel. |
| Proveedores externos sin control | Autorización de publicación por proveedor | El sistema no publica nuevas fichas si el proveedor no tiene permiso escrito marcado. |

## Flujo de contenido recomendado

Una ficha debe nacer como borrador. El administrador introduce título propio, precio, código de la vivienda, ubicación aproximada, descripción, características, fotos y proveedor. Elige el estilo de lectura y puede marcarla como destacada. Después abre la vista previa privada desde el inventario. Cuando todo sea correcto y exista autorización del proveedor, se publica. En ese momento se genera la traducción para todos los idiomas habilitados y la ficha entra automáticamente en el sitemap.

Las fotos deben ser del proveedor autorizado o propias. La aplicación convierte las nuevas imágenes a formatos optimizados y sirve las imágenes de contenido con carga diferida. La ficha principal se conserva nítida, pero el visitante no descarga todas las fotos hasta que las necesita.

## TEKCE: cómo funcionaría sin asumir permisos que todavía no existen

TEKCE separa dos modelos. El **programa de afiliado** entrega un código personal que se añade a enlaces de cualquier página y permite seguir la operación en MyTEKCE. La comisión se basa en operaciones cerradas mediante ese enlace. [1] El **programa de partnership** está dirigido a profesionales y menciona formación, MyTEKCE y GlobalHomes.app para catálogo con marca y datos de contacto propios. [2]

> La información pública de TEKCE permite afirmar que existe atribución por código y seguimiento en MyTEKCE. No permite afirmar que se pueda copiar su catálogo completo, sus fotos o sus textos a otra web.

Por eso, antes de cargar fichas de TEKCE, hay que pedir por correo cinco elementos concretos: permiso de uso y publicación de fotos y descripciones; formato de exportación oficial o API; frecuencia de precios y disponibilidad; enlace de afiliado o regla de atribución; y proceso para registrar un lead originado en Vivienda Nova. Cuando la respuesta exista, se crea un proveedor “TEKCE” en el administrador, se guarda la autorización, y se añade un conector o importador específico. El mismo mecanismo sirve para cualquier otra inmobiliaria autorizada.

Los pagos en cripto no se deben implementar en esta web por ahora. TEKCE describe un proceso en el que el comprador avisa al agente, firma KYC y un acuerdo de pago, transfiere a la cartera de TEKCE y TEKCE convierte a moneda fiduciaria para el vendedor. [3] Vivienda Nova debe limitarse a marcar la preferencia de pago opcional y derivar la consulta a TEKCE solo si el acuerdo comercial lo permite.

## Mejoras futuras recomendadas

| Prioridad | Mejora | Motivo |
|---|---|---|
| Alta | Publicar la v4.0 y enviar sitemap en Google Search Console | Convierte las fichas individuales en páginas descubribles y permite vigilar errores de indexación. |
| Alta | Verificar proveedor por proveedor las autorizaciones de contenido | Evita publicar fotos, textos o precios sin licencia comercial clara. |
| Alta | Conectar el formulario de reserva con correo o CRM de operación | Garantiza respuesta rápida y una trazabilidad útil de cada solicitud. |
| Media | Alertas de precios y favoritos por correo | Recupera interés de clientes que aún no deciden. |
| Media | Comparador de hasta tres viviendas | Facilita la decisión sin abandonar la web. |
| Media | Calculadora financiera separada por país y proveedor | Debe mostrar solo simulación, sin prometer financiación ni recibir información financiera sensible. |
| Media | Páginas editoriales por zona, estilo de vida y tipo | Aumenta tráfico orgánico y ayuda a navegar un catálogo internacional. |
| Posterior a autorización | Conector de proveedores | Debe usar un feed o API oficial, con actualización de precio, disponibilidad, fotos y atribución. |

## Pruebas realizadas

La versión v4.0 pasó comprobación de tipos TypeScript, **21 pruebas automatizadas en 10 grupos** y compilación de producción. La portada local respondió correctamente. Las rutas `robots.txt` y `sitemap.xml` devolvieron contenido válido, con el administrador excluido del rastreo. El carrusel es manual, usa botones anterior/siguiente y conserva navegación por teclado, siguiendo las pautas de accesibilidad W3C. [4]

## Referencias

[1]: https://tekce.com/corporate/affiliate-program "TEKCE Real Estate Affiliate & Referral Program"
[2]: https://tekce.com/corporate/partnership "TEKCE Real Estate Partnership Program"
[3]: https://tekce.com/pay-with-cryptocurrency "Pay with Cryptocurrency | Buy Real Estate with BTC, ETH & USDT"
[4]: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/ "Carousel Pattern | WAI-ARIA Authoring Practices Guide"

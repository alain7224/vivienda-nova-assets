# Guía de fusión y publicación — Vivienda Nova v4.0

**Destinatario:** Manus de la cuenta que contiene el proyecto publicado.  
**Versión vigente de esta entrega:** `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v4_0.zip`.  
**Finalidad:** integrar la actualización completa sin eliminar funciones propias que ya estén activas en el proyecto publicado, en particular las cuentas de usuario y el cierre de sesión de seguridad existente.

## Conclusión

Esta entrega sustituye a v3.2 como base de trabajo. Incluye el catálogo, SEO, traducción, carga de imágenes optimizada, panel administrativo, fichas individuales, reservas, mapa, carruseles y las correcciones v4 descritas abajo. No contiene propiedades de TEKCE ni de ningún proveedor nuevo. Solo añade el procedimiento seguro para integrarlas **cuando exista una autorización escrita, un feed o exportación oficial y el código de atribución correspondiente**.

La aplicación conserva un cierre de sesión por inactividad de treinta minutos. No se debe eliminar ni reducir esa protección durante la fusión. Las funcionalidades de v4 deben añadirse sobre el proyecto original publicado, no reemplazar sus datos de usuarios, credenciales ni configuración secreta.

## Archivos que hay que usar

| Archivo | Uso obligatorio | Razón |
|---|---|---|
| `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v4_0.zip` | Sí | Código acumulado de v3.2 y v4.0. |
| `CORRECCION_DETALLES_CARACTERISTICAS_109.csv` | Sí, si las 109 fichas no están ya corregidas | Datos con descripciones, características, códigos, fotos y galerías verificadas. |
| `GUIA_SEO_RESERVAS_Y_ACTUALIZACIONES.md` | Sí | Verificación de sitemap, robots, reserva, vista previa y contenido propio. |
| `INFORME_V4_TEKCE_Y_PLAN_DE_PRODUCTO.md` | Sí | Límites para TEKCE y mejoras futuras; no importa datos de ese proveedor. |
| `0015_sections_translation_and_display.sql` | Sí | Nueva estructura para secciones editables, texto de ficha y control de proveedores. |

## Paso 1 — Crear una copia y comparar

Descarga el ZIP v4.0 y crea una copia o punto de restauración del proyecto publicado. Descomprime el ZIP en un directorio separado. Compara su contenido con el repositorio publicado antes de sobrescribir nada. Conserva de la versión publicada las variables de entorno, el dominio, usuarios, base de datos, claves, credenciales OAuth y cualquier mejora propia posterior a v3.2.

Ejecuta primero `pnpm install --frozen-lockfile`, después `pnpm check`, `pnpm test -- --run` y `pnpm build`. Si alguno falla, corrige la fusión antes de publicar.

## Paso 2 — Aplicar la migración de datos

Aplica las migraciones en orden numérico. La nueva migración es `drizzle/0015_sections_translation_and_display.sql`. Crea la tabla de secciones editables y añade estos campos: autorización escrita por proveedor, destacado de vivienda, modos de lectura de descripción, alto del texto y máximo de viviendas similares.

> No borres la tabla de propiedades ni sus traducciones existentes. La migración es aditiva y está preparada para convivir con el catálogo publicado.

Después de migrar, abre **Administración → Idiomas y diseño** y pulsa **“Traducir todas las fichas publicadas”**. El proceso conserva el español como origen y genera o reemplaza el contenido de cada idioma habilitado. Si una ficha queda pendiente por una interrupción, vuelve a pulsar el mismo botón. Al guardar una vivienda nueva o editar una existente, se repite el mismo proceso automáticamente.

## Paso 3 — Confirmar que los menús llevan a su tarea

Los accesos de la barra lateral ahora abren estas rutas internas. Deben comprobarse una por una después de iniciar sesión como administrador.

| Acceso | Resultado esperado |
|---|---|
| Resumen | Muestra métricas, inventario y actividad. |
| Añadir vivienda | Abre el formulario de nueva vivienda. |
| Importar viviendas | Abre el importador de CSV. |
| Secciones y carruseles | Abre el editor de secciones horizontales de una a cinco viviendas. |
| Mapa de visitas | Abre el mapa privado de contactos y visitas. |
| Vendedores | Abre el formulario de proveedor y autorización. |
| Operaciones | Abre el formulario de operación y comisión. |
| Idiomas y diseño | Abre idioma, diseño, mapa de oficina, reserva y traducción global. |
| Vista previa | Abre la comprobación de publicación y permite abrir borradores privados. |

Cada acceso se implementa mediante `?panel=...`; por tanto, debe permanecer dentro de `/admin` y no producir una ruta 404.

## Paso 4 — Verificar una ficha pública

Abre una ficha con la ruta `/vivienda/{slug}`. Debe mostrar una galería, código de la vivienda, precio, especificaciones, descripción, características verificadas, una zona de mapa desplegable y el botón de reserva. El botón de reserva no debe aparecer en la portada. Debe preseleccionar y guardar automáticamente la URL de la ficha dentro de la solicitud, de modo que el administrador y el vendedor sepan qué vivienda pidió el cliente.

La ficha incorpora tres modos de lectura administrables. **Automática** acorta únicamente textos largos y permite ampliarlos. **Ventana con desplazamiento interno** conserva el alto elegido por el administrador y permite leer el texto dentro del recuadro. **Completa** muestra siempre todo el contenido sin recorte. El administrador selecciona el alto entre 120 y 1.200 píxeles.

Debajo de cada ficha debe aparecer un carrusel de viviendas similares. Prioriza el mismo tipo de inmueble y la misma zona, muestra de una a cinco tarjetas según el ajuste global y tiene flechas de desplazamiento manual. También pueden crearse secciones manuales con cualquier selección de una a cinco viviendas desde **Secciones y carruseles**. Las tarjetas admiten los diseños plano, 3D discreto, sombra editorial y marco premium.

## Paso 5 — Validar contenido y proveedor antes de publicar

Para cada proveedor crea primero una ficha en **Vendedores**. Incluye persona de contacto, canal, código de atribución, el permiso escrito para fotos y textos, y marca la casilla que confirma que puede publicarse. El sistema bloquea la publicación de nuevas fichas de proveedores que no tengan ese permiso marcado.

No uses nombres, logotipos, texto de venta ni datos internos de una inmobiliaria externa dentro de la descripción pública. El sistema añade controles para impedir menciones de la inmobiliaria fuente. La ficha pública debe contener descripción propia, características verificadas, referencia, precio, galería auténtica, ubicación aproximada y condiciones de contacto de Vivienda Nova.

## Paso 6 — Probar antes de publicar

Crea o edita una ficha con estado **Borrador**. Ábrela con el icono de vista previa desde el inventario. Comprueba fotos, traducciones, mapa, botón de reserva, carrusel y contenido. Publica solo cuando la vista sea correcta.

Después de cada publicación confirma que estas URLs devuelven contenido válido: `/robots.txt`, `/sitemap.xml` y `/vivienda/{slug}`. El sitemap obtiene las fichas publicadas en tiempo real; no hay un archivo que deba editarse manualmente. Google podrá descubrir las nuevas fichas cuando vuelva a rastrear el sitio y cuando se envíe el sitemap desde Search Console.

## TEKCE y otros proveedores: decisión correcta ahora

No cargar ni copiar aún ninguna ficha de TEKCE. Su programa público ofrece un código de afiliado y enlaces personalizados para dirigir clientes, con seguimiento en MyTEKCE. Su programa de partnership menciona MyTEKCE y GlobalHomes.app, pero sus páginas públicas no documentan un API, CSV/XML, widget ni permiso general para copiar fotos o descripciones. [1] [2]

El primer modelo seguro es **derivación controlada**: Vivienda Nova muestra una ficha propia solo si TEKCE autoriza el uso del contenido; el enlace externo debe contener el código de afiliado; y la consulta se registra también en Vivienda Nova. Si TEKCE entrega GlobalHomes.app, un feed oficial, un API o un widget, se añadirá un conector específico después de documentar el formato, frecuencia de actualización, atribución, licencia de fotos, disponibilidad y precio.

El pago con criptomonedas de TEKCE se gestiona por TEKCE con aviso previo, KYC, contrato de pago, cartera corporativa y conversión a moneda fiduciaria. No se debe implementar una pasarela, cartera o formulario KYC de criptomonedas en Vivienda Nova. [3]

## Resultado de publicación

Al terminar, deja la versión publicada como una nueva revisión del proyecto original. Conserva el dominio y la base de datos existentes. Entrega un breve registro con migraciones aplicadas, número de fichas traducidas, URL de sitemap comprobada y una ficha de prueba usada en vista previa.

## Referencias

[1]: https://tekce.com/corporate/affiliate-program "TEKCE Real Estate Affiliate & Referral Program"
[2]: https://tekce.com/corporate/partnership "TEKCE Real Estate Partnership Program"
[3]: https://tekce.com/pay-with-cryptocurrency "Pay with Cryptocurrency | Buy Real Estate with BTC, ETH & USDT"

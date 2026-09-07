# Instrucciones de aplicación — Vivienda Nova

**Destinatario:** Manus AI que gestione el proyecto original publicado de Vivienda Nova.

## Objetivo

Aplicar el ZIP adjunto al proyecto actual de Vivienda Nova sin sustituir su identidad visual. Ejecutar sus migraciones, importar el catálogo completo de LRCostaHomes como borrador y validar el resultado antes de publicar. Esta entrega se ha preparado desde una cuenta de Manus distinta; por esa razón el código y los datos se proporcionan como archivos adjuntos y no se han aplicado directamente a la base de datos del proyecto publicado.

> **Regla principal:** conservar el diseño actual de la web. No rediseñar los paneles, la tipografía editorial, los colores, la portada ni el tamaño visual de los nombres de propiedades. Las modificaciones son funcionales.

## Archivos adjuntos requeridos

| Archivo | Uso |
|---|---|
| `vivienda-nova2-admin-botones-final.zip` | Código completo actualizado. Este archivo contiene todas las mejoras acumuladas. |
| `LRCOSTAHOMES_CATALOGO_COMPLETO_109.csv` | Catálogo extraído de 109 propiedades públicas de LRCostaHomes. |
| `INFORME_CATALOGO_LRCOSTAHOMES.md` | Resumen de extracción, cifras y advertencias de calidad de datos. |

## Cambios funcionales que ya contiene el ZIP

### Gestión de propiedades

El administrador permite crear, editar, publicar y eliminar viviendas. Cada ficha incluye un **precio visible** y un **precio numérico editable**. El precio numérico se usa para ordenar correctamente las propiedades. Al modificarlo desde el administrador, el precio visible se actualiza automáticamente en formato euro.

Cada ficha dispone también de **código de agencia o referencia**, **precio original de fuente**, **URL de ficha fuente** y **orden manual**. El código debe conservar la referencia real de LRCostaHomes. El precio original queda almacenado para comparar futuras modificaciones con el dato de origen.

El orden público prioriza el orden manual. Cuando varias fichas tienen la misma prioridad manual, se ordenan por precio de mayor a menor. Los controles ↑ y ↓ del administrador permiten mover una vivienda sin editar el resto.

### Importación CSV

El administrador incorpora un importador CSV ampliado. El archivo de catálogo incluye: títulos, slugs, dirección, ciudad, zona, provincia, país, tipo, precio visible, precio numérico, código, precio de fuente, URL de fuente, orden manual, dormitorios, baños, superficie, descripción, imagen principal, galería, etiqueta, estado, modo de enlace, enlace externo y código de referido.

Las 109 fichas deben importarse inicialmente como **borrador**. Esto permite comprobar información y medios antes de que cualquier propiedad aparezca públicamente.

### Traducciones automáticas

Al crear o guardar una ficha, el sistema genera las traducciones de título, ciudad, zona, tipo, etiqueta y descripción a los idiomas habilitados en la configuración de Vivienda Nova. Confirmar que la configuración de idiomas del proyecto original conserve los idiomas deseados antes de efectuar una importación masiva.

### Fotos y galería

Cada propiedad puede incluir una imagen principal y una galería. El catálogo contiene **2.974 URLs de imágenes** obtenidas de las fichas públicas de LRCostaHomes, con hasta 30 imágenes por vivienda. La tarjeta pública conserva la imagen principal. El detalle de propiedad muestra miniaturas de la galería.

Las URLs son actualmente enlaces externos de la fuente. Antes de publicar, comprobar que las imágenes cargan correctamente. Para máxima estabilidad y para no depender de los enlaces de terceros, descargar y copiar las imágenes al almacenamiento del proyecto original de Manus, actualizando `imageUrl` y `galleryUrls` con las URLs internas generadas por ese almacenamiento. No publicar automáticamente 2.974 imágenes sin revisar peso, estabilidad y autorización de uso.

### Ubicación y Google Maps

Cada tarjeta pública incluye un icono de ubicación junto con la ciudad o zona. Al pulsarlo, se abre un panel con un mapa de Google Maps que busca por dirección, zona, ciudad y país de la vivienda. No requiere clave de Google Maps para la búsqueda básica mediante iframe.

Cuando la fuente solo proporcione ciudad o zona, el mapa señalará una ubicación aproximada. Si se requiere un punto exacto, completar la dirección o incorporar coordenadas verificadas antes de publicar.

### Carga multimedia y estabilidad visual

Las imágenes usan carga diferida (`loading="lazy"`), decodificación asíncrona (`decoding="async"`) y control de errores para reducir cargas lentas y evitar que una imagen fallida mantenga un marco vacío o parpadeante. Verificar esta conducta con una conexión móvil antes de publicar.

### Paneles editoriales

El administrador mantiene el gestor de tarjetas editoriales. Se pueden añadir bloques de imagen o vídeo, definir título y texto, cambiar color de fondo, color de texto, ancho y alto, y activar o desactivar cada bloque. Esta función conserva el diseño editorial de la web pública.

### Botones del administrador

Se revisaron los controles del administrador. Los botones de añadir vivienda, importar CSV, vendedores, operaciones y ajustes abren la sección o formulario correspondiente. Los botones de editar, subir, bajar y eliminar de las fichas también tienen su función asociada. Los botones Cerrar de los formularios se marcaron como `type="button"` para evitar que envíen un formulario por accidente. Los botones Guardar conservan `type="submit"`.

## Migraciones obligatorias

Antes de importar el CSV, aplicar las migraciones en este orden, además de las migraciones anteriores que el proyecto original ya tenga:

| Orden | Migración | Propósito |
|---:|---|---|
| 1 | `drizzle/0010_property_catalog_fields.sql` | Añade código de agencia, precio de fuente, URL de fuente y orden manual. |
| 2 | `drizzle/0011_property_gallery.sql` | Añade el campo de galería `galleryUrls`. |

Realizar una copia de seguridad de la base de datos antes de aplicar migraciones o importaciones. La orden es importante porque el CSV depende de esos campos.

## Procedimiento obligatorio de aplicación

1. Abrir el proyecto original publicado de Vivienda Nova en la cuenta propietaria.
2. Crear un punto de restauración o copia de seguridad de la base de datos y del proyecto.
3. Descomprimir el ZIP y comparar o aplicar sus cambios al proyecto actual. No sustituir configuración de secretos, dominio, autenticación ni variables de entorno sin revisar.
4. Aplicar `0010_property_catalog_fields.sql` y, después, `0011_property_gallery.sql`.
5. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build`. La entrega original pasó TypeScript, 14 pruebas automatizadas y compilación de producción.
6. Iniciar una vista previa del proyecto original. Confirmar que portada, navegación, cookies, formularios y administrador conservan su funcionamiento.
7. Iniciar sesión como administrador y revisar cada acción principal: Añadir vivienda, Importar CSV, Vendedores, Añadir operación, Idiomas y diseño, Editar, Subir, Bajar, Eliminar y Cerrar.
8. Importar `LRCOSTAHOMES_CATALOGO_COMPLETO_109.csv` como **borrador**. Si el importador actual no admite el campo `gallery`, verificar que se esté utilizando la versión del componente incluida en el ZIP.
9. Comprobar el conteo: deben crearse 109 fichas. Confirmar que 108 tienen precio numérico y que una ficha sin precio queda en borrador hasta una revisión humana.
10. Verificar una muestra representativa de propiedades: la más cara, una de precio medio, una de precio bajo, una con muchas fotos y la ficha sin precio.
11. Revisar: precio, código, enlace a LRCostaHomes, imagen principal, miniaturas, icono de mapa, traducciones y botón de referido.
12. Confirmar que el listado público muestra primero las fichas más caras cuando no hay un orden manual diferente.
13. Publicar únicamente las fichas verificadas. Mantener la propiedad sin precio visible como borrador.
14. Publicar la versión de la web solo después de esta validación.

## Datos de validación del catálogo

| Métrica | Resultado esperado |
|---|---:|
| Fichas totales | 109 |
| Fichas con precio numérico | 108 |
| Fichas sin precio visible | 1 |
| URLs de imágenes incluidas | 2.974 |
| Máximo de imágenes por ficha | 30 |
| Precio más alto extraído | 1.700.000 € |

La ficha sin precio numérico aparece como **Villa** en el catálogo fuente. No asignar un precio estimado. Confirmar el precio directamente en LRCostaHomes antes de cambiarla a publicada.

## Límites y decisiones pendientes

La importación no debe borrar automáticamente las fichas antiguas. Si el propietario decide reemplazarlas, hacerlo de forma separada después de comprobar que las nuevas 109 propiedades están correctas. Primero ocultar o despublicar las fichas anteriores. Eliminar datos es una acción irreversible y requiere una copia de seguridad confirmada.

No modificar el proveedor de autenticación, la configuración de Google Maps, los pagos, reservas, chatbot ni integraciones externas como parte de esta entrega. No fueron solicitados para esta fase.

## Criterio de finalización

La tarea estará terminada cuando el proyecto original conserve su diseño, el administrador responda a todos los botones, las migraciones estén aplicadas, las 109 fichas nuevas estén cargadas como borrador o publicadas tras revisión, los precios se puedan editar, las galerías se vean, el mapa se abra y las páginas compilen sin errores.

## Referencias

[1]: https://lrcostahomes.com/es/ "LRCostaHomes — propiedades en España"
[2]: https://lrcostahomes.com/es/properties-search/ "LRCostaHomes — búsqueda de propiedades"

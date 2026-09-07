# Guía unificada de fusión y publicación — Vivienda Nova

**Destinatario:** Manus AI de la cuenta que contiene el proyecto publicado de Vivienda Nova.  
**Objetivo:** integrar esta actualización en el proyecto original sin perder ninguna función que exista solamente en la versión actualmente publicada.

> **Regla principal:** no reemplaces ni publiques el ZIP recibido de forma ciega. Primero conserva una copia del proyecto publicado y compara los cambios. El paquete contiene mejoras completas, pero la otra versión puede incluir funciones posteriores que solo existen allí.

## 1. Por qué esta actualización es mejor

Esta entrega concentra las correcciones del catálogo y las mejoras de administración en una base coherente. Cada propiedad puede conservar un precio real, un código de agencia, una descripción propia, una galería, características verificables, una ubicación y un orden manual. La web pública no debe repetir el texto de otra agencia ni mostrar un precio genérico. El administrador también tiene accesos explícitos a cada herramienta para evitar botones que no llevan a ningún sitio.

| Aspecto | Resultado de esta actualización |
|---|---|
| Catálogo | Actualización de 109 fichas por URL de origen, sin duplicados |
| Fichas | Descripción propia, características, galería de imágenes, referencia y ubicación |
| Precio | Precio real editable, precio de fuente para revisión y orden por precio o manual |
| Traducciones | Al crear, editar o actualizar una ficha, se generan las versiones de los 12 idiomas configurados |
| Fotografías | JPG, PNG, WebP y AVIF de hasta 20 MB se convierten a WebP optimizado, con orientación correcta y un máximo de 2048 px |
| Carga visual | Imagen de reserva estable cuando una URL externa falla, carga diferida fuera del primer bloque y vídeo con `preload=metadata` |
| Búsqueda | País predeterminado España, provincia, municipio/ciudad, barrio/zona, texto, referencia, dirección, tipo, presupuesto y dormitorios |
| Mapa privado | Botón de mapa de clientes: agrupa marcadores superpuestos y al pulsar abre tarjetas separadas con línea indicadora hasta el punto |
| Contenido | Botones funcionales para imagen/vídeos de portada y tarjetas editables de foto o vídeo |
| Seguridad | Sesión del área privada caduca a los 30 minutos; cookie `HttpOnly` y `Secure` cuando la conexión es HTTPS |
| SEO Google | `robots.txt` y sitemap XML dinámico; cada vivienda publicada tiene URL permanente, canónica y datos estructurados |
| Reserva | Botón editable solo dentro de la ficha de vivienda; registra una solicitud privada, sin cobros automáticos |
| Mapas | Mapa de cada vivienda, mapa privado de clientes y bloque opcional de mapa del negocio configurable en administrador |
| Vista previa | Borradores privados revisables por administrador antes de publicarlos |

## 2. Contenido de la carpeta de Drive

| Carpeta o archivo | Uso correcto |
|---|---|
| `01_PAQUETE_TECNICO/VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v3_2.zip` | Código completo de referencia con todas las mejoras acumuladas, la depuración geográfica y galerías verificadas. No contiene `node_modules`. |
| `02_CATALOGO/CORRECCION_DETALLES_CARACTERISTICAS_109.csv` | Datos de las 109 fichas: textos propios, características, galerías, códigos, coordenadas y precios verificados. |
| `00_LEER_PRIMERO/GUIA_UNIFICADA_PARA_MANUS_ORIGINAL.*` | Esta guía. Hay una copia Markdown y un documento Google Docs. |
| `00_LEER_PRIMERO/RECOMENDACIONES_PORTAL_INMOBILIARIO.md` | Plan de producto y mejoras recomendadas, fundamentado con fuentes públicas. |
| `03_PROYECTO_ORIGINAL_PARA_FUSIONAR/` | Carpeta de entrada. El propietario debe subir aquí un ZIP completo descargado del proyecto publicado original. No eliminar ni sustituir archivos existentes de esa versión. |

## 3. Procedimiento obligatorio, paso por paso

### Paso 1. Preservar el proyecto publicado

Crea un checkpoint o una copia descargable del proyecto original que está publicado. No apliques migraciones, no borres tablas y no publiques cambios antes de disponer de ese punto de retorno. Comprueba qué dominio está publicado y qué versión está activa.

### Paso 2. Entregar el original para la fusión

Descarga el proyecto completo de la otra cuenta de Manus como ZIP y súbelo a la carpeta de Drive `03_PROYECTO_ORIGINAL_PARA_FUSIONAR/`. Nómbralo, por ejemplo, `VIVIENDA_NOVA_ORIGINAL_PUBLICADO_2026-09-06.zip`.

Después, escribe en este chat: **“El original ya está en Drive para fusionar.”** La fusión se realizará tomando como base el original publicado y comparándolo con este paquete. No hace falta que el propietario copie archivos a mano.

### Paso 3. Comparar, no sobrescribir

Descomprime ambos paquetes en carpetas distintas. Compara `package.json`, `pnpm-lock.yaml`, `drizzle/`, `server/`, `client/src/` y los archivos de configuración. Conserva todas las funciones que solo existan en el proyecto publicado. Integra las siguientes rutas y archivos de esta actualización cuando no tengan una alternativa más reciente en el original:

| Área | Archivos principales que deben revisarse o fusionarse |
|---|---|
| Datos y migraciones | `drizzle/schema.ts`, migraciones `0009` a `0014` |
| Propiedades, traducción y fotos | `server/db.ts`, `server/routers.ts`, `server/translation.ts`, `server/storage.ts` |
| Sesión segura de 30 minutos | `shared/const.ts`, `server/_core/oauth.ts`, `client/src/_core/hooks/useAuth.ts`, `server/sessionSecurity.test.ts` |
| Portada, buscador y SEO | `client/src/pages/Home.tsx`, `client/src/pages/PropertyDetail.tsx`, `client/src/lib/i18n.ts`, `client/src/index.css`, `server/seo.ts`, `server/_core/index.ts` |
| Administrador | `client/src/pages/Admin.tsx`, `client/src/pages/Admin.css`, `client/src/components/DashboardLayout.tsx` |
| Componentes nuevos | `ClientLeadsMap.tsx`, `OfficeMap.tsx`, `HeroVideoManager.tsx`, `HeroImageManager.tsx`, `EditorialCardsManager.tsx`, `EditorialCards.tsx`, `PropertyImporter.tsx` |

### Paso 4. Mantener la seguridad de sesión

La versión integrada debe conservar estas condiciones exactas. El administrador requiere una nueva autenticación después de **30 minutos** desde el inicio de sesión. Esto se configura mediante `ADMIN_SESSION_TTL_MS = 1000 * 60 * 30`, usado tanto para el token como para la cookie. La consulta de sesión del navegador se vuelve a comprobar cada minuto y al recuperar el foco.

No sustituir estos archivos por una configuración de un año. La prueba `server/sessionSecurity.test.ts` debe pasar. La portada pública no solicita inicio de sesión; solo la ruta privada `/admin` se protege.

### Paso 5. Instalar dependencias y aplicar la base de datos con seguridad

Después de integrar el código, ejecutar `pnpm install`, `pnpm check`, `pnpm test -- --run` y `pnpm build`. La dependencia nueva para fotografías es `sharp` y debe estar declarada en `package.json` y bloqueada en `pnpm-lock.yaml`.

Inspeccionar el historial real de migraciones de la base de datos. Aplicar únicamente los SQL que aún no estén aplicados. No volver a ejecutar migraciones ya registradas. Las migraciones de catálogo y detalle relevantes son `0010_property_catalog_fields.sql`, `0011_property_gallery.sql`, `0012_property_details.sql`, `0013_property_translation_features.sql` y `0014_seo_reservation_settings.sql`.

### Paso 6. Probar el administrador antes de publicar

Abrir `/admin` con una cuenta administradora. Probar cada botón de la cabecera: **Añadir vivienda**, **Importar / actualizar CSV**, **Vídeos portada**, **Tarjetas con foto o vídeo**, **Mapa de clientes**, **Vendedores**, **Añadir operación**, **Idiomas y diseño** y **Vista previa y actualizaciones**. Cada botón debe abrir su herramienta y el botón **Cerrar** debe volver al panel sin enviar formularios.

En **Multimedia de portada** se debe poder cambiar la imagen y gestionar los vídeos. En **Tarjetas con foto o vídeo** se debe poder crear una tarjeta, modificar ancho, alto, fondo y color de texto, cargar su archivo y guardar. En el formulario de una propiedad se deben ver los campos de precio numérico, referencia, galería completa, características, latitud y longitud. El administrador no permite publicar si la descripción, título o etiqueta mencionan la inmobiliaria fuente.

### Paso 7. Corregir las 109 propiedades existentes

Una vez publicado el código y aplicadas las migraciones, entrar en el administrador y pulsar **Importar / actualizar CSV**. Elegir `CORRECCION_DETALLES_CARACTERISTICAS_109.csv`. El modo correcto se detecta como actualización.

Revisar la vista previa. Para corregir todas, pulsar **Actualizar las 109 fichas** una sola vez y esperar a que termine. El proceso encuentra cada ficha por su `sourceUrl`; por eso actualiza la ficha existente y no crea duplicados. También renueva sus traducciones. Para probar primero, seleccionar una vivienda en **Actualizar una ficha concreta** y pulsar **Actualizar esta ficha**.

No usar el modo de importación antigua para crear de nuevo las 109 viviendas. Si una fila indica que no fue encontrada, revisar que la URL de fuente de la ficha existente coincida exactamente con la URL del CSV.

### Paso 8. Comprobar la web pública

Comprobar al menos cinco viviendas de distintos precios. Deben aparecer el título correcto, precio, referencia, ubicación, descripción propia, características existentes, fotos y mapa. No debe aparecer el nombre de otra inmobiliaria en las descripciones. Cuando una propiedad no tenga piscina, garaje o jardín, no se debe inventar esa característica.

Comprobar el buscador con España preseleccionado. Seleccionar una provincia y confirmar que se actualizan sus municipios. Seleccionar un municipio y confirmar que se actualizan barrios o zonas. Probar una referencia, una dirección y el orden por precio alto. Las viviendas más caras se ven primero cuando comparten el mismo orden manual. Los botones de subir y bajar permiten cambiar ese orden desde el administrador.

### Paso 9. Probar las fotos y el mapa privado

Cargar una fotografía de prueba JPG o PNG de calidad alta. Debe guardarse como WebP, conservar proporciones y no superar 2048 píxeles por lado. La ficha debe abrirse sin bordes parpadeantes. Las imágenes existentes cuya URL externa caiga muestran una imagen de reserva en lugar de un hueco vacío.

Crear dos solicitudes de construcción con las mismas coordenadas o abrir datos existentes equivalentes. Abrir **Mapa de clientes**, pulsar el marcador agrupado y confirmar que cada cliente se visualiza en tarjetas pequeñas desplazadas, no superpuestas. La línea fina de cada tarjeta señala el marcador exacto. Este mapa es privado y solo incluye solicitudes con coordenadas y consentimiento de privacidad; no debe ser accesible desde la web pública.

### Paso 10. Validar SEO, reserva y mapas

Comprobar `/robots.txt` y `/sitemap.xml` en el dominio de producción. El sitemap debe incluir una URL por cada vivienda publicada y no incluir borradores ni `/admin`. Definir `PUBLIC_APP_URL` con el dominio real antes de publicar. Abrir una ficha individual `/vivienda/SLUG`, verificar su URL canónica, datos estructurados, fotos, características, mapa y el formulario **Solicitar reserva**. La reserva debe crear un contacto privado sin cobro automático.

Para activar el mapa del negocio, pegar en **Idiomas y diseño** un enlace de inserción de Google Maps, no una dirección inventada. Para probar un borrador, utilizar el icono de vista previa de la vivienda desde el administrador; ese enlace requiere sesión y no acepta reservas.

### Paso 11. Publicar con reversión disponible

Publicar únicamente cuando las pruebas técnicas y las comprobaciones anteriores terminen correctamente. Mantener disponible el checkpoint del Paso 1. Si aparece una regresión, volver al checkpoint y revisar la fusión, no borrar los datos de catálogo ni los contactos.

## 4. Mensaje de trabajo listo para copiar en Manus AI (English)

> You are updating the **published original Vivienda Nova WebDev project**. Do not overwrite the project with another ZIP. First create a checkpoint and download a full backup of the published source. Compare it against `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v3_2.zip` from the shared Drive folder and merge the changes while preserving every original-only feature. Apply only missing database migrations after checking the migration ledger. Keep the admin session expiry at exactly 30 minutes (`ADMIN_SESSION_TTL_MS`) with secure `HttpOnly` cookies. Verify every admin action opens its correct tool. Deploy only after `pnpm check`, `pnpm test -- --run`, and `pnpm build` pass. Then use `CORRECCION_DETALLES_CARACTERISTICAS_109.csv` in **Import / update CSV** in update mode, test one row first, and finally update the remaining listings by matching `sourceUrl`, never creating duplicates. Verify descriptions do not name source agencies, only verified features appear, prices and references are correct, photo uploads are converted server-side to WebP, the geographic search defaults to Spain, and the private lead map groups overlapping points into offset cards with a fine callout line. Keep the dynamic robots.txt and sitemap.xml routes, set PUBLIC_APP_URL to the final public domain, apply migration 0014, and verify each published property has its /vivienda/slug page, canonical URL, JSON-LD, verified gallery, and editable reservation CTA. The reservation CTA only appears on individual property pages, submits a private availability request, and never charges the visitor. Do not add Colombia, payment links, cash-register logic, reservation bots, or public client maps; those were voice-transcription mistakes and are not part of this release.

## 5. Exclusiones expresas

Esta actualización **no** añade Colombia, caja registradora, enlaces de pago, chat de reservas ni un mapa público de clientes. Sí incorpora una **solicitud de reserva privada** por ficha, pendiente de confirmación manual y sin pagos automáticos. Esos conceptos se descartaron porque fueron errores del reconocimiento por voz. Tampoco muestra en las fichas el nombre de las inmobiliarias de origen.

## 6. Recomendaciones posteriores de producto

La siguiente fase recomendable es una comparación de propiedades y favoritos persistentes, páginas indexables de zona/tipo con política SEO, datos estructurados de ficha, analítica del embudo de búsqueda, llamadas a la acción de visita visibles en móvil y un registro auditable de cambios en el CRM. Estas recomendaciones se explican con fuentes en el documento específico de Drive.

## References

[1]: https://web.dev/articles/top-cwv "The most effective ways to improve Core Web Vitals"
[2]: https://developers.google.com/search/docs/appearance/google-images "Google image SEO best practices"
[3]: https://developers.google.com/search/docs/faceted-navigation "Managing crawling of faceted navigation URLs"
[4]: https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites "Managing multi-regional and multilingual sites"
[5]: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html "Authentication Cheat Sheet — OWASP Cheat Sheet Series"
[6]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html "Authorization Cheat Sheet — OWASP Cheat Sheet Series"
[7]: https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng "Regulation (EU) 2016/679 (GDPR), Articles 5 and 25"
[8]: https://www.w3.org/TR/WCAG22/ "Web Content Accessibility Guidelines (WCAG) 2.2"

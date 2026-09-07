# Vivienda Nova — SEO, reservas, mapas y actualizaciones seguras

## 1. Sitemap y robots de Google

La aplicación dispone de dos rutas técnicas generadas en el servidor:

| Ruta | Función |
|---|---|
| `/sitemap.xml` | Incluye la portada y una URL permanente por cada vivienda publicada. Se recalcula consultando el catálogo publicado: cuando una vivienda se guarda como **publicada**, aparece automáticamente en el siguiente acceso al sitemap. |
| `/robots.txt` | Permite el rastreo público, impide el rastreo de `/admin` y de la API, e indica la URL del sitemap. |

No existe un archivo XML que haya que modificar a mano ni una tarea programada que dependa de créditos. El servidor construye el sitemap con datos reales del catálogo. Antes de publicar con dominio propio se debe configurar `PUBLIC_APP_URL` con la URL final, por ejemplo `https://www.tudominio.es`, para que las URL canónicas y el sitemap usen ese dominio.

Una vez publicada la integración, verificar en el navegador:

```text
https://TU-DOMINIO/sitemap.xml
https://TU-DOMINIO/robots.txt
```

Después añadir la propiedad del dominio a Google Search Console y enviar la URL del sitemap. Google determina su propia frecuencia de rastreo; el sitemap comunica cambios, pero no garantiza indexación inmediata.

## 2. Fichas individuales preparadas para buscadores

Cada vivienda publicada tiene ahora una URL permanente:

```text
/vivienda/SLUG-DE-LA-VIVIENDA
```

La ficha incluye título propio, descripción, precio, código de referencia, localización, mapa, galería, características verificadas y datos estructurados de tipo `RealEstateListing`. También se añade una URL canónica y descripción meta. Solo las viviendas **publicadas** se incluyen en el sitemap.

Nunca utilizar contenido que mencione la agencia de origen como descripción pública. Cada alta debe incluir título, precio, referencia, ciudad/zona, descripción propia, características confirmadas, imagen principal y galería. Si no se confirma una característica, se deja vacía. El administrador bloquea la publicación si el título, etiqueta o descripción contienen el nombre de la inmobiliaria fuente. También permite añadir una URL de foto por línea en **Galería completa**, para que la ficha mantenga todas sus fotografías verificadas, no solo la imagen principal.

## 3. Reservas de propiedades

El botón **Solicitar reserva** solo aparece al abrir una ficha individual; no aparece en la página de inicio. El botón abre un formulario de solicitud con nombre, correo, teléfono, fecha preferida, número de personas, mensaje y dos consentimientos. No cobra dinero ni confirma una reserva automática: crea un contacto privado en el administrador y avisa al propietario para validar disponibilidad.

El administrador puede modificar el texto, fondo y color del botón en **Idiomas y diseño**. El color inicial es verde suave `#8bbf9f`, coherente con la paleta de Vivienda Nova. Las solicitudes se identifican en el CRM con el prefijo `[SOLICITUD DE RESERVA]`.

## 4. Mapas

- **Cada propiedad:** el icono de ubicación abre el mapa de la vivienda. En la ficha individual se muestra también un botón de localización.
- **Mapa de clientes:** solo está dentro del administrador y muestra contactos con consentimiento y ubicación; los puntos coincidentes se agrupan y se abren como tarjetas separadas.
- **Mapa del negocio:** se puede activar desde **Idiomas y diseño** pegando un enlace de inserción de Google Maps que empiece por `https://www.google.com/maps/`. No se ha configurado una dirección por defecto para evitar mostrar una localización inventada.

## 5. Vista previa antes de publicar

### Cambios de contenido

1. Crear o editar la vivienda.
2. Mantener el estado **Borrador**.
3. Pulsar el icono de vista previa de la ficha en la lista del administrador.
4. Revisar fotos, galería, texto, precio, referencia, características y mapa.
5. Cambiar el estado a **Publicada** solo cuando todo sea correcto.

La vista previa de un borrador requiere una sesión de administrador y no acepta reservas. Un borrador no aparece en la portada, el sitemap ni buscadores.

### Cambios de programación

Un ZIP de código no debe ejecutarse automáticamente desde un navegador: sería inseguro y podría romper el sitio publicado. El flujo correcto es:

1. Subir el proyecto original a la carpeta de Drive de fusión.
2. Comparar el proyecto publicado con la actualización.
3. Instalar dependencias y aplicar solo migraciones pendientes.
4. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build`.
5. Abrir una vista previa de prueba.
6. Publicar únicamente si se valida todo, conservando un checkpoint para volver atrás.

Esto permite probar las mejoras sin afectar la web visible. Para automatizar completamente el despliegue de ZIP desde el administrador se necesita configurar un servicio de compilación y publicación conectado al proyecto original; no debe añadirse sin acceso a la cuenta donde vive esa publicación.

## 6. Rendimiento y errores habituales de Search Console

La actualización mantiene conversión administrativa a WebP, límite de 2048 px, imágenes diferidas fuera de pantalla y sustitución visual cuando falla una imagen externa. Además, el administrador, las páginas legales y la ficha completa se cargan solo al abrirse, reduciendo la descarga inicial de la portada. Antes de revisar Search Console se debe comprobar que no haya enlaces rotos, que la página responda en HTTPS y que no exista una URL canónica distinta al dominio real.

Los errores concretos de Google Search Console no estaban incluidos en el material recibido en esta conversación. Cuando se disponga de capturas o exportación de los mensajes exactos —por ejemplo, “Página con redirección”, “Rastreada, actualmente sin indexar”, “Error 404”, “LCP” o “Datos estructurados no válidos”— se deben corregir sobre cada URL afectada, no adivinar el motivo.

## 7. Próximas mejoras recomendadas

| Prioridad | Mejora | Beneficio |
|---|---|---|
| Alta | CTA de visita o videollamada en ficha móvil | Facilita convertir interés en contacto. |
| Alta | Favoritos persistentes y comparador de 2–3 viviendas | Ayuda a quienes vuelven a evaluar opciones. |
| Alta | Medición búsqueda → ficha → solicitud | Muestra dónde se pierden los posibles clientes. |
| Media | Páginas de zona con contenido propio | Mejora descubrimiento en búsquedas geográficas sin crear filtros infinitos. |
| Media | Alertas de búsqueda guardada | Avisa cuando se publica una vivienda que encaja con criterios del usuario. |
| Media | Auditoría de precios y cambios | Contrasta precio fuente y precio visible antes de una actualización. |
| Media | Registro de historial CRM | Indica quién cambió un cliente, una ficha o el estado de una operación. |
| Media | Accesibilidad de formularios y contraste | Reduce abandonos y facilita el uso con teclado o lector de pantalla. |

## Referencias

[1] Google Search Central, [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

[2] Google Search Central, [Introduction to structured data markup](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data).

[3] Google Search Central, [Managing crawling of faceted navigation URLs](https://developers.google.com/crawling/docs/faceted-navigation).

[4] web.dev, [The most effective ways to improve Core Web Vitals](https://web.dev/articles/top-cwv).

[5] OWASP, [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

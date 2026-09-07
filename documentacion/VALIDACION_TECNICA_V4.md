# Validación técnica — Vivienda Nova v4.0

**Fecha:** 7 de septiembre de 2026.

La actualización v4.2 ha superado la comprobación de tipos con `pnpm check`. También ha superado las pruebas automatizadas con **24 pruebas correctas en 11 archivos de prueba**, incluyendo autorización, cierre de sesión, consentimiento, referidos internos, SEO, seguridad de sesión, configuración, importación, catálogo y enlace de WhatsApp. La compilación de producción con `pnpm build` ha terminado correctamente.

La revisión local comprobó que la portada responde con estado HTTP 200. Las rutas públicas de SEO devolvieron contenido válido: `robots.txt` permite el rastreo público, excluye `/admin` y `/api/`, y referencia `sitemap.xml`. El sitemap se generó dinámicamente y devolvió la URL de portada. Cuando existan fichas publicadas en la base de datos de la cuenta original, esas fichas se añadirán automáticamente al mismo sitemap.

La vista local no tenía la base de datos publicada con las 109 propiedades conectada, por lo que no era posible revisar visualmente una ficha concreta en esta sesión. La guía de fusión exige comprobar una ficha publicada y una ficha en borrador dentro de la cuenta original después de aplicar la migración `0015`.

La compilación informa de que el bloque inicial de la portada sigue siendo relativamente grande después de minificar. La aplicación mantiene la carga diferida del administrador y de las fichas. Se recomienda como mejora posterior dividir también algunos componentes visuales de la portada si Google Search Console o PageSpeed detectan una necesidad real después de publicar.

En v4.2 se verificó además que la consulta pública elimina los campos internos de proveedor antes de devolver las viviendas al navegador: agencia, URL de fuente, precio de fuente, URL externa, código de derivación y parámetro de atribución. Las fichas de modo `capture` ahora permanecen visibles y capturan la solicitud bajo la marca Vivienda Nova.

# Aplicación de actualización — Vivienda Nova v4.2

**Archivo técnico vigente:** `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v4_2.zip`  
**Sustituye a:** todos los paquetes anteriores, incluido v4.1.

## Decisión comercial incorporada

El proveedor **no se muestra al visitante**. Vivienda Nova es la única marca pública: aparece en la portada, las tarjetas, las fichas, las solicitudes y WhatsApp. La persona interesada abre una ficha de Vivienda Nova, consulta el mapa, pide información o reserva. Sus datos llegan primero al administrador y a los avisos internos del propietario.

El nombre de la agencia, sus teléfonos, enlaces, códigos, precios de fuente y reglas de derivación quedan disponibles únicamente dentro del administrador y los avisos internos. Desde **Operaciones** se envía el contacto al proveedor apropiado después de verificar que el cliente lo ha autorizado. Esto mantiene la atribución de la comisión y evita entregar al cliente directamente a una inmobiliaria externa.

## Aplicación paso a paso

1. Descargar y descomprimir el ZIP v4.2. No instalar los ZIP anteriores uno por uno.
2. Crear un punto de restauración del proyecto publicado. Conservar dominio, usuarios, variables de entorno, credenciales, base de datos y almacenamiento de la cuenta original.
3. Fusionar la carpeta `proyecto/` del ZIP con el código original. No sobrescribir ciegamente los ficheros específicos de producción.
4. Ejecutar `pnpm install --frozen-lockfile`.
5. Aplicar todas las migraciones pendientes: `0014_seo_reservation_settings.sql`, `0015_sections_translation_and_display.sql`, `0016_whatsapp_widget.sql` y **`0017_private_supplier_capture.sql`**.
6. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build`. No publicar si una de las tres comprobaciones falla.
7. Comprobar que las 109 viviendas publicadas aparecen en la portada incluso si su modo es `capture`. Esta es la corrección comercial principal de v4.2.
8. Abrir una ficha pública y verificar que no muestra nombre, logotipo, enlace, código ni datos de ningún proveedor. Debe verse solo Vivienda Nova.
9. Enviar una solicitud de información y una reserva de prueba. En el administrador y aviso interno debe aparecer la ficha, su enlace y, si existe, el proveedor y código interno. El visitante no debe recibir ni ver esos datos.
10. En **Vendedores**, completar el proveedor, la nota del acuerdo y la autorización escrita. No publicar contenido de proveedores no autorizados.
11. En **Operaciones**, seleccionar el proveedor y usar “Preparar derivación” únicamente después de que el cliente haya autorizado compartir sus datos.
12. En **Idiomas y diseño**, configurar botón de reserva, estilos de tarjetas, mapa de oficina, idiomas, número y botón flotante de WhatsApp. Guardar.
13. En **Secciones y carruseles**, crear una sección de prueba con una a cinco viviendas, ordenar, guardar y comprobar que aparece. Editar y eliminar esa prueba para verificar el flujo real.
14. Abrir `robots.txt` y `sitemap.xml` en el dominio publicado. Enviar el sitemap a Google Search Console.
15. Publicar y revisar en ordenador y móvil. Restaurar el punto del paso 2 solo si aparece un problema.

## Funcionamiento de las rutas de ficha

| Configuración interna | Lo que ve el visitante | Qué sucede internamente |
|---|---|---|
| **Vivienda Nova: capturar solicitud** | Ficha propia, mapa, solicitud de información o reserva. | El propietario recibe el lead con ficha y proveedor interno si está asignado. No hay enlace externo. **Es el modo recomendado y predeterminado.** |
| **Capturar solicitud y permitir derivación interna** | Igual: marca Vivienda Nova y solicitud propia. | El administrador decide después si deriva el contacto y a qué proveedor. |
| **Preparar derivación solo desde administrador** | Igual: marca Vivienda Nova y solicitud propia. | El enlace del proveedor se conserva para que el administrador pueda tramitar la derivación autorizada. Nunca se convierte en botón público. |

## Funciones acumuladas que debe contener v4.2

- Fichas con galería, precio y código editables, descripciones, características, mapa bajo demanda, reservas y viviendas similares.
- Formularios que guardan el enlace de la ficha interesada de forma automática.
- Secciones y carruseles reales con una a cinco propiedades, orden, estilos y colores editables.
- Estilos plano, 3D discreto, sombra editorial y marco premium.
- Texto en modo automático, compacto, scroll interno o completo.
- Traducción de fichas nuevas y botón para traducir el catálogo publicado.
- Búsqueda jerárquica por país, provincia, ciudad y zona; España como valor inicial.
- Fotos optimizadas y recuperación visual si falla una URL.
- Sitemap dinámico, robots.txt y páginas indexables de cada ficha.
- Sesión de administrador segura.
- Mapa privado de clientes con agrupación y tarjetas separadas.
- Botón flotante WhatsApp activable, número/mensaje editables, tres estilos y animación opcional.
- **Privacidad comercial:** el catálogo público no transmite al navegador campos de proveedor, URL de fuente, precio fuente, enlace externo, código o parámetro de atribución.

> Las actualizaciones de código se instalan mediante fusión y publicación desde el proyecto, no subiendo un ZIP desde el navegador. El administrador sirve para controlar contenido, proveedores internos y diseño después de la instalación.

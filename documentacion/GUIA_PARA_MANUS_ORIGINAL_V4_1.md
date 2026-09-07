# Aplicación de actualización — Vivienda Nova v4.1

**Archivo técnico vigente:** `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v4_1.zip`  
**Destino:** el proyecto original publicado de Vivienda Nova.  
**Sustituye a:** v3, v3.1, v3.2 y v4.0. No se deben aplicar varios ZIP uno tras otro.

## Objetivo

Esta entrega reúne todas las mejoras anteriores y añade la configuración real del botón flotante de WhatsApp. Debe integrarse mediante fusión con el proyecto publicado, no sobrescribiendo a ciegas los cambios exclusivos de la cuenta original, tales como dominio, base de datos, credenciales, usuarios, almacenamiento y contenido ya publicado.

## Pasos de aplicación

1. Descargar y descomprimir `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v4_1.zip`.
2. Crear un punto de restauración del proyecto publicado y mantener su URL de publicación actual intacta.
3. Comparar la carpeta `proyecto/` del ZIP con el código original. Fusionar las modificaciones y conservar las variables de entorno y credenciales de la cuenta original.
4. Instalar dependencias usando el gestor indicado por el proyecto: `pnpm install --frozen-lockfile`.
5. Aplicar **todas** las migraciones pendientes, especialmente:
   - `0014_seo_reservation_settings.sql`
   - `0015_sections_translation_and_display.sql`
   - `0016_whatsapp_widget.sql`
6. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build`. No publicar si alguno falla.
7. Abrir `/admin`, iniciar sesión como administrador y verificar que los accesos laterales abren su panel: añadir vivienda, importar, secciones y carruseles, mapa de clientes, vendedores, operaciones, idiomas y diseño, y vista previa.
8. En **Idiomas y diseño**, guardar los ajustes una vez. Esto activa los campos nuevos del botón de reserva y WhatsApp.
9. Para WhatsApp, introducir el número con prefijo internacional, por ejemplo `+34 600 000 000`; marcar “Mostrar el botón flotante abajo a la derecha”; seleccionar el diseño; escribir el mensaje inicial; activar o desactivar la animación y escoger su frecuencia. Sin número o con “Mostrar” desactivado, el botón no se muestra.
10. Crear una sección de prueba desde **Secciones y carruseles**: elegir entre una y cinco viviendas, definir título, ubicación, estilo, color y orden; guardar; abrir la portada y comprobar que aparece. Editar y borrar esa sección de prueba para confirmar que los botones ejecutan acciones reales.
11. Abrir una vivienda publicada mediante `/vivienda/<slug>`. Confirmar galería, características, mapa bajo demanda, formulario de reserva y carrusel de propiedades similares. Enviar una prueba con una dirección de correo controlada y confirmar que el mensaje del administrador incluye título, código y URL de la ficha.
12. En **Idiomas y diseño**, pulsar “Traducir todas las fichas publicadas”. Esperar el resultado y abrir al menos una ficha en cada idioma habilitado para comprobar título, descripción y características.
13. Revisar `https://DOMINIO/robots.txt` y `https://DOMINIO/sitemap.xml`. Deben cargar sin autenticación y el sitemap debe incluir las fichas publicadas. Añadir ese sitemap en Google Search Console desde la cuenta propietaria.
14. Publicar la actualización y revisar en móvil, tableta y ordenador. Si hay un problema, restaurar el punto creado en el paso 2.

## Mejoras que deben quedar visibles

| Área | Resultado esperado |
|---|---|
| Fichas | Página individual con galería, código, precio editable, texto, características, mapa desplegable, reserva y propiedades similares. |
| Contactos | Tanto la solicitud de información como la reserva incluyen automáticamente el enlace de la vivienda. |
| Carruseles | Secciones manuales de 1 a 5 viviendas y carrusel automático de similares por tipo/zona. |
| Administrador | Los accesos laterales llevan al panel correspondiente y las secciones tienen creación, edición, orden y borrado reales. |
| Idiomas | Al guardar una ficha se traducen título, descripción, zona, tipo, etiqueta y características; el botón masivo actualiza fichas existentes. |
| Tarjetas | Plano editorial, 3D discreto, sombra editorial o marco premium. |
| Textos largos | Automático, compacto, ventana con scroll editable o texto completo. |
| Rendimiento | Fotos nuevas optimizadas, galería de carga diferida y respaldo visual si una URL falla. |
| SEO | Fichas indexables, `robots.txt` y sitemap dinámico. |
| WhatsApp | Botón flotante real, pequeño y abajo a la derecha; se abre en WhatsApp con mensaje; tres diseños, mostrar/ocultar, animación opcional y frecuencia editable. |

## Reglas de proveedores

No importar ni copiar fichas, fotos, textos, precios o características de ninguna inmobiliaria sin autorización escrita. Para cada proveedor autorizado, crear un vendedor en el administrador, guardar fecha y alcance de permiso en “Permiso y condiciones de publicación”, y marcar la confirmación de autorización. La aplicación bloquea la publicación de fichas de un proveedor si ese permiso no está registrado.

## Archivos complementarios dentro de `ENTREGA/`

- `CORRECCION_DETALLES_CARACTERISTICAS_109.csv`: corrección histórica de textos, características y galerías del catálogo original.
- `INFORME_V4_TEKCE_Y_PLAN_DE_PRODUCTO.md`: análisis de integración genérica de proveedores autorizados y recomendaciones.
- `VALIDACION_TECNICA_V4.md`: resultados de las comprobaciones automatizadas.
- `ESTADO_TAREAS_V4.md`: resumen de mapa, reservas y carruseles que se encuentran incluidos.

> El ZIP es código de actualización. No se puede ejecutar desde el administrador del navegador por motivos de seguridad. El administrador permite editar **contenido** y configurar WhatsApp, pero una mejora de programación debe fusionarse, probarse y publicarse desde el entorno del proyecto.

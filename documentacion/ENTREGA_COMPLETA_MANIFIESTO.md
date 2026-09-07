# Vivienda Nova — Entrega completa final

Este paquete sustituye a todas las entregas anteriores. Incluye el proyecto completo, las migraciones acumuladas, el CSV de corrección de catálogo y la guía de aplicación.

## Funciones incluidas

| Área | Incluido |
|---|---|
| Diseño público actual | Conservado |
| Carga de portada | Imagen de reserva, carga diferida de medios y controles de vídeo |
| Vídeos de portada | Administrador: cargar, ordenar y eliminar vídeos MP4/WebM |
| Tarjetas editoriales | Administrador: crear tarjetas de foto o vídeo, ajustar ancho, alto y colores |
| Precios | Precio visible, precio numérico editable, precio de fuente y orden manual |
| Códigos | Código de referencia de cada ficha visible y editable |
| Orden | Precio descendente por defecto; botones para subir o bajar manualmente |
| Galerías | Galería de fotos en el detalle de cada vivienda |
| Mapas | Botón de ubicación con coordenadas para abrir el punto de la propiedad |
| Características | Campo editable y etiquetas verificadas como piscina, jardín o garaje |
| Idiomas | Traducción de título, lugar, descripción y características al guardar una ficha |
| Actualización masiva | Actualiza 109 fichas existentes por URL fuente, sin duplicarlas |
| Actualización individual | Selector para corregir una sola ficha |
| CSV | Lector robusto: las comas dentro de las descripciones no rompen las columnas |

## Migraciones incluidas

Las migraciones `0000` a `0013` están dentro de `drizzle/`. Para una instalación que ya recibió las actualizaciones anteriores, aplicar únicamente las nuevas pendientes siguiendo el registro de migraciones, especialmente `0012_property_details.sql` y `0013_property_translation_features.sql`.

## Material de aplicación incluido

La carpeta `ENTREGA/` contiene el CSV `CORRECCION_DETALLES_CARACTERISTICAS_109.csv` y la guía `GUIA_CORRECCION_DETALLES_PUBLICADOS.md`. Tras publicar el código, entrar en el administrador, seleccionar **Importar / actualizar CSV**, escoger el CSV de esa carpeta y usar **Actualizar las 109 fichas** o **Actualizar esta ficha**.

> No usar el botón de importación antigua para crear nuevas propiedades. La actualización encuentra y modifica la ficha existente mediante la URL de fuente.

## Validación

Esta entrega se valida con TypeScript, pruebas automatizadas, compilación de producción y comprobación de integridad del ZIP antes de entregarse.

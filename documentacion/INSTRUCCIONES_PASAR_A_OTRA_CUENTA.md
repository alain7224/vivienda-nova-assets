# Entrega de Vivienda Nova para otra cuenta de Manus

## Qué contiene esta entrega

El archivo `vivienda-nova2-catalogo-precios-final.zip` contiene el código actualizado de Vivienda Nova, incluyendo el editor de propiedades, las migraciones de base de datos, el orden manual, los campos de precio y referencia, y el importador CSV ampliado.

El archivo `DROPBOX_CATALOGO_SERENDIPIA_LUX_II.csv` contiene tres fichas verificadas del listado de Dropbox: códigos 7, 8 y 15. Están en estado `draft` para que se revisen antes de publicar.

## Cómo trasladarlo

1. Entrar en la cuenta original de Manus desde el Android usando el mismo método de acceso utilizado en el iPhone.
2. Abrir el proyecto original de Vivienda Nova.
3. Descargar o adjuntar `vivienda-nova2-catalogo-precios-final.zip` como referencia para aplicar las mejoras.
4. Aplicar la migración `drizzle/0010_property_catalog_fields.sql` después de la migración editorial anterior.
5. Importar `DROPBOX_CATALOGO_SERENDIPIA_LUX_II.csv` desde Administrador → Importar CSV.
6. Revisar imágenes, enlaces y vendedor. Las fichas quedan como borrador y no se publican automáticamente.
7. Revisar las propiedades antiguas por código o URL fuente antes de cambiar cualquier precio.

## Qué no se ha hecho

No se han sobrescrito las fichas antiguas de la otra cuenta. El ZIP descargado no contiene la base de datos publicada y la vista local no tiene `DATABASE_URL`; por ello no era posible confirmar ni cambiar de forma segura los precios antiguos que aparecían como 1.000 €.

Tampoco se han subido automáticamente a Manus las imágenes y el vídeo de Dropbox. El paquete de Dropbox contiene archivos multimedia grandes; deben subirse desde el administrador o desde el almacenamiento del proyecto original.

## Diseño

Se conserva el diseño original de los paneles y la tipografía existente de los nombres de propiedades. Las mejoras funcionales no sustituyen el diseño editorial. El orden público usa primero el orden manual y, cuando no existe una prioridad distinta, muestra primero el precio más alto.

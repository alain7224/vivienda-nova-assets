# Comparación de propiedades — Dropbox y LRCostaHomes

## Resultado verificado

Se descargó el enlace compartido de Dropbox y se revisaron sus 30 archivos. El documento `Serendipia Lux II Price List.pdf` contiene precios legibles para las villas 7, 8 y 15:

| Código | Proyecto | Precio del listado | Dormitorios | Baños | Parcela |
|---|---|---:|---:|---:|---:|
| 7 | Serendipia Lux II, Roldán / Lo Ferro | 389.950 € | 3 | 2 | 242 m² |
| 8 | Serendipia Lux II, Roldán / Lo Ferro | 399.950 € | 3 | 2 | 242 m² |
| 15 | Serendipia Lux II, Roldán / Lo Ferro | 389.950 € | 3 | 2 | 242 m² |

El mismo listado muestra otras unidades con la marca **SOLD / VENDIDO**. No se han inventado precios para esas unidades porque el documento no los presenta como precios activos.

El paquete también contiene fotografías, planos y un vídeo. Las fotografías originales son demasiado pesadas para servirlas directamente en la portada: varias superan 17 MB. Deben optimizarse y subirse mediante el almacenamiento de Manus antes de publicarse.

La página pública de LRCostaHomes se pudo consultar y su buscador indica actualmente 109 propiedades. La web identifica la referencia, precio, ubicación, superficie, dormitorios, baños y enlace individual como campos diferenciados.

## Archivo preparado

`DROPBOX_CATALOGO_SERENDIPIA_LUX_II.csv` contiene las tres fichas con precio numérico, precio original, código de referencia, URL fuente y orden manual. Las fichas están en borrador y con flujo `capture` para evitar publicar o derivar contactos antes de revisar las imágenes, enlaces y vendedor.

## Limitación importante

El ZIP de la aplicación no contiene la base de datos de la web publicada. La vista previa local arranca sin `DATABASE_URL` y por eso muestra una cartera vacía. No es seguro ni posible corregir las fichas antiguas directamente desde este ZIP: para comparar los registros que ya existen hay que conectar el proyecto original de Manus con su base de datos o facilitar una exportación CSV de la cartera actual.

La corrección de código ya preparada añade:

- Código de agencia separado de la referencia interna.
- Precio editable por ficha mediante `priceValue` y `price`.
- Conservación del precio original de la fuente en `sourcePrice`.
- URL de procedencia en `sourceUrl`.
- Orden manual mediante `sortOrder` y botones subir/bajar.
- Orden público por orden manual y, en empate, precio más alto primero.
- Importación CSV de código, precio original, URL fuente y orden.
- Traducción automática de las fichas nuevas y editadas a los idiomas soportados por el sistema actual.

Antes de publicar el CSV, se debe comprobar cada ficha antigua contra su fuente. No se deben convertir automáticamente todos los precios de 1.000 € sin una coincidencia por código o URL, porque eso podría asignar el precio de otra vivienda.

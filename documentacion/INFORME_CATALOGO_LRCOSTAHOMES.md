# Catálogo completo extraído de LRCostaHomes

## Resultado

Se recorrieron las páginas públicas del buscador de LRCostaHomes y se extrajeron **109 fichas**. El archivo completo contiene título, slug, precio visible, precio numérico, referencia técnica, URL fuente, ciudad/zona, características, descripción, imagen principal y galería.

| Elemento | Resultado |
|---|---:|
| Fichas extraídas | 109 |
| Fichas con precio numérico | 108 |
| Fichas con galería | 109 |
| URLs de imágenes recopiladas | 2.974 |
| Fichas sin precio numérico | 1 |

La ficha sin precio numérico es **Villa** y debe revisarse manualmente antes de publicarla. No se le ha asignado un precio inventado.

## Orden por precio

El CSV está preparado con `sortOrder=0` para todas las fichas. En el proyecto actualizado, las fichas se muestran primero por orden manual y, en empate, por precio numérico descendente. Para que el precio sea el criterio predeterminado absoluto, basta con mantener el mismo orden manual en las fichas.

## Imágenes

Se han recopilado todas las URLs de imágenes que aparecen en cada ficha, hasta 30 por propiedad. El campo `gallery` contiene el JSON de la galería y `imageUrl` contiene la primera imagen. En esta etapa son URLs públicas de origen; todavía no se han copiado físicamente al almacenamiento de Manus porque la base de datos y el almacenamiento de la otra cuenta no están conectados.

La carga permanente debe realizarse desde el proyecto original: el importador debe descargar cada imagen y subirla al almacenamiento del proyecto, o conservar las URLs externas si el propietario acepta esa dependencia. No recomiendo publicar 2.974 imágenes externas sin revisar derechos, peso y estabilidad.

## Ubicación y mapa

Se añadió a cada tarjeta un icono de ubicación. Al pulsarlo, se abre un banner/modal con un iframe de Google Maps construido a partir de la dirección, zona y ciudad de la ficha. No requiere una clave de Google Maps para la búsqueda básica. Para una precisión exacta, la ficha debe tener dirección o coordenadas verificadas; cuando solo existe ciudad/zona, Google Maps mostrará esa zona aproximada.

## Carga en la otra cuenta

El archivo `LRCOSTAHOMES_CATALOGO_COMPLETO_109.csv` queda listo para importar desde el administrador. Las fichas deben entrar como borrador para revisar precios, referencias, imágenes, enlaces y vendedor antes de publicar. La otra cuenta debe aplicar primero las migraciones de catálogo y galería incluidas en el ZIP actualizado.

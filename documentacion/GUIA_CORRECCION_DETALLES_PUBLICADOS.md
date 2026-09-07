# Corrección urgente de fichas publicadas — Vivienda Nova

## Objetivo

Corregir las **109 propiedades que ya están publicadas** sin borrarlas y sin crear duplicados. Esta corrección sustituye los textos genéricos por descripciones reales de cada vivienda, elimina la frase que menciona a la inmobiliaria de origen y muestra las características verificadas de cada ficha, como piscina, jardín, garaje, terraza o trastero cuando la información existe.

> **No eliminar propiedades. No volver a importar el catálogo inicial.** Esta entrega actualiza las fichas existentes al compararlas por su URL de fuente, por lo que conserva sus enlaces, su estado de publicación y el resto de configuración de cada vivienda.

## Archivos que se deben adjuntar en esta corrección

| Archivo | Finalidad |
|---|---|
| `vivienda-nova2-correccion-detalles-final.zip` | Código de corrección: detalle completo, características, coordenadas exactas y actualización masiva sin duplicados. |
| `CORRECCION_DETALLES_CARACTERISTICAS_109.csv` | Datos corregidos de las 109 fichas ya cargadas. |

## Qué estaba mal

Las fichas importadas mostraban en el campo de descripción una frase genérica del tipo “Consulta esta propiedad seleccionada por…” y podían mencionar a una inmobiliaria de origen. Ese texto no debe ser visible en Vivienda Nova.

La importación inicial también no estaba aplicando correctamente el detalle completo, la galería, las características y las coordenadas publicadas en cada ficha fuente.

## Qué corrige esta entrega

| Corrección | Resultado |
|---|---|
| Descripción | Se reemplaza por la descripción detallada publicada para cada vivienda. |
| Nombre de otra inmobiliaria | Se elimina de todas las descripciones públicas. |
| Características | Se muestran solo cuando están verificadas: piscina, jardín, chimenea, aparcamiento, trastero y otros datos existentes. |
| Mapa | Usa latitud y longitud verificadas cuando estén disponibles, para centrar el punto correcto. |
| Ubicación | Corrige ciudad, zona y dirección pública cuando la ficha fuente las proporciona. |
| Código | Corrige el código de referencia visible. Por ejemplo, la casa de Gea y Truyols queda como `LR-016`. |
| Galería | El detalle de la ficha muestra las miniaturas de sus fotos. |
| Actualización | El CSV actualiza por `sourceUrl`, no crea una segunda copia de las propiedades. |

## Datos verificados

| Métrica | Resultado |
|---|---:|
| Fichas corregidas | 109 |
| Descripciones con detalle real de 100 o más caracteres | 108 |
| Fichas con características verificadas | 88 |
| Fichas con coordenadas verificadas | 109 |
| Menciones de la inmobiliaria fuente en descripciones | 0 |

La única descripción breve corresponde a una ficha cuyo detalle público es muy corto. No se han inventado características ni textos.

### Ejemplo: Casa de campo en Gea y Truyols

La ficha queda con ubicación **Gea y Truyols · Costa Cálida**, código **LR-016**, coordenadas exactas y características verificadas: **Chimenea, jardín, estacionamiento, trastero y piscina**. Su descripción detalla la parcela, las estancias, las construcciones auxiliares, el porche, la piscina y los servicios disponibles. No contiene el nombre de la otra inmobiliaria.

## Procedimiento exacto

## Uso sencillo desde el administrador

No se debe volver a cargar el catálogo como una importación nueva. Tras aplicar este pequeño cambio de código, el administrador ofrece dos acciones directas cuando se selecciona el CSV de corrección:

| Botón | Uso |
|---|---|
| **Actualizar las 109 fichas** | Corrige de una vez todas las propiedades que ya existen. No crea ninguna vivienda nueva. |
| **Actualizar esta ficha** | Permite elegir una vivienda concreta de una lista y corregir solo esa ficha. |

La actualización busca la propiedad existente por su URL de fuente, por lo que conserva su publicación, enlaces y orden. No hay que borrar nada ni repetir la importación inicial.

## Comprobación imprescindible antes de subir el CSV

Tras aplicar y publicar el ZIP de corrección, abre **Administrador → Importar CSV**. Debe aparecer el aviso:

> “Este archivo actualizará las fichas existentes por su URL de fuente, sin crear duplicados.”

Y, tras seleccionar el archivo, el botón debe llamarse **“Actualizar detalles”**. Si la pantalla sigue diciendo “Carga un archivo CSV para crear varias fichas” o el botón dice “Importar viviendas”, el ZIP nuevo no se ha aplicado/publicado todavía. En ese caso, **no subas el CSV**: pide a Manus que aplique y publique el ZIP primero.

El ZIP final también corrige el lector de CSV para que las comas de una descripción o característica no rompan las columnas.

1. Abrir el proyecto original publicado de Vivienda Nova en la cuenta propietaria.
2. Crear un punto de restauración del proyecto y una copia de seguridad de la base de datos.
3. Aplicar el ZIP de corrección sobre el proyecto actual. Conservar el diseño actual.
4. Aplicar estas migraciones, en este orden:

   ```text
   drizzle/0012_property_details.sql
   drizzle/0013_property_translation_features.sql
   ```

5. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build`.
6. Publicar o finalizar la actualización de código para que el administrador reconozca el modo de actualización de detalles.
7. Entrar como administrador y abrir **Importar CSV**.
8. Subir `CORRECCION_DETALLES_CARACTERISTICAS_109.csv`.
9. El importador debe indicar: **“Este archivo actualizará las fichas existentes por su URL de fuente, sin crear duplicados.”**
10. Pulsar **“Actualizar detalles”**. No pulsar “Importar viviendas”.
11. Confirmar el resultado: **109 fichas actualizadas** y **0 fichas no encontradas**.
12. Abrir una muestra de propiedades, especialmente “Casa de campo en Gea y Truyols”, y comprobar descripción, características, galería e icono de mapa.
13. Mantener la web publicada. Esta corrección no exige eliminar ni volver a publicar las viviendas una por una.

## Traducciones

La actualización corrige primero la ficha española y elimina traducciones antiguas que contengan el texto genérico. Mientras se regeneran las traducciones, las vistas de otros idiomas mostrarán el texto español correcto, no el comentario incorrecto.

Para regenerar todos los idiomas de cada ficha, abrir y guardar la propiedad desde el administrador tras la actualización. El sistema traduce título, ubicación, tipo, descripción y características sin inventar datos. Esta regeneración puede hacerse gradualmente; no bloquea la corrección urgente en español.

## Validación obligatoria antes de cerrar

Verificar que no aparezcan públicamente las expresiones `L&R Costa Homes`, `L & R Costa Homes` ni “Consulta esta propiedad seleccionada por” en las descripciones. Verificar que una ficha sin piscina no muestre piscina y que las fichas que sí la tienen la muestren únicamente si aparece entre sus características verificadas.

## Resultado esperado

Las 109 fichas existentes permanecen activas, pero su detalle queda completo, propio de Vivienda Nova, sin mencionar a la inmobiliaria de origen. La información factual se conserva, las características son verificadas y el mapa se abre en el punto de ubicación de la propiedad.

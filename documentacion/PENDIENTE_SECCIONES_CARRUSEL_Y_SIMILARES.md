# Segunda tarea pendiente — secciones editables, carruseles y viviendas similares

**Estado:** pendiente. No implementar ni generar ZIP hasta que el propietario lo solicite expresamente.

## Solicitud

La web publicada no ofrece todavía un control visible para crear secciones editables de propiedades ni un carrusel horizontal con una a cinco viviendas. Tampoco muestra viviendas similares o destacadas dentro de la ficha individual de una propiedad.

## Referencia revisada

Se ha revisado la ficha pública de referencia `https://lrcostahomes.com/es/property/apartment-in-calpe/`. Su patrón funcional relevante contiene galería, datos básicos, ubicación/mapa, características y una sección de **Propiedades similares**. Vivienda Nova debe tomar esa idea funcional, pero con un diseño editorial propio y mejorado; no debe copiar textos, marca, contactos ni identidad visual de la web fuente.

## Alcance de futura implementación

### 1. Gestor de secciones editables en administrador

Añadir un área claramente accesible desde el menú lateral del administrador, con una acción visible denominada, por ejemplo, **Secciones de propiedades**. Debe abrir la herramienta correcta y no una vista sin contenido.

Cada sección debe permitir:

- Crear, renombrar, editar, duplicar, ocultar, reordenar y eliminar secciones.
- Definir un título, subtítulo opcional, descripción corta y color/fondo compatibles con la paleta del sitio.
- Elegir el modo de selección: manual, más caras, más recientes, destacadas, similares a una propiedad concreta, misma zona, mismo tipo o rango de precio.
- Elegir de **1 a 5 propiedades visibles** por pantalla.
- Seleccionar manualmente y reordenar las propiedades mediante controles de subir/bajar o arrastrar y soltar.
- Elegir si se muestra en portada, en ficha individual o en ambos lugares.
- Crear secciones de ejemplo como “Viviendas destacadas”, “Frente al mar”, “Obra nueva” o “Selección en Costa Blanca”, sin imposición de contenido.
- Guardar como borrador y usar vista previa privada antes de publicar.

### 2. Carrusel horizontal accesible y rápido

En la web pública, cada sección será una franja horizontal de tarjetas con desplazamiento suave.

- Controles anterior/siguiente visibles y desplazamiento horizontal táctil en móvil.
- Mostrar una a cinco tarjetas según configuración y ancho real de pantalla.
- Tarjetas compactas, con imagen, precio, referencia, ubicación y características esenciales.
- Carga diferida de imágenes que no estén visibles; no cargar fotos de todas las tarjetas de una vez.
- Soporte de teclado, foco visible y etiquetas accesibles.
- Sin parpadeos si falla una imagen: usar la imagen de reserva ya existente.
- No introducir autoplay agresivo ni movimiento que afecte la lectura.

### 3. Viviendas similares dentro de cada ficha

Incorporar la sección **Viviendas similares** al final de la ficha individual de una propiedad publicada.

- Por defecto, mostrar entre 1 y 5 propiedades del mismo tipo, zona/municipio o rango de precio similar.
- Excluir la propiedad que se está consultando y excluir borradores.
- Si faltan similares por algoritmo, permitir al administrador elegirlas manualmente para esa ficha.
- No copiar información de la inmobiliaria fuente; usar únicamente título, precio, referencia, texto propio, características y fotos verificadas del catálogo de Vivienda Nova.
- Cada tarjeta debe abrir la ficha individual nueva `/vivienda/:slug`, donde quedarán disponibles el mapa y la solicitud de reserva cuando la primera tarea pendiente sea implementada correctamente.

### 4. Viviendas destacadas

Añadir un campo editable **Destacada** por vivienda y una prioridad manual. La portada podrá mostrar una sección con las destacadas, sin cambiar el orden general por precio alto ya configurado.

## Dependencias y validación

1. Resolver antes la primera tarea pendiente: la ruta de ficha individual debe mostrar correctamente mapa y solicitud de reserva en la publicación real.
2. Añadir una migración nueva y segura para secciones, relación manual propiedad-sección, destacadas y prioridades; no modificar ni borrar datos existentes.
3. Cada botón del menú lateral debe dirigir a su panel correspondiente mediante una URL o estado verificable, por ejemplo `/admin?panel=sections`.
4. Probar creación, edición, borrador, vista previa, reordenación, ocultación y publicación de una sección.
5. Probar el carrusel en móvil y escritorio; probar uno, tres y cinco elementos.
6. Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build` antes de publicar.
7. Crear checkpoint antes de fusionar en el proyecto publicado original.

> No implementar pagos, chatbots, caja registradora, Colombia ni contenido de marca de terceros. Esta tarea es solo para secciones administrables, carruseles horizontales, propiedades similares y propiedades destacadas.

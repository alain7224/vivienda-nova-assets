# Vivienda Nova — Revisión v5.1

## Validación

La revisión supera TypeScript, 11 archivos de pruebas con 24 pruebas y la compilación de producción.

## Correcciones nuevas

1. **Clientes y proyectos:** el listado queda dentro de un contenedor con desplazamiento vertical interno.
2. **Visitas y referidos:** los últimos eventos se consultan mediante scroll dentro de su bloque.
3. **Viviendas visibles:** el inventario mantiene una altura controlada y permite desplazarse dentro de la lista.
4. **Operaciones:** las operaciones también tienen scroll interno.
5. **Móvil:** los bloques usan desplazamiento táctil y evitan mover toda la página durante la consulta.
6. **Recarga de fichas:** si el navegador se actualiza estando en una ficha, se vuelve a la portada. La ficha no se conserva como estado abierto.
7. **Idioma persistente:** el idioma seleccionado se conserva al pasar de la portada a una ficha.
8. **Mapa móvil:** el mapa de la ficha ocupa el ancho completo disponible y se muestra con una altura utilizable.
9. **Etiquetas traducibles:** se eliminaron varias etiquetas fijas en español del buscador y de la ficha.

## Traducciones

Al crear o editar una propiedad, el servidor guarda la versión original y genera traducciones para los idiomas activos mediante el modelo interno de traducción del proyecto. Las fichas antiguas requieren ejecutar en el administrador **Traducir todas las fichas publicadas**. Esta acción no cambia precios, fotos, referencias ni características.

## Instalación

Usar este ZIP como revisión posterior a v5. No combinar archivos de las versiones anteriores. Tras instalarlo, comprobar el administrador en los bloques **Clientes y proyectos**, **Visitas y referidos** y **Viviendas visibles**. Después abrir una ficha, cerrar o volver a la portada y actualizar el navegador para confirmar que no reaparece automáticamente.

## Advertencia de compilación

Vite mantiene una advertencia no bloqueante porque el paquete inicial supera 500 KB. La aplicación compila correctamente; una división adicional de módulos puede reducir todavía más el tiempo de carga en móviles lentos.

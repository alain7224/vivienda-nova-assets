# Vivienda Nova — Revisión de calidad v5

## Estado

La revisión ha superado la comprobación de TypeScript, las pruebas automatizadas y la compilación de producción.

- 11 archivos de pruebas superados.
- 24 pruebas superadas.
- Compilación de producción completada.
- Sin errores de TypeScript.

## Correcciones incluidas

1. El idioma seleccionado se conserva al pasar de la portada a una ficha individual.
2. Se corrigieron etiquetas de la ficha que podían permanecer en español, incluyendo lectura de descripción, formulario de reserva, vista previa y buscador.
3. El mapa de cada ficha ocupa todo el ancho disponible en móvil y tiene una altura utilizable.
4. Se añadieron transiciones suaves y estabilidad visual para reducir saltos, temblores y parpadeos al cambiar de sección o abrir una ficha.
5. Se corrigió una regla de publicación que podía impedir la captura propia de contactos cuando una propiedad estaba publicada.
6. El gestor de secciones y carruseles sigue siendo funcional: permite crear secciones reales, escoger de una a cinco viviendas, ordenar las tarjetas, elegir portada o ficha y seleccionar estilos.
7. El botón de traducción masiva existente sigue disponible en el administrador para generar las traducciones guardadas de las fichas antiguas.

## Importante sobre las traducciones

La interfaz y sus etiquetas ya tienen traducciones locales. Las descripciones, títulos y características de cada vivienda necesitan que se ejecute la acción administrativa **Traducir todas las fichas publicadas** para generar y guardar las copias de las propiedades antiguas. Las propiedades nuevas continúan usando el flujo de traducción al guardarse.

## Importante sobre el proveedor

La marca y los datos del proveedor deben permanecer en el administrador. La ficha pública conserva la marca Vivienda Nova y captura la consulta del cliente dentro del sistema. Los datos internos del proveedor solo se utilizan para la gestión privada y las notificaciones autorizadas.

## Advertencia no bloqueante

La compilación muestra una advertencia de Vite porque el paquete inicial supera 500 KB. La aplicación compila correctamente. La siguiente mejora recomendada es dividir más componentes pesados del inicio para reducir el tiempo de descarga en móviles lentos.

## Aplicación

Usar únicamente el ZIP de esta revisión. No mezclar archivos de las versiones anteriores. Después de actualizar el proyecto publicado, abrir el administrador y ejecutar **Traducir todas las fichas publicadas**; posteriormente comprobar una ficha en español, inglés, alemán y francés, incluyendo mapa, formulario y carrusel de propiedades similares.

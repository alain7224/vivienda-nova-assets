# Tarea pendiente — mapa desplegable y reserva por ficha

**Estado:** pendiente; no implementar hasta que el propietario lo pida expresamente.

## Incidencia comunicada

Tras aplicar la actualización v3.2, en la web publicada no se ve el mapa al abrir una ficha de propiedad ni el banner desplegable de ubicación. Tampoco aparece el botón de reserva dentro de la ficha.

## Alcance aprobado para una futura actualización

1. Revisar en el **proyecto publicado original**, no solo en el ZIP, que la integración de las rutas y migraciones se haya aplicado correctamente.
2. En cada ficha individual de vivienda, mostrar un botón o enlace de ubicación con icono de mapa.
3. Al pulsarlo, desplegar un banner de mapa de Google Maps con la ubicación de la propiedad. Si solo existe ciudad/zona y no coordenadas verificadas, usar una búsqueda de esa ubicación sin inventar un punto exacto.
4. Mostrar el botón de reserva únicamente dentro de la ficha individual, nunca en la portada ni en tarjetas del listado.
5. El botón abrirá el formulario de solicitud de disponibilidad/reserva privada; no incluirá pagos, cobros, caja registradora ni confirmación automática.
6. Conservar texto, color de fondo y color del botón editables desde el administrador.
7. Probar una vivienda con coordenadas, una con ciudad/zona sin coordenadas y una ficha en borrador antes de publicar.
8. Confirmar que la solicitud queda registrada y visible solo en el administrador.

## Comprobaciones técnicas futuras

- Confirmar que se aplicó la migración `0014_seo_reservation_settings.sql`.
- Confirmar que el proyecto publicado contiene `PropertyDetail.tsx`, `OfficeMap.tsx`, las rutas `/vivienda/:slug`, `/sitemap.xml` y `/robots.txt`.
- Confirmar que `PUBLIC_APP_URL` apunta al dominio final.
- Ejecutar `pnpm check`, `pnpm test -- --run` y `pnpm build` antes de publicar.
- Crear un checkpoint del proyecto publicado antes de fusionar cambios.

> No realizar cambios de código hasta que el propietario solicite retomar esta tarea.

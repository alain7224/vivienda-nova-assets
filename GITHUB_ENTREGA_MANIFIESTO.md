# Entrega para la otra cuenta de Manus

## Repositorio

`alain7224/vivienda-nova-assets`

## Qué contiene

- `proyecto/`: código fuente actualizado de Vivienda Nova, sin `node_modules` ni artefactos locales innecesarios.
- `documentacion/`: guías, manifiestos, auditorías, informes y validaciones.
- `CONVERSACIONES_VIVIENDA_NOVA.md`: historial de decisiones y solicitudes desde el inicio.
- `VIVIENDA_NOVA_REVISION_V5_1_SCROLL_FICHAS.zip`: adjunto de la Release v5.1, porque GitHub no admite este ZIP de 560 MB dentro del historial Git normal.

## Revisión vigente

La revisión v5.1 incluye scroll interno en Clientes y proyectos, Visitas y referidos, Viviendas visibles y Operaciones; retorno a inicio al recargar una ficha; correcciones de idioma, mapa móvil y validación completa.

## Validación

- TypeScript: correcto.
- Tests: 11 archivos, 24 pruebas superadas.
- Build de producción: correcto.
- ZIP v5.1: integridad verificada.

## Cómo debe usarlo el otro Manus

1. Clonar este repositorio.
2. Leer primero `documentacion/LEER_PRIMERO_GITHUB.md`.
3. Descargar el ZIP v5.1 desde la Release asociada.
4. Comparar el proyecto publicado con `proyecto/`; no borrar datos de producción sin copia de seguridad.
5. Aplicar migraciones pendientes en orden.
6. Ejecutar `pnpm install`, `pnpm check`, `pnpm test -- --run` y `pnpm build`.
7. Probar el administrador, la traducción, las fichas en móvil, los mapas y los formularios antes de publicar.

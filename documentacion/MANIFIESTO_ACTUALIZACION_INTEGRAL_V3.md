# Manifiesto técnico — Vivienda Nova actualización integral v3.1

## Finalidad

Este manifiesto identifica la entrega integral preparada para fusionarse con la versión publicada de Vivienda Nova. La fusión debe preservar toda función exclusiva del proyecto publicado original.

## Cambios acumulados incluidos

| Número | Cambio | Archivos principales |
|---:|---|---|
| 1 | Precio real editable, precio de fuente, referencia y orden manual de vivienda | `drizzle/schema.ts`, `server/db.ts`, `server/routers.ts`, `Admin.tsx`, `Home.tsx` |
| 2 | Catálogo de 109 fichas con descripciones propias, características verificables, galerías y coordenadas | `CORRECCION_DETALLES_CARACTERISTICAS_109.csv`, migraciones `0010`–`0013` |
| 3 | Traducción estructurada de título, ubicación, tipo, etiqueta, descripción y características | `server/translation.ts`, `server/db.ts`, `server/routers.ts` |
| 4 | Actualizador CSV individual y masivo por `sourceUrl`, sin crear duplicados | `PropertyImporter.tsx`, `server/routers.ts` |
| 5 | Imagen, vídeo de portada y tarjetas multimedia editables desde administrador | `HeroVideoManager.tsx`, `HeroImageManager.tsx`, `EditorialCardsManager.tsx`, `EditorialCards.tsx` |
| 6 | Acciones de administrador visibles y conectadas a su herramienta | `Admin.tsx`, `DashboardLayout.tsx` |
| 7 | Mapa privado de clientes con agrupación de puntos y tarjetas desplazadas | `ClientLeadsMap.tsx`, `ClientLeadsMap.css`, `Admin.tsx` |
| 8 | Búsqueda por país, provincia, municipio, zona, texto/referencia/dirección, tipo, presupuesto y dormitorios | `Home.tsx`, `i18n.ts`, `index.css` |
| 9 | Fotos convertidas de forma automática a WebP y respaldo estable ante imagen externa no disponible | `server/routers.ts`, `Home.tsx`, gestores de carga |
| 10 | Área privada con expiración de sesión a los 30 minutos | `shared/const.ts`, `server/_core/oauth.ts`, `useAuth.ts`, `sessionSecurity.test.ts` |
| 11 | Depuración de catálogo: 108 galerías verificadas contra la galería real de cada ficha, etiquetas neutrales y ubicaciones anómalas corregidas | `CORRECCION_DETALLES_CARACTERISTICAS_109.csv`, `PropertyImporter.catalog.test.ts` |

## Contenido del ZIP

```text
proyecto/                           Código fuente completo de referencia
ENTREGA/CORRECCION_..._109.csv      Datos para corregir fichas ya creadas
ENTREGA/GUIA_UNIFICADA...md         Guía paso a paso para Manus AI
ENTREGA/RECOMENDACIONES...md        Mejoras recomendadas y fuentes
ENTREGA/INSTRUCCIONES_SUBIR...md    Uso de la carpeta de fusión en Drive
MANIFIESTO_ACTUALIZACION_...md      Este resumen
```

## Validación de salida

La entrega se considera apta para fusión únicamente si se ejecutan y terminan sin error los siguientes comandos:

```bash
pnpm install
pnpm check
pnpm test -- --run
pnpm build
```

En esta versión se incorpora también `scripts/test-image-optimization.mjs`, que confirma que la imagen se convierte a WebP y queda limitada a 2048 píxeles por lado. La prueba de catálogo valida 109 filas sin el marcador geográfico erróneo “No se encontraron resultados”, sin mención de agencia fuente en el texto público y con galerías propias en 108 fichas; la única ficha sin galería verificada (`local-comercial`) conserva su imagen principal y queda identificada para revisión.

## Restricciones

No incluir funcionalidades de Colombia, caja registradora, pasarela de pago, chatbot de reserva ni mapa público de clientes. No mencionar agencias fuente en las descripciones públicas de las viviendas.

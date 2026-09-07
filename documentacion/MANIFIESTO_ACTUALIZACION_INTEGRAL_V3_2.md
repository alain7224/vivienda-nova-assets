# Manifiesto técnico — Vivienda Nova actualización integral v3.2

## Estado de la entrega

**Versión vigente:** `VIVIENDA_NOVA_ACTUALIZACION_INTEGRAL_v3_2.zip`.

Esta revisión contiene todas las mejoras acumuladas de las versiones anteriores y añade los elementos necesarios para descubrimiento orgánico, fichas individuales, reservas privadas, mapas administrables y vista previa de borradores. Debe fusionarse con el proyecto publicado original, nunca sobrescribirse sin comparación.

## Mejoras acumuladas

| Área | Entrega v3.2 |
|---|---|
| Catálogo | 109 filas corregidas, textos propios, referencias, precios, características verificables y galerías reales de 108 fichas. |
| Control de origen | El servidor impide publicar título, etiqueta o descripción que mencione `LRCostaHomes` o `L & R Costa Homes`. |
| Galerías | Administrador para foto principal y una URL por línea en galería completa; máximo 30 fotos por ficha. |
| Traducciones | Título, ubicación, tipo, texto, etiqueta y características se regeneran al crear, editar o actualizar una vivienda. |
| SEO | `/robots.txt`, `/sitemap.xml` dinámico, URLs `/vivienda/slug`, canónica, meta descripción y JSON-LD `RealEstateListing`. |
| Sitemap | Incluye la portada y cada vivienda publicada al consultar el catálogo real. Los borradores y el administrador no se incluyen. |
| Reservas | Botón editable y formulario solo en la ficha de cada propiedad. Guarda una solicitud privada sin cobro ni confirmación automática. |
| Mapas | Ubicación por vivienda, mapa privado agrupado de contactos y bloque opcional de ubicación del negocio gestionable desde el administrador. |
| Vista previa | Los borradores se pueden abrir desde el administrador mediante sesión privada; no aparecen en portada, sitemap ni reservas. |
| Imágenes | Carga de JPG, PNG, WebP y AVIF; WebP automático, rotación correcta, máximo 2048 px y foto de reserva estable. |
| Carga inicial | El administrador, las páginas legales y la ficha completa se descargan solo al abrirlas, reduciendo el JavaScript inicial de la portada. |
| Seguridad | Sesión del administrador de 30 minutos, `/admin` con `X-Robots-Tag: noindex`, permiso de administrador para vista previa y mapa de clientes. |

## Migración nueva

Aplicar solo si no figura ya en el registro de migraciones:

```text
0014_seo_reservation_settings.sql
```

Añade configuración del texto y colores de reserva, enlace de inserción de Google Maps del negocio, fecha preferida y número de personas de la solicitud de reserva.

## Variables necesarias en producción

| Variable | Valor |
|---|---|
| `PUBLIC_APP_URL` | Dominio público final, por ejemplo `https://www.tudominio.es`. Se usa para el sitemap y canónicas. |

## Validación obligatoria

```bash
pnpm install
pnpm check
pnpm test -- --run
pnpm build
```

Resultado verificado para esta entrega: **10 archivos de prueba y 21 pruebas superadas**. El sitemap, robots y el encabezado `noindex` de `/admin` se comprobaron en una vista local.

## Exclusiones confirmadas

No incluye Colombia, caja registradora, cobros, pasarela de pago, chatbot de reservas ni mapas públicos de clientes. La reserva de una vivienda es una **solicitud de disponibilidad** que un administrador confirma manualmente.

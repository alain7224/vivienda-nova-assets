# Auditoría de acceso administrativo — Vivienda Nova 2

**Fecha de revisión:** 1 de septiembre de 2026  
**Estado:** corrección de código preparada y validada localmente.

## Diagnóstico ejecutivo

El proyecto contiene un panel administrativo completo en la ruta **`/admin`**, pero la puerta de entrada no era fiable desde la web pública. En la portada, el enlace **«Administrar»** se dibujaba únicamente cuando la sesión ya devolvía el rol `admin`. Una persona propietaria que llega por primera vez a la URL publicada no tiene sesión todavía, por lo que el enlace no aparece y no tiene un acceso visible con el que iniciar sesión.

El problema es más profundo en el paquete exportado. Su archivo `template.json` lo identifica como **`web-static`**, mientras que el código real depende de autenticación OAuth, tRPC, base de datos, almacenamiento de imágenes y rutas de servidor. Un alojamiento estático puede mostrar la portada, pero no puede operar de forma segura el panel, guardar propiedades, subir imágenes ni aplicar las reglas de permisos. Por ello, añadir solo un botón no sería una solución completa si la versión publicada continúa siendo estática.

Además, la exportación no incluía el archivo `client/src/_core/hooks/useAuth.ts`, pese a que cinco componentes lo importan. La comprobación TypeScript original fallaba con cinco errores de módulo no encontrado. El archivo ha sido restaurado en esta entrega.

## Evidencia técnica

| Hallazgo | Ubicación | Impacto en producción | Corrección aplicada |
|---|---|---|---|
| El enlace de administración dependía de `user?.role === "admin"`. | `client/src/pages/Home.tsx` | El propietario no ve un camino de acceso antes de iniciar sesión. | El enlace a `/admin` se muestra siempre en los menús de escritorio y móvil. |
| La API administrativa sí está protegida. | `server/_core/trpc.ts`, `server/routers.ts` | Un enlace visible no expone los datos ni permite cambios a terceros. | Se conserva `adminProcedure`, que exige una sesión con rol `admin`. |
| El callback OAuth siempre redirigía a `/`. | `server/_core/oauth.ts` | Tras iniciar sesión desde `/admin`, el usuario volvía a la portada y parecía que el acceso había fallado. | El estado OAuth conserva la ruta interna de origen y devuelve al usuario a `/admin`. |
| Falta el hook de sesión importado por la interfaz. | `client/src/_core/hooks/useAuth.ts` | La exportación no compilaba desde código fuente. | Se restauró el hook reutilizable para consultar `auth.me` y cerrar sesión. |
| La metadata heredada declara `web-static`. | `template.json` | Si la publicación usa esa configuración, no existirán los servicios necesarios para administrar datos. | No se falseó el archivo de plantilla: la conversión debe hacerse sobre el proyecto original de Manus mediante la función Full-stack. |

## Corrección incluida en el paquete reparado

La versión corregida incorpora un botón **«Administrar»** que lleva siempre a **`/admin`**. También corrige el callback de OAuth: después de elegir la cuenta y completar el login, la aplicación vuelve a `/admin` en vez de enviarte a la portada. Este cambio mejora la accesibilidad operativa sin reducir la seguridad: quien no tenga sesión verá la pantalla de inicio de sesión, y quien inicie sesión con una cuenta distinta de la propietaria verá el mensaje de acceso restringido. Los procedimientos que crean, editan, eliminan o cargan contenido siguen comprobando el rol `admin` en el servidor.

También se añadió el hook `useAuth`, que consulta el endpoint público `auth.me` sin provocar redirecciones desde la portada y centraliza el cierre de sesión. Con ello se resuelve el fallo de compilación de la exportación.

## Validación realizada

La versión reparada se validó en un entorno local con las dependencias declaradas por el proyecto. `pnpm check` terminó correctamente; la batería de Vitest pasó **14 de 14 pruebas** en siete archivos; y `pnpm build` generó correctamente la aplicación de producción. El compilador conserva dos advertencias no bloqueantes sobre rutas de imágenes de `/manus-storage/`, que se resuelven en el entorno de alojamiento de Manus.

## Actualizar la web ya publicada

La actualización correcta debe hacerse sobre el **proyecto original** de Manus, no sobre una copia nueva, para conservar su URL de publicación, su base de datos y sus imágenes. El archivo ZIP no contiene el identificador del proyecto ni una conexión activa a él, por lo que esta auditoría no puede publicar directamente en esa URL desde este chat.

1. Abra el proyecto original **Vivienda Nova 2** en Manus y conéctelo a esta conversación, o facilite la URL/identificador de edición del proyecto. Con ese acceso se puede aplicar la corrección sobre la misma base de datos y crear una nueva publicación.
2. En el proyecto, confirme que la capacidad **Full-stack / web-db-user** está activada. Si se publicó desde una plantilla estática, active esa capacidad antes de continuar. Esta operación aprovisiona autenticación, base de datos y almacenamiento, que son indispensables para el panel.
3. Aplique el código corregido de este paquete. Si la conversión Full-stack se realiza ahora, mantenga las rutas y los archivos de `server/`, `drizzle/` y `shared/`; no sustituya el proyecto por una plantilla estática.
4. Ejecute o aplique las migraciones de `drizzle/` en la base de datos del proyecto. Antes de hacerlo sobre datos existentes, realice un checkpoint. Las migraciones crean las tablas de propiedades, vendedores, contactos, visitas, operaciones y ajustes.
5. Inicie sesión en la URL publicada con la misma cuenta Manus que es propietaria del proyecto. Esa cuenta recibe automáticamente el rol `admin` mediante `OWNER_OPEN_ID`. Si otra cuenta debe administrar, hay que promoverla explícitamente a `admin` en la tabla `users`.
6. Cree un checkpoint y publique una nueva versión. Compruebe después tres recorridos: portada → **Administrar**; `/admin` sin sesión → inicio de sesión; y `/admin` con la cuenta propietaria → alta, edición y carga de una propiedad de prueba.

> No se recomienda convertir el panel en un formulario público ni retirar la validación de rol para hacer visible el botón. Eso expondría contactos, comisiones e inventario a modificaciones no autorizadas.

## Próximo paso necesario

Conecte el proyecto original de Manus a esta conversación. En cuanto esté disponible, la corrección puede aplicarse a la fuente activa, verificar el rol de la cuenta propietaria, realizar un checkpoint y preparar la nueva publicación sin crear una segunda web ni perder la configuración actual.

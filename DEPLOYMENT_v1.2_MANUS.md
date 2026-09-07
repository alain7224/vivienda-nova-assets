# 🚀 DEPLOYMENT v1.2 - INSTRUCCIONES PARA MANUS

## 📌 RESUMEN EJECUTIVO

Esta es la actualización v1.2 de Vivienda Nova. Contiene:
- ✅ Analytics completo (rastreo de visitantes)
- ✅ Traductor reparado (features en todos idiomas)
- ✅ Admin rediseñado (panel analytics + settings)
- ✅ 6 estilos de carruseles nuevos
- ✅ Mapas con geocoding automático
- ✅ Switch global criptomonedas (solo visual)
- ✅ Animaciones iOS smooth (sin temblores)
- ✅ Preview fotos mejorado
- ✅ Textos editables por tarjeta

---

## 📍 UBICACIÓN DEL CÓDIGO

**Repositorio**: https://github.com/alain7224/vivienda-nova-assets

**Rama con los cambios**: PR abierto en main (listo para merge)

**Archivos modificados**: 23 archivos, ~1,900 líneas de código

---

## ⚙️ PASO 1: CLONAR/ACTUALIZAR REPOSITORIO

### Si es la PRIMERA VEZ:

```bash
git clone https://github.com/alain7224/vivienda-nova-assets.git
cd vivienda-nova-assets
```

### Si ya tienes el repositorio:

```bash
cd vivienda-nova-assets
git pull origin main
```

---

## 🔧 PASO 2: APLICAR MIGRACIONES SQL

**⚠️ IMPORTANTE: Aplicar en ORDEN exacto**

### Asegúrate de tener acceso a la base de datos:

```bash
# Conectar a la BD
psql -U tu_usuario -d vivienda_nova -h localhost
```

### Aplicar migración 1 (Rastreo de visitantes mejorado):

```sql
-- Archivo: proyecto/drizzle/0018_visitor_tracking_enhanced.sql
-- Contiene:
-- - Nuevas columnas en siteVisits: propertyId, referrer, deviceType, actionType, scrollDepth
-- - Índices para optimizar queries

\i proyecto/drizzle/0018_visitor_tracking_enhanced.sql
```

### Aplicar migración 2 (Configuración criptomonedas):

```sql
-- Archivo: proyecto/drizzle/0019_crypto_display_settings.sql
-- Contiene:
-- - Campos en siteSettings: cryptoEnabled, cryptoAcceptedTypes
-- - Enums ampliados para 6 estilos de carruseles

\i proyecto/drizzle/0019_crypto_display_settings.sql
```

### Verificar migraciones aplicadas:

```sql
-- Debería existir la tabla actualizada:
SELECT * FROM information_schema.columns 
WHERE table_name = 'siteVisits' 
ORDER BY ordinal_position;

-- Debería mostrar: propertyId, referrer, deviceType, actionType, scrollDepth
```

---

## 📦 PASO 3: INSTALAR DEPENDENCIAS

```bash
cd proyecto

# Instalar pnpm si no lo tienes
corepack enable

# Instalar las dependencias
pnpm install
```

---

## ✅ PASO 4: VALIDAR CÓDIGO

### Verificar tipos TypeScript:

```bash
cd proyecto
pnpm check
```

**Resultado esperado:**
```
✅ Sin errores
```

### Ejecutar tests:

```bash
pnpm test
```

**Resultado esperado:**
```
Test Files  1 failed | 12 passed (13)
      Tests  2 failed | 27 passed (29)
```

⚠️ **Los 2 fallos son preexistentes** (no relacionados con estos cambios)
- Causa: Fixture externo `CORRECCION_DETALLES_CARACTERISTICAS_109.csv` ausente del repo
- Acción: Ignorar, no afecta el deployment

---

## 🏗️ PASO 5: COMPILAR PARA PRODUCCIÓN

```bash
cd proyecto
pnpm build
```

**Resultado esperado:**
```
✅ built in X.XXs
```

Si hay errores, revisar la consola. Si continúa, avisar.

---

## 🌍 PASO 6: CONFIGURAR VARIABLES DE AMBIENTE

Asegúrate de tener estas variables en `.env` o en tu sistema:

```env
# Base de datos (DEBE estar actualizada con migraciones 0018, 0019)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/vivienda_nova

# Modo producción
NODE_ENV=production

# Puerto (opcional, default 5173)
VITE_PORT=5173

# Otros (si aplican)
VITE_API_URL=https://tu-dominio.com
```

---

## 🚀 PASO 7: INICIAR/REINICIAR EL SERVIDOR

### Opción A: Desarrollo local (para testing)

```bash
cd proyecto
pnpm dev
```

Servidor estará en: http://localhost:5173

### Opción B: Producción (recomendado)

```bash
cd proyecto
pnpm build
pnpm preview  # o tu comando para iniciar producción
```

---

## 🧪 PASO 8: TESTING/VERIFICACIÓN

### Verificar que todo funciona:

#### 1. **Home page carga**
```
✅ Visita http://localhost:5173/
✅ Debería mostrar tarjetas normales
✅ Sin errores en console (F12)
```

#### 2. **Analytics registra visitas**
```
✅ Abre una tarjeta
✅ Ve a Admin → Analytics de visitas
✅ Debería mostrar "1 visitante" después de refrescar
```

#### 3. **Traductor funciona**
```
✅ Cambia idioma a EN, DE, FR (en header)
✅ Las "Características" (piscina, garaje) deben aparecer en TODOS idiomas
✅ Antes: desaparecían. Ahora: visibles en todos idiomas
```

#### 4. **Mapas funcionan**
```
✅ Abre una tarjeta
✅ Haz click en icono 📍 ubicación
✅ Debe mostrarse un mapa de la zona
✅ Sin necesidad de API key (usa Nominatim/caché)
```

#### 5. **Criptomonedas (si está habilitado)**
```
✅ Ve a Admin → Idiomas y diseño
✅ Activa "Mostrar criptomonedas"
✅ En las tarjetas debe aparecer "🪙 Aceptamos BTC · ETH · USDC"
```

#### 6. **Admin Analytics**
```
✅ Ve a Admin → Analytics de visitas
✅ Debería mostrar:
   - KPIs: Visitantes, Visitas, Vivienda top, Scroll promedio
   - Gráfico de líneas por día
   - Top 10 viviendas
   - Tabla de visitas (filtrable)
   - Botones: Hoy, Semana, Mes, Año, Personalizado
   - Botón "Descargar CSV"
```

---

## 📊 RESUMEN DE CAMBIOS

### Backend (servidor)

| Archivo | Cambios |
|---------|---------|
| `drizzle/0018_visitor_tracking_enhanced.sql` | NUEVO - Migración SQL |
| `drizzle/0019_crypto_display_settings.sql` | NUEVO - Migración SQL |
| `server/db.ts` | Modificado - Analytics + tracking extendido |
| `server/routers.ts` | Modificado - Nuevos endpoints `/admin.analytics` |
| `server/translation.ts` | Verificado - Features se traducen correctamente |

### Frontend público (web)

| Archivo | Cambios |
|---------|---------|
| `client/src/components/PropertyMap.tsx` | NUEVO - Mapas con geocoding |
| `client/src/components/CryptoBadge.tsx` | NUEVO - Badge criptomonedas |
| `client/src/components/PropertyCarousel.tsx` | Modificado - 6 estilos + icono ubicación |
| `client/src/components/PropertyCarousel.css` | Modificado - Estilos nuevos |
| `client/src/hooks/useDeviceType.ts` | NUEVO - Detecta dispositivo |
| `client/src/hooks/useScrollDepth.ts` | NUEVO - Mide profundidad scroll |
| `client/src/pages/Home.tsx` | Modificado - Tracking visitantes |
| `client/src/pages/PropertyDetail.tsx` | Modificado - Mapa + badge crypto |
| `client/src/index.css` | Modificado - Animaciones iOS |

### Frontend Admin

| Archivo | Cambios |
|---------|---------|
| `client/src/components/AnalyticsPanel.tsx` | NUEVO - Panel analytics completo |
| `client/src/components/AnalyticsPanel.css` | NUEVO - Estilos panel |
| `client/src/pages/Admin.tsx` | Modificado - Sección analytics + settings crypto |
| `client/src/components/PropertyImporter.tsx` | Modificado - Preview fotos real |
| `client/src/components/PropertySectionsManager.tsx` | Modificado - 6 estilos carruseles |
| `client/src/components/DashboardLayout.tsx` | Modificado - Menú + Analytics |

---

## 🔐 SEGURIDAD

✅ **CodeQL scan**: 0 alertas
✅ **Escaneo de secretos**: Limpio (sin API keys, passwords, tokens)
✅ **TypeScript**: Sin errores
✅ **Datos personales**: NO se recopilan IPs ni emails sin consentimiento
   - Solo: visitorId anónimo, hora, dispositivo, página

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot find module X"

```bash
cd proyecto
pnpm install
pnpm check
```

### Error en migraciones SQL

Verifica que:
1. PostgreSQL está corriendo
2. DATABASE_URL es correcto
3. Aplicas en orden: 0018 → 0019

### Build falla

```bash
cd proyecto
pnpm clean  # Si existe
rm -rf node_modules
pnpm install
pnpm build
```

### Tests fallan

Ignora los 2 fallos preexistentes (fixture ausente). Si hay otros fallos, reportar.

---

## 📞 CONTACTO / PREGUNTAS

Si algo no funciona o tienes dudas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del servidor
3. Verifica que aplicaste AMBAS migraciones en orden
4. Verifica que `.env` tiene DATABASE_URL correcto

---

## ✅ CHECKLIST PRE-PUBLICACIÓN

Antes de publicar en producción, verifica:

- [ ] Git pull ejecutado exitosamente
- [ ] Migraciones aplicadas (0018 → 0019)
- [ ] `pnpm install` completado
- [ ] `pnpm check` sin errores
- [ ] `pnpm test` pasó (27/29, ignorar 2 preexistentes)
- [ ] `pnpm build` exitoso
- [ ] Variables de ambiente configuradas
- [ ] Base de datos actualizada
- [ ] Servidor inicia sin errores
- [ ] Tarjetas cargan correctamente
- [ ] Idiomas traducen (EN, DE, FR)
- [ ] Analytics registra visitas
- [ ] Mapas muestran ubicación
- [ ] Admin panel funciona

---

## 🎉 ¡LISTO!

Una vez completados todos los pasos, la actualización v1.2 está en PRODUCCIÓN.

**Fecha deployment**: 2026-09-07
**Versión**: v1.2
**Estado**: ✅ Producción lista
**Líneas de código**: ~1,900
**Archivos**: 23
**Tests**: 27/29 pasan

---

*Documento preparado para Manus AI*
*Última actualización: 2026-09-07*

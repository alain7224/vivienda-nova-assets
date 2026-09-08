# 🎯 INSTRUCCIONES DIRECTAS PARA MANUS AI - DEPLOYMENT v1.2

## 📍 UBICACIÓN DE LOS ARCHIVOS CRÍTICOS

Hola Manus, aquí están los archivos que necesitas. Ya están en GitHub, accesibles y listos.

---

## 🗂️ ARCHIVOS QUE NECESITAS

### 1️⃣ MIGRACIÓN SQL #1 - TRACKING DE VISITANTES

**Archivo**: `0018_visitor_tracking_enhanced.sql`

**Ubicación en repo**: 
```
proyecto/drizzle/0018_visitor_tracking_enhanced.sql
```

**Link directo**:
https://github.com/alain7224/vivienda-nova-assets/blob/main/proyecto/drizzle/0018_visitor_tracking_enhanced.sql

**Descargar raw**:
https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/proyecto/drizzle/0018_visitor_tracking_enhanced.sql

**Qué hace**:
- Añade tracking: propertyId, referrer, deviceType, actionType, scrollDepth
- Crea 5 índices optimizados para analytics
- Valida scroll depth (0-100)

**Comando para aplicar**:
```bash
psql -U tu_usuario -d vivienda_nova -h localhost -f proyecto/drizzle/0018_visitor_tracking_enhanced.sql
```

---

### 2️⃣ MIGRACIÓN SQL #2 - CONFIGURACIÓN CRIPTOMONEDAS

**Archivo**: `0019_crypto_display_settings.sql`

**Ubicación en repo**:
```
proyecto/drizzle/0019_crypto_display_settings.sql
```

**Link directo**:
https://github.com/alain7224/vivienda-nova-assets/blob/main/proyecto/drizzle/0019_crypto_display_settings.sql

**Descargar raw**:
https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/proyecto/drizzle/0019_crypto_display_settings.sql

**Qué hace**:
- Añade cryptoEnabled (0 o 1) a siteSettings
- Añade cryptoAcceptedTypes (JSON) a siteSettings
- Valida que sean valores correctos
- Prepara índices para consultas crypto

**Comando para aplicar**:
```bash
psql -U tu_usuario -d vivienda_nova -h localhost -f proyecto/drizzle/0019_crypto_display_settings.sql
```

---

### 3️⃣ GUÍA DE DEPLOYMENT COMPLETA

**Archivo**: `DEPLOYMENT_v1.2_MANUS.md`

**Ubicación en repo**:
```
DEPLOYMENT_v1.2_MANUS.md (en la raíz)
```

**Link directo**:
https://github.com/alain7224/vivienda-nova-assets/blob/main/DEPLOYMENT_v1.2_MANUS.md

**Descargar raw**:
https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/DEPLOYMENT_v1.2_MANUS.md

**Qué contiene**:
- 8 pasos completos de deployment
- Comandos exactos para ejecutar
- Checklist de validación
- Troubleshooting

---

## 📋 ORDEN EXACTO A SEGUIR

### PASO 1: Obtener el código
```bash
git clone https://github.com/alain7224/vivienda-nova-assets.git
cd vivienda-nova-assets
git pull origin main
```

### PASO 2: Aplicar MIGRACIÓN 0018 (PRIMERO)
```bash
cd proyecto/drizzle
psql -U tu_usuario -d vivienda_nova -h localhost < 0018_visitor_tracking_enhanced.sql
# Verificar: \d siteVisits
# Debería mostrar: propertyId, referrer, deviceType, actionType, scrollDepth
```

### PASO 3: Aplicar MIGRACIÓN 0019 (SEGUNDO)
```bash
psql -U tu_usuario -d vivienda_nova -h localhost < 0019_crypto_display_settings.sql
# Verificar: \d siteSettings
# Debería mostrar: cryptoEnabled, cryptoAcceptedTypes
```

### PASO 4: Validar código
```bash
cd ../
pnpm install
pnpm check      # Sin errores TypeScript
pnpm test       # 27/29 (ignora 2 preexistentes)
pnpm build      # Debe compilar exitosamente
```

### PASO 5: Iniciar servidor
```bash
pnpm preview    # O tu comando de producción
```

### PASO 6: Verificar funcionamiento
- [ ] Home page carga sin errores
- [ ] Analytics registra visitas
- [ ] Idiomas traducen (EN, DE, FR)
- [ ] Mapas muestran ubicación
- [ ] Criptomonedas visibles (si activadas en admin)
- [ ] Admin Analytics funciona

---

## ⚠️ PUNTOS CRÍTICOS

1. **ORDEN DE MIGRACIONES**: 0018 PRIMERO, 0019 DESPUÉS
   - Si inviertes el orden, fallará con errores de referencia

2. **DATABASE_URL correcto**: 
   ```
   DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/vivienda_nova
   ```

3. **PostgreSQL debe estar corriendo**:
   ```bash
   sudo systemctl start postgresql
   # o
   brew services start postgresql
   ```

4. **No crear ni adivinar SQL**: Usa exactamente los archivos subidos

---

## 🔗 RESUMEN DE LINKS

| Archivo | GitHub | Raw | Descripción |
|---------|--------|-----|---|
| 0018 migración | [Ver](https://github.com/alain7224/vivienda-nova-assets/blob/main/proyecto/drizzle/0018_visitor_tracking_enhanced.sql) | [Raw](https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/proyecto/drizzle/0018_visitor_tracking_enhanced.sql) | Tracking visitantes |
| 0019 migración | [Ver](https://github.com/alain7224/vivienda-nova-assets/blob/main/proyecto/drizzle/0019_crypto_display_settings.sql) | [Raw](https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/proyecto/drizzle/0019_crypto_display_settings.sql) | Crypto settings |
| Guía deployment | [Ver](https://github.com/alain7224/vivienda-nova-assets/blob/main/DEPLOYMENT_v1.2_MANUS.md) | [Raw](https://raw.githubusercontent.com/alain7224/vivienda-nova-assets/main/DEPLOYMENT_v1.2_MANUS.md) | Guía completa |

---

## ✅ CHECKLIST PRE-DEPLOY

- [ ] Archivos encontrados y descargados
- [ ] Migración 0018 aplicada
- [ ] Migración 0019 aplicada
- [ ] `pnpm check` sin errores
- [ ] `pnpm test` con 27/29 (ok 2 preexistentes)
- [ ] `pnpm build` exitoso
- [ ] Variables de ambiente configuradas
- [ ] Servidor inicia sin errores
- [ ] Home page carga
- [ ] Admin Analytics funciona
- [ ] Mapas funcionan
- [ ] Tests en producción (verificar en navegador)

---

## 📞 SI ALGO FALLA

1. **Revisa los logs**: 
   ```bash
   pnpm build 2>&1 | head -20
   ```

2. **Verifica BD**:
   ```bash
   psql -U tu_usuario -d vivienda_nova -c "\d siteVisits"
   ```

3. **Revisa DATABASE_URL**:
   ```bash
   echo $DATABASE_URL
   ```

4. **Limpia y reinstala**:
   ```bash
   cd proyecto
   rm -rf node_modules
   pnpm install
   pnpm check
   ```

---

## 🎉 CUANDO TODO FUNCIONE

La versión v1.2 estará en producción con:
- ✅ Analytics completo
- ✅ Traductor reparado
- ✅ 6 estilos de carruseles
- ✅ Mapas con geocoding
- ✅ Animaciones iOS smooth
- ✅ Admin rediseñado

---

**Fecha de subida**: 2026-09-08
**Versión**: v1.2
**Estado**: ✅ Listo para aplicar
**Contacto**: Usa este documento como referencia exacta

*Documento generado para Manus AI*

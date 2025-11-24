# Documentación del Proyecto - Control de Versiones con Git

**Proyecto:** GeoBicentenario - Aplicación de Turismo Santa Cruz
**Estudiante:** Liceras Paniagua Joel Enrique
**Asignatura:** Control de Versiones

---

## 1. Descripción del Proyecto

GeoBicentenario es una aplicación móvil completa (frontend + backend) diseñada para guiar turistas a través de rutas turísticas en Santa Cruz de la Sierra, con motivo del bicentenario.

### Tecnologías Utilizadas

**Frontend:**
- React Native + Expo
- TypeScript
- React Navigation
- Zustand (gestión de estado)
- React Native Maps

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes

---

## 2. Estructura del Repositorio Git

### Commit Inicial (master)
El commit inicial contiene la estructura base del proyecto:
- Sistema de autenticación (login/registro)
- Configuración del backend y base de datos
- Estructura base del frontend
- Pantallas de bienvenida

**Commit:** `690f75f` - Initial commit: Estructura base del proyecto GeoBicentenario

---

## 3. Ramas Creadas y Cambios Implementados

### Rama 1: feature/monumentos

**Propósito:** Implementar el módulo de gestión de monumentos y lugares turísticos

**Cambios en Backend:**
- **Modelo:** `backend-SCZGO/models/monument.model.js`
  - Esquema MongoDB con nombre, descripción, categorías
  - Sistema de coordenadas geográficas (latitud/longitud)
  - Geofencing con radio configurable (50m por defecto)
  - Soporte para múltiples imágenes

- **Controlador:** `backend-SCZGO/controllers/monument.controller.js`
  - CRUD completo de monumentos
  - Búsqueda por categorías
  - Filtrado por ubicación

- **Rutas:** `backend-SCZGO/routes/monument.routes.js`
  - API endpoints para gestión de monumentos

**Cambios en Frontend:**
- **Pantalla:** `FrontendFinal/app/pages/monumento/[id].tsx`
  - Vista detallada de monumentos
  - Galería de imágenes
  - Información y descripción
  - Integración con geolocalización

**Categorías implementadas:**
- Gastronómicos
- Monumentos
- Museos
- Recreativos
- Iglesias

**Commit:** `1d5501e` - Feature: Implementación del módulo de Monumentos

---

### Rama 2: feature/rutas-turisticas

**Propósito:** Implementar el sistema de rutas turísticas personalizadas

**Cambios en Backend:**
- **Modelo:** `backend-SCZGO/models/ruta.model.js`
  - Esquema con puntos ordenados de monumentos
  - Sistema de tracking (inicio/fin)
  - Check-ins en cada punto
  - Tiempo estimado por punto
  - Estado de completitud

- **Controlador:** `backend-SCZGO/controllers/ruta.controller.js`
  - Generación de rutas personalizadas
  - Registro de check-ins
  - Cálculo de duración estimada
  - Gestión de rutas activas

- **Rutas:** `backend-SCZGO/routes/ruta.routes.js`
  - Endpoints para crear y gestionar rutas

**Cambios en Frontend:**
- **FreeTour:** `FrontendFinal/app/pages/tab/FreeTour.tsx`
  - Modo exploración libre
  - Visualización de monumentos cercanos
  - Navegación sin ruta definida

- **GuidedTour:** `FrontendFinal/app/pages/tab/GuidedTour.tsx`
  - Modo guiado con ruta definida
  - Sistema de navegación paso a paso
  - Tracking de progreso
  - Notificaciones por geofencing

**Commit:** `eddc5e8` - Feature: Implementación del módulo de Rutas Turísticas

---

### Rama 3: feature/scz-share

**Propósito:** Implementar funcionalidad de red social para compartir experiencias

**Cambios en Backend:**
- **Modelos:**
  - `backend-SCZGO/models/publicacion.model.js` - Publicaciones de usuarios
  - `backend-SCZGO/models/historia.model.js` - Historias temporales (stories)

- **Controladores:**
  - `backend-SCZGO/controllers/publicacion.controller.js`
    - CRUD de publicaciones
    - Sistema de likes
    - Feed personalizado
  - `backend-SCZGO/controllers/historia.controller.js`
    - Gestión de historias temporales
    - Expiración automática

- **Rutas:**
  - `backend-SCZGO/routes/publicacion.routes.js`
  - `backend-SCZGO/routes/historia.routes.js`

**Cambios en Frontend:**
- **SczShare:** Carpeta completa con múltiples pantallas
  - `index.tsx` - Feed de publicaciones
  - `FormPost.tsx` - Crear nuevas publicaciones
  - `MyPostsScreen.tsx` - Publicaciones del usuario
  - Subcarpeta Profile con configuración de usuario

- **HistoryMode:** Sistema de historias temporales
  - Visualización estilo Instagram Stories
  - Captura de contenido multimedia

**Commit:** `6310f55` - Feature: Implementación del módulo SCZ Share (Red Social)

---

## 4. Proceso de Merge

### Merge 1: feature/monumentos → master
- **Tipo:** Fast-forward (sin conflictos)
- **Resultado:** Integración exitosa del módulo de monumentos

### Merge 2: feature/rutas-turisticas → master
- **Tipo:** Merge con conflicto
- **Conflicto:** `backend-SCZGO/app.js` (registro de rutas)
- **Resolución:** Se combinaron ambas rutas (monumentos + rutas)
- **Commit de merge:** `88efe78`

### Merge 3: feature/scz-share → master
- **Tipo:** Merge con conflicto
- **Conflicto:** `backend-SCZGO/app.js` (registro de rutas de publicaciones)
- **Resolución:** Se integraron todas las rutas en el archivo principal
- **Commit de merge:** `d736f0d`

---

## 5. Estado Final del Proyecto

### Ramas Existentes
```
* master (principal - con todas las funcionalidades integradas)
  feature/monumentos
  feature/rutas-turisticas
  feature/scz-share
```

### Archivo app.js Final
El archivo `backend-SCZGO/app.js` ahora incluye todas las rutas:
```javascript
// Rutas de autenticación y usuarios
app.use('/api/autenticacion', require('./routes/auth.routes'));
app.use('/api/usuarios', require('./routes/user.routes'));

// Rutas de monumentos
app.use('/api/monumentos', require('./routes/monument.routes'));

// Rutas turísticas
app.use('/api/rutas', require('./routes/ruta.routes'));

// Rutas de SCZ Share (red social)
app.use('/api/publicaciones', require('./routes/publicacion.routes'));
app.use('/api/historias', require('./routes/historia.routes'));
```

---

## 6. Comandos Git Utilizados

```bash
# Inicializar repositorio
git init

# Commit inicial
git add .
git commit -m "Initial commit: Estructura base del proyecto GeoBicentenario"

# Crear rama de monumentos
git checkout -b feature/monumentos
git add .
git commit -m "Feature: Implementación del módulo de Monumentos"

# Crear rama de rutas
git checkout master
git checkout -b feature/rutas-turisticas
git add .
git commit -m "Feature: Implementación del módulo de Rutas Turísticas"

# Crear rama de scz-share
git checkout master
git checkout -b feature/scz-share
git add .
git commit -m "Feature: Implementación del módulo SCZ Share (Red Social)"

# Merges
git checkout master
git merge feature/monumentos
git merge feature/rutas-turisticas  # Con resolución de conflictos
git merge feature/scz-share          # Con resolución de conflictos
```

---

## 7. Evidencias Visuales

### Historial de Commits
```
*   d736f0d Merge branch 'feature/scz-share' into master
|\
| * 6310f55 Feature: Implementación del módulo SCZ Share (Red Social)
* |   88efe78 Merge branch 'feature/rutas-turisticas' into master
|\ \
| * | eddc5e8 Feature: Implementación del módulo de Rutas Turísticas
* | 1d5501e Feature: Implementación del módulo de Monumentos
|/
* 690f75f Initial commit: Estructura base del proyecto GeoBicentenario
```

### Archivos Totales por Rama

**Commit Inicial:** 104 archivos
**feature/monumentos:** +5 archivos (109 total)
**feature/rutas-turisticas:** +5 archivos (109 total desde master)
**feature/scz-share:** +19 archivos (123 total desde master)
**Master final:** 123 archivos totales

---

## 8. Conclusión

El proyecto GeoBicentenario fue exitosamente versionado utilizando Git, demostrando:

1. ✅ Creación de repositorio y commit inicial
2. ✅ Desarrollo en 3 ramas separadas con funcionalidades distintas
3. ✅ Resolución de conflictos en merges
4. ✅ Integración final de todas las funcionalidades en master
5. ✅ Mantenimiento del historial completo de cambios

El sistema de control de versiones permitió organizar el desarrollo del proyecto de manera modular, facilitando el trabajo independiente en cada funcionalidad y su posterior integración.

---

**Fecha de elaboración:** 24 de Noviembre, 2025
**Herramienta utilizada:** Git

---

## 9. Instrucciones para Revisar el Repositorio

### Ver todas las ramas
```bash
git branch -a
```

### Ver historial gráfico
```bash
git log --oneline --graph --all
```

### Ver cambios en cada rama
```bash
# Ver archivos en rama monumentos
git checkout feature/monumentos
git diff master..feature/monumentos --name-only

# Ver archivos en rama rutas
git checkout feature/rutas-turisticas
git diff master..feature/rutas-turisticas --name-only

# Ver archivos en rama scz-share
git checkout feature/scz-share
git diff master..feature/scz-share --name-only
```

### Volver a master
```bash
git checkout master
```

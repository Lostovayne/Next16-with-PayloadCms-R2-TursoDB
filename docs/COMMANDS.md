# Guía Completa de Comandos

Documentación detallada de todos los comandos disponibles en el proyecto.

## Tabla de Contenidos

- [Comandos de Desarrollo](#comandos-de-desarrollo)
- [Comandos de Build y Producción](#comandos-de-build-y-producción)
- [Comandos de Payload CMS](#comandos-de-payload-cms)
- [Comandos de Testing](#comandos-de-testing)
- [Comandos de Base de Datos](#comandos-de-base-de-datos)
- [Comandos de Linting y Formato](#comandos-de-linting-y-formato)
- [Comandos de Docker](#comandos-de-docker)
- [Variables de Entorno en Comandos](#variables-de-entorno-en-comandos)

---

## Comandos de Desarrollo

### `pnpm dev`

```bash
pnpm dev
```

**Descripción:** Inicia el servidor de desarrollo de Next.js con hot-reload.

**Detalles:**

- Puerto por defecto: `3000`
- Hot-reload automático
- Muestra errores en tiempo real
- Incluye React Fast Refresh

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation next dev
```

**Cuándo usar:**

- Desarrollo diario
- Probar cambios en tiempo real
- Depuración local

**Acceso:**

- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3000/admin
- API: http://localhost:3000/api

---

### `pnpm devsafe`

```bash
pnpm devsafe
```

**Descripción:** Inicia el servidor de desarrollo después de limpiar el caché de Next.js.

**Detalles:**

- Elimina la carpeta `.next/`
- Resuelve problemas de caché
- Útil cuando hay errores extraños

**Equivalente a:**

```bash
rm -rf .next && cross-env NODE_OPTIONS=--no-deprecation next dev
```

**Cuándo usar:**

- Después de cambiar configuraciones importantes
- Cuando el hot-reload no funciona correctamente
- Errores de compilación persistentes
- Después de actualizar dependencias

---

## Comandos de Build y Producción

### `pnpm build`

```bash
pnpm build
```

**Descripción:** Construye la aplicación optimizada para producción.

**Detalles:**

- Genera el import map automáticamente
- Optimiza el código JavaScript/TypeScript
- Compila páginas estáticas
- Optimiza imágenes
- Asigna 8GB de memoria a Node.js

**Equivalente a:**

```bash
pnpm run generate:importmap && cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" next build
```

**Proceso:**

1. `generate:importmap` - Genera mapeo de imports
2. `next build` - Compila la aplicación

**Salida:**

```
.next/
├── static/          # Assets estáticos
├── server/          # Código del servidor
└── standalone/      # (si está configurado)
```

**Cuándo usar:**

- Antes de desplegar a producción
- Para probar el build localmente
- Verificar el tamaño de los bundles

---

### `pnpm start`

```bash
pnpm start
```

**Descripción:** Inicia el servidor de producción (requiere `pnpm build` primero).

**Detalles:**

- Usa el build optimizado
- Sin hot-reload
- Rendimiento máximo
- Puerto por defecto: `3000`

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation next start
```

**Cuándo usar:**

- Probar el build de producción localmente
- Verificar rendimiento
- Testing de pre-producción

** Importante:** Ejecuta `pnpm build` antes de este comando.

---

## Comandos de Payload CMS

### `pnpm generate:types`

```bash
pnpm generate:types
```

**Descripción:** Genera tipos TypeScript basados en las colecciones de Payload.

**Detalles:**

- Lee todas las colecciones en `src/collections/`
- Genera `src/payload-types.ts`
- Proporciona autocompletado en el IDE
- Type-safety completo

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation payload generate:types
```

**Salida:**

```typescript
// src/payload-types.ts
export interface User {
  id: string;
  email: string;
  // ... más campos
}

export interface Media {
  id: string;
  filename: string;
  // ... más campos
}
```

**Cuándo usar:**

- Después de modificar colecciones
- Después de agregar nuevos campos
- Cuando los tipos no coinciden
- Antes de hacer commit

---

### `pnpm generate:importmap`

```bash
pnpm generate:importmap
```

**Descripción:** Genera el mapa de importaciones para Payload Admin UI.

**Detalles:**

- Escanea componentes personalizados
- Genera mapeo de rutas
- Requerido para el admin panel
- Se ejecuta automáticamente en `pnpm build`

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation payload generate:importmap
```

**Cuándo usar:**

- Después de agregar componentes custom al admin
- Antes de hacer build
- Si el admin no carga correctamente

---

### `pnpm payload`

```bash
pnpm payload [comando]
```

**Descripción:** Acceso directo al CLI de Payload CMS.

**Comandos disponibles:**

#### Crear primer usuario

```bash
pnpm payload create-first-user
```

Interactivo - te pedirá email y password.

#### Migraciones

```bash
# Crear nueva migración
pnpm payload migrate:create

# Ejecutar migraciones pendientes
pnpm payload migrate

# Ver estado de migraciones
pnpm payload migrate:status

# Revertir última migración
pnpm payload migrate:down

# Resetear base de datos (¡CUIDADO!)
pnpm payload migrate:reset
```

#### Seed (datos de prueba)

```bash
pnpm payload seed
```

#### Generar archivos

```bash
# Generar tipos
pnpm payload generate:types

# Generar GraphQL schema
pnpm payload generate:graphQLSchema

# Generar import map
pnpm payload generate:importmap
```

---

## Comandos de Testing

### `pnpm test`

```bash
pnpm test
```

**Descripción:** Ejecuta todos los tests (integración + e2e).

**Equivalente a:**

```bash
pnpm run test:int && pnpm run test:e2e
```

**Proceso:**

1. Tests de integración (Vitest)
2. Tests end-to-end (Playwright)

---

### `pnpm test:int`

```bash
pnpm test:int
```

**Descripción:** Ejecuta tests de integración con Vitest.

**Detalles:**

- Tests unitarios y de integración
- Usa `vitest.config.mts`
- Rápido y eficiente

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation vitest run --config ./vitest.config.mts
```

**Ejemplo de uso:**

```bash
# Ejecutar todos los tests
pnpm test:int

# Modo watch
npx vitest

# Con coverage
npx vitest --coverage
```

---

### `pnpm test:e2e`

```bash
pnpm test:e2e
```

**Descripción:** Ejecuta tests end-to-end con Playwright.

**Detalles:**

- Tests de navegador completo
- Simula interacciones de usuario
- Captura screenshots en fallos

**Equivalente a:**

```bash
cross-env NODE_OPTIONS="--no-deprecation --no-experimental-strip-types" pnpm exec playwright test
```

**Comandos adicionales de Playwright:**

```bash
# Modo UI interactivo
npx playwright test --ui

# Depuración
npx playwright test --debug

# Ejecutar en navegador específico
npx playwright test --project=chromium

# Ver reporte
npx playwright show-report
```

---

## Comandos de Base de Datos

### Drizzle Kit

```bash
# Ver estado del schema
npx drizzle-kit studio
```

Abre un UI web en http://localhost:4983 para visualizar la BD.

```bash
# Generar migraciones SQL
npx drizzle-kit generate
```

Crea archivos SQL en `src/migrations/`.

```bash
# Push schema directamente (desarrollo)
npx drizzle-kit push
```

**Cuidado:** Aplica cambios sin crear migración. Solo en desarrollo.

```bash
# Verificar esquema
npx drizzle-kit check
```

---

### Turso CLI

```bash
# Crear base de datos
turso db create mi-proyecto-db

# Listar bases de datos
turso db list

# Ver detalles
turso db show mi-proyecto-db

# Obtener URL
turso db show mi-proyecto-db --url

# Crear token
turso db tokens create mi-proyecto-db

# Eliminar base de datos
turso db destroy mi-proyecto-db
```

---

## Comandos de Linting y Formato

### `pnpm lint`

```bash
pnpm lint
```

**Descripción:** Ejecuta ESLint para verificar calidad del código.

**Equivalente a:**

```bash
cross-env NODE_OPTIONS=--no-deprecation next lint
```

**Arreglar automáticamente:**

```bash
pnpm lint --fix
```

---

### Prettier (no incluido en scripts)

```bash
# Verificar formato
npx prettier --check .

# Formatear todos los archivos
npx prettier --write .

# Formatear archivo específico
npx prettier --write src/collections/Posts.ts
```

---

## Comandos de Docker

### Build

```bash
# Construir imagen
docker build -t mi-proyecto-2025 .

# Build con tag específico
docker build -t mi-proyecto-2025:v1.0.0 .
```

### Run

```bash
# Ejecutar contenedor
docker run -p 3000:3000 mi-proyecto-2025

# Con variables de entorno
docker run -p 3000:3000 --env-file .env mi-proyecto-2025

# En segundo plano
docker run -d -p 3000:3000 mi-proyecto-2025
```

### Docker Compose

```bash
# Iniciar servicios
docker-compose up

# En segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Rebuild y restart
docker-compose up --build

# Eliminar volúmenes también
docker-compose down -v
```

---

## Variables de Entorno en Comandos

### NODE_OPTIONS

```bash
--no-deprecation
```

Oculta warnings de deprecación.

```bash
--max-old-space-size=8000
```

Asigna 8GB de memoria a Node.js (útil para builds grandes).

```bash
--no-experimental-strip-types
```

Desactiva el strip de tipos experimentales (Playwright).

### cross-env

El paquete `cross-env` permite establecer variables de entorno de forma compatible entre sistemas operativos (Windows, Linux, macOS).

**Sin cross-env (solo Unix):**

```bash
NODE_OPTIONS=--no-deprecation next dev
```

**Con cross-env (multiplataforma):**

```bash
cross-env NODE_OPTIONS=--no-deprecation next dev
```

---

## Comandos Útiles Adicionales

### Instalación y Gestión

```bash
# Instalar dependencias
pnpm install

# Agregar dependencia
pnpm add nombre-paquete

# Agregar dependencia de desarrollo
pnpm add -D nombre-paquete

# Actualizar dependencias
pnpm update

# Actualizar dependencia específica
pnpm update nombre-paquete

# Listar dependencias desactualizadas
pnpm outdated

# Limpiar node_modules y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Git

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "feat: descripción del cambio"

# Push
git push origin main
```

### Limpieza

```bash
# Limpiar caché de Next.js
rm -rf .next

# Limpiar node_modules
rm -rf node_modules

# Limpiar todo y reinstalar
rm -rf .next node_modules pnpm-lock.yaml
pnpm install
```

---

## Flujo de Trabajo Típico

### Desarrollo Diario

```bash
1. pnpm dev                    # Iniciar desarrollo
2. # Hacer cambios en el código
3. pnpm generate:types         # Actualizar tipos
4. pnpm lint                   # Verificar código
5. git add .                   # Agregar cambios
6. git commit -m "mensaje"     # Commit
7. git push                    # Push a repositorio
```

### Antes de Desplegar

```bash
1. pnpm generate:types         # Actualizar tipos
2. pnpm lint                   # Verificar código
3. pnpm test                   # Ejecutar tests
4. pnpm build                  # Build de producción
5. pnpm start                  # Probar build localmente
```

### Después de Cambiar Schema

```bash
1. # Modificar archivos en src/collections/
2. pnpm generate:types         # Actualizar tipos
3. pnpm payload migrate:create # Crear migración
4. pnpm payload migrate        # Aplicar migración
5. pnpm devsafe               # Reiniciar con caché limpio
```

### Solución de Problemas

```bash
1. rm -rf .next                # Limpiar caché
2. pnpm generate:types         # Regenerar tipos
3. pnpm generate:importmap     # Regenerar import map
4. pnpm devsafe               # Reiniciar
```

---

## Comandos de Diagnóstico

```bash
# Ver versión de Node.js
node --version

# Ver versión de pnpm
pnpm --version

# Ver tamaño de node_modules
du -sh node_modules

# Ver tamaño del build
du -sh .next

# Ver procesos de Node activos
ps aux | grep node

# Matar proceso en puerto 3000 (Linux/Mac)
lsof -ti:3000 | xargs kill -9

# Matar proceso en puerto 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

---

## Recursos

- [pnpm Docs](https://pnpm.io)
- [Next.js CLI](https://nextjs.org/docs/api-reference/cli)
- [Payload CLI](https://payloadcms.com/docs/cli)
- [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview)

---

**¿Comando no funciona?** Verifica:

1.  Estás en la carpeta raíz del proyecto
2.  `node_modules/` existe (ejecuta `pnpm install`)
3.  El archivo `.env` está configurado correctamente
4.  No hay otro proceso usando el puerto 3000

**¡Feliz desarrollo! **

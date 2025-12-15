# 🏗️ Arquitectura del Proyecto

Documentación técnica de la arquitectura de **Payload CMS 3.0 + Next.js 15 + Turso + Cloudflare R2**.

## 📋 Tabla de Contenidos

- [Vista General](#vista-general)
- [Diagrama de Arquitectura](#diagrama-de-arquitectura)
- [Flujo de Datos](#flujo-de-datos)
- [Componentes Principales](#componentes-principales)
- [Stack Tecnológico](#stack-tecnológico)
- [Decisiones de Arquitectura](#decisiones-de-arquitectura)

---

## 🎯 Vista General

Este proyecto implementa una arquitectura **headless CMS** moderna con las siguientes características:

- **Frontend/Backend:** Next.js 15 con App Router (Monolito modular)
- **CMS:** Payload CMS 3.0 integrado
- **Base de Datos:** Turso (SQLite distribuido, edge-ready)
- **Almacenamiento:** Cloudflare R2 (S3-compatible)
- **API:** REST + GraphQL automáticos
- **Autenticación:** JWT con Payload Auth

---

## 📐 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO FINAL                            │
│                    (Navegador / App Móvil)                       │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VERCEL / SERVIDOR                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                       │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │  SSR / SSG / API Routes                             │  │  │
│  │  │  - Páginas públicas                                  │  │  │
│  │  │  - API endpoints personalizados                      │  │  │
│  │  └─────────────────┬───────────────────────────────────┘  │  │
│  │                    │                                       │  │
│  │  ┌─────────────────▼───────────────────────────────────┐  │  │
│  │  │          Payload CMS 3.0 Core                       │  │  │
│  │  │  ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │  Admin Panel UI (/admin)                     │   │  │  │
│  │  │  │  - React 19                                   │   │  │  │
│  │  │  │  - Lexical Editor                            │   │  │  │
│  │  │  └──────────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │  REST API (/api/*)                           │   │  │  │
│  │  │  │  - CRUD automático                           │   │  │  │
│  │  │  │  - Autenticación JWT                         │   │  │  │
│  │  │  └──────────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │  GraphQL API (/api/graphql)                  │   │  │  │
│  │  │  │  - Schema auto-generado                      │   │  │  │
│  │  │  │  - Queries y Mutations                       │   │  │  │
│  │  │  └──────────────────────────────────────────────┘   │  │  │
│  │  │  ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │  Collections Layer                           │   │  │  │
│  │  │  │  - Users (auth)                              │   │  │  │
│  │  │  │  - Media (uploads)                           │   │  │  │
│  │  │  │  - [Tus colecciones personalizadas]          │   │  │  │
│  │  │  └──────────────────────────────────────────────┘   │  │  │
│  │  └─────────────────┬───────────────┬───────────────────┘  │  │
│  └────────────────────┼───────────────┼──────────────────────┘  │
└───────────────────────┼───────────────┼─────────────────────────┘
                        │               │
                        │               │
        ┌───────────────▼──┐        ┌───▼────────────────┐
        │                  │        │                     │
        │  TURSO DATABASE  │        │  CLOUDFLARE R2      │
        │   (SQLite Edge)  │        │  (Object Storage)   │
        │                  │        │                     │
        │  ┌────────────┐  │        │  ┌──────────────┐  │
        │  │   users    │  │        │  │  images/     │  │
        │  │   media    │  │        │  │  documents/  │  │
        │  │   posts    │  │        │  │  videos/     │  │
        │  │   ...      │  │        │  │  ...         │  │
        │  └────────────┘  │        │  └──────────────┘  │
        │                  │        │                     │
        │  - Distributed   │        │  - S3 Compatible   │
        │  - Edge Replicas │        │  - Global CDN      │
        │  - Low Latency   │        │  - Zero Egress     │
        └──────────────────┘        └─────────────────────┘
```

---

## 🔄 Flujo de Datos

### 1️⃣ Flujo de Creación de Contenido

```
┌──────────────┐
│   Admin      │  1. Login al admin panel
│   User       │     (/admin)
└──────┬───────┘
       │
       │ 2. Autentica con JWT
       ▼
┌──────────────────┐
│  Payload Auth    │  3. Valida credenciales
└──────┬───────────┘     contra Turso DB
       │
       │ 4. Token JWT válido
       ▼
┌──────────────────┐
│  Admin Panel     │  5. Crea/Edita contenido
│  (Lexical)       │     + Sube archivos
└──────┬───────────┘
       │
       │ 6. POST /api/collection
       ▼
┌──────────────────────────────────┐
│  Payload CMS                     │
│  ┌────────────────────────────┐  │
│  │ 7. Valida datos            │  │
│  │ 8. Ejecuta hooks           │  │
│  │ 9. Procesa relaciones      │  │
│  └──────────┬─────────────────┘  │
└─────────────┼────────────────────┘
              │
      ┌───────┴────────┐
      │                │
      ▼                ▼
┌──────────┐    ┌─────────────┐
│  Turso   │    │ Cloudflare  │
│  DB      │    │ R2 Storage  │
│          │    │             │
│ 10. Save │    │ 11. Upload  │
│   data   │    │    files    │
└──────────┘    └─────────────┘
```

### 2️⃣ Flujo de Consumo de Contenido (API)

```
┌──────────────┐
│   Frontend   │  1. GET /api/posts
│   or Mobile  │     ?where[status]=published
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│  Next.js API       │  2. Procesa request
│  Route Handler     │
└──────┬─────────────┘
       │
       │ 3. Llama a Payload
       ▼
┌──────────────────────────────────┐
│  Payload CMS                     │
│  ┌────────────────────────────┐  │
│  │ 4. Valida permisos         │  │
│  │ 5. Aplica filtros          │  │
│  │ 6. Popula relaciones       │  │
│  └──────────┬─────────────────┘  │
└─────────────┼────────────────────┘
              │
              │ 7. Query a Turso
              ▼
┌──────────────────────┐
│  Turso Database      │
│  SELECT * FROM posts │
│  WHERE status='pub'  │
└──────────┬───────────┘
           │
           │ 8. Retorna datos
           ▼
┌──────────────────────┐
│  Payload CMS         │  9. Formatea respuesta
│  - Incluye URLs R2   │     con relaciones y
│  - Serializa datos   │     media URLs
└──────────┬───────────┘
           │
           │ 10. JSON Response
           ▼
┌──────────────────────┐
│  Cliente             │  11. Renderiza contenido
└──────────────────────┘
```

### 3️⃣ Flujo de Subida de Archivos

```
┌──────────────┐
│   Usuario    │  1. Selecciona archivo
│   (Admin)    │     en Admin Panel
└──────┬───────┘
       │
       │ 2. Upload vía form
       ▼
┌────────────────────┐
│  Payload Media     │  3. Procesa archivo
│  Collection        │     - Valida tipo
│                    │     - Genera metadata
└──────┬─────────────┘     - Crea thumbnails
       │
       │ 4. Usa S3 Storage Plugin
       ▼
┌───────────────────────────────┐
│  @payloadcms/storage-s3       │
│  ┌─────────────────────────┐  │
│  │ 5. Sharp Image Process  │  │
│  │ 6. Generate sizes       │  │
│  └──────────┬──────────────┘  │
└─────────────┼─────────────────┘
              │
              │ 7. Upload to R2
              ▼
┌────────────────────────────────┐
│  Cloudflare R2                 │
│  ┌──────────────────────────┐  │
│  │ /uploads/                │  │
│  │   - original.jpg         │  │
│  │   - thumbnail.jpg        │  │
│  │   - medium.jpg           │  │
│  └──────────────────────────┘  │
└───────────┬────────────────────┘
            │
            │ 8. Retorna URLs públicas
            ▼
┌────────────────────────┐
│  Turso Database        │  9. Guarda metadata
│  media table           │     + URLs en DB
│  - filename            │
│  - url                 │
│  - sizes               │
│  - mimeType            │
└────────────────────────┘
```

---

## 🧩 Componentes Principales

### 1. Next.js 15 (App Router)

**Responsabilidad:** Framework principal, enrutamiento, SSR/SSG

**Archivos clave:**

- `src/app/` - Rutas y páginas
- `next.config.mjs` - Configuración
- `src/app/api/` - API Routes personalizadas

**Características:**

- Server Components por defecto
- Streaming y Suspense
- Optimización automática de imágenes
- Route Handlers para APIs

### 2. Payload CMS

**Responsabilidad:** Gestión de contenido, admin panel, APIs

**Archivos clave:**

- `src/payload.config.ts` - Configuración principal
- `src/collections/` - Definiciones de colecciones
- `src/payload-types.ts` - Tipos generados

**Características:**

- Admin UI automático
- REST + GraphQL APIs
- Sistema de autenticación
- Hooks y validación
- Control de acceso granular

### 3. Turso Database

**Responsabilidad:** Almacenamiento de datos estructurados

**Archivos clave:**

- `drizzle.conf.ts` - Configuración de ORM
- `src/migrations/` - Migraciones de schema

**Características:**

- SQLite distribuido
- Edge replicas globales
- Latencia ultra-baja (<10ms)
- Compatible con libSQL

### 4. Cloudflare R2

**Responsabilidad:** Almacenamiento de archivos y media

**Configuración:**

- Plugin `@payloadcms/storage-s3`
- Variables de entorno R2\_\*

**Características:**

- Compatible con S3 API
- Zero egress fees
- CDN integrado
- Almacenamiento ilimitado

### 5. Drizzle ORM

**Responsabilidad:** Migraciones y schema management

**Archivos clave:**

- `drizzle.conf.ts`
- `src/migrations/`

**Características:**

- Type-safe queries
- Generación de migraciones
- Push directo al schema (dev)

---

## 💻 Stack Tecnológico

### Backend

```typescript
// Runtime
Node.js 20+

// Framework
Next.js 15.4.10

// CMS
Payload CMS 3.68.4

// Database
@payloadcms/db-sqlite 3.68.4
@libsql/client 0.15.15

// ORM
Drizzle Kit 0.31.8

// Storage
@payloadcms/storage-s3 3.68.4
@aws-sdk/client-s3 3.948.0
```

### Frontend

```typescript
// Framework UI
React 19.2.3
React DOM 19.2.3

// Editor
@payloadcms/richtext-lexical 3.68.4

// Payload UI
@payloadcms/ui 3.68.4

// Image Processing
Sharp 0.34.2
```

### DevOps

```typescript
// Testing
Vitest 3.2.3
Playwright 1.56.1

// Linting
ESLint 9.39.2
Prettier 3.7.4

// Containerization
Docker
Docker Compose

// Deployment
Vercel (recomendado)
```

---

## 🤔 Decisiones de Arquitectura

### ¿Por qué Monolito en lugar de Microservicios?

**Decisión:** Monolito modular con Next.js

**Razones:**

- ✅ Menor complejidad operacional
- ✅ Deploy más simple
- ✅ Menos overhead de red
- ✅ Ideal para equipos pequeños/medianos
- ✅ Fácil de escalar verticalmente
- ✅ Desarrollo más rápido

**Cuándo cambiar:** Si necesitas escalar horizontalmente equipos grandes o dominios muy diferentes.

---

### ¿Por qué Turso en lugar de PostgreSQL/MySQL?

**Decisión:** Turso (SQLite distribuido)

**Razones:**

- ✅ Edge-ready (réplicas globales)
- ✅ Latencia ultra-baja (<10ms)
- ✅ Plan gratuito generoso
- ✅ Zero-ops (serverless)
- ✅ Compatible con SQLite (familiar)
- ✅ Branch databases (dev/staging/prod)

**Limitaciones:**

- ❌ No recomendado para >1000 writes/seg
- ❌ Menos maduro que PostgreSQL
- ❌ Algunas features SQL avanzadas limitadas

---

### ¿Por qué Cloudflare R2 en lugar de AWS S3?

**Decisión:** Cloudflare R2

**Razones:**

- ✅ **Zero egress fees** (S3 cobra por descarga)
- ✅ Compatible con S3 API (drop-in replacement)
- ✅ CDN integrado de Cloudflare
- ✅ 10GB gratis al mes
- ✅ Menor costo total

**Comparación de costos:**

| Servicio | Storage | Egress    | Total (100GB storage + 1TB egress) |
| -------- | ------- | --------- | ---------------------------------- |
| AWS S3   | ~$2.30  | ~$90      | ~$92.30/mes                        |
| R2       | ~$1.50  | **$0.00** | **~$1.50/mes** 🎉                  |

---

### ¿Por qué Payload CMS en lugar de Strapi/Contentful?

**Decisión:** Payload CMS

**Razones:**

- ✅ **Code-first** (configuración en TypeScript)
- ✅ **Type-safe** completo
- ✅ **Self-hosted** (control total)
- ✅ **Integrado con Next.js** (mismo proyecto)
- ✅ **Lexical editor** moderno
- ✅ **GraphQL + REST** automáticos
- ✅ **Open source** (MIT license)
- ✅ **Hooks potentes** para lógica custom

**vs Strapi:**

- Payload es más type-safe
- Payload se integra mejor con Next.js

**vs Contentful:**

- Payload es self-hosted (sin vendor lock-in)
- Payload es gratuito (Contentful cobra por usuarios)

---

## 🔐 Seguridad

### Autenticación

```typescript
// JWT con Payload Auth
collections: [
  {
    slug: 'users',
    auth: true, // Habilita autenticación
    // Payload maneja:
    // - Hashing de passwords (bcrypt)
    // - Generación de JWT
    // - Refresh tokens
    // - Email verification
  },
];
```

### Control de Acceso

```typescript
// Por colección
access: {
  read: ({ req: { user } }) => !!user,
  create: ({ req: { user } }) => user?.role === 'admin',
  update: ({ req: { user } }) => user?.role === 'admin',
  delete: ({ req: { user } }) => user?.role === 'admin',
}

// Por campo
fields: [
  {
    name: 'sensitiveData',
    access: {
      read: ({ req: { user } }) => user?.role === 'admin',
    }
  }
]
```

### Variables de Entorno

- ✅ Nunca commiteadas (`.gitignore`)
- ✅ Encriptación en tránsito (HTTPS)
- ✅ Secrets en plataforma de deploy (Vercel)

---

## 📊 Escalabilidad

### Capacidades Actuales

| Métrica              | Capacidad Estimada                          |
| -------------------- | ------------------------------------------- |
| **Requests/seg**     | ~1000 (limitado por Next.js/Vercel)         |
| **DB reads/seg**     | ~100,000 (Turso edge replicas)              |
| **DB writes/seg**    | ~500 (Turso primary)                        |
| **Storage**          | Ilimitado (R2)                              |
| **Concurrent users** | ~10,000 (con buen caching)                  |
| **Media bandwidth**  | Ilimitado (R2 zero egress + Cloudflare CDN) |

### Estrategias de Escalado

1. **Vertical (fácil):**
   - Aumentar memoria/CPU en Vercel
   - Upgrade plan de Turso

2. **Horizontal (moderado):**
   - Deploy múltiples instancias en Vercel
   - Turso auto-replica en edge

3. **Caching (esencial):**
   - ISR en Next.js (páginas estáticas)
   - CDN para media (R2 + Cloudflare)
   - Redis para sessions (opcional)

---

## 🔄 Ciclo de Vida de Request

### Request de Página (SSR)

```
1. Usuario → URL
2. Vercel Edge → Next.js
3. Next.js → Server Component
4. Payload.find() → Turso DB
5. Turso → Datos + Media URLs (R2)
6. Next.js → Renderiza HTML
7. HTML → Usuario
8. Hydration en cliente
```

### Request de API

```
1. Cliente → POST /api/posts
2. Next.js Route Handler → Payload
3. Payload → Valida auth (JWT)
4. Payload → Valida access control
5. Payload → Ejecuta hooks
6. Payload → Turso DB (write)
7. Payload → Retorna JSON
8. JSON → Cliente
```

---

## 📁 Convenciones de Código

### Naming Conventions

```typescript
// Colecciones: PascalCase
export const Posts: CollectionConfig;

// Campos: camelCase
name: 'publishedAt';

// Slugs: kebab-case
slug: 'blog-posts';

// Archivos: kebab-case
user - profile.tsx;
```

### Estructura de Colección

```typescript
export const CollectionName: CollectionConfig = {
  slug: 'collection-name',
  admin: {
    /* ... */
  },
  access: {
    /* ... */
  },
  hooks: {
    /* ... */
  },
  fields: [
    /* ... */
  ],
  timestamps: true,
};
```

---

## 🎯 Performance

### Optimizaciones Aplicadas

1. **Next.js:**
   - Server Components (menos JS al cliente)
   - Image optimization con Sharp
   - Route prefetching automático

2. **Database:**
   - Turso edge replicas (latencia <10ms)
   - Indexes en campos frecuentes

3. **Storage:**
   - R2 CDN global
   - Image resizing automático (Sharp)
   - Lazy loading de imágenes

4. **Build:**
   - Tree shaking
   - Code splitting automático
   - Compresión gzip/brotli

---

## 🧪 Testing Strategy

```
┌─────────────────────────────────────┐
│  E2E Tests (Playwright)             │
│  - User flows completos             │
│  - Tests de navegador               │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Integration Tests (Vitest)         │
│  - API endpoints                    │
│  - Payload collections              │
│  - Database operations              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  Unit Tests (Vitest)                │
│  - Utils functions                  │
│  - Validation logic                 │
│  - Hooks isolados                   │
└─────────────────────────────────────┘
```

---

## 🚀 Deploy Pipeline

```
1. Git Push (GitHub)
   ↓
2. Vercel detecta cambio
   ↓
3. Install dependencies (pnpm)
   ↓
4. Run tests (pnpm test)
   ↓
5. Generate types (pnpm generate:types)
   ↓
6. Generate importmap
   ↓
7. Next.js build
   ↓
8. Deploy to Edge
   ↓
9. Update environment vars
   ↓
10. Run migrations (si hay)
   ↓
11. ✅ Live!
```

---

## 📚 Referencias

- [Payload CMS Architecture](https://payloadcms.com/docs/getting-started/what-is-payload)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Turso Architecture](https://docs.turso.tech/introduction)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)

---

**¿Tienes dudas sobre la arquitectura?** Abre un issue o discussion en el repositorio.

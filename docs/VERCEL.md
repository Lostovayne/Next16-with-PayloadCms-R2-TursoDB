# Despliegue en Vercel

Guía completa para desplegar este proyecto de Payload CMS en Vercel.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Configuración Rápida](#configuración-rápida)
- [Variables de Entorno](#variables-de-entorno)
- [Despliegue Paso a Paso](#despliegue-paso-a-paso)
- [Configuración de Build](#configuración-de-build)
- [Troubleshooting](#troubleshooting)
- [Optimizaciones](#optimizaciones)

---

## Requisitos Previos

Antes de desplegar en Vercel, asegúrate de tener:

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Turso](https://turso.tech) (base de datos)
- Cuenta en [Cloudflare](https://cloudflare.com) (R2 storage)
- Repositorio de GitHub/GitLab/Bitbucket
- Variables de entorno preparadas (ver abajo)

---

## Configuración Rápida

### 1. Conectar Repositorio

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click en **"Add New Project"**
3. Selecciona tu repositorio de GitHub/GitLab/Bitbucket
4. Click en **"Import"**

### 2. Configurar Proyecto

En la pantalla de configuración:

```
Framework Preset: Next.js
Root Directory: ./
Build Command: pnpm build (detectado automáticamente)
Output Directory: .next (detectado automáticamente)
Install Command: pnpm install (detectado automáticamente)
```

### 3. Variables de Entorno

** IMPORTANTE:** Antes de hacer click en "Deploy", configura TODAS las variables de entorno.

Click en **"Environment Variables"** y agrega:

| Variable                 | Valor                                           | Entorno                          |
| ------------------------ | ----------------------------------------------- | -------------------------------- |
| `PAYLOAD_SECRET`         | [Generar](#generar-payload_secret)              | Production, Preview, Development |
| `TURSO_DATABASE_URL`     | `libsql://tu-db.turso.io`                       | Production, Preview, Development |
| `TURSO_AUTH_TOKEN`       | Tu token de Turso                               | Production, Preview, Development |
| `R2_BUCKET_NAME`         | Nombre de tu bucket R2                          | Production, Preview, Development |
| `R2_ACCESS_KEY_ID`       | Access Key ID de R2                             | Production, Preview, Development |
| `R2_SECRET_ACCESS_KEY`   | Secret Access Key de R2                         | Production, Preview, Development |
| `R2_ENDPOINT`            | `https://[account-id].r2.cloudflarestorage.com` | Production, Preview, Development |
| `NEXT_PUBLIC_SERVER_URL` | `https://tu-proyecto.vercel.app`                | Production                       |
| `NEXT_PUBLIC_SERVER_URL` | `https://[deployment-url]`                      | Preview                          |
| `LIBSQL_CLIENT`          | `web`                                           | Production, Preview, Development |
| Variable                 | Valor                                           | Entorno                          |
| ------------------------ | ----------------------------------------------- | -------------------------------- |
| `PAYLOAD_SECRET`         | [Generar](#generar-payload_secret)              | Production, Preview, Development |
| `TURSO_DATABASE_URL`     | `libsql://tu-db.turso.io`                       | Production, Preview, Development |
| `TURSO_AUTH_TOKEN`       | Tu token de Turso                               | Production, Preview, Development |
| `R2_BUCKET_NAME`         | Nombre de tu bucket R2                          | Production, Preview, Development |
| `R2_ACCESS_KEY_ID`       | Access Key ID de R2                             | Production, Preview, Development |
| `R2_SECRET_ACCESS_KEY`   | Secret Access Key de R2                         | Production, Preview, Development |
| `R2_ENDPOINT`            | `https://[account-id].r2.cloudflarestorage.com` | Production, Preview, Development |
| `NEXT_PUBLIC_SERVER_URL` | `https://tu-proyecto.vercel.app`                | Production                       |
| `NEXT_PUBLIC_SERVER_URL` | `https://[deployment-url]`                      | Preview                          |
| `LIBSQL_CLIENT`          | `web`                                           | Production, Preview, Development |
| Variable                 | Valor                                           | Entorno                          |
| ------------------------ | ----------------------------------------------- | -------------------------------- |
| `PAYLOAD_SECRET`         | [Generar](#generar-payload_secret)              | Production, Preview, Development |
| `TURSO_DATABASE_URL`     | `libsql://tu-db.turso.io`                       | Production, Preview, Development |
| `TURSO_AUTH_TOKEN`       | Tu token de Turso                               | Production, Preview, Development |
| `R2_BUCKET_NAME`         | Nombre de tu bucket R2                          | Production, Preview, Development |
| `R2_ACCESS_KEY_ID`       | Access Key ID de R2                             | Production, Preview, Development |
| `R2_SECRET_ACCESS_KEY`   | Secret Access Key de R2                         | Production, Preview, Development |
| `R2_ENDPOINT`            | `https://[account-id].r2.cloudflarestorage.com` | Production, Preview, Development |
| `NEXT_PUBLIC_SERVER_URL` | `https://tu-proyecto.vercel.app`                | Production                       |
| `NEXT_PUBLIC_SERVER_URL` | `https://[deployment-url]`                      | Preview                          |
| `LIBSQL_CLIENT`          | `web`                                           | Production, Preview, Development |

### 4. Deploy

Click en **"Deploy"** y espera 2-5 minutos.

---

## Variables de Entorno

### Generar PAYLOAD_SECRET

Opción 1 - En tu terminal local:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Opción 2 - En línea:

```bash
openssl rand -hex 32
```

**Resultado esperado:** Una cadena de 64 caracteres hexadecimales

```
23e1ef930586ddfd3e95aa9a1071d03ad543f2d8c24703d320ee4c5d67dbe60b
```

### Obtener credenciales de Turso

```bash
# Listar bases de datos
turso db list

# Obtener URL de la base de datos
turso db show mi-proyecto-db --url

# Generar token de autenticación
turso db tokens create mi-proyecto-db
```

### Obtener credenciales de Cloudflare R2

1. Ve a [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click en **R2** en el menú lateral
3. Ve a **"Manage R2 API Tokens"**
4. Click en **"Create API Token"**
5. Selecciona permisos: **"Object Read & Write"**
6. Guarda:
   - Access Key ID
   - Secret Access Key
7. Para el endpoint: `https://[tu-account-id].r2.cloudflarestorage.com`

### Variables de Entorno Detalladas

#### `PAYLOAD_SECRET` (OBLIGATORIO)

- **Descripción:** Clave secreta para encriptar datos sensibles
- **Formato:** String hexadecimal de 64 caracteres (32 bytes)
- **Ejemplo:** `23e1ef930586ddfd3e95aa9a1071d03ad543f2d8c24703d320ee4c5d67dbe60b`
- ** NUNCA compartir públicamente**

#### `TURSO_DATABASE_URL` (OBLIGATORIO)

- **Descripción:** URL de conexión a tu base de datos Turso
- **Formato:** `libsql://[database-name]-[org].turso.io`
- **Ejemplo:** `libsql://my-app-db-myorg.turso.io`

#### `TURSO_AUTH_TOKEN` (OBLIGATORIO)

- **Descripción:** Token de autenticación para Turso
- **Formato:** String largo (JWT)
- **Ejemplo:** `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...`
- ** Regenerar si expira**

#### `R2_BUCKET_NAME` (OBLIGATORIO)

- **Descripción:** Nombre de tu bucket en Cloudflare R2
- **Formato:** String (lowercase, sin espacios)
- **Ejemplo:** `my-app-media`

#### `R2_ACCESS_KEY_ID` (OBLIGATORIO)

- **Descripción:** Access Key ID de R2
- **Formato:** String de 32 caracteres
- **Ejemplo:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

#### `R2_SECRET_ACCESS_KEY` (OBLIGATORIO)

- **Descripción:** Secret Access Key de R2
- **Formato:** String de 64 caracteres
- **Ejemplo:** `q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6j7k8l9z0x1c2v3b4n5m6`
- ** NUNCA compartir públicamente**

#### `R2_ENDPOINT` (OBLIGATORIO)

- **Descripción:** Endpoint de tu cuenta de Cloudflare R2
- **Formato:** `https://[account-id].r2.cloudflarestorage.com`
- **Ejemplo:** `https://abc123def456.r2.cloudflarestorage.com`
- ** Encuentra tu account-id en Cloudflare Dashboard → R2**

#### `NEXT_PUBLIC_SERVER_URL` (RECOMENDADO)

- **Descripción:** URL pública de tu aplicación
- **Formato:** `https://tu-dominio.com`
- **Ejemplo (Production):** `https://mi-app.vercel.app`
- **Ejemplo (Preview):** Dejar vacío o usar `https://[deployment-url]`
- **Uso:** Para generar URLs absolutas en emails, webhooks, etc.

#### `LIBSQL_CLIENT` (RECOMENDADO)

- **Descripción:** Tipo de cliente para libSQL
- **Valor:** `web`
- **Uso:** Optimiza la conexión para entornos serverless

---

## Despliegue Paso a Paso

### Opción 1: Desde Vercel Dashboard (Recomendado)

1. **Importar Proyecto**

   ```
   https://vercel.com/new
   → Select repository
   → Click "Import"
   ```

2. **Configurar Framework**
   - Framework Preset: **Next.js** (auto-detectado)
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

3. **Variables de Entorno**
   - Click en **"Environment Variables"**
   - Agrega cada variable (ver tabla arriba)
   - Asegúrate de marcar todos los entornos:
     - Production
     - Preview
     - Development

4. **Deploy**
   - Click **"Deploy"**
   - Espera 2-5 minutos
   - ¡Listo!

### Opción 2: Desde CLI

```bash
# Ejecutar Vercel CLI con pnpm (sin instalación global)
pnpm dlx vercel login

# Deploy (primera vez)
pnpm dlx vercel

# Seguir prompts:
# - Set up and deploy? → Yes
# - Which scope? → Tu usuario/org
# - Link to existing project? → No
# - Project name? → mi-proyecto-2025
# - Directory? → ./
# - Override settings? → No

# Configurar variables de entorno
vercel env add PAYLOAD_SECRET
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add R2_BUCKET_NAME
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_ENDPOINT
vercel env add LIBSQL_CLIENT

# Deploy a producción
vercel --prod
```

### Opción 3: Deploy Button (Para compartir template)

Agrega este botón a tu README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tu-usuario/tu-repo&env=PAYLOAD_SECRET,TURSO_DATABASE_URL,TURSO_AUTH_TOKEN,R2_BUCKET_NAME,R2_ACCESS_KEY_ID,R2_SECRET_ACCESS_KEY,R2_ENDPOINT,LIBSQL_CLIENT&envDescription=Required%20environment%20variables&envLink=https://github.com/tu-usuario/tu-repo/blob/main/docs/VERCEL.md)
```

---

## ⚙ Configuración de Build

Vercel ya detecta automáticamente Next.js, pero puedes personalizar en `vercel.json`:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "LIBSQL_CLIENT": "web"
  }
}
```

### Configuración de Node.js

Vercel usa Node.js 20 por defecto. Esto ya está configurado en `package.json`:

```json
{
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }
}
```

# ⚡ Guía Rápida de Inicio - 5 Minutos

Esta guía te permitirá tener el proyecto funcionando en menos de 5 minutos.

## 📋 Checklist Rápido

- [ ] Node.js >= 20.9.0 instalado
- [ ] pnpm instalado
- [ ] Cuenta en Turso creada
- [ ] Cuenta en Cloudflare creada

## 🚀 Inicio Rápido

### 1️⃣ Instalar dependencias (30 segundos)

```bash
pnpm install
```

### 2️⃣ Configurar Turso Database (2 minutos)

```bash
# Instalar Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash  # macOS/Linux
# O para Windows PowerShell:
# irm get.tur.so/install.ps1 | iex

# Autenticarse
turso auth login

# Crear base de datos
turso db create mi-proyecto-db

# Obtener URL
turso db show mi-proyecto-db --url
# Copiar output → TURSO_DATABASE_URL

# Crear token
turso db tokens create mi-proyecto-db
# Copiar output → TURSO_AUTH_TOKEN
```

### 3️⃣ Configurar Cloudflare R2 (2 minutos)

1. Ve a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click en **R2** → **Create bucket**
3. Nombre: `mi-proyecto-media` → **Create**
4. Copia el nombre → `R2_BUCKET_NAME`
5. En Settings, copia el Endpoint → `R2_ENDPOINT`
6. Click en **Manage R2 API Tokens** → **Create API token**
7. Nombre: `mi-proyecto` → Permisos: **Object Read & Write**
8. Copia Access Key ID → `R2_ACCESS_KEY_ID`
9. Copia Secret Access Key → `R2_SECRET_ACCESS_KEY`

### 4️⃣ Crear archivo .env (30 segundos)

```bash
cp .env.example .env
```

Edita `.env` y pega tus credenciales:

```env
# Genera un secreto:
PAYLOAD_SECRET=<ejecuta: openssl rand -base64 32>

# Pega tus credenciales de Turso:
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=eyJ...
TURSO_PUSH=false

# Pega tus credenciales de R2:
R2_BUCKET_NAME=mi-proyecto-media
R2_ACCESS_KEY_ID=abc...
R2_SECRET_ACCESS_KEY=xyz...
R2_ENDPOINT=https://...r2.cloudflarestorage.com

NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

### 5️⃣ Iniciar el proyecto (30 segundos)

```bash
# Desarrollo
pnpm dev
```

¡Listo! Abre: `http://localhost:3000/admin`

## 🎯 Primeros Pasos Después de Iniciar

1. **Crear primer usuario administrador:**
   - Ve a `http://localhost:3000/admin`
   - Completa el formulario de registro
   - ¡Ya tienes acceso al panel!

2. **Subir archivos:**
   - En el panel admin, ve a **Media**
   - Click en **Create New**
   - Sube una imagen o archivo
   - Se guardará automáticamente en Cloudflare R2

3. **Explorar las colecciones:**
   - **Users**: Gestión de usuarios
   - **Media**: Archivos y medios

## 📦 Comandos Más Usados

```bash
# Desarrollo
pnpm dev              # Iniciar servidor de desarrollo
pnpm devsafe          # Desarrollo (limpia caché)

# Build
pnpm build            # Construir para producción
pnpm start            # Iniciar producción

# Payload
pnpm generate:types   # Generar tipos TypeScript
pnpm payload migrate  # Ejecutar migraciones
```

## 🔧 Problemas Comunes

### ❌ Error: "PAYLOAD_SECRET is required"

```bash
# Generar un nuevo secreto
openssl rand -base64 32
# Pégalo en .env como PAYLOAD_SECRET=...
```

### ❌ Error: "Cannot connect to Turso"

```bash
# Verificar credenciales
turso db show mi-proyecto-db --url
turso db tokens create mi-proyecto-db
# Actualiza .env con los nuevos valores
```

### ❌ Error: "R2 bucket not found"

- Verifica que `R2_BUCKET_NAME` sea exacto (sin espacios)
- Verifica que las credenciales tengan permisos

### ❌ Error de build o caché

```bash
# Limpiar todo y reiniciar
rm -rf .next node_modules
pnpm install
pnpm dev
```

## 🌐 Desplegar en Vercel (Bonus - 2 minutos)

1. Sube tu código a GitHub
2. Ve a [vercel.com](https://vercel.com) → **Import Project**
3. Conecta tu repositorio
4. En **Environment Variables**, agrega TODAS las variables de `.env` MÁS:
   ```
   LIBSQL_CLIENT=web
   TURSO_PUSH=true
   NEXT_PUBLIC_SERVER_URL=https://tu-proyecto.vercel.app
   ```
5. Click **Deploy**
6. ¡Listo! 🎉

## 📚 Siguiente: Leer el README Completo

Para información detallada, personalización y troubleshooting avanzado, lee [README.md](./README.md)

---

**¿Funcionó todo?** ⭐ Dale una estrella al repo

**¿Tienes problemas?** 🐛 Abre un issue con los detalles

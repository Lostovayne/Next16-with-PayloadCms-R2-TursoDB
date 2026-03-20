# Guía Completa de Docker

Documentación completa para construir, ejecutar y desplegar el proyecto usando Docker.

## Tabla de Contenidos

- [Introducción](#introducción)
- [Prerequisitos](#prerequisitos)
- [Construcción Local](#construcción-local)
- [Usar Imagen de GitHub](#usar-imagen-de-github)
- [Variables de Entorno](#variables-de-entorno)
- [Docker Compose](#docker-compose)
- [Despliegue en Producción](#despliegue-en-producción)
- [Optimizaciones](#optimizaciones)
- [Troubleshooting](#troubleshooting)

---

## Introducción

Este proyecto incluye:

- **Dockerfile multi-stage** optimizado con cache layers
- **GitHub Actions** para build y publicación automática
- **GitHub Container Registry (GHCR)** para almacenar imágenes
- **docker-compose.yml** para desarrollo y producción
- **Health checks** integrados
- **Optimización de tamaño** (imagen final ~200-300MB)

### Arquitectura Multi-Stage

```
Stage 1: base       → Node.js 20 + pnpm 10
   ↓
Stage 2: deps       → Instalar dependencias (con cache)
   ↓
Stage 3: builder    → Build de Next.js + Payload
   ↓
Stage 4: runner     → Imagen final optimizada (solo runtime)
```

---

## Prerequisitos

### Software Necesario

```bash
# Docker
docker --version  # >= 24.0.0

# Docker Compose
docker-compose --version  # >= 2.20.0
```

### Variables de Entorno

Crea un archivo `.env` con:

```env
# Payload CMS
PAYLOAD_SECRET=tu_secreto_seguro_minimo_32_caracteres

# Turso Database
TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
TURSO_AUTH_TOKEN=tu_token_de_autenticacion

# Cloudflare R2
R2_BUCKET_NAME=tu-bucket
R2_ACCESS_KEY_ID=tu_access_key
R2_SECRET_ACCESS_KEY=tu_secret_key
R2_ENDPOINT=https://account_id.r2.cloudflarestorage.com

# Opcional
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

---

## Construcción Local

### Build de Imagen

```bash
# Build básico
docker build -t payload-cms:latest .

# Build con nombre específico
docker build -t mi-proyecto:v1.0.0 .

# Build sin cache (forzar rebuild completo)
docker build --no-cache -t payload-cms:latest .

# Ver progreso detallado
docker build --progress=plain -t payload-cms:latest .
```

### Ejecutar Contenedor

```bash
# Ejecutar con variables de entorno inline
docker run -d \
  --name payload-app \
  -p 3000:3000 \
  -e PAYLOAD_SECRET=tu_secreto \
  -e TURSO_DATABASE_URL=tu_url \
  -e TURSO_AUTH_TOKEN=tu_token \
  -e R2_BUCKET_NAME=tu_bucket \
  -e R2_ACCESS_KEY_ID=tu_key \
  -e R2_SECRET_ACCESS_KEY=tu_secret \
  -e R2_ENDPOINT=tu_endpoint \
  payload-cms:latest

# Ejecutar con archivo .env
docker run -d \
  --name payload-app \
  -p 3000:3000 \
  --env-file .env \
  payload-cms:latest

# Ejecutar en modo interactivo (ver logs)
docker run -it \
  --name payload-app \
  -p 3000:3000 \
  --env-file .env \
  payload-cms:latest
```

### Comandos Útiles

```bash
# Ver logs
docker logs -f payload-app

# Acceder al contenedor
docker exec -it payload-app sh

# Detener contenedor
docker stop payload-app

# Eliminar contenedor
docker rm payload-app

# Ver contenedores corriendo
docker ps

# Ver todas las imágenes
docker images

# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes sin usar
docker image prune -a
```

---

## Usar Imagen de GitHub

### Pull de GHCR

**Política de Publicación:**

- **main**: Construye y publica a GHCR (producción)
- **PRs**: Solo construye para validar (NO publica)
- **develop**: NO ejecuta el workflow de Docker

** Nota importante:** Los nombres de imágenes en Docker/GHCR deben estar en **minúsculas**. El workflow convierte automáticamente `github.repository` a minúsculas.

Cuando haces push a `main`, GitHub Actions automáticamente:

1. Construye la imagen Docker
2. La publica en GitHub Container Registry (GHCR)
3. Ejecuta escaneo de seguridad con Trivy

```bash
# Pull de la imagen publicada (el nombre debe estar en minúsculas)
docker pull ghcr.io/tu-usuario/tu-repo:latest

# Pull de una versión específica
docker pull ghcr.io/tu-usuario/tu-repo:v1.0.0

# Ejecutar imagen de GHCR
docker run -d \
  --name payload-app \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/tu-usuario/tu-repo:latest
```

### Autenticación en GHCR

Si la imagen es privada:

```bash
# Login con Personal Access Token
echo $GITHUB_TOKEN | docker login ghcr.io -u tu-usuario --password-stdin

# O con password manual
docker login ghcr.io -u tu-usuario
```

### Tags Disponibles

GitHub Actions genera automáticamente estos tags (en minúsculas):

| Tag           | Descripción              | Ejemplo                         | Branch   |
| ------------- | ------------------------ | ------------------------------- | -------- |
| `latest`      | Última versión de `main` | `ghcr.io/user/repo:latest`      | **main** |
| `main`        | Branch main              | `ghcr.io/user/repo:main`        | **main** |
| `v1.2.3`      | Version tag              | `ghcr.io/user/repo:v1.2.3`      | **main** |
| `v1.2`        | Major.minor              | `ghcr.io/user/repo:v1.2`        | **main** |
| `main-abc123` | SHA commit               | `ghcr.io/user/repo:main-abc123` | **main** |

**Notas importantes:**

- Solo las imágenes de `main` (producción) se publican a GHCR
- Otras ramas solo construyen la imagen para validación
- Los nombres de imagen se convierten automáticamente a minúsculas (requisito de Docker)

---

## Variables de Entorno

### Variables Requeridas

```bash
# OBLIGATORIAS - El contenedor no iniciará sin estas
PAYLOAD_SECRET=          # Min 32 caracteres
TURSO_DATABASE_URL=      # URL de Turso
TURSO_AUTH_TOKEN=        # Token de Turso
R2_BUCKET_NAME=          # Nombre del bucket
R2_ACCESS_KEY_ID=        # Access key de R2
R2_SECRET_ACCESS_KEY=    # Secret key de R2
R2_ENDPOINT=             # Endpoint de R2
```

### Variables Opcionales

```bash
# Configuración
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# URLs públicas
NEXT_PUBLIC_SERVER_URL=https://tu-dominio.com

# Turso
TURSO_PUSH=false

# Logging
LOG_LEVEL=info
```

### Archivo .env de Ejemplo

```env
# Copiar este archivo como .env y completar valores

# Payload CMS
PAYLOAD_SECRET=change-this-to-a-secure-random-string-min-32-chars

# Turso Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-turso-token
TURSO_PUSH=false

# Cloudflare R2
R2_BUCKET_NAME=your-bucket-name
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_ENDPOINT=https://account-id.r2.cloudflarestorage.com

# Application
NODE_ENV=production
NEXT_PUBLIC_SERVER_URL=https://your-domain.com
```

---

## Docker Compose

### Desarrollo

```bash
# Iniciar con build
docker-compose up --build

# Iniciar en background
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Detener
docker-compose down

# Detener y eliminar volúmenes
docker-compose down -v
```

### Producción (con imagen de GHCR)

Edita `docker-compose.yml`:

```yaml
services:
  app:
    # Comenta esto:
    # build:
    #   context: .
    #   dockerfile: Dockerfile

    # Descomenta esto:
    image: ghcr.io/tu-usuario/tu-repo:latest
```

Luego:

```bash
# Pull y start
docker-compose pull
docker-compose up -d

# Verificar estado
docker-compose ps

# Ver health check
docker-compose exec app curl http://localhost:3000/api/health
```

### Comandos Útiles de Compose

```bash
# Rebuild forzado
docker-compose up --build --force-recreate

# Escalar (múltiples instancias)
docker-compose up -d --scale app=3

# Ver uso de recursos
docker-compose stats

# Ejecutar comando en contenedor
docker-compose exec app sh

# Ver configuración final
docker-compose config
```

---

## Despliegue en Producción

### Railway

```bash
# 1. Login con Railway CLI (pnpm)
pnpm dlx @railway/cli login

# 2. Crear nuevo proyecto
pnpm dlx @railway/cli init

# 4. Configurar variables de entorno
railway variables set PAYLOAD_SECRET=tu_secreto
railway variables set TURSO_DATABASE_URL=tu_url
# ... más variables

# 5. Deploy desde imagen de GitHub
railway up --service payload-app
```

O usando `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Render

1. Conecta tu repositorio GitHub
2. Selecciona "Docker"
3. Configura variables de entorno
4. Deploy automático en cada push

### DigitalOcean App Platform

```yaml
# app.yaml
name: payload-cms
services:
  - name: web
    dockerfile_path: Dockerfile
    github:
      repo: tu-usuario/tu-repo
      branch: main
    envs:
      - key: PAYLOAD_SECRET
        value: ${PAYLOAD_SECRET}
      - key: TURSO_DATABASE_URL
        value: ${TURSO_DATABASE_URL}
      # ... más variables
    health_check:
      http_path: /api/health
    instance_count: 1
    instance_size_slug: basic-xs
```

### Fly.io

```bash
# Instalar flyctl
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Lanzar app
flyctl launch

# Configurar secrets
flyctl secrets set PAYLOAD_SECRET=tu_secreto
flyctl secrets set TURSO_DATABASE_URL=tu_url
# ... más secrets

# Deploy
flyctl deploy
```

`fly.toml`:

```toml
app = "payload-cms"

[build]
  dockerfile = "Dockerfile"

[env]
  PORT = "3000"
  NODE_ENV = "production"

[[services]]
  internal_port = 3000
  protocol = "tcp"

  [[services.ports]]
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20

  [[services.tcp_checks]]
    interval = "15s"
    timeout = "2s"
```

### VPS Tradicional

```bash
# 1. SSH al servidor
ssh user@your-server.com

# 2. Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Pull imagen
docker pull ghcr.io/tu-usuario/tu-repo:latest

# 4. Crear archivo .env
nano .env
# Pega tus variables aquí

# 5. Ejecutar contenedor
docker run -d \
  --name payload-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/tu-usuario/tu-repo:latest

# 6. Verificar
docker logs -f payload-app
curl http://localhost:3000/api/health
```

### Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/payload-cms
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Habilitar sitio
sudo ln -s /etc/nginx/sites-available/payload-cms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL con Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## Optimizaciones

### Tamaño de Imagen

```bash
# Ver tamaño de imagen
docker images payload-cms

# Analizar layers
docker history payload-cms:latest

# Usar herramienta dive para análisis detallado
docker run --rm -it \
  -v /var/run/docker.sock:/var/run/docker.sock \
  wagoodman/dive:latest payload-cms:latest
```

### Cache de Build

GitHub Actions usa cache automático:

```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

Localmente con BuildKit:

```bash
# Habilitar BuildKit
export DOCKER_BUILDKIT=1

# Build con cache
docker build \
  --cache-from payload-cms:latest \
  -t payload-cms:latest .
```

### Multi-Platform (ARM64 + AMD64)

```bash
# Crear builder
docker buildx create --use

# Build para múltiples plataformas
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t payload-cms:latest \
  --push \
  .
```

### Reducir Tiempo de Build

1. **Ordenar COPY por frecuencia de cambio:**
   - Primero: `package.json`, `pnpm-lock.yaml`
   - Después: código fuente

2. **Usar .dockerignore agresivo**

3. **Cache de pnpm store:**
   ```dockerfile
   RUN pnpm config set store-dir /root/.pnpm-store
   RUN --mount=type=cache,id=pnpm,target=/root/.pnpm-store \
       pnpm install --frozen-lockfile
   ```

---

## Troubleshooting

### Contenedor no inicia

```bash
# Ver logs detallados
docker logs payload-app

# Verificar variables de entorno
docker exec payload-app env

# Verificar que el puerto no esté en uso
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows
```

### Error: "PAYLOAD_SECRET is required"

```bash
# Verificar que la variable esté configurada
docker inspect payload-app | grep PAYLOAD_SECRET

# Reiniciar con variable correcta
docker stop payload-app
docker rm payload-app
docker run -d --name payload-app -p 3000:3000 \
  -e PAYLOAD_SECRET=tu_secreto_correcto \
  --env-file .env \
  payload-cms:latest
```

### Build falla con "out of memory"

```bash
# Aumentar memoria de Docker Desktop
# Settings → Resources → Memory → 8GB

# O build con menos concurrencia
docker build --build-arg NODE_OPTIONS="--max-old-space-size=8000" .
```

### Imagen muy grande

```bash
# Verificar tamaño
docker images payload-cms

# Si es >500MB, verificar:
# 1. .dockerignore está configurado
# 2. Multi-stage está funcionando
# 3. No estás copiando node_modules en COPY .

# Limpiar build cache
docker builder prune -a
```

### Health check falla

```bash
# Verificar endpoint manualmente
docker exec payload-app curl http://localhost:3000/api/health

# Si falla, verificar logs
docker logs payload-app

# Deshabilitar health check temporalmente
docker run -d --name payload-app \
  --no-healthcheck \
  -p 3000:3000 \
  --env-file .env \
  payload-cms:latest
```

### No puede conectar a Turso

```bash
# Verificar variables
docker exec payload-app sh -c 'echo $TURSO_DATABASE_URL'

# Verificar conectividad desde contenedor
docker exec payload-app sh -c 'curl -I $TURSO_DATABASE_URL'

# Verificar que no haya firewall bloqueando
```

### Push a GHCR falla

```bash
# Re-login
echo $GITHUB_TOKEN | docker login ghcr.io -u tu-usuario --password-stdin

# Verificar permisos del token
# Debe tener: write:packages, read:packages

# Tag correcto
docker tag payload-cms:latest ghcr.io/tu-usuario/tu-repo:latest
docker push ghcr.io/tu-usuario/tu-repo:latest
```

---

## Monitoreo

### Health Check Manual

```bash
# Desde fuera del contenedor
curl http://localhost:3000/api/health

# Desde dentro del contenedor
docker exec payload-app curl http://localhost:3000/api/health

# Respuesta esperada
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "uptime": 3600.5,
  "environment": "production",
  "version": "1.0.0"
}
```

### Logs

```bash
# Ver últimas líneas
docker logs --tail 100 payload-app

# Seguir logs en tiempo real
docker logs -f payload-app

# Logs con timestamps
docker logs -t payload-app

# Filtrar por tiempo
docker logs --since 1h payload-app
```

### Métricas

```bash
# Uso de recursos
docker stats payload-app

# Inspección completa
docker inspect payload-app

# Procesos corriendo
docker top payload-app
```

---

## Actualización

### Actualizar a Nueva Versión

```bash
# 1. Pull nueva imagen
docker pull ghcr.io/tu-usuario/tu-repo:latest

# 2. Detener contenedor actual
docker stop payload-app

# 3. Backup (opcional)
docker commit payload-app payload-app-backup

# 4. Eliminar contenedor viejo
docker rm payload-app

# 5. Iniciar con nueva imagen
docker run -d \
  --name payload-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/tu-usuario/tu-repo:latest

# 6. Verificar
docker logs -f payload-app
```

### Rollback

```bash
# Volver a versión anterior
docker stop payload-app
docker rm payload-app

docker run -d \
  --name payload-app \
  -p 3000:3000 \
  --env-file .env \
  ghcr.io/tu-usuario/tu-repo:v1.0.0  # versión anterior
```

---

## Recursos

- [Dockerfile Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)

---

## Checklist de Producción

Antes de desplegar en producción:

- [ ] Variables de entorno configuradas correctamente
- [ ] `PAYLOAD_SECRET` es seguro y único
- [ ] Credenciales de Turso son de producción
- [ ] Credenciales de R2 son de producción
- [ ] Health check funciona correctamente
- [ ] Imagen está publicada en GHCR
- [ ] Logs se están guardando
- [ ] Backups configurados
- [ ] Monitoreo configurado
- [ ] Dominio y SSL configurados
- [ ] Rate limiting configurado (si aplica)

---

**¿Problemas?** Revisa la sección de [Troubleshooting](#-troubleshooting) o abre un issue.

**¡Listo para deploy! **

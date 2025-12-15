# ===================================
# Multi-Stage Dockerfile Optimizado
# Payload CMS 3.0 + Next.js 15 + pnpm 10
# ===================================

# ===================================
# Stage 1: Base con pnpm
# ===================================
FROM node:20-alpine AS base

# Habilitar corepack para pnpm
RUN corepack enable && corepack prepare pnpm@10.22.0 --activate

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Configurar directorio de trabajo
WORKDIR /app

# ===================================
# Stage 2: Dependencias
# ===================================
FROM base AS deps

# Copiar archivos de configuración de pnpm
COPY .npmrc* pnpm-lock.yaml package.json ./

# Instalar dependencias de producción
# --frozen-lockfile: no modifica pnpm-lock.yaml
# --prod: solo dependencias de producción
RUN pnpm install --frozen-lockfile --prod

# Guardar node_modules de producción
RUN cp -R node_modules /prod_node_modules

# Instalar TODAS las dependencias (dev + prod) para el build
RUN pnpm install --frozen-lockfile

# ===================================
# Stage 3: Builder
# ===================================
FROM base AS builder

WORKDIR /app

# Copiar node_modules desde deps
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente
COPY . .

# Variables de entorno para build
# IMPORTANTE: Estas son solo para build time
# Las variables de runtime se pasan al contenedor
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Variables de build requeridas (con valores dummy)
# Las reales se pasan en runtime
ENV PAYLOAD_SECRET=build-time-secret-must-be-replaced-at-runtime-with-real-secret
ENV TURSO_DATABASE_URL=file:./build.db
ENV TURSO_AUTH_TOKEN=build-token
ENV R2_BUCKET_NAME=build-bucket
ENV R2_ACCESS_KEY_ID=build-key
ENV R2_SECRET_ACCESS_KEY=build-secret
ENV R2_ENDPOINT=https://build.r2.cloudflarestorage.com

# Generar import map de Payload
RUN pnpm generate:importmap

# Build de Next.js
# Next.js genera automáticamente el output standalone
RUN pnpm build

# Limpiar cache de pnpm para reducir tamaño
RUN pnpm store prune

# ===================================
# Stage 4: Runner (Imagen Final)
# ===================================
FROM node:20-alpine AS runner

# Instalar solo las dependencias del sistema necesarias
RUN apk add --no-cache \
    libc6-compat \
    curl \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Configurar usuario no-root por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Variables de entorno de producción
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copiar archivos públicos
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Crear directorio para archivos subidos (si usas local storage como fallback)
RUN mkdir -p ./media && chown nextjs:nodejs ./media

# Copiar el output standalone de Next.js
# Next.js genera esto automáticamente con output: 'standalone'
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar node_modules de producción (más pequeños)
COPY --from=deps --chown=nextjs:nodejs /prod_node_modules ./node_modules

# Copiar package.json para referencia
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Healthcheck para verificar que el servidor esté corriendo
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Comando para iniciar la aplicación
CMD ["node", "server.js"]

# Documentación del Proyecto

Bienvenido a la documentación completa de **Payload CMS 3.0 + Next.js 16 + Turso + Cloudflare R2**.

Gestor de paquetes por defecto: **pnpm**.

## Índice de Documentación

### Para Usuarios

| Documento                                 | Descripción                                                | Tiempo de lectura |
| ----------------------------------------- | ---------------------------------------------------------- | ----------------- |
| **[ QUICKSTART.md](./QUICKSTART.md)**     | Guía rápida de inicio - Configura el proyecto en 5 minutos | 5 min             |
| **[ DEVELOPMENT.md](./DEVELOPMENT.md)**   | Guía completa de desarrollo y extensión del proyecto       | 20 min            |
| **[ COMMANDS.md](./COMMANDS.md)**         | Referencia completa de todos los comandos disponibles      | 15 min            |
| **[ ARCHITECTURE.md](./ARCHITECTURE.md)** | Arquitectura técnica del proyecto con diagramas            | 15 min            |
| **[ CI_CD.md](./CI_CD.md)**               | GitHub Actions, Dependabot y automatizaciones              | 10 min            |

### Para Contribuidores

| Documento                                 | Descripción                      | Tiempo de lectura |
| ----------------------------------------- | -------------------------------- | ----------------- |
| **[ CONTRIBUTING.md](./CONTRIBUTING.md)** | Guía para contribuir al proyecto | 10 min            |

---

## ¿Por Dónde Empezar?

### Si es tu primera vez:

1. **[Lee el README principal](../README.md)** para entender qué es el proyecto
2. **[Sigue QUICKSTART.md](./QUICKSTART.md)** para configurar todo en 5 minutos
3. **[Explora DEVELOPMENT.md](./DEVELOPMENT.md)** para aprender a crear tus primeras colecciones
4. **[Revisa ARCHITECTURE.md](./ARCHITECTURE.md)** para entender cómo funciona todo internamente
5. **[Configura CI/CD.md](./CI_CD.md)** para habilitar GitHub Actions y automatizaciones

### ‍ Si ya tienes el proyecto corriendo:

1. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Aprende a crear colecciones, campos y personalizar
2. **[COMMANDS.md](./COMMANDS.md)** - Consulta todos los comandos disponibles
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Entiende el flujo de datos y componentes
4. **[CI_CD.md](./CI_CD.md)** - Configura automatizaciones con GitHub Actions
5. **[README principal](../README.md)** - Referencia para despliegue y troubleshooting

### Si quieres contribuir:

1. **[CONTRIBUTING.md](./CONTRIBUTING.md)** - Lee las guías de contribución
2. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Entiende la arquitectura del proyecto
3. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Aprende el código y las convenciones
4. Abre un Issue o Pull Request siguiendo las plantillas

---

## Resumen de Cada Documento

### QUICKSTART.md

**Objetivo:** Tener el proyecto corriendo en 5 minutos.

**Contenido:**

- Instalación rápida
- Configuración de Turso Database (paso a paso)
- Configuración de Cloudflare R2 (paso a paso)
- Variables de entorno explicadas
- Primeros pasos después de iniciar
- Solución rápida de problemas comunes

**¿Cuándo leerlo?**

- Primera vez que usas la plantilla
- Necesitas configurar el proyecto rápidamente
- Quieres recordar cómo obtener las credenciales

---

### DEVELOPMENT.md

**Objetivo:** Aprender a desarrollar y extender el proyecto.

**Contenido:**

- Arquitectura del proyecto
- Crear nuevas colecciones
- Configuración de campos (todos los tipos)
- Hooks y validación personalizada
- Relaciones entre colecciones
- Control de acceso y permisos
- Personalizar el Admin Panel
- API y endpoints personalizados
- Migraciones de base de datos
- Testing

**¿Cuándo leerlo?**

- Quieres crear nuevas colecciones
- Necesitas personalizar el CMS
- Vas a agregar funcionalidades
- Quieres entender cómo funciona todo

---

### COMMANDS.md

**Objetivo:** Referencia completa de todos los comandos.

**Contenido:**

- Comandos de desarrollo (`pnpm dev`, `pnpm devsafe`)
- Comandos de build y producción
- Comandos de Payload CMS (migrate, generate, etc.)
- Comandos de testing (Vitest, Playwright)
- Comandos de base de datos (Drizzle, Turso)
- Comandos de linting y formato
- Comandos de Docker
- Comandos de diagnóstico
- Flujos de trabajo típicos

**¿Cuándo leerlo?**

- Necesitas ejecutar un comando específico
- Quieres entender qué hace cada script
- Olvidaste cómo hacer algo
- Referencia rápida día a día

---

### ARCHITECTURE.md

**Objetivo:** Entender la arquitectura técnica del proyecto.

**Contenido:**

- Diagramas de arquitectura
- Flujos de datos (creación, consumo, uploads)
- Componentes principales
- Stack tecnológico detallado
- Decisiones de arquitectura (por qué cada tecnología)
- Seguridad y autenticación
- Escalabilidad y performance
- Estrategia de testing
- Pipeline de deploy

**¿Cuándo leerlo?**

- Quieres entender cómo funciona todo internamente
- Necesitas justificar decisiones técnicas
- Vas a escalar el proyecto
- Contribuirás con features complejas
- Estás evaluando el stack para tu proyecto

---

### CONTRIBUTING.md

**Objetivo:** Guiar a los contribuidores del proyecto.

**Contenido:**

- Código de conducta
- Proceso de contribución paso a paso
- Flujo de desarrollo
- Estándares de código (TypeScript, ESLint, Prettier)
- Formato de commits (Conventional Commits)
- Cómo reportar bugs
- Cómo sugerir mejoras
- Cómo agregar tests
- Checklist antes de hacer PR

**¿Cuándo leerlo?**

- Quieres contribuir al proyecto
- Vas a hacer un Pull Request
- Necesitas reportar un bug
- Tienes una idea para mejorar el proyecto

---

### CI_CD.md

**Objetivo:** Configurar GitHub Actions y automatizaciones.

**Contenido:**

- Configuración de Dependabot
- CI/CD Pipeline (linting, build, tests)
- Auto-format con Prettier
- Auto-merge de actualizaciones menores
- ⚙ Personalización de workflows
- Troubleshooting de Actions

**¿Cuándo leerlo?**

- Acabas de crear el repositorio en GitHub
- Quieres automatizar actualizaciones de dependencias
- Necesitas CI/CD para tu proyecto
- Quieres formateo automático de código
- Tienes problemas con GitHub Actions

---

## Buscar Información Rápida

### Configuración Inicial

- **Instalar el proyecto:** [QUICKSTART.md](./QUICKSTART.md)
- **Variables de entorno:** [QUICKSTART.md - Paso 4](./QUICKSTART.md#4%EF%B8%8F⃣-crear-archivo-env-30-segundos)
- **Obtener credenciales de Turso:** [QUICKSTART.md - Turso](./QUICKSTART.md#2%EF%B8%8F⃣-configurar-turso-database-2-minutos)
- **Obtener credenciales de R2:** [QUICKSTART.md - R2](./QUICKSTART.md#3%EF%B8%8F⃣-configurar-cloudflare-r2-2-minutos)

### Desarrollo

- **Crear colecciones:** [DEVELOPMENT.md - Crear Colecciones](./DEVELOPMENT.md#-crear-nuevas-colecciones)
- **Tipos de campos:** [DEVELOPMENT.md - Campos](./DEVELOPMENT.md#-configuración-de-campos)
- **Hooks:** [DEVELOPMENT.md - Hooks](./DEVELOPMENT.md#-hooks-y-validación)
- **Permisos:** [DEVELOPMENT.md - Control de Acceso](./DEVELOPMENT.md#-control-de-acceso)
- **Migraciones:** [DEVELOPMENT.md - Migraciones](./DEVELOPMENT.md#%EF%B8%8F-migraciones-de-base-de-datos)

### CI/CD

- **Configurar Actions:** [CI_CD.md - Configuración Inicial](./CI_CD.md#-configuración-inicial)
- **Dependabot:** [CI_CD.md - Dependabot](./CI_CD.md#-dependabot)
- **Auto-format:** [CI_CD.md - Auto-Format](./CI_CD.md#-auto-format)
- **Auto-merge:** [CI_CD.md - Auto-Merge](./CI_CD.md#-auto-merge-de-dependabot)

### Arquitectura

- **Flujo de datos:** [ARCHITECTURE.md - Flujo de Datos](./ARCHITECTURE.md#-flujo-de-datos)
- **Componentes:** [ARCHITECTURE.md - Componentes](./ARCHITECTURE.md#-componentes-principales)
- **Decisiones:** [ARCHITECTURE.md - Decisiones](./ARCHITECTURE.md#-decisiones-de-arquitectura)
- **Seguridad:** [ARCHITECTURE.md - Seguridad](./ARCHITECTURE.md#-seguridad)

### Comandos

- **Iniciar desarrollo:** [COMMANDS.md - pnpm dev](./COMMANDS.md#pnpm-dev)
- **Build producción:** [COMMANDS.md - pnpm build](./COMMANDS.md#pnpm-build)
- **Generar tipos:** [COMMANDS.md - generate:types](./COMMANDS.md#pnpm-generatetypes)
- **Migraciones:** [COMMANDS.md - Payload CLI](./COMMANDS.md#pnpm-payload)
- **Testing:** [COMMANDS.md - Testing](./COMMANDS.md#-comandos-de-testing)

### Troubleshooting

- **Problemas comunes:** [QUICKSTART.md - Problemas](./QUICKSTART.md#-problemas-comunes)
- **Solución de problemas:** [README principal - Troubleshooting](../README.md#-solución-de-problemas)
- **Comandos de diagnóstico:** [COMMANDS.md - Diagnóstico](./COMMANDS.md#-comandos-de-diagnóstico)

---

## Rutas de Aprendizaje

### Principiante

```
1. README.md (entender el proyecto)
   ↓
2. QUICKSTART.md (configurar)
   ↓
3. Usar el Admin Panel (crear contenido)
   ↓
4. DEVELOPMENT.md - Sección de Campos (entender opciones)
```

### Intermedio

```
1. DEVELOPMENT.md - Crear Colecciones
   ↓
2. DEVELOPMENT.md - Hooks y Validación
   ↓
3. DEVELOPMENT.md - Relaciones
   ↓
4. ARCHITECTURE.md - Flujo de Datos
   ↓
5. CI_CD.md - Configurar GitHub Actions
   ↓
6. COMMANDS.md - Migraciones
```

### Avanzado

```
1. ARCHITECTURE.md - Vista completa del sistema
   ↓
2. DEVELOPMENT.md - Control de Acceso
   ↓
3. DEVELOPMENT.md - API Personalizada
   ↓
4. CI_CD.md - Automatizaciones avanzadas
   ↓
5. DEVELOPMENT.md - Testing
   ↓
6. CONTRIBUTING.md (contribuir mejoras)
```

---

## Acceso Rápido

### Enlaces Importantes

- **[ README Principal](../README.md)** - Volver al inicio
- **[ package.json](../package.json)** - Ver dependencias y scripts
- **[⚙ payload.config.ts](../src/payload.config.ts)** - Configuración principal
- **[ .env.example](../.env.example)** - Plantilla de variables de entorno
- **[ .github/workflows/](../.github/workflows/)** - GitHub Actions workflows

### Recursos Externos

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Turso Docs](https://docs.turso.tech)
- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)

---

## Consejos

> **Tip:** Usa `Ctrl/Cmd + F` para buscar palabras clave en cada documento.

> **Tip:** Todos los documentos tienen tabla de contenidos con enlaces directos.

> **Tip:** Los ejemplos de código incluyen comentarios explicativos.

> **Tip:** Si algo no está claro, abre un Issue para mejorar la documentación.

---

## ¿Aún Tienes Dudas?

1. **Busca en la documentación:** Usa `Ctrl/Cmd + F` en cada archivo
2. **Revisa los ejemplos:** Todos los documentos incluyen código de ejemplo
3. **Consulta issues:** Puede que alguien ya preguntó lo mismo
4. **Abre una Discussion:** Para preguntas generales
5. **Reporta un bug:** Si encontraste un problema
6. **Lee la documentación oficial:** Enlaces arriba

---

**¡Feliz desarrollo! **

¿Encontraste útil esta documentación? ⭐ Dale una estrella al proyecto.

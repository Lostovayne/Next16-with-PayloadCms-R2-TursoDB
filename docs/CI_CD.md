# 🚀 CI/CD y Automatizaciones con GitHub Actions

Documentación completa de las automatizaciones configuradas en el proyecto.

## 📋 Tabla de Contenidos

- [Resumen de Workflows](#resumen-de-workflows)
- [Configuración Inicial](#configuración-inicial)
- [Dependabot](#dependabot)
- [CI/CD Pipeline](#cicd-pipeline)
- [Auto-Format](#auto-format)
- [Auto-Merge de Dependabot](#auto-merge-de-dependabot)
- [Activar/Desactivar Workflows](#activardesactivar-workflows)
- [Troubleshooting](#troubleshooting)

---

## 📊 Resumen de Workflows

Este proyecto incluye 4 automatizaciones principales:

| Workflow                  | Archivo                                      | Trigger                | Propósito                             |
| ------------------------- | -------------------------------------------- | ---------------------- | ------------------------------------- |
| **CI/CD**                 | `.github/workflows/ci.yml`                   | Push/PR a main/develop | Tests, linting, build                 |
| **Auto-Format**           | `.github/workflows/format.yml`               | Push/PR/Manual         | Formateo automático con Prettier      |
| **Dependabot Auto-Merge** | `.github/workflows/dependabot-automerge.yml` | PRs de Dependabot      | Auto-merge de actualizaciones menores |
| **Dependabot Config**     | `.github/dependabot.yml`                     | Automático (semanal)   | Actualización de dependencias         |

---

## 🔧 Configuración Inicial

### 1. Habilitar GitHub Actions

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Actions** → **General**
3. En "Actions permissions", selecciona:
   - ✅ **Allow all actions and reusable workflows**
4. En "Workflow permissions", selecciona:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### 2. Secrets Necesarios (Opcional)

Para CI/CD completo en GitHub Actions, puedes agregar estos secrets:

```
Settings → Secrets and variables → Actions → New repository secret
```

| Secret               | Descripción                     | Requerido            |
| -------------------- | ------------------------------- | -------------------- |
| `PAYLOAD_SECRET`     | Secret de Payload (para builds) | ❌ No (usa fallback) |
| `TURSO_DATABASE_URL` | URL de Turso (para builds)      | ❌ No (usa fallback) |
| `TURSO_AUTH_TOKEN`   | Token de Turso                  | ❌ No (usa fallback) |

> **Nota:** Los secrets NO son necesarios para que el CI funcione. El workflow usa valores de prueba por defecto.

---

## 🤖 Dependabot

### Configuración

Archivo: `.github/dependabot.yml`

**Características:**

- ✅ Actualizaciones **semanales** (lunes 9:00 AM)
- ✅ Solo actualizaciones **menores y patches** (no major)
- ✅ **Agrupación inteligente** de PRs (payload, react, testing, etc.)
- ✅ **Límite de PRs simultáneos** (máximo 5 para npm, 2 para actions)
- ✅ Commit messages con formato **Conventional Commits**

### ⚠️ Configuración Inicial Requerida: Labels

Antes de usar Dependabot, **debes crear las labels en GitHub**:

1. Ve a tu repositorio → **Settings** → **Labels**
2. Click en **"New label"** y crea estas labels:
   - `dependencies` (color: `#0366d6`)
   - `automated` (color: `#7057ff`)
   - `github-actions` (color: `#2088ff`)
   - `docker` (color: `#0db7ed`)
   - `needs-review` (color: `#fbca04`)
   - `major-update` (color: `#d93f0b`)

**O usa el script automático:**

```bash
# Con GitHub CLI (más fácil)
gh label create "dependencies" --description "Pull requests that update a dependency file" --color "0366d6"
gh label create "automated" --description "Automated pull requests" --color "7057ff"
gh label create "github-actions" --description "Pull requests that update GitHub Actions" --color "2088ff"
gh label create "docker" --description "Pull requests that update Docker" --color "0db7ed"
gh label create "needs-review" --description "This PR requires manual review" --color "fbca04"
gh label create "major-update" --description "Major version update" --color "d93f0b"
```

**Luego descomenta las líneas de `labels:` en `.github/dependabot.yml`**

📖 Ver guía completa: [GITHUB_LABELS.md](./GITHUB_LABELS.md)

### Grupos de Actualización (Reduce PRs)

El proyecto agrupa actualizaciones inteligentemente para **reducir el número de PRs**:

| Grupo                      | Paquetes                                      | Resultado                                      |
| -------------------------- | --------------------------------------------- | ---------------------------------------------- |
| `payload-ecosystem`        | `@payloadcms/*`, `payload`                    | **1 PR** con todos los updates de Payload      |
| `react-nextjs`             | `react`, `react-dom`, `next`, `@types/react*` | **1 PR** con todo el ecosistema React          |
| `aws-sdk`                  | `@aws-sdk/*`                                  | **1 PR** con todos los paquetes AWS            |
| `database`                 | `drizzle-kit`, `@libsql/*`                    | **1 PR** con database tools                    |
| `testing`                  | `vitest`, `playwright`, `@playwright/*`, etc. | **1 PR** con todas las herramientas de testing |
| `linting`                  | `eslint`, `prettier`, `@eslint/*`             | **1 PR** con linting tools                     |
| `typescript`               | `typescript`, `@types/*`                      | **1 PR** con TypeScript y types                |
| `production-dependencies`  | Otras deps de producción                      | **1 PR** agrupado                              |
| `development-dependencies` | Otras deps de desarrollo                      | **1 PR** agrupado                              |

**Resultado:** En lugar de 20+ PRs individuales, obtienes **~9 PRs agrupados** 🎉

### Personalizar Dependabot

Edita `.github/dependabot.yml`:

```yaml
# Cambiar horario
schedule:
  interval: 'weekly' # daily, weekly, monthly
  day: 'monday' # monday, tuesday, etc.
  time: '09:00' # Hora UTC
  timezone: 'America/New_York' # Tu zona horaria

# Cambiar límite de PRs (recomendado: 3-5)
open-pull-requests-limit: 5 # Reducido para evitar spam

# Permitir actualizaciones major (⚠️ NO recomendado)
# Elimina o comenta esta sección:
ignore:
  - dependency-name: '*'
    update-types: ['version-update:semver-major']

# Agregar más paquetes a un grupo existente
groups:
  payload-ecosystem:
    patterns:
      - '@payloadcms/*'
      - 'payload'
      - 'tu-plugin-payload' # ← Agregar aquí
```

### 💡 Mejores Prácticas de Agrupación

1. **Agrupa por ecosistema** (React, AWS, Testing)
2. **Separa prod vs dev** dependencies
3. **Limita PRs simultáneos** a 3-5
4. **Excluye major updates** del auto-merge
5. **Usa nombres descriptivos** para los grupos

---

## 🔄 CI/CD Pipeline

### Archivo: `.github/workflows/ci.yml`

Este workflow se ejecuta en cada push o PR a `main` o `develop`.

### Jobs Configurados

#### 1️⃣ Lint & Type Check

```yaml
✅ ESLint
✅ TypeScript type checking
✅ Payload types generation
```

#### 2️⃣ Build

```yaml
✅ pnpm build
✅ Verifica que el proyecto compile correctamente
✅ Muestra el tamaño del build
```

#### 3️⃣ Security Audit

```yaml
✅ pnpm audit
✅ Verifica vulnerabilidades de seguridad
✅ No falla el CI (solo advertencias)
```

#### 4️⃣ Tests (COMENTADO)

```yaml
❌ Tests de integración (Vitest) - DESACTIVADO
❌ Tests E2E (Playwright) - DESACTIVADO
# Para activar, descomenta las secciones en ci.yml
```

### Activar Tests

Cuando tengas tests implementados:

1. Abre `.github/workflows/ci.yml`
2. Busca las secciones comentadas:
   ```yaml
   # Job 2: Tests de Integración
   # NOTA: Descomenta esta sección cuando tengas tests implementados
   # test-integration:
   #   name: Integration Tests
   #   ...
   ```
3. Descomenta todo el bloque (quita los `#`)
4. Actualiza la línea `needs` en el job `build`:
   ```yaml
   needs: [lint, test-integration]
   ```
5. Actualiza `notify-success`:
   ```yaml
   needs: [lint, test-integration, test-e2e, build, security]
   ```

### Personalizar CI

```yaml
# Cambiar versión de Node.js
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20' # Cambia a '18' o '22' si necesitas

# Agregar más linters
- name: Run additional checks
  run: |
    pnpm run check-format
    pnpm run check-imports
```

---

## 🎨 Auto-Format

### Archivo: `.github/workflows/format.yml`

Formatea automáticamente tu código con Prettier y hace commit de los cambios.

### ¿Cómo Funciona?

1. **Trigger**: Se ejecuta en cada push/PR o manualmente
2. **Check**: Verifica si el código necesita formateo
3. **Format**: Si es necesario, ejecuta `prettier --write .`
4. **Commit**: Hace commit automático con `[skip ci]`
5. **Comment**: En PRs, comenta para avisar al usuario

### Ejecución Manual

```bash
# Desde GitHub UI
Actions → Auto Format Code → Run workflow → Run workflow
```

### Configuración de Prettier

Edita `.prettierrc.json` para personalizar el formato:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Ignorar Archivos

Edita `.prettierignore`:

```
# No formatear
.next/
node_modules/
dist/
build/
*.min.js
```

### Desactivar Auto-Format

Si prefieres formatear manualmente:

1. Ve a `.github/workflows/format.yml`
2. Elimina el archivo o renómbralo a `format.yml.disabled`

O desactiva solo para ciertas ramas:

```yaml
on:
  push:
    branches:
      # - main  # Comenta para desactivar en main
      - develop
```

---

## 🔀 Auto-Merge de Dependabot

### Archivo: `.github/workflows/dependabot-automerge.yml`

Aprueba y hace merge automático de PRs de Dependabot para actualizaciones menores.

### ¿Cómo Funciona?

```
1. Dependabot crea PR
   ↓
2. Workflow detecta tipo de actualización
   ↓
3. Si es minor/patch:
   ├─> ✅ Auto-aprueba el PR
   ├─> 🔄 Espera a que pasen los CI checks
   └─> 🎯 Hace merge automático

4. Si es major:
   ├─> ⚠️ Agrega label "needs-review"
   ├─> 💬 Comenta en el PR
   └─> ⏸️ Requiere aprobación manual
```

### Tipos de Actualización

| Tipo      | Auto-merge | Ejemplo         |
| --------- | ---------- | --------------- |
| **Patch** | ✅ Sí      | `1.0.0 → 1.0.1` |
| **Minor** | ✅ Sí      | `1.0.0 → 1.1.0` |
| **Major** | ❌ No      | `1.0.0 → 2.0.0` |

### Personalizar Auto-Merge

```yaml
# Cambiar a solo patches (más seguro)
- name: Check update type
  id: check-update-type
  run: |
    UPDATE_TYPE="${{ steps.metadata.outputs.update-type }}"
    # Solo permitir patches
    if [[ "$UPDATE_TYPE" == "version-update:semver-patch" ]]; then
      echo "is-minor-or-patch=true" >> $GITHUB_OUTPUT
    else
      echo "is-minor-or-patch=false" >> $GITHUB_OUTPUT
    fi
```

### Desactivar Auto-Merge

Si prefieres revisar todas las actualizaciones manualmente:

```yaml
# Opción 1: Eliminar el archivo
# .github/workflows/dependabot-automerge.yml

# Opción 2: Cambiar condición para que nunca se ejecute
if: false && github.actor == 'dependabot[bot]'
```

---

## ⚙️ Activar/Desactivar Workflows

### Desactivar un Workflow Temporalmente

**Opción 1: Desde GitHub UI**

1. Ve a **Actions**
2. Click en el workflow
3. Click en `...` → **Disable workflow**

**Opción 2: Renombrar archivo**

```bash
# Desactivar CI
mv .github/workflows/ci.yml .github/workflows/ci.yml.disabled

# Reactivar
mv .github/workflows/ci.yml.disabled .github/workflows/ci.yml
```

### Cambiar Triggers

```yaml
# Solo en push a main
on:
  push:
    branches:
      - main

# Solo en PRs
on:
  pull_request:

# Manual + automático
on:
  push:
  workflow_dispatch:  # Permite ejecución manual
```

### Limitar a Rutas Específicas

```yaml
on:
  push:
    paths:
      - 'src/**'
      - 'package.json'
      - '.github/workflows/**'
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

---

## 🐛 Troubleshooting

### ❌ CI falla con "PAYLOAD_SECRET is required"

**Solución:**

El CI usa valores de prueba por defecto. Si quieres usar tus propios valores:

1. Ve a **Settings** → **Secrets** → **Actions**
2. Agrega `PAYLOAD_SECRET` con un valor de al menos 32 caracteres
3. Opcionalmente agrega `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`

### ❌ Auto-format no está haciendo commit

**Posibles causas:**

1. **Permisos insuficientes**
   - Ve a Settings → Actions → General
   - Habilita "Allow GitHub Actions to create and approve pull requests"

2. **Branch protegida**
   - Settings → Branches → Branch protection rules
   - Desactiva "Require pull request reviews before merging" para `github-actions[bot]`

### ❌ Dependabot auto-merge no funciona

**Verifica:**

1. **Permisos de workflow:**

   ```yaml
   permissions:
     contents: write
     pull-requests: write
   ```

2. **Branch protection:**
   - Settings → Branches
   - Si tienes "Require status checks", asegúrate que los checks pasen primero

3. **Tipo de actualización:**
   - Solo minor y patch se auto-mergen
   - Major updates requieren revisión manual

### ❌ Build falla con error de memoria

**Solución:**

Aumenta memoria en el workflow:

```yaml
- name: Build application
  run: pnpm build
  env:
    NODE_OPTIONS: '--max-old-space-size=8000'
```

### ❌ pnpm install falla

**Verifica versión:**

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10 # Debe coincidir con tu versión local
```

---

## 📊 Badges para README

Agrega badges a tu README para mostrar el estado:

```markdown
[![CI/CD](https://github.com/tu-usuario/tu-repo/workflows/CI%2FCD/badge.svg)](https://github.com/tu-usuario/tu-repo/actions)
[![Auto Format](https://github.com/tu-usuario/tu-repo/workflows/Auto%20Format%20Code/badge.svg)](https://github.com/tu-usuario/tu-repo/actions)
```

---

## 🎯 Mejores Prácticas

### ✅ DO

- ✅ Usa `pnpm install --frozen-lockfile` en CI
- ✅ Cachea node_modules con `cache: 'pnpm'`
- ✅ Usa `pull_request_target` para workflows que necesitan write permissions en PRs externos
- ✅ Limita timeouts con `timeout-minutes`
- ✅ Usa `continue-on-error: true` para checks opcionales
- ✅ Agrega `[skip ci]` en commits automáticos para evitar loops

### ❌ DON'T

- ❌ No expongas secrets en logs
- ❌ No uses `pull_request` + `write` permissions (usa `pull_request_target`)
- ❌ No hagas auto-merge de major updates sin revisar
- ❌ No ejecutes workflows en todas las ramas (limita a main/develop)

---

## 🏷️ Gestión de Labels

### Problema Común: "Labels not found"

Si ves este error en Dependabot:

```
No se han encontrado las siguientes etiquetas: automated, dependencies.
```

**Solución:** Crea las labels manualmente (ver [GITHUB_LABELS.md](./GITHUB_LABELS.md))

### Script Rápido para Crear Labels

```bash
# Opción 1: GitHub CLI (recomendado)
gh label create "dependencies" --description "Dependency updates" --color "0366d6"
gh label create "automated" --description "Automated PRs" --color "7057ff"

# Opción 2: Desde GitHub UI
# Settings → Labels → New label
```

**Después de crear las labels:**

1. Edita `.github/dependabot.yml`
2. Descomenta las líneas `labels:`
3. Commit y push

---

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [GitHub Labels Guide](./GITHUB_LABELS.md)
- [pnpm in CI](https://pnpm.io/continuous-integration)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## 🔄 Actualizar este Documento

Este documento se actualiza junto con los workflows. Si modificas `.github/workflows/`, actualiza esta documentación.

**Última actualización:** 2025-01

---

**¿Tienes dudas?** Abre un issue o consulta la [documentación oficial de GitHub Actions](https://docs.github.com/en/actions).

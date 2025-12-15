# 🏷️ Configuración de Labels de GitHub

Guía para crear y configurar las labels necesarias para Dependabot y otras automatizaciones.

## 📋 Tabla de Contenidos

- [Crear Labels Manualmente](#crear-labels-manualmente)
- [Crear Labels con GitHub CLI](#crear-labels-con-github-cli)
- [Crear Labels con Script](#crear-labels-con-script)
- [Labels Recomendadas](#labels-recomendadas)

---

## 🎨 Crear Labels Manualmente

### Paso 1: Ir a Settings

1. Abre tu repositorio en GitHub
2. Click en **Settings** (pestaña superior)
3. En el menú lateral izquierdo, click en **Labels**

### Paso 2: Crear las Labels

Click en **"New label"** para cada una de estas:

#### Label 1: dependencies

```
Name: dependencies
Description: Pull requests that update a dependency file
Color: #0366d6 (azul)
```

#### Label 2: automated

```
Name: automated
Description: Automated pull requests
Color: #7057ff (morado)
```

#### Label 3: github-actions

```
Name: github-actions
Description: Pull requests that update GitHub Actions
Color: #2088ff (azul claro)
```

#### Label 4: docker

```
Name: docker
Description: Pull requests that update Docker
Color: #0db7ed (celeste)
```

#### Label 5: needs-review

```
Name: needs-review
Description: This PR requires manual review
Color: #fbca04 (amarillo)
```

#### Label 6: major-update

```
Name: major-update
Description: Major version update (breaking changes possible)
Color: #d93f0b (rojo)
```

---

## 🖥️ Crear Labels con GitHub CLI

### Prerequisito: Instalar GitHub CLI

```bash
# macOS
brew install gh

# Windows (winget)
winget install --id GitHub.cli

# Linux
# Ver: https://github.com/cli/cli#installation
```

### Autenticarse

```bash
gh auth login
```

### Crear todas las labels de una vez

```bash
# Navega a la raíz de tu repositorio
cd mi-proyecto-2025

# Crear labels
gh label create "dependencies" \
  --description "Pull requests that update a dependency file" \
  --color "0366d6"

gh label create "automated" \
  --description "Automated pull requests" \
  --color "7057ff"

gh label create "github-actions" \
  --description "Pull requests that update GitHub Actions" \
  --color "2088ff"

gh label create "docker" \
  --description "Pull requests that update Docker" \
  --color "0db7ed"

gh label create "needs-review" \
  --description "This PR requires manual review" \
  --color "fbca04"

gh label create "major-update" \
  --description "Major version update (breaking changes possible)" \
  --color "d93f0b"

echo "✅ Labels created successfully!"
```

---

## 🤖 Crear Labels con Script

### Script Bash

Crea un archivo `create-labels.sh`:

```bash
#!/bin/bash

# Script para crear labels de GitHub
# Uso: ./create-labels.sh

set -e

echo "🏷️  Creating GitHub labels..."

# Array de labels: "name|description|color"
labels=(
  "dependencies|Pull requests that update a dependency file|0366d6"
  "automated|Automated pull requests|7057ff"
  "github-actions|Pull requests that update GitHub Actions|2088ff"
  "docker|Pull requests that update Docker|0db7ed"
  "needs-review|This PR requires manual review|fbca04"
  "major-update|Major version update (breaking changes possible)|d93f0b"
)

# Crear cada label
for label_data in "${labels[@]}"; do
  IFS='|' read -r name description color <<< "$label_data"

  echo "Creating label: $name"
  gh label create "$name" \
    --description "$description" \
    --color "$color" \
    --force 2>/dev/null || echo "  ⚠️  Label '$name' might already exist"
done

echo ""
echo "✅ All labels created successfully!"
echo ""
echo "To enable labels in dependabot.yml, uncomment the 'labels' sections."
```

**Uso:**

```bash
chmod +x create-labels.sh
./create-labels.sh
```

### Script Node.js

Crea un archivo `create-labels.js`:

```javascript
#!/usr/bin/env node

// Script para crear labels de GitHub usando Octokit
// Requiere: npm install @octokit/rest dotenv

import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const owner = 'tu-usuario'; // Cambia esto
const repo = 'tu-repo'; // Cambia esto

const labels = [
  {
    name: 'dependencies',
    description: 'Pull requests that update a dependency file',
    color: '0366d6',
  },
  {
    name: 'automated',
    description: 'Automated pull requests',
    color: '7057ff',
  },
  {
    name: 'github-actions',
    description: 'Pull requests that update GitHub Actions',
    color: '2088ff',
  },
  {
    name: 'docker',
    description: 'Pull requests that update Docker',
    color: '0db7ed',
  },
  {
    name: 'needs-review',
    description: 'This PR requires manual review',
    color: 'fbca04',
  },
  {
    name: 'major-update',
    description: 'Major version update (breaking changes possible)',
    color: 'd93f0b',
  },
];

async function createLabels() {
  console.log('🏷️  Creating GitHub labels...\n');

  for (const label of labels) {
    try {
      await octokit.rest.issues.createLabel({
        owner,
        repo,
        name: label.name,
        description: label.description,
        color: label.color,
      });
      console.log(`✅ Created: ${label.name}`);
    } catch (error) {
      if (error.status === 422) {
        console.log(`⚠️  Already exists: ${label.name}`);
      } else {
        console.error(`❌ Error creating ${label.name}:`, error.message);
      }
    }
  }

  console.log('\n✅ All labels processed!');
}

createLabels();
```

**Uso:**

```bash
# Instalar dependencias
npm install @octokit/rest dotenv

# Crear .env con tu token
echo "GITHUB_TOKEN=ghp_tu_token_aqui" > .env

# Ejecutar
node create-labels.js
```

---

## 📝 Labels Recomendadas

### Labels Esenciales (Obligatorias)

| Label          | Color                                                                     | Uso               |
| -------------- | ------------------------------------------------------------------------- | ----------------- |
| `dependencies` | ![#0366d6](https://via.placeholder.com/15/0366d6/000000?text=+) `#0366d6` | PRs de Dependabot |
| `automated`    | ![#7057ff](https://via.placeholder.com/15/7057ff/000000?text=+) `#7057ff` | PRs automáticos   |

### Labels Adicionales (Recomendadas)

| Label            | Color                                                                     | Uso                      |
| ---------------- | ------------------------------------------------------------------------- | ------------------------ |
| `github-actions` | ![#2088ff](https://via.placeholder.com/15/2088ff/000000?text=+) `#2088ff` | Updates de Actions       |
| `docker`         | ![#0db7ed](https://via.placeholder.com/15/0db7ed/000000?text=+) `#0db7ed` | Updates de Docker        |
| `needs-review`   | ![#fbca04](https://via.placeholder.com/15/fbca04/000000?text=+) `#fbca04` | Requiere revisión manual |
| `major-update`   | ![#d93f0b](https://via.placeholder.com/15/d93f0b/000000?text=+) `#d93f0b` | Actualizaciones major    |

### Labels Opcionales

| Label             | Color     | Descripción        |
| ----------------- | --------- | ------------------ |
| `security`        | `#ee0701` | Security updates   |
| `breaking-change` | `#d93f0b` | Breaking changes   |
| `auto-merge`      | `#2cbe4e` | Safe to auto-merge |
| `wontfix`         | `#ffffff` | Will not be fixed  |

---

## ✅ Verificar Labels

Después de crear las labels:

```bash
# Con GitHub CLI
gh label list

# Filtrar por nombre
gh label list | grep dependencies
```

O visita: `https://github.com/tu-usuario/tu-repo/labels`

---

## 🔧 Habilitar Labels en Dependabot

Una vez creadas las labels, edita `.github/dependabot.yml`:

```yaml
# Descomenta estas líneas:
labels:
  - 'dependencies'
  - 'automated'
```

---

## 🎨 Colores Recomendados

Paleta de colores para consistencia:

```
Azules:
- #0366d6 - Azul estándar (dependencies)
- #2088ff - Azul claro (github-actions)
- #0db7ed - Celeste (docker)

Morados:
- #7057ff - Morado (automated)
- #6f42c1 - Morado oscuro

Amarillos/Naranjas:
- #fbca04 - Amarillo (needs-review)
- #d93f0b - Naranja/Rojo (major-update)

Verdes:
- #2cbe4e - Verde (auto-merge, ready)
- #0e8a16 - Verde oscuro (security)

Grises:
- #d1d5da - Gris claro
- #6a737d - Gris medio
```

---

## 🚫 Eliminar Labels

Si necesitas eliminar una label:

```bash
# Con GitHub CLI
gh label delete "nombre-label" --yes

# O manualmente en:
# Settings → Labels → Click en label → Delete label
```

---

## 💡 Mejores Prácticas

1. **Nomenclatura:**
   - Usa minúsculas
   - Usa guiones `-` en lugar de espacios
   - Sé descriptivo pero conciso

2. **Colores:**
   - Usa la misma paleta de colores
   - Rojo para urgente/breaking
   - Verde para aprobado/seguro
   - Azul para informativo
   - Amarillo para advertencia

3. **Organización:**
   - Crea grupos lógicos (dependencies, ci, bug, etc.)
   - Documenta el propósito de cada label
   - Elimina labels no usadas

4. **Automatización:**
   - Usa scripts para crear labels en nuevos repos
   - Mantén consistencia entre proyectos

---

## 📚 Recursos

- [GitHub Labels Documentation](https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels)
- [GitHub CLI Labels](https://cli.github.com/manual/gh_label)
- [Dependabot Labels](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/managing-pull-requests-for-dependency-updates#managing-dependabot-pull-requests-with-comment-commands)

---

**Siguiente paso:** Después de crear las labels, descomenta las secciones `labels:` en `.github/dependabot.yml`

# 🎨 Guía de Linting y Formatting

Documentación completa de las reglas de ESLint y Prettier configuradas en el proyecto.

## 📋 Tabla de Contenidos

- [Resumen](#resumen)
- [Prettier - Formato de Código](#prettier---formato-de-código)
- [ESLint - Calidad de Código](#eslint---calidad-de-código)
- [Comandos Disponibles](#comandos-disponibles)
- [Integración con IDE](#integración-con-ide)
- [Reglas Importantes](#reglas-importantes)
- [Solución de Problemas](#solución-de-problemas)

---

## 📊 Resumen

Este proyecto usa las **mejores prácticas actuales** de TypeScript/Next.js:

| Herramienta    | Versión | Propósito                    |
| -------------- | ------- | ---------------------------- |
| **Prettier**   | 3.7.4   | Formato automático de código |
| **ESLint**     | 9.39.2  | Análisis estático y calidad  |
| **TypeScript** | 5.7.3   | Type checking                |

### Filosofía de las Reglas

✅ **Semicolons (`;`)** - SÍ se usan (estándar TypeScript)
✅ **Single quotes (`'`)** - Preferidas sobre double quotes
✅ **Trailing commas** - En objetos/arrays multilínea (ES5 style)
✅ **100 caracteres** - Límite de línea
✅ **2 espacios** - Indentación
✅ **LF** - Line endings Unix

---

## 🎨 Prettier - Formato de Código

### Configuración (`.prettierrc.json`)

```json
{
  "semi": true, // ✅ Semicolons obligatorios
  "singleQuote": true, // ✅ Comillas simples
  "trailingComma": "es5", // ✅ Trailing commas (objetos, arrays)
  "printWidth": 100, // ✅ 100 caracteres por línea
  "tabWidth": 2, // ✅ 2 espacios de indentación
  "useTabs": false, // ✅ Espacios, no tabs
  "arrowParens": "always", // ✅ (x) => x  no  x => x
  "endOfLine": "lf", // ✅ Unix line endings
  "bracketSpacing": true, // ✅ { foo } no {foo}
  "bracketSameLine": false // ✅ Tags JSX en nueva línea
}
```

### Ejemplos de Formato

#### ✅ Correcto (con semicolons)

```typescript
import { useState } from 'react';
import { NextPage } from 'next';

const MyComponent: NextPage = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default MyComponent;
```

#### ❌ Incorrecto (sin semicolons)

```typescript
import { useState } from 'react'  // ❌ Falta semicolon
import { NextPage } from 'next'   // ❌ Falta semicolon

const MyComponent: NextPage = () => {
  const [count, setCount] = useState(0)  // ❌ Falta semicolon

  const handleClick = () => {
    setCount(count + 1)  // ❌ Falta semicolon
  }  // ❌ Falta semicolon

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleClick}>Increment</button>
    </div>
  )  // ❌ Falta semicolon
}  // ❌ Falta semicolon

export default MyComponent  // ❌ Falta semicolon
```

### Archivos Ignorados (`.prettierignore`)

**IMPORTANTE:** Los siguientes archivos NO deben ser formateados:

```
# Lockfiles (CRÍTICO - NO FORMATEAR NUNCA)
pnpm-lock.yaml
package-lock.json
yarn.lock

# Dependencias
node_modules/

# Build outputs
.next/
build/
dist/
.vercel/

# Payload CMS generado automáticamente
src/payload-types.ts

# Migraciones generadas (SQL)
src/migrations/
*.sql

# Configuraciones que no deben modificarse
tsconfig.json
next-env.d.ts
vercel.json

# Public assets
public/

# Database files
*.db
*.db-shm
*.db-wal

# Media uploads
media/
uploads/
```

⚠️ **CRÍTICO:** Nunca formatees `pnpm-lock.yaml`, `package-lock.json` o `yarn.lock` ya que puede causar errores en la instalación de dependencias.

---

## 🔍 ESLint - Calidad de Código

### Configuración Principal

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "plugins": ["@typescript-eslint"],
  "parser": "@typescript-eslint/parser"
}
```

### Reglas Clave

#### 1. Semicolons (OBLIGATORIOS)

```json
{
  "semi": ["error", "always"],
  "@typescript-eslint/semi": ["error", "always"]
}
```

```typescript
// ✅ Correcto
const foo = 'bar';
const sum = (a: number, b: number): number => {
  return a + b;
};

// ❌ Incorrecto
const foo = 'bar'; // Error: Missing semicolon
const sum = (a, b) => {
  return a + b;
}; // Error: Missing semicolon
```

#### 2. Quotes (Comillas Simples)

```json
{
  "quotes": ["error", "single", { "avoidEscape": true }]
}
```

```typescript
// ✅ Correcto
const greeting = 'Hello World';
const message = "It's a beautiful day"; // Permite " para evitar escape

// ❌ Incorrecto
const greeting = 'Hello World'; // Error: Use single quotes
const message = "It's a beautiful day"; // Mejor usar "
```

#### 3. Trailing Commas

```json
{
  "comma-dangle": [
    "error",
    {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "functions": "never"
    }
  ]
}
```

```typescript
// ✅ Correcto
const obj = {
  foo: 'bar',
  baz: 'qux', // ✅ Trailing comma en multilínea
};

const arr = [
  1,
  2,
  3, // ✅ Trailing comma en multilínea
];

function doSomething(
  a: number,
  b: number // ✅ NO trailing comma en parámetros
) {
  return a + b;
}

// ❌ Incorrecto
const obj = {
  foo: 'bar',
  baz: 'qux', // ❌ Falta trailing comma
};

function doSomething(
  a: number,
  b: number // ❌ Sobra trailing comma en functions
) {}
```

#### 4. TypeScript Específico

```typescript
// ✅ Correcto - No usar any
const parseData = (data: unknown): User => {
  // ...
};

// ⚠️ Warning - Evitar any
const parseData = (data: any): User => {
  // ...
};

// ✅ Correcto - Usar const assertions
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
} as const;

// ✅ Correcto - Ignorar variables no usadas con _
const [_unused, setCount] = useState(0);
const onClick = (_event: MouseEvent) => {
  // ...
};
```

#### 5. Import Order

```typescript
// ✅ Correcto - Orden de imports
import React, { useState } from 'react'; // 1. React
import { NextPage } from 'next'; // 2. Next.js
import { useRouter } from 'next/router';

import { Button } from '@/components/Button'; // 3. Internal (@/)
import { formatDate } from '@/lib/utils';

import type { User } from '@/types'; // 4. Types al final

// ❌ Incorrecto - Sin orden
import { formatDate } from '@/lib/utils';
import { NextPage } from 'next';
import React from 'react';
```

#### 6. Console Statements

```typescript
// ✅ Permitido - Error y Warning
console.error('Error occurred:', error);
console.warn('Warning:', message);

// ⚠️ Warning - console.log en producción
console.log('Debug info:', data); // Evitar en producción

// ✅ Correcto - Eliminar antes de commit
// console.log('Debug info:', data);
```

#### 7. Prefer Const

```typescript
// ✅ Correcto
const name = 'John';
let count = 0;
count++;

// ❌ Incorrecto
let name = 'John'; // Error: Use const instead
```

#### 8. Arrow Functions

```typescript
// ✅ Correcto
const add = (a: number, b: number): number => {
  return a + b;
};

// ✅ Correcto - Arrow parens siempre
const square = (x: number) => x * x;

// ❌ Incorrecto
const square = (x) => x * x; // Error: Missing parens
```

---

## 💻 Comandos Disponibles

### Linting

```bash
# Ejecutar ESLint
pnpm lint

# Fix automático de problemas
pnpm lint:fix

# Lint archivo específico
pnpm exec eslint src/app/page.tsx

# Lint con output detallado
pnpm exec eslint . --debug
```

### Formatting

```bash
# Formatear todo el proyecto (respeta .prettierignore)
pnpm format

# Verificar formato sin modificar
pnpm format:check

# Formatear archivo específico
pnpm exec prettier --write src/app/page.tsx

# Formatear solo archivos staged (pre-commit)
pnpm exec prettier --write $(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx|json|css|scss)$')

# Verificar qué archivos serán formateados
pnpm exec prettier --list-different .
```

⚠️ **Nota:** `pnpm format` automáticamente ignora archivos en `.prettierignore`

### Workflow Típico

```bash
# Antes de commit
pnpm format      # Formatear código (ignora lockfiles automáticamente)
pnpm lint:fix    # Fix lint issues
pnpm lint        # Verificar que no hay errores

# Build para verificar TypeScript
pnpm build

# O usa el script de verificación completo
bash scripts/verify-format.sh
```

### Script de Verificación Completo

Ejecuta el script que verifica todo:

```bash
# Da permisos de ejecución
chmod +x scripts/verify-format.sh

# Ejecutar verificación completa
./scripts/verify-format.sh
```

Este script verifica:

- ✅ Formato con Prettier
- ✅ Linting con ESLint
- ✅ Tipos con TypeScript
- ✅ Semicolons presentes
- ✅ Archivos críticos no modificados

---

## 🔧 Integración con IDE

### VS Code

#### Extensiones Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

#### Settings (`.vscode/settings.json`)

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ

1. Settings → Languages & Frameworks → JavaScript → Prettier
2. ✅ On save
3. ✅ On code reformat
4. Prettier package: `{project}/node_modules/prettier`

### Neovim / Vim

```lua
-- Con null-ls
local null_ls = require("null-ls")
null_ls.setup({
  sources = {
    null_ls.builtins.formatting.prettier,
    null_ls.builtins.diagnostics.eslint,
  },
})

-- Format on save
vim.cmd([[autocmd BufWritePre * lua vim.lsp.buf.format()]])
```

---

## 📝 Reglas Importantes

### DO ✅

1. **Usa semicolons siempre**

   ```typescript
   const foo = 'bar'; // ✅
   ```

2. **Usa single quotes**

   ```typescript
   const message = 'Hello'; // ✅
   ```

3. **Usa trailing commas en multilínea**

   ```typescript
   const obj = {
     foo: 'bar',
     baz: 'qux', // ✅
   };
   ```

4. **Usa const por defecto**

   ```typescript
   const config = { ... };  // ✅
   ```

5. **Siempre usa arrow parens**

   ```typescript
   const fn = (x) => x * 2; // ✅
   ```

6. **Tipado explícito cuando es necesario**
   ```typescript
   const sum = (a: number, b: number): number => a + b; // ✅
   ```

### DON'T ❌

1. **No omitas semicolons**

   ```typescript
   const foo = 'bar'; // ❌
   ```

2. **No uses double quotes sin razón**

   ```typescript
   const message = 'Hello'; // ❌
   ```

3. **No uses any sin justificación**

   ```typescript
   const data: any = fetchData(); // ❌
   ```

4. **No uses var**

   ```typescript
   var count = 0; // ❌
   ```

5. **No dejes console.log en producción**

   ```typescript
   console.log('Debug:', data); // ❌
   ```

6. **No ignores errores de TypeScript**
   ```typescript
   // @ts-ignore
   const result = unsafeFunction(); // ❌
   ```

---

## 🐛 Solución de Problemas

### Prettier no formatea al guardar

**Solución:**

1. Verifica extensión instalada: `Prettier - Code formatter`
2. Verifica settings.json:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```
3. Reinicia VS Code

### ESLint muestra errores en archivos generados

**Solución:**

Agrega a `.eslintrc.json`:

```json
{
  "ignorePatterns": ["src/payload-types.ts", "src/migrations/**"]
}
```

### Conflictos entre ESLint y Prettier

**Solución:**

Las reglas ya están configuradas para no conflictuar:

- ESLint maneja calidad de código
- Prettier maneja formato
- ESLint delega formato a Prettier (`indent: "off"`)

### Error: "Delete `␍`" (CRLF vs LF)

**Solución:**

```bash
# Configurar Git para usar LF
git config --global core.autocrlf false

# Convertir archivos existentes
find . -type f -name "*.ts" -o -name "*.tsx" | xargs dos2unix

# O con Prettier
pnpm format
```

### Demasiados errores de linting

**Solución:**

```bash
# Fix automático
pnpm lint:fix

# Si persisten, revisar uno por uno
pnpm lint
```

---

## 🎯 Pre-commit Hooks (Opcional)

### Con Husky + lint-staged

```bash
# Instalar
pnpm add -D husky lint-staged

# Configurar
npx husky init
```

**package.json:**

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["prettier --write", "eslint --fix"],
    "*.{json,css,scss,md}": ["prettier --write"]
  }
}
```

**.husky/pre-commit:**

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
```

---

## 📚 Recursos

- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript ESLint](https://typescript-eslint.io/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)

---

## ✅ Checklist

Antes de hacer commit:

- [ ] ✅ Código formateado con Prettier (`pnpm format`)
- [ ] ✅ Sin errores de ESLint (`pnpm lint`)
- [ ] ✅ Build exitoso (`pnpm build`)
- [ ] ✅ Tests pasando (`pnpm test`)
- [ ] ✅ Sin console.log innecesarios
- [ ] ✅ Todos los semicolons presentes
- [ ] ✅ Imports ordenados correctamente
- [ ] ✅ **pnpm-lock.yaml NO fue modificado manualmente**
- [ ] ✅ payload-types.ts está actualizado (`pnpm generate:types`)

### Archivos que NUNCA deben editarse manualmente:

- ❌ `pnpm-lock.yaml` / `package-lock.json` / `yarn.lock`
- ❌ `src/payload-types.ts` (generado con `pnpm generate:types`)
- ❌ `src/migrations/*.sql` (generado con `pnpm payload migrate:create`)
- ❌ `next-env.d.ts` (generado por Next.js)
- ❌ `.next/` (build output)

---

**¿Dudas sobre las reglas?** Consulta este documento o revisa los archivos `.eslintrc.json` y `.prettierrc.json`.

#  Guía de Contribución

¡Gracias por tu interés en contribuir a este proyecto! Este documento te guiará a través del proceso de contribución.

##  Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Development](#proceso-de-development)
- [Estándares de Código](#estándares-de-código)
- [Commits y Pull Requests](#commits-y-pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

##  Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Valores

- **Respeto:** Trata a todos con respeto y consideración
- **Inclusión:** Sé inclusivo y acogedor con todos
- **Colaboración:** Trabaja en equipo y ayuda a otros
- **Profesionalismo:** Mantén un ambiente profesional y constructivo

##  Cómo Contribuir

### 1. Fork el Repositorio

```bash
# Hacer fork desde GitHub UI, luego:
git clone https://github.com/TU-USUARIO/mi-proyecto-2025.git
cd mi-proyecto-2025
```

### 2. Configurar el Entorno

```bash
# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env

# Configurar tus credenciales en .env
# Ver QUICKSTART.md para instrucciones detalladas
```

### 3. Crear una Rama

```bash
# Crear rama desde main
git checkout -b tipo/descripcion-corta

# Ejemplos:
git checkout -b feature/add-comments-collection
git checkout -b fix/upload-error
git checkout -b docs/improve-readme
```

### 4. Hacer Cambios

```bash
# Iniciar desarrollo
pnpm dev

# Hacer tus cambios...

# Generar tipos si modificaste colecciones
pnpm generate:types

# Verificar código
pnpm lint
```

### 5. Commits

```bash
# Agregar cambios
git add .

# Commit con mensaje descriptivo (ver formato abajo)
git commit -m "feat: agregar colección de comentarios"

# Push a tu fork
git push origin tipo/descripcion-corta
```

### 6. Pull Request

1. Ve a GitHub y crea un Pull Request
2. Completa la plantilla del PR
3. Espera la revisión
4. Realiza cambios si son solicitados

##  Proceso de Development

### Configuración Inicial

1. **Variables de Entorno:**
   - Nunca commitees `.env`
   - Actualiza `.env.example` si agregas nuevas variables
   - Documenta las variables en el README

2. **Dependencias:**

   ```bash
   # Agregar nueva dependencia
   pnpm add nombre-paquete

   # Dependencia de desarrollo
   pnpm add -D nombre-paquete
   ```

3. **Migraciones:**
   ```bash
   # Después de cambiar schema
   pnpm payload migrate:create
   pnpm payload migrate
   ```

### Flujo de Trabajo

```bash
# 1. Actualizar main
git checkout main
git pull upstream main

# 2. Crear rama de feature
git checkout -b feature/nueva-funcionalidad

# 3. Desarrollar
pnpm dev
# ... hacer cambios ...

# 4. Generar tipos
pnpm generate:types

# 5. Testing
pnpm test

# 6. Lint
pnpm lint

# 7. Commit
git add .
git commit -m "feat: descripción"

# 8. Push
git push origin feature/nueva-funcionalidad

# 9. Crear PR en GitHub
```

##  Estándares de Código

### TypeScript

-  Usa TypeScript para todo el código
-  Define tipos explícitos
-  Evita `any`, usa `unknown` si es necesario
-  Usa interfaces para objetos complejos

```typescript
//  Evitar
const data: any = fetchData();

//  Correcto
interface UserData {
  id: string;
  email: string;
  name: string;
}

const data: UserData = fetchData();
```

### ESLint y Prettier

```bash
# Verificar lint
pnpm lint

# Formatear código
npx prettier --write .
```

### Nombres de Archivos

- **Colecciones:** PascalCase - `Posts.ts`, `Users.ts`
- **Componentes:** PascalCase - `Header.tsx`, `Button.tsx`
- **Utilidades:** camelCase - `formatDate.ts`, `slugify.ts`
- **Configuración:** kebab-case - `payload.config.ts`, `next.config.mjs`

### Estructura de Código

```typescript
// 1. Imports
import { CollectionConfig } from 'payload';
import { slugify } from '../lib/utils';

// 2. Tipos/Interfaces
interface CustomField {
  name: string;
  value: string;
}

// 3. Constantes
const DEFAULT_STATUS = 'draft';

// 4. Funciones/Componentes
export const Posts: CollectionConfig = {
  // ...
};
```

##  Commits y Pull Requests

### Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descripción corta

Descripción larga opcional

Footer opcional
```

**Tipos permitidos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma, etc (no afecta código)
- `refactor`: Refactorización (no es feat ni fix)
- `perf`: Mejoras de performance
- `test`: Agregar o corregir tests
- `chore`: Cambios en build, dependencias, etc
- `ci`: Cambios en CI/CD

**Ejemplos:**

```bash
feat: agregar colección de comentarios
feat(posts): agregar campo de categoría
fix: corregir error de upload en media
fix(auth): resolver problema de tokens expirados
docs: actualizar guía de instalación
docs(readme): agregar sección de troubleshooting
refactor: simplificar lógica de validación
test: agregar tests para Posts collection
chore: actualizar dependencias
```

### Pull Requests

**Título del PR:**

```
feat: Agregar sistema de comentarios
```

**Descripción del PR:**

```markdown
## Descripción

Agrega una nueva colección de comentarios con soporte para:

- Comentarios anidados
- Moderación
- Notificaciones

## Tipo de Cambio

- [x] Nueva funcionalidad
- [ ] Corrección de bug
- [ ] Documentación
- [ ] Refactorización

## Checklist

- [x] El código sigue los estándares del proyecto
- [x] He actualizado la documentación
- [x] He agregado tests
- [x] Todos los tests pasan
- [x] He actualizado .env.example si agregué variables

## Screenshots (si aplica)

![comentarios](url-imagen)

## Notas Adicionales

Los comentarios se almacenan en Turso y las imágenes en R2.
```

##  Reportar Bugs

### Antes de Reportar

1.  Busca en issues existentes
2.  Verifica que esté actualizado (`git pull`)
3.  Reproduce el bug en una instalación limpia
4.  Lee la documentación

### Template de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del bug.

**Pasos para Reproducir**

1. Ve a '...'
2. Click en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento Esperado**
Qué esperabas que sucediera.

**Comportamiento Actual**
Qué sucedió realmente.

**Screenshots**
Si aplica, agrega screenshots.

**Entorno:**

- OS: [ej. Windows 11, macOS 14, Ubuntu 22.04]
- Node.js: [ej. 20.11.0]
- pnpm: [ej. 9.1.0]
- Navegador: [ej. Chrome 120, Firefox 121]

**Información Adicional**
Cualquier otra información relevante.

**Logs de Error**
```

Pega aquí los logs de error

```

```

##  Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu feature request está relacionado a un problema?**
Descripción clara del problema. Ej. "Siempre es frustrante cuando..."

**Solución Deseada**
Descripción clara de qué quieres que suceda.

**Alternativas Consideradas**
Otras soluciones o features que has considerado.

**Contexto Adicional**
Cualquier otro contexto, screenshots, o ejemplos.

**¿Estarías dispuesto a implementarlo?**

- [ ] Sí, puedo crear un PR
- [ ] Necesito ayuda
- [ ] Solo sugiero la idea
```

##  Testing

### Agregar Tests

```bash
# Tests de integración
# Crear: tests/integration/nombre.test.ts

# Tests E2E
# Crear: tests/e2e/nombre.spec.ts
```

**Ejemplo de test:**

```typescript
import { describe, it, expect } from 'vitest';
import { getPayload } from 'payload';
import config from '@/payload.config';

describe('Comments Collection', () => {
  it('should create a comment', async () => {
    const payload = await getPayload({ config });

    const comment = await payload.create({
      collection: 'comments',
      data: {
        content: 'Test comment',
        post: '123',
      },
    });

    expect(comment.content).toBe('Test comment');
  });
});
```

### Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Solo integración
pnpm test:int

# Solo E2E
pnpm test:e2e

# Watch mode
npx vitest
```

##  Documentación

### Actualizar Documentación

Si tu PR agrega/modifica funcionalidad, actualiza:

-  `README.md` - Para cambios importantes
-  `DEVELOPMENT.md` - Para features de desarrollo
-  `COMMANDS.md` - Para nuevos comandos
-  Comentarios en el código
-  `.env.example` - Para nuevas variables

### Estilo de Documentación

- Usa markdown correcto
- Incluye ejemplos de código
- Agrega screenshots cuando sea útil
- Usa emojis para mejor lectura 
- Mantén la consistencia con docs existentes

##  Checklist Final

Antes de crear tu PR, verifica:

- [ ] El código compila sin errores (`pnpm build`)
- [ ] Todos los tests pasan (`pnpm test`)
- [ ] No hay errores de lint (`pnpm lint`)
- [ ] Has actualizado la documentación
- [ ] Has agregado tests para nueva funcionalidad
- [ ] El commit sigue el formato Conventional Commits
- [ ] Has actualizado `.env.example` si agregaste variables
- [ ] Has probado localmente
- [ ] El PR tiene una descripción clara

##  Recursos para Contribuidores

- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

##  Comunicación

- **Issues:** Para bugs y feature requests
- **Discussions:** Para preguntas y discusiones
- **PRs:** Para contribuciones de código

##  Reconocimientos

Todos los contribuidores serán reconocidos en el proyecto. ¡Gracias por tu contribución!

---

## ❓ Preguntas

¿Tienes preguntas? No dudes en:

1. Abrir una Discussion
2. Preguntar en el issue relevante
3. Revisar la documentación del proyecto

---

**¡Gracias por contribuir! **

Tu tiempo y esfuerzo ayudan a hacer este proyecto mejor para todos.




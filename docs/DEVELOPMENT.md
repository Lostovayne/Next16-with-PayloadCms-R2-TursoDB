# Guía de Desarrollo y Extensión

Esta guía te ayudará a entender la arquitectura del proyecto y cómo extenderlo con nuevas funcionalidades.

## Tabla de Contenidos

- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Crear Nuevas Colecciones](#crear-nuevas-colecciones)
- [Configuración de Campos](#configuración-de-campos)
- [Hooks y Validación](#hooks-y-validación)
- [Relaciones entre Colecciones](#relaciones-entre-colecciones)
- [Control de Acceso](#control-de-acceso)
- [Personalizar el Admin Panel](#personalizar-el-admin-panel)
- [API y Endpoints](#api-y-endpoints)
- [Migraciones de Base de Datos](#migraciones-de-base-de-datos)

## Arquitectura del Proyecto

```
mi-proyecto-2025/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (payload)/           # Rutas de Payload CMS
│   │   │   └── admin/           # Panel de administración
│   │   ├── api/                 # API routes personalizadas
│   │   └── layout.tsx           # Layout principal
│   │
│   ├── collections/             # Colecciones de Payload
│   │   ├── Users.ts            # Usuarios (autenticación)
│   │   └── Media.ts            # Archivos multimedia
│   │
│   ├── lib/                    # Utilidades compartidas
│   │   └── utils.ts
│   │
│   ├── migrations/             # Migraciones de Drizzle
│   │   └── [timestamp]_*.sql
│   │
│   ├── payload.config.ts       # Configuración principal de Payload
│   └── payload-types.ts        # Tipos generados automáticamente
```

## Crear Nuevas Colecciones

### Paso 1: Crear el archivo de la colección

Crea un nuevo archivo en `src/collections/Posts.ts`:

```typescript
import { CollectionConfig } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
  },
  access: {
    read: () => true, // Público
    create: ({ req: { user } }) => !!user, // Solo usuarios autenticados
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
        { label: 'Archivado', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          maxLength: 60,
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
        {
          name: 'keywords',
          type: 'text',
        },
      ],
    },
  ],
  timestamps: true, // Agrega createdAt y updatedAt
};
```

### Paso 2: Registrar la colección

En `src/payload.config.ts`:

```typescript
import { Posts } from './collections/Posts';

export default buildConfig({
  // ... otras configuraciones
  collections: [
    Users,
    Media,
    Posts, // ← Agregar aquí
  ],
  // ...
});
```

### Paso 3: Generar tipos y migrar

```bash
# Generar tipos TypeScript
pnpm generate:types

# Aplicar cambios a la base de datos
pnpm payload migrate
```

## Configuración de Campos

### Tipos de Campos Comunes

```typescript
// Texto simple
{
  name: 'title',
  type: 'text',
  required: true,
}

// Textarea
{
  name: 'description',
  type: 'textarea',
  maxLength: 500,
}

// Rich Text (Lexical Editor)
{
  name: 'content',
  type: 'richText',
}

// Número
{
  name: 'price',
  type: 'number',
  min: 0,
  max: 999999,
}

// Email
{
  name: 'email',
  type: 'email',
  required: true,
}

// Checkbox
{
  name: 'featured',
  type: 'checkbox',
  defaultValue: false,
}

// Select
{
  name: 'category',
  type: 'select',
  options: [
    { label: 'Tecnología', value: 'tech' },
    { label: 'Diseño', value: 'design' },
  ],
}

// Radio
{
  name: 'difficulty',
  type: 'radio',
  options: [
    { label: 'Fácil', value: 'easy' },
    { label: 'Medio', value: 'medium' },
    { label: 'Difícil', value: 'hard' },
  ],
}

// Fecha
{
  name: 'publishDate',
  type: 'date',
  admin: {
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
}

// Archivo
{
  name: 'document',
  type: 'upload',
  relationTo: 'media',
}

// JSON
{
  name: 'metadata',
  type: 'json',
}

// Array
{
  name: 'items',
  type: 'array',
  fields: [
    { name: 'name', type: 'text' },
    { name: 'quantity', type: 'number' },
  ],
}

// Grupo
{
  name: 'address',
  type: 'group',
  fields: [
    { name: 'street', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'zipCode', type: 'text' },
  ],
}

// Tabs (para organizar campos)
{
  type: 'tabs',
  tabs: [
    {
      label: 'Contenido',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'content', type: 'richText' },
      ],
    },
    {
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
```

## Hooks y Validación

### Hooks de Campo

```typescript
{
  name: 'slug',
  type: 'text',
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        // Generar slug automáticamente desde el título
        if (!value && data?.title) {
          return data.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        }
        return value
      },
    ],
  },
}
```

### Hooks de Colección

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    // Antes de crear
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create') {
          data.author = req.user.id;
          data.createdAt = new Date();
        }
        return data;
      },
    ],

    // Después de crear
    afterChange: [
      async ({ doc, req, operation }) => {
        if (operation === 'create') {
          // Enviar email, notificación, etc.
          console.log(`Nuevo post creado: ${doc.title}`);
        }
      },
    ],

    // Antes de leer
    beforeRead: [
      ({ doc, req }) => {
        // Modificar documento antes de devolverlo
        return doc;
      },
    ],

    // Antes de eliminar
    beforeDelete: [
      async ({ req, id }) => {
        // Verificar si se puede eliminar
        console.log(`Eliminando post: ${id}`);
      },
    ],
  },
  fields: [
    // ...campos
  ],
};
```

### Validación Personalizada

```typescript
{
  name: 'email',
  type: 'email',
  validate: (value) => {
    if (!value?.includes('@')) {
      return 'Email inválido'
    }
    return true
  },
}

{
  name: 'age',
  type: 'number',
  validate: (value) => {
    if (value < 18) {
      return 'Debe ser mayor de 18 años'
    }
    if (value > 120) {
      return 'Edad no válida'
    }
    return true
  },
}
```

## Relaciones entre Colecciones

### Relación Simple (hasOne)

```typescript
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  required: true,
}
```

### Relación Múltiple (hasMany)

```typescript
{
  name: 'categories',
  type: 'relationship',
  relationTo: 'categories',
  hasMany: true,
  required: true,
}
```

### Relación Polimórfica

```typescript
{
  name: 'relatedItem',
  type: 'relationship',
  relationTo: ['posts', 'pages', 'products'],
  required: true,
}
```

### Ejemplo: Sistema de Comentarios

```typescript
// src/collections/Comments.ts
export const Comments: CollectionConfig = {
  slug: 'comments',
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
    },
    {
      name: 'parentComment',
      type: 'relationship',
      relationTo: 'comments', // Auto-relación para respuestas
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
};
```

## Control de Acceso

### Nivel de Colección

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    // Lectura: Todos pueden leer posts publicados
    read: ({ req: { user } }) => {
      if (user) return true; // Usuarios ven todo
      return {
        status: { equals: 'published' }, // Público solo ve publicados
      };
    },

    // Crear: Solo usuarios autenticados
    create: ({ req: { user } }) => !!user,

    // Actualizar: Solo el autor o admin
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        author: { equals: user.id },
      };
    },

    // Eliminar: Solo admin
    delete: ({ req: { user } }) => {
      return user?.role === 'admin';
    },
  },
  fields: [
    // ...
  ],
};
```

### Nivel de Campo

```typescript
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
}
```

### Roles Personalizados

En `src/collections/Users.ts`:

```typescript
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Autor', value: 'author' },
        { label: 'Usuario', value: 'user' },
      ],
      defaultValue: 'user',
      required: true,
    },
    // ... otros campos
  ],
};
```

## Personalizar el Admin Panel

### Configuración del Admin

En `src/payload.config.ts`:

```typescript
export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Mi Proyecto',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
    // Logo personalizado
    components: {
      graphics: {
        Logo: './components/Logo',
        Icon: './components/Icon',
      },
    },
  },
  // ...
});
```

### Personalizar vista de lista

```typescript
export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'createdAt'],
    listSearchableFields: ['title', 'excerpt'],
    group: 'Contenido', // Agrupar en el menú
    hidden: false, // Ocultar del menú
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50, 100],
    },
  },
  // ...
};
```

## API y Endpoints

### Endpoints Automáticos

Payload genera automáticamente endpoints REST y GraphQL:

```
GET    /api/posts          # Listar
GET    /api/posts/:id      # Obtener uno
POST   /api/posts          # Crear
PATCH  /api/posts/:id      # Actualizar
DELETE /api/posts/:id      # Eliminar
```

### Consultas Avanzadas

```typescript
// Con filtros
fetch('/api/posts?where[status][equals]=published');

// Con población
fetch('/api/posts?depth=1'); // Incluye relaciones

// Con límite y paginación
fetch('/api/posts?limit=10&page=2');

// Con ordenamiento
fetch('/api/posts?sort=-createdAt'); // Descendente

// Búsqueda
fetch('/api/posts?where[title][like]=next');
```

### Endpoint Personalizado

Crea `src/app/api/custom/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  const payload = await getPayload({ config });

  const posts = await payload.find({
    collection: 'posts',
    where: {
      status: {
        equals: 'published',
      },
    },
    limit: 10,
    sort: '-createdAt',
  });

  return NextResponse.json(posts);
}
```

## Migraciones de Base de Datos

### Crear una Migración

```bash
# Genera una nueva migración basada en cambios del schema
pnpm payload migrate:create
```

### Aplicar Migraciones

```bash
# Ejecutar migraciones pendientes
pnpm payload migrate
```

### Revertir Migraciones

```bash
# Volver a la migración anterior
pnpm payload migrate:down
```

### Estado de Migraciones

```bash
# Ver estado
pnpm payload migrate:status
```

### Migración Manual con Drizzle

```bash
# Generar SQL desde el schema
npx drizzle-kit generate

# Aplicar directamente (desarrollo)
npx drizzle-kit push
```

## Testing

### Test de Integración

Crea `tests/integration/posts.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getPayload } from 'payload';
import config from '@/payload.config';

describe('Posts Collection', () => {
  it('should create a post', async () => {
    const payload = await getPayload({ config });

    const post = await payload.create({
      collection: 'posts',
      data: {
        title: 'Test Post',
        content: 'Test content',
        status: 'draft',
      },
    });

    expect(post.title).toBe('Test Post');
  });
});
```

## Troubleshooting

### Error: Mismatching Payload dependency versions

**Síntoma:**

```
Error: Mismatching "payload" dependency versions found: @payloadcms/plugin-cloud-storage@3.68.4 (Please change this to 3.68.5).
All "payload" packages must have the same version.
```

**Causa:**
Payload CMS requiere que **todas** las dependencias `@payloadcms/*` y `payload` tengan exactamente la misma versión. Cuando Dependabot u otra herramienta actualiza solo algunas de ellas, se produce este error.

**Solución:**

1. **Identificar las versiones:**

   ```bash
   grep -E '"(@payloadcms/|payload)' package.json
   ```

2. **Actualizar todas a la misma versión:**
   Edita `package.json` y asegúrate de que todas las dependencias de Payload tengan la misma versión (sin `^` o `~`):

   ```json
   {
     "dependencies": {
       "@payloadcms/db-sqlite": "3.68.5",
       "@payloadcms/next": "3.68.5",
       "@payloadcms/richtext-lexical": "3.68.5",
       "@payloadcms/storage-s3": "3.68.5",
       "@payloadcms/ui": "3.68.5",
       "payload": "3.68.5"
     }
   }
   ```

3. **Reinstalar dependencias:**

   ```bash
   pnpm install
   ```

4. **Verificar:**
   ```bash
   pnpm dev
   ```

**Prevención:**
El proyecto ya está configurado con Dependabot para agrupar todas las actualizaciones de Payload en un solo PR. Esto previene desajustes de versiones.

Si necesitas actualizar Payload manualmente:

```bash
# Actualizar todas las dependencias de Payload a la última versión
pnpm update @payloadcms/db-sqlite @payloadcms/next @payloadcms/richtext-lexical @payloadcms/storage-s3 @payloadcms/ui payload

# O especificar una versión exacta
pnpm add @payloadcms/db-sqlite@3.69.0 @payloadcms/next@3.69.0 @payloadcms/richtext-lexical@3.69.0 @payloadcms/storage-s3@3.69.0 @payloadcms/ui@3.69.0 payload@3.69.0
```

### Error: Database connection issues

**Síntoma:**

```
Error: Failed to connect to database
```

**Solución:**

1. Verifica que las variables de entorno de Turso estén configuradas correctamente en `.env`
2. Asegúrate de que la base de datos existe en Turso
3. Verifica que el token de autenticación sea válido
4. Revisa la conectividad de red

### Error: R2 upload fails

**Síntoma:**
Los archivos no se suben a Cloudflare R2.

**Solución:**

1. Verifica las credenciales de R2 en `.env`
2. Asegúrate de que el bucket existe
3. Verifica los permisos del token de acceso
4. Revisa los logs del servidor para más detalles

### Dependabot crea demasiados PRs

**Síntoma:**
Recibes muchos PRs individuales de Dependabot.

**Solución:**
El proyecto ya está configurado con agrupación de dependencias en `.github/dependabot.yml`. Si aún recibes muchos PRs:

1. Ajusta los grupos en `dependabot.yml`
2. Reduce `open-pull-requests-limit`
3. Cambia el intervalo de actualización de `weekly` a `monthly`

## Recursos Adicionales

- [Payload Collections](https://payloadcms.com/docs/configuration/collections)
- [Payload Fields](https://payloadcms.com/docs/fields/overview)
- [Payload Access Control](https://payloadcms.com/docs/access-control/overview)
- [Payload Hooks](https://payloadcms.com/docs/hooks/overview)

---

**¡Feliz desarrollo! ** Si tienes preguntas, consulta la [documentación oficial](https://payloadcms.com/docs) o abre un issue.

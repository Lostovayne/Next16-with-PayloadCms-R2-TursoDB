import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

// Carga variables de entorno locales
dotenv.config();

export default defineConfig({
  schema: './src/collections/*.ts',
  out: './src/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

import { createClient } from '@libsql/client/web';

export function createTursoClient() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error('TURSO_DATABASE_URL is required');
  }

  if (!authToken) {
    throw new Error('TURSO_AUTH_TOKEN is required');
  }

  return createClient({
    url,
    authToken,
  });
}

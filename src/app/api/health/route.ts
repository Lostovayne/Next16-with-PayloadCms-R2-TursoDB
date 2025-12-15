import { NextResponse } from 'next/server';

/**
 * Health Check Endpoint
 * Usado por Docker healthcheck y monitoring
 */
export async function GET() {
  try {
    // Verificaciones básicas
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
    };

    // Retornar status 200 OK
    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    // Si hay error, retornar 503 Service Unavailable
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}

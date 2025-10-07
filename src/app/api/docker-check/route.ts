import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if we're in Alpine Linux (Docker container)
    const fs = await import('fs');
    const osRelease = fs.readFileSync('/etc/os-release', 'utf8');
    const isAlpine = osRelease.includes('Alpine');

    // Check Docker environment variables
    const dockerEnvVars = {
      HOSTNAME: process.env.HOSTNAME,
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    };

    // Log to console (will appear in Render logs)
    console.log('🐳 Docker Verification:', {
      isDocker: isAlpine,
      osInfo: osRelease
        .split('\n')
        .find((line) => line.startsWith('PRETTY_NAME'))
        ?.split('=')[1]
        ?.replace(/"/g, ''),
      environment: dockerEnvVars,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      isDocker: isAlpine,
      osInfo: osRelease
        .split('\n')
        .find((line) => line.startsWith('PRETTY_NAME'))
        ?.split('=')[1]
        ?.replace(/"/g, ''),
      environment: dockerEnvVars,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log('🐳 Docker check failed:', error);
    return NextResponse.json({
      isDocker: false,
      error: 'Could not verify Docker environment',
      environment: {
        HOSTNAME: process.env.HOSTNAME,
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
      },
    });
  }
}

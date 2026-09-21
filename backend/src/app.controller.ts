import { Controller, Get, Header } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  @Header('Content-Type', 'text/html; charset=utf-8')
  root() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Garnacheros API</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
      color: #1f2937;
    }
    .card {
      text-align: center;
      padding: 2.5rem 3rem;
      border-radius: 1rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      background: white;
    }
    h1 { font-size: 2.5rem; margin: 0 0 0.5rem; }
    p { color: #6b7280; margin: 0 0 1.5rem; }
    .badge {
      display: inline-block;
      padding: 0.35rem 0.9rem;
      border-radius: 999px;
      background: #dcfce7;
      color: #166534;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    a {
      color: #ea580c;
      text-decoration: none;
      font-weight: 600;
    }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🌮 Garnacheros API</h1>
    <div class="badge">✓ Funcionando correctamente</div>
    <p>La API está lista para recibir peticiones.</p>
    <a href="/api/spots">Ver puestos disponibles →</a>
  </div>
</body>
</html>`;
  }

  @Get('/health')
  health() {
    return { status: 'ok' };
  }
}

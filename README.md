# 🌮 Garnacheros

Sitio web para calificar y descubrir los mejores puestos de comida callejera en CDMX y Aguascalientes.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: Neon (Postgres serverless)
- **Auth**: Clerk
- **Deployment**: Docker + Nginx

## Requisitos

- Node.js 22+
- Docker Desktop
- Cuentas en Clerk y Neon (opcionales para desarrollo local)

## Desarrollo local

### 1. Configurar variables de entorno

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/garnacheros
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env.local`):
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3001/api
```

### 2. Instalar dependencias

```bash
cd frontend && npm install
cd ../backend && npm install
```

### 3. Ejecutar con Docker Compose

```bash
docker-compose up
```

Frontend estará disponible en `http://localhost`
Backend estará disponible en `http://localhost:3001`

### 4. Seedear datos

```bash
cd backend
npm run seed
```

## Producción

### Preparar VPS

```bash
# En tu VPS
docker login
docker pull [tu-registry]/garnacheros-web:latest
docker pull [tu-registry]/garnacheros-api:latest

# Crear archivo .env con variables de producción
cat > .env << EOF
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=...
VITE_CLERK_PUBLISHABLE_KEY=...
DOMAIN=garnacheros.technoapps.agency
EOF

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### SSL con Let's Encrypt

```bash
# Instalar Certbot en el VPS
sudo apt update && sudo apt install certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --standalone -d garnacheros.technoapps.agency

# Actualizar nginx.conf y reiniciar
```

## Estructura del proyecto

```
/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── db.ts       # Conexión a Neon
│   │   │   ├── schema.ts   # Migraciones
│   │   │   └── seed.ts     # Datos iniciales
│   │   ├── routes/
│   │   │   ├── spots.ts    # GET /api/spots
│   │   │   └── reviews.ts  # POST/DELETE /api/reviews
│   │   ├── middleware/
│   │   │   └── auth.ts     # Middleware de Clerk
│   │   └── index.ts        # App principal
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── SpotsList.tsx
│   │   │   ├── SpotCard.tsx
│   │   │   └── SpotDetail.tsx
│   │   ├── api/
│   │   │   └── client.ts   # Cliente HTTP
│   │   ├── App.tsx
│   │   └── index.css
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml      # Desarrollo
├── docker-compose.prod.yml # Producción
└── README.md
```

## Features

- ✅ Autenticación con Clerk
- ✅ Listado de 20+ puestos de comida callejera
- ✅ Filtrar por ciudad (CDMX / Aguascalientes)
- ✅ Búsqueda por nombre, tipo de comida o colonia
- ✅ Dejar reseñas y calificaciones (1-5 estrellas)
- ✅ Ver promedio de calificación por puesto
- ✅ Eliminar tus propias reseñas
- ✅ Interfaz responsive (móvil y desktop)
- ✅ Paleta de colores naranja/roja temática

## Notas

- Los datos iniciales se cargan desde `/backend/src/db/seed.ts` — incluyen puestos reales documentados en CDMX y Aguascalientes.
- El backend valida todos los tokens de Clerk antes de permitir crear/eliminar reseñas.
- El frontend usa Tailwind CSS para estilos — sin dependencias de librerías de UI.

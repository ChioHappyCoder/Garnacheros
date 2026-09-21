# 🌮 Garnacheros

<div align="center">

### Califica y descubre los mejores puestos de comida callejera en CDMX y Aguascalientes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-22+-43853D?logo=node.js&logoColor=white)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)](https://www.docker.com)

</div>

---

## 🛠️ Tech Stack

### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Clerk Auth](https://img.shields.io/badge/Clerk-Authentication-6C63FF?logo=clerk&logoColor=white)](https://clerk.com)

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-22+-43853D?logo=node.js&logoColor=white)](https://nodejs.org)
[![Nest.js](https://img.shields.io/badge/Nest.js-10.3-EA2845?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

### Database & Auth
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white)](https://postgresql.org)
[![Neon](https://img.shields.io/badge/Neon-Serverless-000000?logo=postgresql&logoColor=white)](https://neon.tech)
[![Clerk](https://img.shields.io/badge/Clerk-JWT%20Auth-6C63FF?logo=clerk&logoColor=white)](https://clerk.com)

### DevOps & Deployment
[![Docker](https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker&logoColor=white)](https://www.docker.com)
[![Docker Compose](https://img.shields.io/badge/Docker_Compose-Orchestration-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-009639?logo=nginx&logoColor=white)](https://nginx.org)
[![Let's Encrypt](https://img.shields.io/badge/Let's_Encrypt-SSL/TLS-60C659?logo=letsencrypt&logoColor=white)](https://letsencrypt.org)

---

## ⚡ Características

- ✨ **Autenticación moderna** con Clerk (OAuth + Email/Password)
- 🗺️ **20+ puestos** reales documentados en CDMX y Aguascalientes
- 🔍 **Búsqueda inteligente** por nombre, tipo de comida y colonia
- 🏙️ **Filtrado por ciudad** con un clic
- ⭐ **Sistema de reseñas** con calificación 1-5 estrellas
- 💬 **Comentarios personalizados** en cada reseña
- 📊 **Promedio dinámico** de calificaciones
- 📱 **Interfaz 100% responsive** (mobile-first)
- 🎨 **Paleta temática** naranja/roja inspirada en comida callejera
- 🚀 **Deployment dockerizado** listo para VPS
- 🔒 **CORS y validación JWT** en todos los endpoints

---

## 📁 Estructura del Proyecto

```
Garnacheros/
├── 📦 backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── db.ts           # Pool de conexión PostgreSQL
│   │   │   ├── schema.ts       # Migraciones SQL
│   │   │   └── seed.ts         # Datos iniciales (10 puestos)
│   │   ├── main.ts             # Bootstrap Nest.js
│   │   ├── app.module.ts       # Módulo raíz
│   │   ├── app.controller.ts   # Health check
│   │   ├── auth/
│   │   │   └── clerk.guard.ts  # Guard JWT de Clerk
│   │   ├── spots/
│   │   │   ├── spots.controller.ts
│   │   │   ├── spots.service.ts
│   │   │   └── spots.module.ts
│   │   ├── reviews/
│   │   │   ├── reviews.controller.ts
│   │   │   ├── reviews.service.ts
│   │   │   └── reviews.module.ts
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── database.provider.ts
│   │   ├── common/
│   │   │   └── types.ts        # Interfaces TypeScript
│   ├── Dockerfile              # Build multi-stage Node
│   ├── tsconfig.json           # ES2022 target + decorators
│   └── package.json
│
├── 🎨 frontend/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout + ClerkProvider
│   │   ├── page.tsx            # Login page
│   │   ├── health/
│   │   │   └── page.tsx        # Health check API
│   │   └── spots/
│   │       ├── page.tsx        # Lista de puestos
│   │       └── [id]/
│   │           └── page.tsx    # Detalle de puesto
│   ├── components/
│   │   ├── Header.tsx          # Nav + UserButton
│   │   ├── SpotsList.tsx       # Grid con filtros
│   │   ├── SpotCard.tsx        # Card individual
│   │   └── SpotDetail.tsx      # Vista detalle + reseñas
│   ├── lib/
│   │   └── api.ts              # Cliente axios + tipos
│   ├── styles/
│   │   └── globals.css         # Tailwind globals
│   ├── public/                 # Assets estáticos
│   ├── Dockerfile              # Build Next.js
│   ├── nginx.conf              # Config reverse proxy
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── 🐳 docker-compose.yml       # Dev (4 servicios: db, api, app, web)
├── 🐳 docker-compose.prod.yml  # Prod (VPS-ready con 4 servicios)
├── CLAUDE.md                   # Guía de desarrollo
├── .env.example                # Template variables
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Requisitos
- **Node.js** 22+
- **Docker** y **Docker Compose** (incluye PostgreSQL 16 Alpine)
- Cuenta en **Clerk** (gratuita)
- Cuenta en **Neon** (gratuita, para producción en VPS)

### 1️⃣ Configurar variables de entorno

**Crear `.env` en la raíz del proyecto** (usado por `docker-compose.yml` para `api` y `app`):
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```
⚠️ Estas claves se obtienen gratis en [dashboard.clerk.com](https://dashboard.clerk.com). `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` se usa como **build arg** de la imagen del frontend — si cambias su valor, hay que reconstruir con `docker-compose up -d --build app`, no basta con reiniciar.

**Crear `backend/.env`** (solo necesario si corres el backend fuera de Docker, ej. para `npm run seed` desde el host):
```bash
DATABASE_URL=postgresql://garnacheros:garnacheros_dev_password@localhost:5432/garnacheros
CLERK_SECRET_KEY=sk_test_xxxxx
PORT=3000
FRONTEND_URL=http://localhost
```

### 2️⃣ Instalar dependencias

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install
```

### 3️⃣ Ejecutar en desarrollo

```bash
docker-compose up --build
```

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend (directo)** | http://localhost:5173 | Next.js 14 |
| **App vía Nginx** | http://localhost | Frontend + API proxeados por nginx (puerto 80) |
| **Backend API** | http://localhost:3000 | REST API Nest.js |
| **Health** | http://localhost:3000/health | Estado del backend |
| **Database** | localhost:5432 | PostgreSQL 16 |

Los 4 contenedores (`db`, `api`, `app`, `web`) deben verse `healthy` en `docker-compose ps` (y en Docker Desktop) antes de continuar.

### 4️⃣ Conectar a la Base de Datos Local

**PostgreSQL 16 está corriendo en localhost:5432**

```bash
psql -h localhost -U garnacheros -d garnacheros
# Password: garnacheros_dev_password
```

**O usar desde Docker:**
```bash
docker-compose exec db psql -U garnacheros -d garnacheros
```

### 5️⃣ Seedear datos iniciales

```bash
cd backend
npm run seed
```

## 📊 Fuentes de Datos

### Datos Iniciales (10 Puestos)

Los datos iniciales se cargan desde `backend/src/db/seed.ts` y contienen puestos reales documentados:

| Ciudad | Puestos | Ejemplos |
|--------|---------|----------|
| **CDMX** | 5 | El Califa de León, El Tizoncito, Los Cocuyos, El Huequito, Orinoco |
| **Aguascalientes** | 5 | Lechón Rudy, Carnitas Mora, Las Planchitas, Lechón Pascualito, Taquería La Gloria |

### Fuentes de Datos (Futuro)

Los datos pueden enriquecerse desde:

1. **DENUE (INEGI)** — Base de datos oficial de negocios registrados en México
   - ✅ Gratuito, sin límite de consultas
   - ✅ Datos verificados por gobierno
   - 📍 Filtrado por giro: "restaurantes con servicio limitado"

2. **Google Places API** — Enriquecimiento de coordenadas, horarios, fotos
   - ⚠️ API pagada (pero crédito gratuito inicial ~$200 USD/mes)
   - 📍 Consultas únicas en seed script, NO en cada visita de usuario
   - 🔒 Nunca exponer API key en frontend

### Agregar Nuevos Puestos

**Opción 1: Editar `seed.ts` directamente**
```typescript
// backend/src/db/seed.ts
const SPOTS = [
  {
    name: "Mi Puesto",
    city: "CDMX",
    address: "Calle X 123",
    colonia: "Colonia",
    food_type: "Tacos",
    hours: "Mon-Sun 8am-11pm",
    description: "Descripción del puesto",
    image_url: "https://...",
  },
  // ... más puestos
];
```

**Opción 2: Script de importación desde DENUE/Google Places**
```bash
# En desarrollo futuro:
npm run import-denue --city CDMX --food-type tacos
npm run import-places --location "Aguascalientes"
```

---

## 🧪 Tests E2E (Playwright)

Suite de regresión que cubre health checks, CRUD de puestos/reseñas y auth:

```bash
npm install
npx playwright install --with-deps chromium
npm run test:e2e
```

Requiere los 4 contenedores corriendo (`docker-compose up -d`) y datos sembrados (`npm run seed`). Ver [`tests/e2e/`](tests/e2e/) y [`playwright.config.ts`](playwright.config.ts).

Para el historial de bugs encontrados y corregidos durante el desarrollo (gotchas de Docker, CORS, encoding, etc.), ver [`SDD.md`](SDD.md).

---

## 📦 Producción en VPS

### Deploy en tu servidor

```bash
# 1. SSH al VPS
ssh user@technoapps.agency

# 2. Clonar repo
git clone https://github.com/ChioHappyCoder/Garnacheros.git
cd Garnacheros

# 3. Crear archivo .env
cat > .env << EOF
DATABASE_URL=postgresql://user:password@neon.tech/garnacheros
CLERK_SECRET_KEY=sk_live_xxxxx
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
DOMAIN=garnacheros.technoapps.agency
EOF

# 4. Desplegar
docker-compose -f docker-compose.prod.yml up -d --build
```

### Configurar SSL (Let's Encrypt)

```bash
sudo apt update && sudo apt install -y certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --standalone -d garnacheros.technoapps.agency

# Actualizar nginx.conf con rutas de certificado
# Reiniciar contenedor web
docker-compose -f docker-compose.prod.yml restart web
```

---

## 🔌 API Endpoints

### Puestos (Sin autenticación)
```
GET  /api/spots                    # Listar todos con filtros
GET  /api/spots?city=CDMX&search=tacos
GET  /api/spots/:id                # Detalle con reseñas
```

### Reseñas (Requiere JWT de Clerk)
```
POST   /api/reviews/:spotId        # Crear reseña (autenticado)
DELETE /api/reviews/:id            # Eliminar reseña (solo autor)
```

---

## 💾 Base de Datos

### Tablas

**`spots`**
```sql
id (PK)
name, city, address, colonia, food_type, hours
description, image_url
latitude, longitude
created_at
```

**`reviews`**
```sql
id (PK)
spot_id (FK → spots)
user_id (Clerk ID)
rating (1-5)
comment
created_at
```

---

## 🎨 Diseño & UX

- **Paleta de colores**: Naranjas y rojos inspirados en comida callejera
- **Typography**: Sans-serif limpia y legible
- **Responsive**: Mobile-first, optimizado para pantallas pequeñas
- **Animaciones**: Hover effects sutiles, transiciones suave
- **Accesibilidad**: Semántica HTML, contrast ratios WCAG AA

---

## 🔐 Seguridad

✅ **Validación JWT** en todos los endpoints protegidos  
✅ **CORS configurado** para dominios permitidos  
✅ **SQL parameterizado** contra inyecciones  
✅ **Autorización granular** (solo eliminar propias reseñas)  
✅ **Variables de entorno** nunca en el código  
✅ **HTTPS/TLS** en producción con Let's Encrypt  

---

## 📝 Licencia

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este proyecto está bajo licencia MIT. Ver [`LICENSE`](./LICENSE) para más detalles.

---

## 👨‍💻 Desarrollo

```bash
# Formato de commits
git commit -m "feat: Descripción de la feature"
git commit -m "fix: Descripción del bug fix"
git commit -m "docs: Actualización de documentación"
```

---

## 📚 Recursos

- [NextJS Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [NestJS Documentation](https://docs.nestjs.com)
- [PostgreSQL 16 Docs](https://www.postgresql.org/docs/16)
- [Neon PostgreSQL](https://neon.tech/docs)
- [Clerk Authentication](https://clerk.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices)
- [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

### Hecho con ❤️ para los amantes de la comida callejera

**[Visitar sitio](https://garnacheros.technoapps.agency)** • **[Reportar bug](https://github.com/ChioHappyCoder/Garnacheros/issues)** • **[Sugerir feature](https://github.com/ChioHappyCoder/Garnacheros/discussions)**

</div>

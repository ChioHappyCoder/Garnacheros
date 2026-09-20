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
│   │   │   ├── db.ts           # Pool de conexión Neon
│   │   │   ├── schema.ts       # Migraciones SQL
│   │   │   └── seed.ts         # Datos iniciales (10 puestos)
│   │   ├── routes/
│   │   │   ├── spots.ts        # GET /api/spots, GET /api/spots/:id
│   │   │   └── reviews.ts      # POST/DELETE /api/reviews
│   │   ├── middleware/
│   │   │   └── auth.ts         # Validación JWT de Clerk
│   │   ├── types.ts            # Extensión Express Request
│   │   └── index.ts            # App principal Express
│   ├── Dockerfile              # Build multi-stage Node
│   ├── tsconfig.json           # ES2022 target
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
├── 🐳 docker-compose.yml       # Dev (3 servicios: api, app, web)
├── 🐳 docker-compose.prod.yml  # Prod (VPS-ready)
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

**Crear `backend/.env`:**
```bash
CLERK_SECRET_KEY=sk_test_xxxxx
PORT=3001
FRONTEND_URL=http://localhost:3000
# DATABASE_URL se genera automáticamente en docker-compose.yml
```

**Crear `frontend/.env.local`:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_API_URL=http://localhost:3001/api
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
| **Frontend** | http://localhost | Interfaz Next.js (via Nginx) |
| **Backend** | http://localhost:3001 | REST API Nest.js |
| **Health** | http://localhost/health | Estado de servicios (Nginx) |
| **Database** | localhost:5432 | PostgreSQL 16 |

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

Esto cargará 10 puestos reales:
- 🏪 El Califa de León (CDMX) ⭐ Estrella Michelin
- 🏪 Lechón Rudy (Aguascalientes)
- 🏪 Carnitas Mora (Aguascalientes)
- 🏪 Las Planchitas (Aguascalientes)
- ...y 6 más

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

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Neon PostgreSQL](https://neon.tech)
- [Clerk Authentication](https://clerk.com/docs)
- [Docker Best Practices](https://docs.docker.com)
- [Tailwind CSS](https://tailwindcss.com)

---

<div align="center">

### Hecho con ❤️ para los amantes de la comida callejera

**[Visitar sitio](https://garnacheros.technoapps.agency)** • **[Reportar bug](https://github.com/ChioHappyCoder/Garnacheros/issues)** • **[Sugerir feature](https://github.com/ChioHappyCoder/Garnacheros/discussions)**

</div>

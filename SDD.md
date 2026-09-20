# Software Design Document (SDD)
## Garnacheros — Plataforma de Calificación y Reseñas

**Versión:** 2.0  
**Fecha:** 2026-09-20 (Nest.js Refactor)  
**Proyecto:** Garnacheros — Califica y descubre puestos de comida callejera  
**Publicado en:** https://github.com/ChioHappyCoder/Garnacheros  

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Base de Datos](#base-de-datos)
5. [API REST](#api-rest)
6. [Autenticación](#autenticación)
7. [Frontend](#frontend)
8. [Deployment](#deployment)
9. [Guía de Replicación](#guía-de-replicación)

---

## Descripción General

**Garnacheros** es una plataforma fullstack que permite a usuarios:
- ✅ Autenticarse con OAuth (Clerk)
- ✅ Buscar puestos de comida callejera filtrados por ciudad/tipo de comida
- ✅ Ver detalle completo de cada puesto (ubicación, horarios, fotos)
- ✅ Dejar reseñas con calificación 1-5 estrellas y comentarios
- ✅ Ver reseñas de otros usuarios y promedio de calificación

**Dominio:** https://garnacheros.technoapps.agency  
**Repositorio Público:** https://github.com/ChioHappyCoder/Garnacheros

### Caso de Uso Principal

```
Usuario → Login (Clerk OAuth) → Ver lista de puestos
       → Filtrar por ciudad/búsqueda → Seleccionar puesto
       → Ver detalles + reseñas existentes
       → Dejar nueva reseña (rating + comentario)
       → Ver promedio actualizado en tiempo real
```

---

## Stack Tecnológico

### Frontend
| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework | Next.js | 14+ | App Router, SSR/SSG, mejor para SEO y carga inicial |
| Lenguaje | TypeScript | 5.3 | Tipado estricto, menos bugs en producción |
| Estilos | Tailwind CSS | 3.3 | Utility-first, rápido, fácil de personalizar |
| Autenticación | Clerk (@clerk/nextjs) | 5.0 | OAuth integrado, manejo de sesiones seguro |
| HTTP Client | Axios | 1.6 | Manejo de headers, tokens, interceptores |
| Build | Next.js Built-in | — | Zero config, optimización automática |
| Runtime | Node.js | 22 | LTS, mejor rendimiento, soporte ESM |

### Backend
| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Framework | Nest.js | 10.3 | Arquitectura modular, inyección de dependencias, TypeScript first |
| Lenguaje | TypeScript | 5.3 | Tipado estricto, decoradores, mejor mantenibilidad |
| Base de Datos | PostgreSQL | 16 (dev), Neon (prod) | Serverless en prod, Alpine en dev local |
| Driver SQL | pg | 8.23 | Queries parameterizadas, previene SQL injection |
| Autenticación | @clerk/clerk-sdk-node | 4.13 | Validación JWT en guards, middleware nativo |
| Variables | dotenv | 18.0 | Carga segura de secretos desde .env |
| Runtime | Node.js | 22 | LTS, mejor rendimiento, soporte CommonJS/ESM |

### DevOps
| Componente | Tecnología | Versión | Justificación |
|------------|-----------|---------|---------------|
| Containerización | Docker | 24+ | Reproducible, portable, escalable |
| Orquestación | Docker Compose | 2.0+ | Coordina 4 servicios (api, app, web, db) |
| Database Container | PostgreSQL Alpine | 16 | Mismo que VPS, lightweight, reproducible |
| Reverse Proxy | Nginx | Alpine | Lightweight, rápido, enrutamiento eficiente |
| SSL/TLS | Let's Encrypt | Gratis | HTTPS automático, renovación gratis |
| VPS | Debian 12 / Ubuntu 24 LTS | — | Compatible con Docker Engine 24+ |

---

## Arquitectura

### Diagrama General

```
┌─────────────────┐
│    Browser      │ (Usuario autenticado con Clerk)
└────────┬────────┘
         │
    ┌────▼─────────────────────┐
    │  Nginx Reverse Proxy      │ (puerto 80/443)
    │  • Sirve frontend         │
    │  • Proxea /api/* a backend│
    └────┬──────────┬───────────┘
         │          │
    ┌────▼──┐  ┌───▼──────────────┐
    │Next.js│  │   Nest.js API    │
    │  App  │  │  (Modules +      │
    │(3000) │  │   Controllers)   │ (puerto 3001)
    └──┬────┘  └────┬──────────────┘
       │            │
       │     ┌──────▼────────────┐
       │     │ Neon PostgreSQL   │
       │     │ (Cloud Database)  │
       │     └───────────────────┘
       │
       └─────────────┬──────────────┐
            ┌────────▼────────┐    ┌▼──────────┐
            │  Clerk API      │    │ Google    │
            │ (OAuth/JWT)     │    │ Places API│
            └─────────────────┘    │(optional) │
                                   └───────────┘
```

### Flujo de Datos

#### 1. Autenticación
```
User accede /spots
→ Next.js verifica auth (Clerk middleware)
→ Si no autenticado → Redirect a /  (login page)
→ Si autenticado → Muestra lista de puestos
```

#### 2. Cargar Lista de Puestos
```
Frontend (GET /api/spots?city=CDMX&search=tacos)
→ Nginx proxea a Backend
→ Backend valida JWT de Clerk
→ Backend queryea PostgreSQL
→ Retorna JSON con [spots]
→ Frontend renderiza grid de SpotCards
```

#### 3. Crear Reseña
```
User selecciona rating (5 estrellas) + comentario
→ Frontend (POST /api/reviews/spotId)
  con header Authorization: Bearer {JWT}
→ Nginx proxea a Backend
→ Backend valida JWT → extrae user_id de Clerk
→ Backend inserta en tabla reviews
→ Backend retorna la reseña creada
→ Frontend recarga detalles del puesto
→ Promedio de rating se actualiza en tiempo real
```

---

## Base de Datos

### Schema PostgreSQL (Neon)

#### Tabla: `spots`
```sql
CREATE TABLE spots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  colonia VARCHAR(255),
  food_type VARCHAR(100),
  hours VARCHAR(255),
  description TEXT,
  image_url TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_spots_city ON spots(city);
CREATE INDEX idx_spots_food_type ON spots(food_type);
```

#### Tabla: `reviews`
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  spot_id INTEGER NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  user_id VARCHAR(255) NOT NULL,  -- Clerk user ID
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_spot_id ON reviews(spot_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
```

### Inicialización de Datos

**Desarrollo local (Docker):**
- PostgreSQL 16 se crea automáticamente en docker-compose.yml
- Usuario: `garnacheros`, Password: `garnacheros_dev_password`
- Base de datos: `garnacheros`
- Volumen: `postgres_data` (persistencia entre restarts)

**Cargar datos iniciales:**
Script `backend/src/db/seed.ts`:
```bash
npm run seed
# Carga 10-30 puestos reales en PostgreSQL
```

**En producción (VPS):**
- Database: Neon PostgreSQL Serverless
- Conexión: `DATABASE_URL` desde .env en VPS
- Scripts se ejecutan con `npm run seed` tras deploy

---

## API REST

### Endpoints Públicos (sin autenticación)

#### GET /api/spots
Listar puestos con filtros

**Query Params:**
```
?city=CDMX&search=tacos
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "El Califa de León",
    "city": "CDMX",
    "address": "Calle Ayuntamiento 21, Centro",
    "colonia": "Centro",
    "food_type": "Garnachas",
    "hours": "18:00-02:00",
    "image_url": "https://...",
    "avg_rating": 4.8,
    "review_count": 15
  }
]
```

#### GET /api/spots/:id
Obtener detalle completo de un puesto + reseñas

**Response (200):**
```json
{
  "id": 1,
  "name": "El Califa de León",
  "...": "...",
  "reviews": [
    {
      "id": 101,
      "user_id": "user_123",
      "rating": 5,
      "comment": "¡Excelente! Muy fresco y delicioso",
      "created_at": "2026-09-20T14:30:00Z"
    }
  ]
}
```

### Endpoints Protegidos (requieren Clerk JWT)

#### POST /api/reviews/:spotId
Crear una nueva reseña

**Headers:**
```
Authorization: Bearer {CLERK_JWT_TOKEN}
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Muy rico, recomendado"
}
```

**Response (201):**
```json
{
  "id": 102,
  "user_id": "user_123",
  "rating": 5,
  "comment": "Muy rico, recomendado",
  "created_at": "2026-09-20T15:45:00Z"
}
```

#### DELETE /api/reviews/:id
Eliminar reseña (solo el autor)

**Headers:**
```
Authorization: Bearer {CLERK_JWT_TOKEN}
```

**Response (204):** (sin body)

**Validación:** Backend verifica `req.auth.userId === review.user_id`

---

## Autenticación

### Flujo Clerk OAuth

```
1. Usuario entra a garnacheros.technoapps.agency
   ↓
2. Clerk SignInButton redirige a Clerk hosted UI
   ↓
3. Usuario login con Google/Email/GitHub
   ↓
4. Clerk retorna JWT en sessionStorage (browser)
   ↓
5. Clerk middleware (Next.js) valida JWT
   ↓
6. Frontend puede:
   - Usar useAuth() hook para obtener token
   - Incluir Authorization: Bearer {token} en requests al backend
   ↓
7. Backend valida JWT con Clerk SDK (@clerk/clerk-sdk-node)
   ↓
8. user_id se extrae del JWT y se usa para autorizar acciones
```

### Seguridad
- ✅ Tokens JWT firmados por Clerk (imposible falsificar)
- ✅ Validación JWT en Guards de Nest.js (ClerkAuthGuard)
- ✅ CORS configurado solo para dominios permitidos
- ✅ SQL parameterizado (pg driver previene SQL injection)
- ✅ Secretos en .env (nunca en código)
- ✅ HTTPS/TLS en producción (Let's Encrypt)
- ✅ Tipado estricto en TypeScript (no `any` permitidos)

---

## Arquitectura del Backend (Nest.js)

### Estructura de Módulos

Nest.js organiza el código en **módulos** con inyección de dependencias:

```
src/
├── main.ts                    # Punto de entrada, bootstrap
├── app.module.ts              # Módulo raíz, importa otros módulos
├── app.controller.ts          # Health check controller
│
├── database/
│   ├── database.module.ts     # Módulo de DB
│   └── database.provider.ts   # Proveedor Pool PostgreSQL
│
├── auth/
│   └── clerk.guard.ts         # Guard para autenticación JWT
│
├── spots/
│   ├── spots.module.ts        # Módulo de spots
│   ├── spots.controller.ts    # Rutas GET /api/spots
│   └── spots.service.ts       # Lógica de negocios
│
├── reviews/
│   ├── reviews.module.ts      # Módulo de reviews
│   ├── reviews.controller.ts  # Rutas POST/DELETE /api/reviews
│   └── reviews.service.ts     # Lógica de negocios
│
├── common/
│   └── types.ts               # Interfaces compartidas
│
└── db/
    ├── db.ts                  # Pool de conexión
    ├── schema.ts              # Migraciones SQL
    └── seed.ts                # Data seeding
```

### Flujo de Dependencias

1. **AppModule** importa DatabaseModule, SpotsModule, ReviewsModule
2. **DatabaseModule** proporciona Pool PostgreSQL (DATABASE_CONNECTION)
3. **SpotsModule** inyecta DatabaseModule para acceder a la base de datos
4. **ReviewsModule** inyecta DatabaseModule + ClerkAuthGuard para autorización
5. **Controllers** manejan rutas y usan services
6. **Services** manejan lógica de negocio y queries SQL

### Patrón de Autorización

```typescript
@Controller('api/reviews')
export class ReviewsController {
  @Post(':spotId')
  @UseGuards(ClerkAuthGuard)  // Guard valida JWT
  async create(@Request() req: any) {
    // req.auth.userId está garantizado por el guard
  }
}
```

---

## Frontend

### Estructura Next.js App Router

```
app/
├── layout.tsx           # Root layout, ClerkProvider
├── page.tsx             # Login page (/ ruta)
├── health/
│   └── page.tsx         # Healthcheck visual
└── spots/
    ├── page.tsx         # Lista de puestos (protegida)
    └── [id]/
        └── page.tsx     # Detalle puesto (protegida)

components/
├── Header.tsx           # Nav bar + UserButton Clerk
├── SpotsList.tsx        # Client component, filtros + grid
├── SpotCard.tsx         # Individual spot card
└── SpotDetail.tsx       # Client component, reseñas + form

lib/
└── api.ts               # Cliente HTTP axios + tipos
```

### Componentes Clave

**Header.tsx**
- Logo + Link a /spots
- UserButton de Clerk (avatar + logout)
- Sticky, z-50

**SpotsList.tsx** (Client component)
- Input search (setState en tiempo real)
- Botones filtro ciudad (all, CDMX, Aguascalientes)
- Grid 3 columnas (lg), 2 (md), 1 (sm)
- Loading state

**SpotCard.tsx**
- Image, nombre, tipo comida, colonia
- Rating stars + número reseñas
- Click → Link a /spots/[id]
- Hover effect (scale 105)

**SpotDetail.tsx** (Client component)
- Imagen grande
- Detalles: colonia, ciudad, dirección, horarios
- Rating promedio + count
- Form para crear reseña (star picker + textarea)
- Listado de reseñas existentes (solo si autenticado)
- Botón eliminar en cada reseña (si es autor)

### Paleta de Colores

```js
// tailwind.config.js
colors: {
  primary: {
    500: '#f97316',  // Orange (Tailwind orange-500)
    600: '#ea580c',
    700: '#c2410c',
  }
}
```

Tema inspirado en comida callejera (naranja/rojo).

---

## Deployment

### Requisitos del VPS

```
- OS: Debian 12 / Ubuntu 22.04+
- RAM: 2GB mínimo (4GB recomendado)
- Disk: 20GB SSD
- Docker: 24+
- Docker Compose: 2.0+
```

### Paso a Paso

#### 1. Provisionar Servidor

```bash
# SSH al VPS
ssh user@technoapps.agency

# Instalar Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. Clonar Repositorio

```bash
cd /opt
sudo git clone https://github.com/ChioHappyCoder/Garnacheros.git
cd Garnacheros
sudo chown -R $USER:$USER .
```

#### 3. Crear Archivos de Configuración

```bash
# Crear .env con secretos reales
cat > .env << EOF
# Base de datos (obtener de Neon console)
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/garnacheros?sslmode=require

# Clerk (obtener de dashboard.clerk.com)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx

# API (interno)
NEXT_PUBLIC_API_URL=https://garnacheros.technoapps.agency/api
EOF

# Proteger archivo
chmod 600 .env
```

#### 4. Generar SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt update && sudo apt install -y certbot python3-certbot-nginx

# Generar certificado
sudo certbot certonly --standalone \
  -d garnacheros.technoapps.agency \
  --email admin@technoapps.agency \
  --agree-tos \
  --non-interactive

# Certificados estarán en:
# /etc/letsencrypt/live/garnacheros.technoapps.agency/
```

#### 5. Actualizar Nginx para SSL

```nginx
# frontend/nginx.conf (producción)

server {
  listen 443 ssl http2;
  server_name garnacheros.technoapps.agency;

  ssl_certificate /etc/letsencrypt/live/garnacheros.technoapps.agency/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/garnacheros.technoapps.agency/privkey.pem;

  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;

  # ... resto de config ...
}

# Redirect HTTP → HTTPS
server {
  listen 80;
  server_name garnacheros.technoapps.agency;
  return 301 https://$server_name$request_uri;
}
```

#### 6. Montar Certificados en Docker

```bash
# docker-compose.prod.yml
volumes:
  - /etc/letsencrypt:/etc/letsencrypt:ro
```

#### 7. Levantar Servicios

```bash
docker-compose -f docker-compose.prod.yml up -d --build

# Verificar
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs -f
```

#### 8. Seedear Base de Datos (primera ejecución)

```bash
docker exec garnacheros_api npm run seed
```

#### 9. Configurar Renovación Automática de SSL

```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Verificar
sudo systemctl status certbot.timer
```

---

## Guía de Replicación

### Para Crear tu Propio Proyecto (otro tema)

Este proyecto está diseñado para ser **reutilizable con otro dominio/tema**. Aquí está el paso a paso:

### 1. Fork del Repositorio

```bash
# En GitHub, fork: https://github.com/ChioHappyCoder/Garnacheros

# En local
git clone https://github.com/TU_USUARIO/TU_PROYECTO.git
cd TU_PROYECTO
```

### 2. Customizar Tema

**Cambia el dominio y nombres:**

| Archivo | Cambio |
|---------|--------|
| README.md | Título, descripción, dominio |
| CLAUDE.md | Nombre proyecto, stack |
| docker-compose.yml | Nombres servicios, puertos |
| frontend/app/layout.tsx | Metadata (title, description) |
| frontend/components/Header.tsx | Logo/título |
| frontend/styles/globals.css | Colores (Tailwind) |
| backend/src/db/seed.ts | Datos iniciales |

**Ejemplo: Cambiar de "Garnacheros" a "RestaurantReviews"**

```bash
# frontend/components/Header.tsx
- <h1 className="text-2xl font-bold text-orange-600">🌮 Garnacheros</h1>
+ <h1 className="text-2xl font-bold text-blue-600">⭐ RestaurantReviews</h1>
```

### 3. Crear Cuentas de Servicios Externos

- **Clerk**: Sign up en https://clerk.com
  - Crear aplicación
  - Copiar CLERK_SECRET_KEY y NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  
- **Neon**: Sign up en https://neon.tech
  - Crear proyecto PostgreSQL
  - Copiar DATABASE_URL

### 4. Configurar Variables de Entorno

```bash
# .env
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_URL=http://localhost/api
```

### 5. Instalar Dependencias y Testear Localmente

```bash
# Frontend
cd frontend && npm install

# Backend
cd ../backend && npm install

# Levantar
docker-compose up --build

# Ver en http://localhost
```

### 6. Seedear Datos

```bash
# Actualizar backend/src/db/seed.ts con tus datos
# Luego:
docker exec garnacheros_api npm run seed
```

### 7. Deploy a VPS

Seguir la sección [Deployment](#deployment) de este SDD.

---

## Recursos Adicionales

- **Clerk Docs**: https://clerk.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Express Guide**: https://expressjs.com
- **Tailwind CSS**: https://tailwindcss.com
- **Docker Compose**: https://docs.docker.com/compose

---

**Última actualización:** 2026-09-20  
**Versión:** 1.0  
**Licencia:** MIT

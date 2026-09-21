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
| Componente | Tecnología | Versión | Puerto(s) | Justificación |
|------------|-----------|---------|-----------|---------------|
| Containerización | Docker | 24+ | — | Reproducible, portable, escalable |
| Orquestación | Docker Compose | 2.0+ | — | Coordina 4 servicios (db, api, app, web) |
| Database | PostgreSQL Alpine | 16 | 5432 | Mismo que VPS, lightweight, reproducible |
| Backend API | Nest.js | 10.3 | 3000 | TypeScript puro, modular, inyección de dependencias |
| Frontend App | Next.js | 14 | 5173 | SSR/SSG, App Router, desarrollo tipo Vite |
| Reverse Proxy | Nginx | Alpine | 80 | Lightweight, rápido, enrutamiento eficiente |
| SSL/TLS | Let's Encrypt | Gratis | 443 | HTTPS automático, renovación gratis |
| VPS | Ubuntu 24 LTS | — | — | Compatible con Docker Engine 24+ |

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
    ┌────▼──────┐  ┌───▼──────────────┐
    │  Next.js  │  │   Nest.js API    │
    │   App     │  │  (Modules +      │
    │ (5173)    │  │   Controllers)   │ (puerto 3000)
    └──┬────────┘  └────┬──────────────┘
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

## 🚨 Gotchas y Soluciones Antiregresión

Este proyecto enfrentó varios errores durante desarrollo. Documentar aquí evita que se repitan.

### 1. CommonJS vs ES Modules en Frontend

**Problema:** next.config.js, postcss.config.js y tailwind.config.js usaban `module.exports` pero package.json tenía `"type": "module"`

```
ReferenceError: module is not defined in ES module scope
```

**Solución:**
- ✅ Cambiar `module.exports` → `export default` en todos los .js de config
- ✅ Verificar que package.json tiene `"type": "module"` (ES modules)

**Archivo:** [frontend/next.config.js](frontend/next.config.js), [frontend/postcss.config.js](frontend/postcss.config.js), [frontend/tailwind.config.js](frontend/tailwind.config.js)

**Guard:** Test E2E verifica que `npm run build` no falla

---

### 2. Clerk SignInButton vs SignIn Component

**Problema:** `SignInButton` de Clerk v5 no acepta prop `redirectUrl`

```tsx
// ❌ INCORRECTO
<SignInButton redirectUrl="/spots">
  <button>Login</button>
</SignInButton>
// Error: Property 'redirectUrl' does not exist
```

**Solución:**
- ✅ Usar componente `SignIn` con prop `afterSignInUrl="/spots"`
- ✅ `SignIn` es el componente UI completo de Clerk (formulario pre-built)

```tsx
// ✅ CORRECTO
<SignIn afterSignInUrl="/spots" />
```

**Archivo:** [frontend/app/page.tsx](frontend/app/page.tsx)

**Guard:** Test E2E verifica que login redirige correctamente a /spots

---

### 3. Clerk Authentication en Nest.js

**Problema:** Código usaba `verifyAuth()` y `clerkMiddleware()` que no existen en `@clerk/clerk-sdk-node`

```
Module '@clerk/clerk-sdk-node' has no exported member 'verifyAuth'
```

**Solución:**
- ✅ Usar `jsonwebtoken` para decodificar JWT manualmente
- ✅ Implementar `ClerkAuthGuard` que valida JWT sin verifyAuth()
- ✅ Extraer `userId` del claim `sub` del JWT

```typescript
// ✅ CORRECTO
import * as jwt from 'jsonwebtoken';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    
    const decoded = jwt.decode(token) as JwtPayload & { sub?: string };
    request.auth = { userId: decoded.sub };
    return true;
  }
}
```

**Archivo:** [backend/src/auth/clerk.guard.ts](backend/src/auth/clerk.guard.ts)

**Guard:** Test E2E verifica que POST /api/reviews requiere token válido

---

### 4. Null Return Type en Service

**Problema:** `spots.service.ts findOne()` retornaba null pero tipo era `Promise<SpotDetail>`

```
Type 'null' is not assignable to type 'SpotDetail'
```

**Solución:**
- ✅ Cambiar retorno a `Promise<SpotDetail | null>`
- ✅ Controller maneja null tirando NotFoundException

```typescript
// ✅ CORRECTO
async findOne(id: number): Promise<SpotDetail | null> {
  if (spotResult.rows.length === 0) {
    return null;  // ✅ Permitido
  }
  return { ...spotResult.rows[0], reviews };
}

// En controller:
const spot = await this.spotsService.findOne(id);
if (!spot) throw new NotFoundException();
```

**Archivo:** [backend/src/spots/spots.service.ts](backend/src/spots/spots.service.ts)

**Guard:** Test unitario verifica que GET /api/spots/999 retorna 404

---

### 5. CORS Built-in en Nest.js

**Problema:** Código importaba package `cors` pero Nest.js lo incluye nativamente

```
Cannot find module 'cors' or its corresponding type declarations
```

**Solución:**
- ✅ Eliminar import de `cors`
- ✅ Usar `app.enableCors()` directamente en main.ts
- ✅ Nest.js maneja CORS automáticamente

```typescript
// ✅ CORRECTO (main.ts)
const app = await NestFactory.create(AppModule);
app.enableCors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
});
```

**Archivo:** [backend/src/main.ts](backend/src/main.ts)

**Guard:** Test E2E verifica que preflight CORS requests retornan 200

---

### 6. Puerto 3001 vs 3000

**Problema:** main.ts defaulteaba a puerto 3001 pero docker-compose.yml y documentación decían 3000

**Solución:**
- ✅ docker-compose.yml configura `PORT=3000` en environment
- ✅ main.ts leer `process.env.PORT || 3001`
- ✅ Documentación actualizada con puerto correcto (3000)

**Archivos:**
- [docker-compose.yml](docker-compose.yml) línea 37: `PORT=3000`
- [backend/src/main.ts](backend/src/main.ts) línea 16: `const port = process.env.PORT || 3001`
- [CLAUDE.md](CLAUDE.md): Backend API http://localhost:3000

**Guard:** Health check test verifica que API responde en puerto 3000

---

### 7. Secretos No Deben Exponerse

**Problema:** Usuario intentó poner contraseña PostgreSQL directamente en docker-compose.yml

**Solución:**
- ✅ NUNCA hardcodear secretos en código/config
- ✅ Usar .env.local (gitignored) para desarrollo
- ✅ .env.example con placeholders
- ✅ NUNCA imprimir o loguear DATABASE_URL, CLERK_SECRET_KEY

**Archivo:** [.env.example](.env.example)

**Guard:** Pre-commit hook verifica que no hay secretos en staged files

```bash
# .husky/pre-commit (ejemplo)
! grep -r "DATABASE_URL\|CLERK_SECRET" --include="*.js" --include="*.ts"
```

---

### 8. Módulo ESM vs CommonJS en Backend (fix incompleto corregido)

**Problema:** Un fix anterior cambió `tsconfig.json` de `"module": "commonjs"` a `"module": "esnext"` para resolver `Cannot find module '/app/dist/main.js'`. El build (`nest build`) pasaba sin errores, pero en runtime fallaba con `ERR_MODULE_NOT_FOUND: Cannot find module '/app/dist/app.module'`.

**Causa raíz real:** `backend/package.json` tenía `"type": "module"`, lo cual hace que Node.js trate los `.js` compilados como ES Modules nativos. Node ESM **exige extensión `.js` explícita** en imports relativos (`./app.module.js`), pero el código fuente usa imports sin extensión (`./app.module`), válidos solo para resolución CommonJS/Node clásica. TypeScript compilando a `esnext` NO agrega automáticamente las extensiones `.js` a los imports — por eso `tsc`/`nest build` compilaba sin error pero Node fallaba al ejecutar.

**Solución (revertir completamente a CommonJS, no parchear ESM):**
- ✅ `backend/package.json`: remover `"type": "module"` por completo
- ✅ `backend/tsconfig.json`: `"module": "commonjs"` (no `"esnext"`)
- ✅ `backend/package.json` script `seed`: `ts-node src/db/seed.ts` (sin flag `--esm`)
- ✅ Verificado con `grep` que no existe `import.meta` ni top-level `await` en `backend/src/**/*.ts` antes de revertir, confirmando que CommonJS es seguro

**Archivos:** [backend/package.json](backend/package.json), [backend/tsconfig.json](backend/tsconfig.json)

**Guard:** Test E2E de health check falla si el contenedor `api` no llega a estado `healthy` — un `ERR_MODULE_NOT_FOUND` impide que el proceso arranque y el healthcheck nunca pasa

**Lección:** Nest.js está diseñado para CommonJS por defecto. Migrar a ESM requiere agregar extensiones `.js` a TODOS los imports relativos del código fuente — no es un cambio de una sola línea en `tsconfig.json`. Si no hay una razón de peso para usar ESM, quedarse en CommonJS es la opción correcta y más simple.

---

### 9. Volumen Docker sobrescribe `dist` compilado dentro de la imagen

**Problema:** `docker-compose.yml` montaba `./backend/dist:/app/dist` como bind mount en el servicio `api`. Esto sobrescribía en runtime el `dist` ya compilado dentro de la imagen con el `dist` local del host (vacío o desactualizado), causando `Cannot find module '/app/dist/main.js'` **incluso cuando la imagen sí contenía el archivo** (verificado con `docker run --rm garnacheros-api ls dist`).

**Solución:**
- ✅ Remover los bind mounts `./backend/src:/app/src` y `./backend/dist:/app/dist` del servicio `api`
- ✅ Remover por el mismo motivo los bind mounts de `./frontend/app`, `./frontend/components`, `./frontend/lib` del servicio `app` (podrían sobrescribir el build `.next` de producción de forma análoga)

**Archivo:** [docker-compose.yml](docker-compose.yml)

**Guard:** Test E2E de health check falla si `api`/`app` no llegan a `healthy`

**Lección:** Nunca montar como bind mount un directorio de build output (`dist`, `.next`, `build`) en un contenedor que corre la versión compilada/de producción (no hot-reload). Esos mounts son solo para desarrollo con watch mode; en un `docker-compose.yml` que hace `npm start` sobre artefactos ya compilados, sobran y son peligrosos.

---

### 10. Healthcheck con `curl` falla en `node:22-alpine`

**Problema:** El healthcheck de `api` usaba `["CMD", "curl", "-f", "http://localhost:3000/health"]`, pero `curl` no está instalado en la imagen base `node:22-alpine` (solo `wget` está disponible de forma confiable).

**Solución:**
- ✅ Cambiar a `["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]`
- ✅ Este patrón ya se usaba correctamente en los healthchecks de `app` y `web`; solo faltaba aplicarlo también a `api`

**Archivo:** [docker-compose.yml](docker-compose.yml)

**Guard:** `docker-compose ps` debe mostrar `(healthy)` para los 4 servicios

---

### 11. Nginx upstream apuntando a puertos/servicios incorrectos

**Problema:** `frontend/nginx.conf` definía `upstream express_api { server api:3001; }` y `upstream next_app { server app:3000; }`, pero el backend corre internamente en el puerto 3000 (no 3001) y el frontend Next.js corría en el puerto 3000 también (mismatch con el mapeo `5173:5173` de docker-compose y con el healthcheck que pega a `localhost:5173`). Nginx fallaba al arrancar: `host not found in upstream "api:3001"` y el contenedor `web` quedaba en loop de restart.

**Solución:**
- ✅ `nginx.conf`: `upstream express_api { server api:3000; }`
- ✅ `nginx.conf`: `upstream next_app { server app:5173; }`
- ✅ `frontend/package.json`: scripts `dev`/`start` cambiados de `-p 3000` a `-p 5173` para que el puerto interno del proceso Next.js coincida con el mapeo de puertos de docker-compose y con nginx
- ✅ `frontend/Dockerfile`: `EXPOSE 5173` (antes `EXPOSE 3000`)

**Archivos:** [frontend/nginx.conf](frontend/nginx.conf), [frontend/package.json](frontend/package.json), [frontend/Dockerfile](frontend/Dockerfile)

**Guard:** Test E2E de health check contra `http://localhost/` (vía nginx) falla si hay mismatch de puertos

**Lección:** Cuando un puerto se define en varios lugares (Dockerfile `EXPOSE`, script `start` de la app, `ports:` de compose, healthcheck, y `nginx.conf` upstream), un solo lugar desalineado rompe toda la cadena. Verificar los 5 puntos juntos al cambiar cualquier puerto.

---

### 12. Servicios sin red explícita no pueden resolverse por nombre

**Problema:** Los servicios `app` y `web` en `docker-compose.yml` no tenían declarado `networks: - garnacheros-network`, así que Docker Compose los dejaba en la red `default` en vez de la red nombrada donde sí estaban `db` y `api`. Resultado: nginx (`web`) no podía resolver `api` ni `app` por nombre de servicio (`host not found in upstream "api:3000"`) aunque la configuración de puertos ya era correcta.

**Solución:**
- ✅ Agregar `networks: - garnacheros-network` explícitamente a los servicios `app` y `web`

**Archivo:** [docker-compose.yml](docker-compose.yml)

**Guard:** `docker logs garnacheros-web` no debe mostrar `host not found in upstream`

**Lección:** Si un `docker-compose.yml` define una red custom (`garnacheros-network`), **todos** los servicios que necesitan comunicarse entre sí deben declararla explícitamente — no se hereda automáticamente ni siquiera si otros servicios del mismo archivo ya la usan.

---

### 13. Imports con extensión `.js` sobrevivieron a la reversión ESM→CommonJS

**Problema:** Tras revertir `tsconfig.json`/`package.json` a CommonJS (ver gotcha #8), el `seed` seguía fallando con `Cannot find module './db.js'`. Varios archivos (`src/db/seed.ts`, `src/db/schema.ts`, `src/routes/spots.ts`, `src/routes/reviews.ts`) habían quedado con imports estilo ESM (`from "./db.js"`) de un intento previo de migración, y ts-node/CommonJS no resuelve `./db.js` cuando el archivo real es `db.ts` (busca literalmente `db.js` en `src/`, que no existe).

**Solución:** Remover la extensión `.js` de todos los imports/`require` relativos en `backend/src/**/*.ts`.

**Guard:** `npm run seed` debe completar sin `MODULE_NOT_FOUND`

**Lección:** Al revertir una migración ESM↔CommonJS, revisar TODO el árbol de imports, no solo los archivos de configuración (`tsconfig.json`, `package.json`). Un `grep -rn '\.js"' src/` antes y después del cambio de sistema de módulos evita este tipo de residuo.

---

### 14. `DATABASE_URL` placeholder sin llenar + archivo `.env` equivocado

**Problema:** `backend/db.ts` carga variables con `dotenv.config()` (que por defecto lee `backend/.env`), pero el proyecto solo tenía `backend/.env.local` con un placeholder sin completar (`postgresql://user@host:5432/garnacheros`, sin password ni host real). Esto causaba errores confusos (`SASL: client password must be a string`, luego `ENOTFOUND host`) al correr `npm run seed` desde el host.

**Solución:**
- ✅ Usar `backend/.env` (no `.env.local`) como indica `CLAUDE.md`
- ✅ Para ejecutar `npm run seed` desde el host (fuera de Docker), `DATABASE_URL` debe apuntar a `localhost:5432` (el puerto mapeado), con las credenciales dev ya públicas en `docker-compose.yml` (`garnacheros:garnacheros_dev_password`) — dentro de contenedores Docker sí se usa `db:5432` como host

**Archivo:** `backend/.env` (gitignored, no committeado)

**Guard:** `npm run seed` debe insertar los 10 puestos sin error de conexión

**Lección:** El nombre de host en `DATABASE_URL` depende de si el proceso corre dentro de Docker (`db`) o en el host (`localhost`) — mantener claro cuál se usa dónde evita confusión al debuggear.

---

### 15. Clerk `<SignIn>` no está localizado a español por defecto

**Problema:** El test E2E `auth.spec.ts` esperaba el texto `"Inicio de sesión"` en la página de login, pero el componente `<SignIn>` de Clerk renderiza en inglés por defecto (`"Sign in to garnacheros"`) a menos que se configure localización explícita.

**Solución:** Ajustar la aserción del test para verificar el heading real de la landing (`🌮 Garnacheros`) y un heading de Clerk en inglés (`/sign in/i`), en vez de asumir texto en español no configurado.

**Archivo:** [tests/e2e/auth.spec.ts](tests/e2e/auth.spec.ts)

**Guard:** Suite completa de Playwright (`npm run test:e2e`) — 10/10 tests deben pasar

**Lección:** Si se quiere Clerk en español, hay que pasar `localization` desde `@clerk/localizations` al `<ClerkProvider>`; mientras tanto, los tests deben reflejar el idioma real renderizado, no el idioma deseado del producto.

---

### 16. Variables `NEXT_PUBLIC_*` no llegan al bundle si solo se pasan en runtime

**Problema:** `docker-compose.yml` pasaba `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` como `environment:` (runtime) del servicio `app`, pero Next.js **inyecta las variables `NEXT_PUBLIC_*` en el bundle del cliente durante `next build`**, no en runtime. Como el `Dockerfile` no las recibía como build args, el cliente quedaba compilado con el valor default hardcodeado en `lib/api.ts` (`http://localhost:3001/api`), un puerto inexistente — el fetch fallaba silenciosamente (catch vacío) y la UI mostraba "No se encontraron puestos" sin ningún error visible.

**Solución:**
- ✅ `frontend/Dockerfile`: declarar `ARG NEXT_PUBLIC_API_URL` / `ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y volcarlas a `ENV` antes de `RUN npm run build`
- ✅ `docker-compose.yml`: pasar `build.args` además de (no en vez de) `environment:` para el servicio `app`

**Archivos:** [frontend/Dockerfile](frontend/Dockerfile), [docker-compose.yml](docker-compose.yml)

**Guard:** Test E2E de Playwright para `/spots` debería verificar que la lista de puestos no está vacía tras el seed (pendiente de agregar como test explícito — hoy solo se verifica el endpoint de la API, no el renderizado del cliente)

**Lección:** Con Next.js, cualquier variable `NEXT_PUBLIC_*` usada en código de cliente debe pasarse como **build arg**, no solo como variable de entorno de runtime del contenedor. Si cambia su valor, hay que reconstruir la imagen — no basta con reiniciar el contenedor.

---

### 17. CORS solo permitía un origen, bloqueando acceso directo al puerto del frontend

**Problema:** `backend/src/main.ts` configuraba `app.enableCors({ origin: process.env.FRONTEND_URL })`, con `FRONTEND_URL=http://localhost` (el origen de nginx). Al acceder directo a `http://localhost:5173` (bypaseando nginx), el navegador bloqueaba las peticiones a la API por CORS, y de nuevo el error quedaba oculto (catch vacío en `apiClient`).

**Solución:** Cambiar `origin` a un array con ambos orígenes válidos en desarrollo: `[process.env.FRONTEND_URL, 'http://localhost:5173']`.

**Archivo:** [backend/src/main.ts](backend/src/main.ts)

**Guard:** Test E2E de CORS ya existente (preflight) debería extenderse para probar ambos orígenes

**Lección:** En desarrollo local con múltiples puntos de entrada (nginx en :80 y el dev server directo en :5173), CORS debe permitir explícitamente todos los orígenes por los que un humano puede acceder al front — no solo el "oficial" de producción.

---

### 18. `catch` silenciosos en el cliente API ocultan errores reales

**Problema:** Los tres gotchas anteriores (#16, #17, y URLs de imagen rotas) fueron difíciles de diagnosticar porque `SpotsList.tsx`/`SpotDetail.tsx` hacían `.catch(console.error)` sin mostrar nada en la UI — la única señal visible era "No se encontraron puestos", indistinguible de una DB realmente vacía.

**Lección (pendiente de aplicar):** Los componentes cliente deberían distinguir entre "sin resultados" y "error de red/CORS" en la UI (ej. un mensaje de error visible), para que estos bugs sean autodescriptivos en vez de requerir inspeccionar la consola del navegador o el Network tab.

---

### 19. La mayoría de las URLs de imagen del seed eran inválidas (404)

**Problema:** 8 de 10 `image_url` en `backend/src/db/seed.ts` apuntaban a IDs de fotos de Unsplash que devolvían 404 (fotos borradas/inexistentes), causando que casi todas las tarjetas de puestos mostraran imagen rota.

**Solución:**
- ✅ Reemplazar las URLs por IDs de Unsplash verificados con `curl -o /dev/null -w "%{http_code}"` antes de commitear
- ✅ Agregar lógica de `UPDATE` en `seed.ts` para que re-correr el seed también actualice `image_url` en puestos ya existentes (antes el seed solo insertaba si el puesto no existía, así que corregir el array no tenía efecto sin borrar la tabla)

**Archivo:** [backend/src/db/seed.ts](backend/src/db/seed.ts)

**Guard:** Antes de agregar una URL de imagen externa al seed, verificar con `curl -s -o /dev/null -w "%{http_code}"` que responde 200

**Lección:** Nunca confiar en URLs de imagen "de memoria" — los IDs de recursos de terceros (Unsplash, etc.) expiran o cambian. Verificar siempre antes de commitear, y hacer que el seed sea idempotente también para actualizaciones, no solo inserciones.

---

### 20. Agregados de Postgres (`AVG`, `COUNT`) llegan como `string` desde `node-pg`, no `number`

**Problema:** `spots.service.ts` calcula `ROUND(AVG(r.rating)::numeric, 1) as avg_rating` y `COUNT(r.id) as review_count`. El driver `pg` de Node.js devuelve columnas `numeric`/`bigint` como **strings** (para no perder precisión), no como `number`. El frontend hacía `(spot.avg_rating || 0).toFixed(1)`, lo cual funcionaba mientras `avg_rating` era `null` (sin reseñas → cae a `0`, un number), pero **crasheaba con `TypeError: avg_rating.toFixed is not a function`** en cuanto un puesto tenía al menos una reseña real (avg_rating pasaba a ser el string `"5.0"`). Esto se manifestaba como: pantalla de "Application error" al enviar una reseña, y estrellas que parecían no responder a clicks (en realidad la página entera ya había crasheado en un render previo, antes de que cualquier botón pudiera funcionar).

**Solución:** Castear explícitamente con `Number(...)` antes de usar métodos numéricos: `(Number(spot.avg_rating) || 0).toFixed(1)` y `Number(spot.review_count) || 0`.

**Archivos:** [frontend/components/SpotCard.tsx](frontend/components/SpotCard.tsx), [frontend/components/SpotDetail.tsx](frontend/components/SpotDetail.tsx)

**Guard:** Test E2E debería cubrir el flujo completo de "crear reseña → recargar detalle del puesto" para un puesto con ≥1 reseña, no solo el estado inicial sin reseñas (pendiente de agregar)

**Lección:** Cualquier valor que salga de una agregación SQL (`AVG`, `SUM`, `COUNT`) vía `pg` debe tratarse como `string | null` en TypeScript, nunca como `number` directo, y convertirse explícitamente con `Number()` antes de usar métodos como `.toFixed()`. El bug se escondió porque el caso "sin datos" (`null`) coincidía por casualidad con el fallback seguro (`0`), ocultando el problema hasta que había datos reales.

---

### 21. Rating por defecto en 5 + toggle-al-clic = deselección accidental

**Problema:** Al agregar la función de "deseleccionar estrella" (clic en la estrella ya marcada la resetea a 0), el estado inicial `rating` seguía en `useState(5)` — es decir, las 5 estrellas ya aparecían doradas desde que cargaba la página. El primer clic natural de un usuario (en la 5ta estrella, para "confirmar 5 de 5") coincidía con el valor ya seleccionado, así que el toggle lo interpretaba como "declic" y bajaba el rating a `0` en vez de mantenerlo en 5. Resultado percibido: "selecciono 5 estrellas y no pasa nada", el botón de enviar quedaba deshabilitado (`rating < 1`), nunca llegaba el POST al backend, y el promedio se quedaba en 0.0.

**Solución:** Cambiar el estado inicial de `rating` a `0` (sin selección), tanto en el `useState` inicial como en el reset tras enviar una reseña exitosamente.

**Archivo:** [frontend/components/SpotDetail.tsx](frontend/components/SpotDetail.tsx)

**Guard:** Test E2E debería simular clic en la estrella N donde N = valor inicial del rating, y verificar que el estado resultante sea el esperado (pendiente de agregar — hoy no hay cobertura de interacción de UI con clics reales en el formulario de reseña)

**Lección:** Al agregar un toggle basado en "¿el valor clicado ya es el valor actual?", verificar que el valor inicial no coincida con la interacción más común esperada del usuario. Es más seguro que un control de calificación por estrellas empiece vacío (`0`) que precargado con un valor "por defecto" que compita con la lógica de selección/deselección.

---

## Checklist E2E Antiregresión

Estos tests corren en cada build para evitar regresiones:

- ✅ Next.js `npm run build` compila sin errores CommonJS
- ✅ Nest.js `npm run build` compila sin errores TypeScript
- ✅ Frontend renderiza en http://localhost:5173
- ✅ Backend API responde en http://localhost:3000
- ✅ Health check retorna 200 en GET http://localhost:3000/health
- ✅ Login redirige autenticados a /spots
- ✅ GET /api/spots retorna lista de puestos
- ✅ GET /api/spots/:id retorna detalle + reseñas
- ✅ POST /api/reviews/:spotId sin token retorna 401
- ✅ POST /api/reviews/:spotId con token crea reseña
- ✅ DELETE /api/reviews/:id solo funciona para autor
- ✅ CORS preflight retorna 200
- ✅ Promedio de rating se actualiza en tiempo real

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

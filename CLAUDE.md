# CLAUDE.md — Garnacheros

Guía de desarrollo específica para el proyecto Garnacheros.

---

## ⚠️ REGLAS CRÍTICAS (MANDATORY & FORBIDDEN)

### 🚫 PROHIBIDO FIRMAR COMMITS
Todos los commits deben hacerse **SIN FIRMA** (`git commit -m "..."` sin Co-Authored-By).
```bash
git config commit.gpgsign false
```

### 🔐 PROHIBIDO EXPONER SECRETOS EN PANTALLA O GITHUB
**NUNCA** imprimir, loguear, o commitear:
- `CLERK_SECRET_KEY` (sk_live_*, sk_test_*)
- `CLERK_PUBLISHABLE_KEY` (pk_live_*, pk_test_*)
- `DATABASE_URL` (contiene credenciales de Neon)
- `.env` archivos
- API keys, tokens, o credenciales de cualquier tipo

**Reglas de oro:**
- ❌ NUNCA usar `cat`, `echo`, `grep -n` sobre `.env*` archivos
- ❌ NUNCA pasar secretos a herramientas de IA o servicios terceros
- ❌ NUNCA commitear `.env` o archivos con credenciales
- ✅ SIEMPRE usar `.env.example` con placeholders
- ✅ SIEMPRE validar antes de cualquier `git push`

Si accidentalmente se expone un secreto → **Rotar inmediatamente en Clerk + Neon** → **No recuperable.**

---

# 🌮 Garnacheros — Guía de Desarrollo

## 📋 Sobre este proyecto

**Garnacheros** es una plataforma fullstack para calificar puestos de comida callejera en CDMX y Aguascalientes.

| Aspecto | Detalles |
|--------|----------|
| **Frontend** | Next.js 14 + React 18 + TypeScript 5.3 + Tailwind CSS |
| **Backend** | Nest.js 10.3 + TypeScript 5.3 + Node.js 22 |
| **Database** | Neon PostgreSQL (serverless) |
| **Auth** | Clerk (OAuth + Email/Password) |
| **Deploy** | Docker Compose + Nginx + Let's Encrypt |
| **Dominio** | https://garnacheros.technoapps.agency |
| **Repo público** | https://github.com/ChioHappyCoder/Garnacheros |

## 🛠️ Setup del proyecto

### Local

```bash
# 1. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 2. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 3. Llenar .env con valores reales (Neon, Clerk)

# 4. Levantar en desarrollo (con Docker)
docker-compose up --build

# 5. Seedear datos (primera ejecución)
cd backend && npm run seed
```

**URLs en desarrollo:**
- Frontend: http://localhost (via Nginx) o http://localhost:3000 (Next.js directo)
- Backend: http://localhost:3001
- API: http://localhost/api
- Health: http://localhost/health
- Database: postgresql://garnacheros:garnacheros_dev_password@localhost:5432/garnacheros

**Base de datos local:**
```bash
psql postgresql://garnacheros:garnacheros_dev_password@localhost:5432/garnacheros
# O
psql -h localhost -U garnacheros -d garnacheros
```

## 🔧 Stack específico

### Backend
- **@nestjs/core** — Framework fullstack con inyección de dependencias
- **@nestjs/common** — Decoradores, Guards, Pipes, Modules
- **@clerk/clerk-sdk-node** — Validación JWT de Clerk en guards
- **pg** — Pool de conexiones a Neon
- **dotenv** — Variables de entorno

**Arquitectura:** Modules → Controllers → Services → Database Provider (patrón Nest.js)

**No usar:** ORMs complejos (Prisma/Sequelize). SQL raw + tipos TypeScript.

### Frontend
- **Next.js 14** — React framework con App Router (SSR/SSG)
- **@clerk/nextjs** — Autenticación Clerk optimizada para Next.js
- **axios** — HTTP client para llamadas a `/api`
- **tailwindcss 3.3** — Estilos utilities-first
- **TypeScript 5.3** — ES2022 target, strict mode

**Paleta de colores:** Naranjas (orange-*) y grises (gray-*) — tema comida callejera.

**Variables de entorno:** Solo `NEXT_PUBLIC_*` se pasan al frontend. Backend usa `CLERK_SECRET_KEY`.

#### Estructura de App Router
```
app/
├── layout.tsx           # Root layout con ClerkProvider
├── page.tsx             # Login page (redirect si está autenticado)
├── health/
│   └── page.tsx         # Health check de la API
└── spots/
    ├── page.tsx         # Lista de puestos (requiere auth)
    └── [id]/
        └── page.tsx     # Detalle de puesto (requiere auth)

components/
├── Header.tsx
├── SpotsList.tsx
├── SpotCard.tsx
└── SpotDetail.tsx

lib/
└── api.ts               # Cliente HTTP + tipos
```

### Database (Neon)
- Schema: 2 tablas (`spots`, `reviews`)
- Índices en `spot_id`, `user_id`, `city`
- Foreign keys con `ON DELETE CASCADE`
- Migraciones en TypeScript (se corren en `seed.ts`)

## 📝 Convenciones del código

### TypeScript
- **Target:** ES2022 (configurado en `tsconfig.json`)
- **Strict mode:** siempre activado
- **Tipos en funciones:** siempre explícitos (no `any`)
- Interfaces en componentes React con sufijo `Props`

### Commits
```bash
git commit -m "feat: Nueva feature" 
git commit -m "fix: Bug específico"
git commit -m "refactor: Mejora de código"
git commit -m "docs: Actualización de docs"
git commit -m "perf: Optimización"
```
**Importante:** NO firmar commits (config: `commit.gpgsign = false`)

### Archivos especiales
- ❌ **Nunca** commitear `.env`, `*.local.json`, secretos
- ✅ Siempre crear `.env.example` con placeholders
- ✅ Variables de entorno: VITE_* (frontend), DATABASE_URL/CLERK_*  (backend)

## 🔐 Manejo de secretos con dotenv

**Regla de oro:** Ningún secreto en código ni commits. Usar **dotenv** para cargar desde archivos `.env`.

### Setup

1. **Crear archivos `.env` locales** (nunca commitear):
   ```bash
   # backend/.env
   DATABASE_URL=postgresql://user:password@host:5432/garnacheros
   CLERK_SECRET_KEY=sk_test_xxxxx
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   
   # frontend/.env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

2. **Backend** — dotenv carga automáticamente en `src/index.ts`:
   ```ts
   import dotenv from "dotenv";
   dotenv.config(); // Carga backend/.env automáticamente
   
   const dbUrl = process.env.DATABASE_URL; // ✅ BIEN
   ```

3. **Frontend** — Next.js carga automáticamente variables `NEXT_PUBLIC_*`:
   ```ts
   const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ BIEN (Next.js)
   // Variables sin NEXT_PUBLIC_ solo disponibles en servidor
   ```

### Distribución de secretos

| Secreto | Archivo | Producción (VPS) |
|---------|---------|------------------|
| `DATABASE_URL` | `backend/.env` | Configurar en VPS vía SSH |
| `CLERK_SECRET_KEY` | `backend/.env` | Solo en VPS, nunca en GitHub |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Env var | Puede estar en GitHub Actions (público, no secreto) |

**Nunca hacer:**
```ts
// ❌ MALO — hardcodear secretos
const CLERK_SECRET = "sk_live_xxxxx";

// ✅ BIEN — cargar desde dotenv
const CLERK_SECRET = process.env.CLERK_SECRET_KEY;
```

### En producción (VPS)
```bash
# SSH al VPS
ssh user@technoapps.agency
cd Garnacheros

# Crear backend/.env con valores reales
cat > backend/.env << EOF
DATABASE_URL=postgresql://user:pass@neon.tech/db
CLERK_SECRET_KEY=sk_live_xxxxx
PORT=3001
FRONTEND_URL=https://garnacheros.technoapps.agency
EOF

# Crear frontend/.env.local si es necesario
cat > frontend/.env.local << EOF
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_API_URL=https://garnacheros.technoapps.agency/api
EOF

# Docker automáticamente carga estos .env
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📡 API Design

### Endpoints (sin cambios sin avisar)

**Públicos (GET):**
- `GET /api/spots?city=CDMX&search=tacos` — Listar con filtros
- `GET /api/spots/:id` — Detalle + reseñas

**Protegidos (requieren Clerk JWT):**
- `POST /api/reviews/:spotId` — Crear reseña (usuario actual)
- `DELETE /api/reviews/:id` — Eliminar (solo si eres el autor)

### Respuestas
Siempre JSON. Errores con `{ error: "mensaje" }`. Status codes:
- 200: OK
- 201: Created
- 400: Bad request (validación)
- 401: Unauthorized (no auth)
- 403: Forbidden (no permitido)
- 404: Not found
- 500: Server error

## 🐛 Debugging

```bash
# Logs del backend
docker-compose logs -f api

# Logs del frontend (browser DevTools → Console)

# Conectar a Neon
psql $DATABASE_URL
SELECT * FROM spots;
SELECT * FROM reviews WHERE spot_id = 1;
```

## 🚀 Deployar cambios

### En local
```bash
docker-compose down
docker-compose up --build

# Ver logs
docker-compose logs -f app
docker-compose logs -f api
```

### En VPS (Ubuntu 24 LTS)
```bash
ssh user@technoapps.agency
cd Garnacheros
git pull origin main

# Copiar/actualizar .env con variables reales
cat > .env << EOF
DATABASE_URL=postgresql://user:pass@neon.tech/garnacheros?sslmode=require
CLERK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
FRONTEND_URL=https://garnacheros.technoapps.agency
NEXT_PUBLIC_API_URL=https://garnacheros.technoapps.agency/api
EOF

chmod 600 .env

# Desplegar con docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f app
docker-compose -f docker-compose.prod.yml logs -f web
```

### Health Checks
```bash
# Verificar que todos los contenedores estén healthy
docker-compose -f docker-compose.prod.yml ps

# Output esperado: Status "healthy" para api, app, web
```

## ⚠️ Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `DATABASE_URL` undefined | `.env` no configurado | Copiar `.env.example` → `.env` + llenar valores |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` undefined | Vars no cargadas | Solo `NEXT_PUBLIC_*` llegan al frontend. Reiniciar `npm run dev` |
| 401 en reseñas | Token Clerk inválido | ClerkAuthGuard valida el JWT. Verificar token en header |
| 403 al eliminar reseña | No eres el autor | Guard valida `req.auth.userId` contra `review.user_id` |
| Error de módulo Nest.js | Importación circular | Verificar que DatabaseModule se importe en módulos que lo usan |

## 🚫 Prohibido en Garnacheros

- ❌ **Cambiar auth provider** sin migración completa de usuarios
- ❌ **Modificar schema** sin crear script de migración
- ❌ **Hardcodear dominios/URLs** (usar env vars)
- ❌ **Commitear secretos** (`.env`, keys, tokens)
- ❌ **Usar npm packages no verificados** (ejecutar `npm audit` regularmente)
- ❌ **Modificar Dockerfile en producción** sin testing local

## ✅ Mejores prácticas obligatorias

1. **Tests locales antes de push:** `docker-compose up` → verificar flujo completo
2. **Tipos siempre:** No hay `any` permitidos en TS
3. **SQL parameterizado:** Nunca concatenar user input en queries
4. **Logs informativos:** No loguear secretos; loguear acciones importantes (signin, reseña creada)
5. **Commits pequeños:** 1 feature/fix por commit, no mezclar refactors con features
6. **Review antes de merge:** Al menos 1 revisión (si hay team) o self-review exhaustivo

## 📚 Recursos para mantener el proyecto

- **Clerk docs:** https://clerk.com/docs
- **Neon docs:** https://neon.tech/docs
- **Express guide:** https://expressjs.com
- **Tailwind:** https://tailwindcss.com
- **Docker best practices:** https://docs.docker.com/develop/dev-best-practices/

---

**Última actualización:** 2026-09-20  
**Maintainer:** @ChioHappyCoder  
**GitHub:** https://github.com/ChioHappyCoder/Garnacheros

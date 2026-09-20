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
| **Frontend** | React 18 + Vite + TypeScript 5.3 + Tailwind CSS |
| **Backend** | Express 4.18 + TypeScript 5.3 + Node.js 22 |
| **Database** | Neon PostgreSQL (serverless) |
| **Auth** | Clerk (OAuth + Email/Password) |
| **Deploy** | Docker + Nginx + Let's Encrypt |
| **Dominio** | https://garnacheros.technoapps.agency |
| **Repo público** | https://github.com/ChioHappyCoder/Garnacheros |

## 🛠️ Setup del proyecto

```bash
# 1. Instalar dependencias
cd frontend && npm install
cd ../backend && npm install

# 2. Configurar variables de entorno
# backend/.env (ver .env.example)
# frontend/.env.local (ver .env.example)

# 3. Levantar en desarrollo
docker-compose up --build

# 4. Seedear datos (primera ejecución)
cd backend && npm run seed
```

## 🔧 Stack específico

### Backend
- **express.js** — Framework HTTP minimalista + router REST
- **@clerk/clerk-sdk-node** — Validación JWT de Clerk
- **pg** — Pool de conexiones a Neon
- **cors** — Middleware CORS configurado por dominio
- **dotenv** — Variables de entorno

**No usar:** ORMs complejos (Prisma/Sequelize). SQL raw + tipos TypeScript.

### Frontend
- **@clerk/clerk-react** — SignInButton, UserButton, hooks (useAuth, useUser)
- **axios** — HTTP client para llamadas a `/api`
- **tailwindcss** — Estilos utilities-first (sin CSS modules)
- **vite** — Build tool + dev server con hot reload

**Paleta de colores Tailwind:** Naranjas (orange-*) y grises (gray-*) — tema comida callejera.

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
   FRONTEND_URL=http://localhost:5173
   
   # frontend/.env.local
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   VITE_API_URL=http://localhost:3001/api
   ```

2. **Backend** — dotenv carga automáticamente en `src/index.ts`:
   ```ts
   import dotenv from "dotenv";
   dotenv.config(); // Carga backend/.env automáticamente
   
   const dbUrl = process.env.DATABASE_URL; // ✅ BIEN
   ```

3. **Frontend** — Vite carga automáticamente variables `VITE_*`:
   ```ts
   const apiUrl = import.meta.env.VITE_API_URL; // ✅ BIEN (Vite)
   // NO usar process.env en frontend (no existe en el browser)
   ```

### Distribución de secretos

| Secreto | Archivo | Producción (VPS) |
|---------|---------|------------------|
| `DATABASE_URL` | `backend/.env` | Configurar en VPS vía SSH |
| `CLERK_SECRET_KEY` | `backend/.env` | Solo en VPS, nunca en GitHub |
| `VITE_CLERK_PUBLISHABLE_KEY` | `frontend/.env.local` | Puede estar en GitHub Actions (seguro, no es secreto) |

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
```

### En VPS
```bash
ssh user@technoapps.agency
cd Garnacheros
git pull origin main
docker-compose -f docker-compose.prod.yml up -d --build
```

## ⚠️ Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `DATABASE_URL` undefined | `.env` no configurado | Copiar `.env.example` → `.env` + llenar valores |
| `VITE_CLERK_PUBLISHABLE_KEY` undefined | `VITE_*` vars no loadean | Solo VITE_* se pasan al frontend. Verificar en vite.config.ts |
| 401 en reseñas | Token Clerk inválido | Verificar que `getToken()` se llama en frontend antes de POST |
| 403 al eliminar reseña | No eres el autor | Backend valida `req.auth.userId` contra `review.user_id` |
| Nginx 502 | Backend caído | `docker-compose logs api` → revisar errors |

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

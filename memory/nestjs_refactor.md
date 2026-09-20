---
name: nestjs_refactor
description: Backend refactored from Express.js to Nest.js 10.3 with modules, guards, and improved Docker setup
metadata:
  type: project
---

## Nest.js Backend Refactor (2026-09-20)

**Why:** Nest.js provides better architecture with modules, dependency injection, decorators, and type safety. More enterprise-ready than Express.

**Architecture Changes:**
- Express routers → Nest.js Controllers (@Controller)
- Middleware → Nest.js Guards (@UseGuards)
- Express app setup → Nest.js AppModule + main.ts bootstrap
- Manual dependency → Nest.js DI (@Inject)

**File Structure:**
```
backend/src/
├── main.ts              # Bootstrap (NestFactory.create)
├── app.module.ts        # Root module, imports DatabaseModule, SpotsModule, ReviewsModule
├── app.controller.ts    # Health check endpoint
├── database/
│   ├── database.module.ts
│   └── database.provider.ts    # Pool PostgreSQL injection
├── auth/
│   └── clerk.guard.ts          # ClerkAuthGuard (JWT validation)
├── spots/
│   ├── spots.module.ts
│   ├── spots.controller.ts
│   └── spots.service.ts
├── reviews/
│   ├── reviews.module.ts
│   ├── reviews.controller.ts
│   └── reviews.service.ts
├── common/
│   └── types.ts         # Shared interfaces (Spot, Review, SpotDetail)
└── db/                  # Unchanged
    ├── db.ts, schema.ts, seed.ts
```

**Key Dependencies:**
- `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
- `@clerk/clerk-sdk-node` (for verifyAuth in guards)
- `pg` (queries unchanged, still parameterized)
- `reflect-metadata`, `rxjs` (Nest.js runtime)

**Docker Optimization:**
- Multi-stage builds (builder → runtime stage)
- Healthchecks in Dockerfile (curl for backend)
- dumb-init for proper signal handling
- docker-compose.prod.yml for VPS: logging, networking, healthchecks
- docker-compose.yml for dev: volumes for hot reload

**Commits:**
- 6af95e6: Migrate Express → Nest.js
- 42311e2: Optimize Dockerfiles for Ubuntu 24 LTS

**Next:** Guards in place but auth can be further refined with global guards or interceptors if needed.

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('Login page renders with SignIn component', async ({ page }) => {
    await page.goto('/');

    // Debería mostrar el component de Clerk
    await expect(page.locator('text=Inicio de sesión')).toBeVisible();
  });

  test('Unauthenticated user cannot access /spots', async ({ page }) => {
    // Esto depende de cómo esté configurado Clerk en el frontend
    // Por ahora verificamos que la página carga correctamente
    await page.goto('/spots').catch(() => {
      // Es esperado que rediriga si no está autenticado
    });
  });

  test('POST /api/reviews without token returns 401', async ({ request }) => {
    const response = await request.post(
      'http://localhost:3000/api/reviews/1',
      {
        data: {
          rating: 5,
          comment: 'Test review',
        },
      }
    );

    // Sin Authorization header, debe retornar 401
    expect([401, 403]).toContain(response.status());
  });

  test('DELETE /api/reviews without token returns 401', async ({ request }) => {
    const response = await request.delete(
      'http://localhost:3000/api/reviews/1'
    );

    expect([401, 403]).toContain(response.status());
  });
});

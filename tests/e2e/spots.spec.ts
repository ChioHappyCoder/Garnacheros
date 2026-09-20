import { test, expect } from '@playwright/test';

test.describe('Spots API', () => {
  test('GET /api/spots returns list of spots', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/spots');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('city');
    }
  });

  test('GET /api/spots with city filter', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/spots?city=CDMX');
    expect(response.status()).toBe(200);

    const data = await response.json();
    if (data.length > 0) {
      expect(data[0].city).toBe('CDMX');
    }
  });

  test('GET /api/spots/:id returns spot details with reviews', async ({ request }) => {
    // Primero obtener un spot válido
    const spotsResponse = await request.get('http://localhost:3000/api/spots');
    const spots = await spotsResponse.json();

    if (spots.length > 0) {
      const spotId = spots[0].id;

      const response = await request.get(`http://localhost:3000/api/spots/${spotId}`);
      expect(response.status()).toBe(200);

      const spot = await response.json();
      expect(spot).toHaveProperty('id', spotId);
      expect(spot).toHaveProperty('reviews');
      expect(Array.isArray(spot.reviews)).toBe(true);
    }
  });

  test('GET /api/spots/:id with invalid ID returns 404', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/spots/999999');
    expect(response.status()).toBe(404);
  });
});

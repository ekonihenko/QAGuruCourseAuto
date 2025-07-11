import { test, expect } from '../fixtures/api-client';

test.describe('API Challenges Tests @challenges', () => {
  test('GET /challenges - получение списка всех challenges @smoke @get', async ({ apiContext }) => {
    const response = await apiContext.get('/challenges');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('challenges');
    expect(Array.isArray(data.challenges)).toBeTruthy();
    expect(data.challenges.length).toBeGreaterThan(0);
    expect(data.challenges[0]).toHaveProperty('name');
    expect(data.challenges[0]).toHaveProperty('description');
  });

  test('POST /challenger - создание нового challenger токена @smoke @post', async ({
    apiContext,
  }) => {
    const response = await apiContext.post('/challenger');

    expect([200, 201]).toContain(response.status());

    const headers = response.headers();
    expect(headers).toHaveProperty('x-challenger');
    expect(headers['x-challenger']).toBeTruthy();
    expect(headers['x-challenger'].length).toBeGreaterThan(10);
  });

  test('GET /heartbeat - проверка доступности API @smoke @get', async ({ apiContext }) => {
    const response = await apiContext.get('/heartbeat');

    expect(response.status()).toBe(204);

    const text = await response.text();
    expect(text).toBe('');
  });
});

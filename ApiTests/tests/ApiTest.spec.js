const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://apichallenges.herokuapp.com';
let HEADERS = {
  'Content-Type': 'application/json',
  'X-CHALLENGER': 'x-challenger-guid',
};

test.describe('Родительский блок охватывает все тесты, связанные с /todos Todos', () => {
  let todoId;
  let challengerId;

  // Получение Id
  test.beforeAll(async ({ request }) => {
    const response = await request.post(`${BASE_URL}/challenger`); //запрос к /challenger для получения X-Challenger Id
    await expect(response.ok()).toBe(true);
    await expect(response.status()).toBe(201); // Должен вернуться 201
    challengerId = response.headers()['x-challenger']; //Извлекаю значение заголовка с  x-challenger,кот должен сод-ть id
    await expect(challengerId).toBeDefined(); //проверяю, что id получен и не  undefined
    // Обновление заголовков с id
    HEADERS = {
      ...HEADERS,
      'X-Challenger': challengerId, //обновляю конкретный 'X-Challenger' в новом объекте. Взяла из переменной challengerId(из заголовка строка 18)
    };
  });

  // Вложенный блок - GET
  test.describe('GET Запросы', () => {
    test('GET 1 - Получение всех списков задач', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expect(responseBody.todos).toBeDefined();
    });

    test('GET /todos/{id} - should retrieve a specific todo', async ({ request }) => {
      const tempTodo = await createTodo(request);
      todoId = tempTodo.id;
      const response = await request.get(`${BASE_URL}/todos/${todoId}`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expect(responseBody.id).toBe(todoId);
    });

    test('GET /todos/{id} - should return 404 for non-existent todo', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos/999999`, { headers: HEADERS });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(404);
    });

    test('GET /todos - should handle empty list if no todos exist', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      const responseBody = await response.json();
      await expect(Array.isArray(responseBody.todos)).toBeTruthy();
    });

    test('GET /todos - should return correct content-type header', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      await expect(response.headers()['content-type']).toContain('application/json');
    });

    test('GET /todos/{id} - should handle invalid ID format', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos/invalid`, { headers: HEADERS });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400); // Assuming API returns 400 for bad format
    });

    test('GET /todos - should respond within reasonable time', async ({ request }) => {
      const startTime = Date.now();
      const response = await request.get(`${BASE_URL}/todos`, { headers: HEADERS });
      const duration = Date.now() - startTime;
      await expect(response.ok()).toBeTruthy();
      await expect(duration).toBeLessThan(2000); // Expect response within 2 seconds
    });

    test('GET /todos - should handle large dataset if applicable', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/todos`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      const responseBody = await response.json();
      await expect(responseBody.todos.length).toBeGreaterThanOrEqual(0); // Basic check for data handling
    });
  });

  // POST Requests (Minimum 8 Tests)
  test.describe('POST Requests', () => {
    test('POST /todos - should create a new todo with valid data', async ({ request }) => {
      const todoData = { title: `Test Todo ${Date.now()}`, doneStatus: false, description: 'Test' };
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(201);
      const responseBody = await response.json();
      todoId = responseBody.id;
      await expect(responseBody.title).toBe(todoData.title);
    });

    test('POST /todos - should fail without title', async ({ request }) => {
      const todoData = { doneStatus: false, description: 'Test' };
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400); // Assuming validation error
    });

    test('POST /todos - should fail with empty body', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/todos`, { data: {}, headers: HEADERS });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400);
    });

    test('POST /todos - should handle long title', async ({ request }) => {
      const longTitle = 'A'.repeat(1000);
      const todoData = { title: longTitle, doneStatus: false, description: 'Test' };
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.status()).toBeGreaterThanOrEqual(200);
      await expect(response.status()).toBeLessThan(300); // Expect success or partial success
    });

    test('POST /todos - should handle missing doneStatus', async ({ request }) => {
      const todoData = { title: `Test Todo ${Date.now()}`, description: 'Test' };
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.status()).toBeGreaterThanOrEqual(200);
      await expect(response.status()).toBeLessThan(300); // Check if API accepts missing field
    });

    test('POST /todos - should return correct content-type', async ({ request }) => {
      const todoData = { title: `Test Todo ${Date.now()}`, doneStatus: false };
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.headers()['content-type']).toContain('application/json');
    });

    test('POST /todos - should fail with invalid JSON', async ({ request }) => {
      const response = await request.post(`${BASE_URL}/todos`, {
        data: 'invalid json',
        headers: { ...HEADERS, 'Content-Type': 'text/plain' },
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400);
    });

    test('POST /todos - should handle duplicate title if allowed', async ({ request }) => {
      const title = `Duplicate Todo ${Date.now()}`;
      const todoData = { title, doneStatus: false };
      await request.post(`${BASE_URL}/todos`, { data: todoData, headers: HEADERS });
      const response = await request.post(`${BASE_URL}/todos`, {
        data: todoData,
        headers: HEADERS,
      });
      await expect(response.status()).toBeGreaterThanOrEqual(200);
      await expect(response.status()).toBeLessThan(300); // Check if duplicates are allowed
    });
  });

  // PUT Requests (Minimum 5 Tests)
  test.describe('PUT Requests', () => {
    test.beforeEach(async ({ request }) => {
      const tempTodo = await createTodo(request);
      todoId = tempTodo.id;
    });

    test('PUT /todos/{id} - should update todo with valid data', async ({ request }) => {
      const updatedData = { title: `Updated Todo ${Date.now()}`, doneStatus: true };
      const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
        data: updatedData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expect(responseBody.title).toBe(updatedData.title);
    });

    test('PUT /todos/{id} - should fail for non-existent todo', async ({ request }) => {
      const updatedData = { title: 'Updated Todo' };
      const response = await request.put(`${BASE_URL}/todos/999999`, {
        data: updatedData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(404);
    });

    test('PUT /todos/{id} - should fail with invalid data', async ({ request }) => {
      const updatedData = { title: '' }; // Empty title assuming it's invalid
      const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
        data: updatedData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400);
    });

    test('PUT /todos/{id} - should handle partial update if allowed', async ({ request }) => {
      const updatedData = { doneStatus: true };
      const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
        data: updatedData,
        headers: HEADERS,
      });
      await expect(response.status()).toBeGreaterThanOrEqual(200);
      await expect(response.status()).toBeLessThan(300);
    });

    test('PUT /todos/{id} - should return correct content-type', async ({ request }) => {
      const updatedData = { title: `Updated ${Date.now()}` };
      const response = await request.put(`${BASE_URL}/todos/${todoId}`, {
        data: updatedData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.headers()['content-type']).toContain('application/json');
    });
  });

  // PATCH Requests (Minimum 5 Tests)
  test.describe('PATCH Requests', () => {
    test.beforeEach(async ({ request }) => {
      const tempTodo = await createTodo(request);
      todoId = tempTodo.id;
    });

    test('PATCH /todos/{id} - should partially update todo (doneStatus)', async ({ request }) => {
      const patchData = { doneStatus: true };
      const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
        data: patchData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expect(responseBody.doneStatus).toBe(true);
    });

    test('PATCH /todos/{id} - should partially update todo (title)', async ({ request }) => {
      const patchData = { title: `Patched Title ${Date.now()}` };
      const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
        data: patchData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const responseBody = await response.json();
      await expect(responseBody.title).toBe(patchData.title);
    });

    test('PATCH /todos/{id} - should fail for non-existent todo', async ({ request }) => {
      const patchData = { doneStatus: true };
      const response = await request.patch(`${BASE_URL}/todos/999999`, {
        data: patchData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(404);
    });

    test('PATCH /todos/{id} - should fail with invalid data', async ({ request }) => {
      const patchData = { title: '' }; // Assuming empty title is invalid
      const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
        data: patchData,
        headers: HEADERS,
      });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400);
    });

    test('PATCH /todos/{id} - should handle unknown fields if ignored', async ({ request }) => {
      const patchData = { unknownField: 'test' };
      const response = await request.patch(`${BASE_URL}/todos/${todoId}`, {
        data: patchData,
        headers: HEADERS,
      });
      await expect(response.status()).toBeGreaterThanOrEqual(200);
      await expect(response.status()).toBeLessThan(300); // Check if API ignores unknown fields
    });
  });

  // DELETE Requests (Minimum 4 Tests)
  test.describe('DELETE Requests', () => {
    test.beforeEach(async ({ request }) => {
      const tempTodo = await createTodo(request);
      todoId = tempTodo.id;
    });

    test('DELETE /todos/{id} - should delete a specific todo', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/todos/${todoId}`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
      const getResponse = await request.get(`${BASE_URL}/todos/${todoId}`, { headers: HEADERS });
      await expect(getResponse.status()).toBe(404);
    });

    test('DELETE /todos/{id} - should fail for non-existent todo', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/todos/999999`, { headers: HEADERS });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(404);
    });

    test('DELETE /todos/{id} - should handle invalid ID format', async ({ request }) => {
      const response = await request.delete(`${BASE_URL}/todos/invalid`, { headers: HEADERS });
      await expect(response.ok()).toBeFalsy();
      await expect(response.status()).toBe(400);
    });

    test('DELETE /todos/{id} - should return correct status code on success', async ({
      request,
    }) => {
      const response = await request.delete(`${BASE_URL}/todos/${todoId}`, { headers: HEADERS });
      await expect(response.ok()).toBeTruthy();
      await expect(response.status()).toBe(200);
    });
  });

  // Helper function to create a todo for tests
  async function createTodo(request) {
    const todoData = {
      title: `Temp Todo ${Date.now()}`,
      doneStatus: false,
      description: 'Temporary todo for testing',
    };
    const response = await request.post(`${BASE_URL}/todos`, { data: todoData, headers: HEADERS });
    if (!response.ok()) {
      throw new Error(`Failed to create temporary todo for testing: ${response.status()}`);
    }
    return await response.json();
  }
});

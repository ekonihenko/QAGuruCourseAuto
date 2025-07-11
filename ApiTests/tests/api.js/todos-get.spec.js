import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - GET запросы @todos @get', () => {
  test('GET /todos - получение списка всех TODO @smoke', async ({ apiContext }) => {
    const response = await apiContext.get('/todos');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('todos');
    expect(Array.isArray(data.todos)).toBeTruthy();

    if (data.todos.length > 0) {
      const todo = data.todos[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('doneStatus');
      expect(typeof todo.doneStatus).toBe('boolean');
    }
  });

  test('GET /todos/:id - получение TODO по ID @smoke', async ({ apiContext }) => {
    const createResponse = await apiContext.post('/todos', {
      data: {
        title: 'Test TODO',
        doneStatus: false,
        description: 'Test',
      },
    });

    const createdTodo = await createResponse.json();
    console.log('Created:', createdTodo);

    const response = await apiContext.get(`/todos/${createdTodo.id}`);
    const text = await response.text();
    console.log('GET Response:', text);

    expect(response.status()).toBe(200);
    expect(text).toContain('Test TODO');
  });

  test('GET /todos/:id - получение несуществующего TODO @negative', async ({ apiContext }) => {
    const nonExistentId = 99999;
    const response = await apiContext.get(`/todos/${nonExistentId}`);
    console.log('GET non-existent TODO status:', response.status());

    expect(response.status()).toBe(404);

    try {
      const data = await response.json();
      console.log('Error response:', data);

      expect(data).toHaveProperty('errorMessages');
      expect(Array.isArray(data.errorMessages)).toBeTruthy();
      expect(data.errorMessages.length).toBeGreaterThan(0);

      const errorMessage = data.errorMessages[0].toLowerCase();
      const hasExpectedError =
        errorMessage.includes('could not find') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('no such') ||
        errorMessage.includes('todo') ||
        errorMessage.includes('entity');

      expect(hasExpectedError).toBeTruthy();
    } catch (e) {
      console.error('Failed to parse error response:', e);
    }
  });

  test('GET /todos?doneStatus=true - фильтрация по статусу выполнения @filter', async ({
    apiContext,
  }) => {
    await apiContext.post('/todos', {
      data: { title: 'Completed TODO', doneStatus: true, description: '' },
    });

    const response = await apiContext.get('/todos?doneStatus=true');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.todos).toBeDefined();
    data.todos.forEach((todo) => {
      expect(todo.doneStatus).toBe(true);
    });
  });

  test('GET /todos?doneStatus=false - фильтрация невыполненных TODO @filter', async ({
    apiContext,
  }) => {
    await apiContext.post('/todos', {
      data: { title: 'Incomplete TODO', doneStatus: false, description: '' },
    });

    const response = await apiContext.get('/todos?doneStatus=false');

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.todos).toBeDefined();
    data.todos.forEach((todo) => {
      expect(todo.doneStatus).toBe(false);
    });
  });

  test('HEAD /todos - проверка заголовков без тела ответа @headers', async ({ apiContext }) => {
    const response = await apiContext.head('/todos');

    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['content-type']).toContain('application/json');
    const body = await response.text();
    expect(body).toBe('');
  });

  test('OPTIONS /todos - получение доступных методов @options', async ({ apiContext }) => {
    const response = await apiContext.fetch('/todos', {
      method: 'OPTIONS',
    });

    expect(response.status()).toBe(200);

    const headers = response.headers();
    expect(headers['allow']).toBeDefined();
    const allowedMethods = headers['allow'].split(', ');
    expect(allowedMethods).toContain('GET');
    expect(allowedMethods).toContain('POST');
    expect(allowedMethods).toContain('OPTIONS');
  });

  test('GET /todos поддерживает XML формат @headers', async ({ playwright }) => {
    const context = await playwright.request.newContext({
      baseURL: 'https://apichallenges.herokuapp.com',
    });

    const xmlResponse = await context.get('/todos', {
      headers: {
        Accept: 'application/xml',
      },
    });

    expect(xmlResponse.status()).toBe(200);
    expect(xmlResponse.headers()['content-type']).toContain('application/xml');

    const xmlText = await xmlResponse.text();

    expect(xmlText).toMatch(/^<todos>/);
    expect(xmlText).toMatch(/<\/todos>$/);
    expect(xmlText).toContain('<todo>');
    expect(xmlText).toContain('</todo>');
    expect(xmlText).toContain('<id>');
    expect(xmlText).toContain('<title>');
    expect(xmlText).toContain('<doneStatus>');

    await context.dispose();
  });
});

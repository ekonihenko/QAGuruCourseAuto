import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - PATCH запросы @todos @patch', () => {
  let createdTodoId;
  let originalTodo;

  test.beforeEach(async ({ apiContext, todoFixture }) => {
    const response = await apiContext.post('/todos', { data: todoFixture });
    originalTodo = await response.json();
    createdTodoId = originalTodo.id;
  });

  test('PATCH /todos/:id - частичное обновление title @smoke', async ({ apiContext }) => {
    const patchData = { title: 'Patched Title' };

    const response = await apiContext.patch(`/todos/${createdTodoId}`, {
      data: patchData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(createdTodoId);
    expect(data.title).toBe(patchData.title);
    expect(data.doneStatus).toBe(originalTodo.doneStatus);
    expect(data.description).toBe(originalTodo.description);
  });

  test('PATCH /todos/:id - частичное обновление doneStatus @status', async ({ apiContext }) => {
    const patchData = { doneStatus: true };

    const response = await apiContext.patch(`/todos/${createdTodoId}`, {
      data: patchData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.doneStatus).toBe(true);
    expect(data.title).toBe(originalTodo.title);
    expect(data.description).toBe(originalTodo.description);
  });

  test('PATCH /todos/:id - частичное обновление description @description', async ({
    apiContext,
  }) => {
    const patchData = { description: 'Patched description' };

    const response = await apiContext.patch(`/todos/${createdTodoId}`, {
      data: patchData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.description).toBe(patchData.description);
    expect(data.title).toBe(originalTodo.title);
    expect(data.doneStatus).toBe(originalTodo.doneStatus);
  });

  test('PATCH /todos/:id - обновление нескольких полей @multiple', async ({ apiContext }) => {
    const patchData = {
      title: 'Multi-patch Title',
      description: 'Multi-patch description',
    };

    const response = await apiContext.patch(`/todos/${createdTodoId}`, {
      data: patchData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.title).toBe(patchData.title);
    expect(data.description).toBe(patchData.description);
    expect(data.doneStatus).toBe(originalTodo.doneStatus);
  });

  test('PATCH /todos/:id - попытка обновить несуществующий TODO @negative', async ({
    apiContext,
  }) => {
    const response = await apiContext.patch('/todos/99999', {
      data: { title: 'Patched' },
    });

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(data.errorMessages[0]).toContain('No such todo entity instance');
  });
});

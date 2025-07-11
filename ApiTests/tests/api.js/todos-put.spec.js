import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - PUT запросы @todos @put', () => {
  let createdTodoId;

  test.beforeEach(async ({ apiContext, todoFixture }) => {
    const response = await apiContext.post('/todos', { data: todoFixture });
    const data = await response.json();
    createdTodoId = data.id;
  });

  test('PUT /todos/:id - полное обновление TODO @smoke', async ({ apiContext }) => {
    const updatedData = {
      title: 'Updated Title',
      doneStatus: true,
      description: 'Updated description',
    };

    const response = await apiContext.put(`/todos/${createdTodoId}`, {
      data: updatedData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.id).toBe(createdTodoId);
    expect(data.title).toBe(updatedData.title);
    expect(data.doneStatus).toBe(updatedData.doneStatus);
    expect(data.description).toBe(updatedData.description);
  });

  test('PUT /todos/:id - обновление только обязательных полей @minimal', async ({ apiContext }) => {
    const updatedData = {
      title: 'New Title Only',
      doneStatus: true,
    };

    const response = await apiContext.put(`/todos/${createdTodoId}`, {
      data: updatedData,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data.title).toBe(updatedData.title);
    expect(data.doneStatus).toBe(updatedData.doneStatus);
    expect(data.description).toBe('');
  });

  test('PUT /todos/:id - обновление несуществующего TODO @negative', async ({ apiContext }) => {
    const response = await apiContext.put('/todos/99999', {
      data: {
        title: 'Updated',
        doneStatus: true,
      },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(data.errorMessages[0]).toContain('Cannot create todo with PUT due to Auto fields id');
  });

  test('PUT /todos/:id - обновление без обязательного поля title @negative', async ({
    apiContext,
  }) => {
    const response = await apiContext.put(`/todos/${createdTodoId}`, {
      data: { doneStatus: true },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(data.errorMessages).toContain('title : field is mandatory');
  });

  test('PUT /todos/:id - изменение статуса выполнения @status', async ({ apiContext }) => {
    const createResponse = await apiContext.post('/todos', {
      data: { title: 'Test', doneStatus: false },
    });
    const { id } = await createResponse.json();

    const response = await apiContext.put(`/todos/${id}`, {
      data: { title: 'Test', doneStatus: true },
    });

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.doneStatus).toBe(true);
  });
});

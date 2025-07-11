import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - DELETE запросы @todos @delete', () => {
  test('DELETE /todos/:id - удаление существующего TODO @smoke', async ({
    apiContext,
    todoFixture,
  }) => {
    const createResponse = await apiContext.post('/todos', { data: todoFixture });
    const createdTodo = await createResponse.json();

    const deleteResponse = await apiContext.delete(`/todos/${createdTodo.id}`);

    expect([200, 204]).toContain(deleteResponse.status());

    const getResponse = await apiContext.get(`/todos/${createdTodo.id}`);
    expect(getResponse.status()).toBe(404);
  });

  test('DELETE /todos/:id - попытка удалить несуществующий TODO @negative', async ({
    apiContext,
  }) => {
    const response = await apiContext.delete('/todos/99999');

    expect(response.status()).toBe(404);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');

    const errorMessage = data.errorMessages[0].toLowerCase();
    expect(errorMessage).toMatch(/no such|not found|could not find|entity/i);
  });

  test('DELETE /todos/:id - повторное удаление уже удаленного TODO @negative', async ({
    apiContext,
    todoFixture,
  }) => {
    const createResponse = await apiContext.post('/todos', { data: todoFixture });
    const createdTodo = await createResponse.json();

    const firstDeleteResponse = await apiContext.delete(`/todos/${createdTodo.id}`);
    expect([200, 204]).toContain(firstDeleteResponse.status());

    const secondDeleteResponse = await apiContext.delete(`/todos/${createdTodo.id}`);

    expect(secondDeleteResponse.status()).toBe(404);

    const data = await secondDeleteResponse.json();
    expect(data).toHaveProperty('errorMessages');
    expect(Array.isArray(data.errorMessages)).toBeTruthy();
    expect(data.errorMessages.length).toBeGreaterThan(0);
  });

  test('DELETE /todos/:id - проверка что другие TODO не затронуты @isolation', async ({
    apiContext,
  }) => {
    const todo1Response = await apiContext.post('/todos', {
      data: {
        title: 'First TODO',
        doneStatus: false,
        description: '',
      },
    });
    expect(todo1Response.status()).toBe(201);
    const todo1 = await todo1Response.json();

    const todo2Response = await apiContext.post('/todos', {
      data: {
        title: 'Second TODO',
        doneStatus: false,
        description: '',
      },
    });
    expect(todo2Response.status()).toBe(201);
    const todo2 = await todo2Response.json();

    const deleteResponse = await apiContext.delete(`/todos/${todo1.id}`);
    expect([200, 204]).toContain(deleteResponse.status());

    const allTodosResponse = await apiContext.get('/todos');
    expect(allTodosResponse.status()).toBe(200);

    const allTodos = await allTodosResponse.json();
    const todoIds = allTodos.todos.map((t) => t.id);

    expect(todoIds).not.toContain(todo1.id);

    expect(todoIds).toContain(todo2.id);

    const foundTodo2 = allTodos.todos.find((t) => t.id === todo2.id);
    expect(foundTodo2).toBeDefined();
    expect(foundTodo2.title).toBe('Second TODO');
  });
});

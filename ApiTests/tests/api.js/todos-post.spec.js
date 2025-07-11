import { test, expect } from '../fixtures/api-client';

test.describe('TODO API - POST запросы @todos @post', () => {
  test('POST /todos - создание нового TODO @smoke', async ({ apiContext, todoFixture }) => {
    const response = await apiContext.post('/todos', {
      data: todoFixture,
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(typeof data.id).toBe('number');
    expect(data.title).toBe(todoFixture.title);
    expect(data.doneStatus).toBe(todoFixture.doneStatus);
    expect(data.description).toBe(todoFixture.description);
  });

  test('POST /todos - создание TODO только с обязательными полями @minimal', async ({
    apiContext,
  }) => {
    const minimalTodo = {
      title: 'Minimal TODO',
      doneStatus: false,
      description: '',
    };

    const response = await apiContext.post('/todos', {
      data: minimalTodo,
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.title).toBe(minimalTodo.title);
    expect(data.doneStatus).toBe(minimalTodo.doneStatus);
    expect(data.description).toBe('');
  });

  test('POST /todos - создание TODO без обязательного поля title @negative', async ({
    apiContext,
  }) => {
    const response = await apiContext.post('/todos', {
      data: { doneStatus: false, description: 'test' },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(
      data.errorMessages.some((msg) => msg.includes('title') && msg.includes('mandatory')),
    ).toBeTruthy();
  });

  test('POST /todos - doneStatus не обязательное поле', async ({ apiContext }) => {
    const response = await apiContext.post('/todos', {
      data: { title: 'Test' },
    });

    expect(response.status()).toBe(201);
  });

  test('POST /todos - создание TODO с пустым title @negative', async ({ apiContext }) => {
    const response = await apiContext.post('/todos', {
      data: { title: '', doneStatus: false, description: '' },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(
      data.errorMessages.some((msg) => msg.includes('title') && msg.includes('empty')),
    ).toBeTruthy();
  });

  test('POST /todos - невалидный doneStatus возвращает 400 @negative', async ({ apiContext }) => {
    const response = await apiContext.post('/todos', {
      data: { title: 'Test', doneStatus: 'invalid' },
    });

    expect(response.status()).toBe(400);
  });

  test('POST /todos - создание TODO с очень длинным title @boundary', async ({ apiContext }) => {
    const longTitle = 'A'.repeat(50);
    const response = await apiContext.post('/todos', {
      data: { title: longTitle, doneStatus: false, description: '' },
    });

    expect(response.status()).toBe(201);

    const data = await response.json();
    expect(data.title).toBe(longTitle);
    expect(data.title.length).toBe(50);
  });

  test('POST /todos - создание TODO со слишком длинным title @negative @boundary', async ({
    apiContext,
  }) => {
    const tooLongTitle = 'A'.repeat(51);
    const response = await apiContext.post('/todos', {
      data: { title: tooLongTitle, doneStatus: false, description: '' },
    });

    expect(response.status()).toBe(400);

    const data = await response.json();
    expect(data).toHaveProperty('errorMessages');
    expect(
      data.errorMessages.some((msg) => msg.includes('title') && msg.includes('length')),
    ).toBeTruthy();
  });
});

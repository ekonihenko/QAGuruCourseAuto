import { test, expect } from '@playwright/test';

test('GET#1 Request "todos"', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todos', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });
  expect(response.status()).toBe(200);

  console.log(await response.json());
});

test('GET#2 Неправильный эндпоинт "todo"', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todo', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });

  expect(response.status()).toBe(404);
});

test('GET#3 404 Несуществующий id', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todos/120', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });

  expect(response.status()).toBe(404);

  console.log(await response.json());

  const text = await response.text();
  expect(text).toContain('Could not find an instance with todos/120');
});

test('GET#4 Фильтр по title', async ({ request }) => {
  const response = await request.get(
    'https://apichallenges.herokuapp.com/todos?title=process%20payroll',
  );

  expect(response.status()).toBe(200);

  console.log(await response.json());
});

test('GET#5 Вернуть все экземпляры сущности', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities');

  expect(response.status()).toBe(200);
  console.log(await response.json());
});

test('GET#6 Проверка, что в ответе 10 сущностей', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities');

  expect(response.status()).toBe(200);

  const body = await response.json();
  console.log(body);

  expect(body.entities).toHaveLength(10);
});

test('GET#7 Вернуть экземпляр c Id=6', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities/6');

  expect(response.status()).toBe(200);
  console.log(await response.json());

  const text = await response.text();
  expect(text).toContain('entity number 6');
});

test('GET#8 404-сущность не существует', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities/16');

  expect(response.status()).toBe(404);
  console.log(await response.json());
});

test('POST#1 Создание "Списка дел"', async ({ request }) => {
  const postAPIResponse = await request.post('https://apichallenges.herokuapp.com/todos', {
    headers: {
      Authorization: 'Bearer YOUR_TOKEN_HERE',
      'X-CHALLENGER': 'x-challenger-guid',
    },
    data: {
      title: 'План на неделю',
      doneStatus: true,
      description: 'То что необходимо выполнить за  неделю',
    },
  });
  const postAPIResponseBody = await postAPIResponse.json();
  console.log(postAPIResponseBody);
});

//test('POST#2');

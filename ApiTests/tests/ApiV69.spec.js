import { test, expect } from '@playwright/test';

test('GET#1 Request "todos" ', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todos', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });
  expect(response.status()).toBe(200);

  console.log(await response.json());
});

test('Get#2 Неправильный эндпоинт "todo"', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todo', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });

  expect(response.status()).toBe(404);
});

test('GET#3 404 Несуществующий id" ', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/todos/120', {
    headers: { 'X-CHALLENGER': 'x-challenger-guid' },
  });
  expect(response.status()).toBe(404);

  console.log(await response.json());
  const text = await response.text();
  expect(text).toContain('Could not find an instance with todos/120');
});

test('GET#4 Фильтр по title ', async ({ request }) => {
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

test('GET#6 Проверка,что в ответе 10 сущностей', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities');
  expect(response.status()).toBe(200);

  //Сохранила body в переменную
  const body = await response.json();
  console.log(body);

  //Провекряем , что body содержит 10 сущностей(По доке их 10)
  expect(body.entities).toHaveLength(10);
});

test('GET#7 Вернуть экземпляр c Id=6', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities/6');

  expect(response.status()).toBe(200);
  console.log(await response.json());

  const text = await response.text();
  expect(text).toContain('entity number 6');
});

test('Get#8  404-сущность не существует', async ({ request }) => {
  const response = await request.get('https://apichallenges.herokuapp.com/sim/entities/16');

  expect(response.status()).toBe(404);
  console.log(await response.json());
});

test('Post#1 Успешное создание задания', async ({ request }) => {
  const response = await request.post('https://apichallenges.herokuapp.com/todos', {
    data{
|       "title": "Test",
|       "doneStatus": true,
|       "description": "I study autotesting"
|     }
  });
     expect(response.status()).toBe(201);

  const text = await response.text();
  expect(text).toContain('Test');
  console.log(await response.json());

});

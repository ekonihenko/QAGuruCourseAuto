import { test as base } from '@playwright/test';

export const test = base.extend({
  apiContext: async ({ playwright }, use) => {
    let context = await playwright.request.newContext({
      baseURL: 'https://apichallenges.herokuapp.com',
      extraHTTPHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const challengerResponse = await context.post('/challenger');
    const xChallenger = challengerResponse.headers()['x-challenger'];

    if (xChallenger) {
      await context.dispose();
      context = await playwright.request.newContext({
        baseURL: 'https://apichallenges.herokuapp.com',
        extraHTTPHeaders: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CHALLENGER': xChallenger,
        },
      });
    }

    await use(context);
    await context.dispose();
  },

  todoFixture: async ({}, use) => {
    const todo = {
      title: 'Test TODO',
      doneStatus: false,
      description: 'Test description',
    };
    await use(todo);
  },
});

export { expect } from '@playwright/test';

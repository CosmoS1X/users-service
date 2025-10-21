import { Model } from 'objection';
import knex from 'knex';
import knexConfig from '../knexfile';

beforeAll(async () => {
  const testDb = knex(knexConfig.test);
  Model.knex(testDb);

  await testDb.migrate.latest();
});

afterAll(async () => {
  await Model.knex().destroy();
});

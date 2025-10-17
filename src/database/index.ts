import knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV as keyof typeof knexConfig;
const db = knex(knexConfig[environment]);

Model.knex(db);

export { db, Model };

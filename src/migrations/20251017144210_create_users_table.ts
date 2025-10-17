import type { Knex } from 'knex';

export const up = (knex: Knex) => (
  knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('full_name').notNullable();
    table.timestamp('birth_date');
    table.string('email').notNullable().unique();
    table.string('password_digest').notNullable();
    table.enum('role', ['user', 'admin']).notNullable().defaultTo('user');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex: Knex) => knex.schema.dropTable('users');

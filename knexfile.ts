import 'dotenv/config';
import path from 'path';
import type { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';
import type { Database } from 'sqlite3';

type EnvironmentUnion = 'production' | 'development' | 'test';

const prodMigrationsPath = path.resolve(__dirname, 'dist', 'src', 'migrations');
const devMigrationsPath = path.resolve(__dirname, 'src', 'migrations');

const migrationsConfig: Record<EnvironmentUnion, Knex.MigratorConfig> = {
  production: {
    directory: prodMigrationsPath,
    extension: 'js',
    loadExtensions: ['.js'],
  },
  development: {
    directory: devMigrationsPath,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
  test: {
    directory: devMigrationsPath,
    extension: 'ts',
    loadExtensions: ['.ts'],
  },
};

const commonConfig: Knex.Config = {
  useNullAsDefault: true,
  ...knexSnakeCaseMappers(),
};

const sqlitePoolConfig = {
  afterCreate: (connection: Database, done: (error: Error) => void) => {
    connection.run('PRAGMA foreign_keys = ON', done);
  },
};

const knexConfig: Record<EnvironmentUnion, Knex.Config> = {
  production: {
    client: 'pg',
    connection: {
      database: process.env.PG_DB,
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      ssl: true,
    },
    migrations: migrationsConfig.production,
    ...commonConfig,
  },
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(process.cwd(), 'users-service.sqlite'),
    },
    migrations: migrationsConfig.development,
    pool: sqlitePoolConfig,
    ...commonConfig,
  },
  test: {
    client: 'sqlite3',
    connection: ':memory:',
    // debug: true,
    migrations: migrationsConfig.test,
    pool: sqlitePoolConfig,
    ...commonConfig,
  },
};

export default knexConfig;

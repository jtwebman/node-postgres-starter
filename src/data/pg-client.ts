import postgres from 'postgres';
import { Config } from '../lib/config.js';
import { DB } from './db.js';

function wrappedClient(sql: postgres.Sql | postgres.TransactionSql): DB<postgres.Sql | postgres.TransactionSql> {
  return {
    async startTransaction<T>(fn: (db: DB<postgres.Sql>) => T | Promise<T>): Promise<T | undefined> {
      let value: T | undefined;
      await sql.begin<T>(async (inTransactionClient) => {
        value = await fn(wrappedClient(inTransactionClient));
        return value;
      });
      return value;
    },
    async validConnection(): Promise<boolean> {
      const values = await sql<readonly { connected: boolean }[]>`SELECT true as connected`;
      return values[0]?.connected || false;
    },
    getInteralClient(): postgres.Sql {
      return sql;
    },
  };
}

export function getClient(config: Config): DB<postgres.Sql | postgres.TransactionSql> {
  return wrappedClient(
    postgres(config.PG_CONNECTION_URL, {
      max: config.PG_CONNECTION_POOL,
    }),
  );
}

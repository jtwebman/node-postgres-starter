import postgres from 'postgres';

import config from './lib/config.js';
import { DB, waitDBConnect } from './data/db.js';
import { getClient } from './data/pg-client.js';

const db: DB<postgres.Sql | postgres.TransactionSql> = getClient(config);

waitDBConnect(db, 6).then(() => {
  console.log('started');
});

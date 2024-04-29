import retry from 'async-retry';

export interface DB<dbT> {
  /**
   * Starts a trnasaction with all code running inside the function passed in a transaction.
   * @param fn - A function that takes the db client that is now i na transaction
   * @returns - It will return the generic type you give it.
   */
  startTransaction<T>(fn: (db: DB<dbT>) => T | Promise<T>): Promise<T | undefined>;

  /**
   * Used to check for a valid db connection to start service or healthcehcks
   */
  validConnection(): Promise<boolean>;

  /**
   * Used only in the data layer to get the internal client and run db stuff. This abstracts out transactions in business logic
   * without them having to understand the library doing DB things unter the hood.
   * @returns - It will return the generic type given to DB.
   */
  getInteralClient(): dbT;
}

export function waitDBConnect<dbT>(db: DB<dbT>, retries: number = 6) {
  return retry(
    async () => {
      await db.validConnection();
      return db;
    },
    {
      retries,
    },
  );
}

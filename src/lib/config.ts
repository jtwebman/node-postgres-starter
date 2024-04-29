export interface Config {
  PORT: number;
  PG_CONNECTION_URL: string;
  PG_CONNECTION_POOL: number;
}

const config: Config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  PG_CONNECTION_URL: process.env.PG_CONNECTION_URL ? process.env.PG_CONNECTION_URL : '',
  PG_CONNECTION_POOL: process.env.PG_CONNECTION_POOL ? parseInt(process.env.PG_CONNECTION_POOL, 10) : 50,
};

export default config;

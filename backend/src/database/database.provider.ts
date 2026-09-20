import { Pool } from 'pg';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const databaseProvider = {
  provide: DATABASE_CONNECTION,
  useFactory: async (): Promise<Pool> => {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    await pool.query('SELECT 1');
    console.log('✓ Database connected');

    return pool;
  },
};

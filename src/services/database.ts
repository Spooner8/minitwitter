import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schemas/index.ts';

type DBSchema = NodePgDatabase<typeof schema>;
const DATABASE_URL = process.env.DATABASE_URL!;

/**
 * @description
 * This is the database connection object that is used to interact with the database.  
 * It is created using the `drizzle` function from the `drizzle-orm` package.
 */
const db: DBSchema = drizzle(DATABASE_URL);
export { db };

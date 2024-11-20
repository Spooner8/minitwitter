import 'dotenv/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../schemas/index.ts';

type DBSchema = NodePgDatabase<typeof schema>;

const db: DBSchema = drizzle(process.env.DATABASE_URL!);
export { db };

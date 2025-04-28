import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const queryClient = postgres(process.env.POSTGRES_URI!)

const db = drizzle(queryClient, { logger: true })

export default db

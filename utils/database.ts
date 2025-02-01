import { neon } from "@neondatabase/serverless";

export default neon(process.env.POSTGRES_URL || "");

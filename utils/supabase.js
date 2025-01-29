import { createClient } from "@supabase/supabase-js";

export default createClient(
	process.env.GLOBALDB_SUPABASE_URL,
	process.env.GLOBALDB_NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

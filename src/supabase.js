import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hqhxphhwtvztowiwykda.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxaHhwaGh3dHZ6dG93aXd5a2RhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MzA3NjYsImV4cCI6MjA5MTQwNjc2Nn0.twS6KVHd6r9-dsx6wYF-MBjPEGm-XNtoC1a4VZu8YCM";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
# supabase.py
# Creates one Supabase client that entire app shares
# Imported by other service files

from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY, SUPABASE_SERVICE_ROLE_KEY

# Use the service role key when available, because backend writes may be blocked by
# row-level security policies when using the public anon key.
key_to_use = SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY
if not key_to_use:
    raise RuntimeError(
        "Supabase key not configured. Set SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY in .env"
    )

# Single client instance
client = create_client(SUPABASE_URL, key_to_use)
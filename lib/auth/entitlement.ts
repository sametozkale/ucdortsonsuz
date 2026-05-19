import { hasSupabaseConfig } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export function isReaderDevBypass(): boolean {
  return process.env.READER_DEV_BYPASS === "true";
}

export async function hasBookEntitlement(bookId: string): Promise<boolean> {
  if (isReaderDevBypass()) return true;

  if (!hasSupabaseConfig()) return true;

  const supabase = await createClient();
  if (!supabase) return false;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("entitlements")
    .select("book_id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .maybeSingle();

  return Boolean(data);
}

import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  BOOK_PURCHASE_FALLBACK_HREF,
  BOOK_PURCHASE_URL,
} from "@/lib/constants";

function purchaseDestination(request: NextRequest): URL | string {
  if (BOOK_PURCHASE_URL) return BOOK_PURCHASE_URL;
  return new URL(BOOK_PURCHASE_FALLBACK_HREF, request.url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isReader = pathname.startsWith("/oku");

  if (!isReader) {
    return NextResponse.next();
  }

  if (process.env.READER_DEV_BYPASS === "true") {
    return NextResponse.next();
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isReader && !user) {
    return NextResponse.redirect(purchaseDestination(request));
  }

  return response;
}

export const config = {
  matcher: ["/oku/:path*"],
};

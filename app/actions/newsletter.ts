"use server";

import { z } from "zod";
import { hasSupabaseConfig } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin."),
  name: z.string().optional(),
  consent: z
    .string()
    .refine((v) => v === "on", "Gizlilik politikasını kabul etmelisiniz."),
});

export type NewsletterState = {
  ok: boolean;
  message: string;
};

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    name: formData.get("name") || undefined,
    consent: formData.get("consent"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Form geçersiz.",
    };
  }

  const { email, name } = parsed.data;

  if (!hasSupabaseConfig()) {
    return {
      ok: true,
      message:
        "Kaydınız alındı (geliştirme modu). Supabase bağlandığında kalıcı olarak saklanacak.",
    };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { ok: false, message: "Bağlantı kurulamadı. Lütfen tekrar deneyin." };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: email.toLowerCase().trim(),
    name: name?.trim() || null,
    source: "website",
    consent: true,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: true, message: "Bu e-posta zaten kayıtlı." };
    }
    return { ok: false, message: "Kayıt sırasında bir hata oluştu." };
  }

  return {
    ok: true,
    message: "Listeye başarıyla kaydoldunuz. Teşekkürler!",
  };
}

"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState = { ok: false, message: "" };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(
    subscribeNewsletter,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="newsletter-name" className="text-sm text-ink-secondary">
          Ad (isteğe bağlı)
        </Label>
        <Input
          id="newsletter-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Adınız"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newsletter-email" className="text-sm text-ink-secondary">
          E-posta
        </Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="ornek@email.com"
          aria-describedby="newsletter-status"
        />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="newsletter-consent" name="consent" required value="on" />
        <Label
          htmlFor="newsletter-consent"
          className="text-sm font-normal leading-relaxed text-ink-secondary"
        >
          E-posta listesine kaydolmayı ve{" "}
          <a href="/gizlilik" className="text-link">
            gizlilik politikasını
          </a>{" "}
          kabul ediyorum.
        </Label>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Kaydediliyor…" : "Listeye katıl"}
      </Button>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}
      >
        {state.message}
      </p>
    </form>
  );
}

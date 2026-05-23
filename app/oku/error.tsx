"use client";

import { useEffect } from "react";

export default function OkuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[reader] route error", error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-stone-500">
        Okuyucu yüklenirken bir sorun oluştu. Sayfayı yenileyin.
      </p>
      <button
        type="button"
        onClick={reset}
        className="font-medium text-stone-800 underline"
      >
        Tekrar dene
      </button>
    </div>
  );
}

import Link from "next/link";

export function SampleContentFooter() {
  return (
    <footer className="mt-12 pt-8 text-sm text-ink-secondary">
      <Link href="/ornekler" className="text-link !no-underline hover:underline">
        Diğer örnekler
      </Link>
      {" · "}
      <Link href="/kitap" className="text-link !no-underline hover:underline">
        Kitap hakkında
      </Link>
      {" · "}
      <Link href="/satin-al" className="text-link !no-underline hover:underline">
        Satın al
      </Link>
    </footer>
  );
}

import Link from "next/link";
import { PurchaseLink } from "@/components/marketing/PurchaseLink";

export function SampleContentFooter() {
  return (
    <footer className="mt-12 pt-8 text-sm text-ink-secondary">
      <Link href="/#kitaptan" className="text-link !no-underline hover:underline">
        Kitaptan örnekler
      </Link>
      {" · "}
      <Link href="/kitap" className="text-link !no-underline hover:underline">
        Kitap hakkında
      </Link>
      {" · "}
      <PurchaseLink className="text-link !no-underline hover:underline">
        Satın al
      </PurchaseLink>
    </footer>
  );
}

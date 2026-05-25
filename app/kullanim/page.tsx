import { LegalDocument } from "@/components/legal/LegalDocument";
import { TERMS_OF_USE_MD } from "@/lib/legal/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Kullanım Koşulları",
  description:
    "ucdortsonsuz.com kullanım koşulları: telif, dijital okuyucu, e-kitap indirme ve satın alma.",
  path: "/kullanim",
});

export default function KullanimPage() {
  return (
    <LegalDocument title="Kullanım Koşulları" markdown={TERMS_OF_USE_MD} />
  );
}

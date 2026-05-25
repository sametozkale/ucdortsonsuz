import { LegalDocument } from "@/components/legal/LegalDocument";
import { PRIVACY_POLICY_MD } from "@/lib/legal/content";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Gizlilik Politikası",
  description:
    "ucdortsonsuz.com gizlilik politikası: bülten, dijital okuyucu, e-kitap indirme ve KVKK haklarınız.",
  path: "/gizlilik",
});

export default function GizlilikPage() {
  return (
    <LegalDocument title="Gizlilik Politikası" markdown={PRIVACY_POLICY_MD} />
  );
}

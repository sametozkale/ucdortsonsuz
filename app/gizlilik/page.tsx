import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Gizlilik Politikası",
  description: "ucdortsonsuz.com gizlilik politikası ve KVKK bilgilendirmesi.",
  path: "/gizlilik",
});

export default function GizlilikPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 prose prose-stone">
      <h1 className="font-serif text-3xl font-semibold">Gizlilik Politikası</h1>
      <p className="mt-6 text-stone-700 leading-relaxed">
        Bu site, Samet Özkale&apos;nin Üç Dört Sonsuz kitabını tanıtmak ve
        dijital olarak sunmak amacıyla işletilmektedir. E-posta listesi
        kayıtları yalnızca iletişim ve duyurular için kullanılır; üçüncü
        taraflarla paylaşılmaz.
      </p>
      <p className="mt-4 text-stone-700 leading-relaxed">
        Okuma ayraçları tarayıcınızda yerel olarak (localStorage) saklanır;
        sunucuya gönderilmez. Satın alma ve hesap verileri Supabase altyapısında
        güvenli şekilde tutulur.
      </p>
      <p className="mt-4 text-stone-700 leading-relaxed">
        Sorularınız için: info@ucdortsonsuz.com
      </p>
    </article>
  );
}

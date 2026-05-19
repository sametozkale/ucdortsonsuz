import {
  AUTHOR_NAME,
  BOOK_DESCRIPTION,
  BOOK_SLUG,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
} from "@/lib/constants";
import type { Book, BookItem, BookSection } from "@/lib/book/types";

const BOOK_ID = "00000000-0000-4000-8000-000000000001";

export const MOCK_BOOK: Book = {
  id: BOOK_ID,
  title: BOOK_TITLE,
  author_name: AUTHOR_NAME,
  slug: BOOK_SLUG,
  description: BOOK_DESCRIPTION,
  cover_image_url: null,
};

export const MOCK_SECTIONS: BookSection[] = [
  {
    id: "sec-front",
    book_id: BOOK_ID,
    type: "front_matter",
    title: "Önsöz",
    sort_order: 1,
  },
  {
    id: "sec-story",
    book_id: BOOK_ID,
    type: "story",
    title: "Kitabın Hikayesi",
    sort_order: 2,
  },
  {
    id: "sec-toc",
    book_id: BOOK_ID,
    type: "toc",
    title: "İçindekiler",
    sort_order: 3,
  },
  {
    id: "sec-poems",
    book_id: BOOK_ID,
    type: "poems",
    title: "Şiirler",
    sort_order: 4,
  },
  {
    id: "sec-essays",
    book_id: BOOK_ID,
    type: "essays",
    title: "Denemeler",
    sort_order: 5,
  },
];

const ONSOZ = `Bu kitap, sayıların ve sessizliğin arasında büyüyen bir yolculuğun kaydıdır.

Üç ile dört arasında kalan, sonsuzla konuşan her satır, okura bir kapı açmak için yazıldı.`;

const STORY = `**Üç Dört Sonsuz**'un doğuşu, bir defterin ortasından başlar.

Yıllar süren notlar, gece yarısı yazılmış cümleler ve hiç gönderilmemiş mektuplar — hepsi bu kitapta bir araya geldi. Şiirler duygunun dilini, denemeler ise düşüncenin izini süer.

Samet Özkale, bu metinlerde hem kişisel hem evrensel bir ses arar: kayıp, bellek, şehir, aile ve kelimelerin kendisi.`;

const ZEYTIN_AGACI = `Zeytin dallarının karmaşasıyım ben

Yeşilin hakimiyeti kahverenginin mağduriyetiyim

Fikirlerim köklerim ve ben köklerimin sahibiyim

Biçimim, biçemim ve asaletim

Yağan yağmurlar oldu sırdaşım

Ben, bu dünyada kayda geçmez vilayetim

Sen, gönlünü benden esirgemeyen toprağım

Ben senin sonu olmayan hikayenim

Ve yine ben, zeytin ağacı

Tek bir zeytinde olsa verebilmek için

Seni günlerce bekledim…`;

function poemBody(n: number): string {
  return `Gecenin ortasında uyandım,
sayılar pencereden içeri girdi.

${n}. şiir bu kitabın
sessiz haritasında bir durak.

Bir satır daha — ve kapanır
kapılar ardında kalan ışık.`;
}

function essayBody(n: number): string {
  return `Deneme ${n}: Kelimelerin gölgesinde

Yazmak, hatırlamanın başka bir biçimidir. Bu denemede yazar, çocukluğundan bugüne uzanan bir ipi takip eder; her paragraf bir durak, her cümle bir nefes.

Okur burada şiirden farklı bir ritim bulur — düşüncenin açık yüzü.`;
}

function buildMockItems(): BookItem[] {
  const items: BookItem[] = [];
  let order = 1;

  items.push({
    id: "item-onsoz",
    book_id: BOOK_ID,
    section_id: "sec-front",
    kind: "page",
    title: "Önsöz",
    slug: "onsoz",
    excerpt: "Kitabın kapısını aralayan önsöz.",
    body_md: ONSOZ,
    sort_order: order++,
    is_sample: false,
    is_public_seo: true,
    page_breaks: null,
    section: MOCK_SECTIONS[0],
  });

  items.push({
    id: "item-story",
    book_id: BOOK_ID,
    section_id: "sec-story",
    kind: "page",
    title: "Kitabın Hikayesi",
    slug: "kitabin-hikayesi",
    excerpt:
      "Üç Dört Sonsuz'un nasıl yazıldığını ve hangi temaları taşıdığını anlatan bölüm.",
    body_md: STORY,
    sort_order: order++,
    is_sample: true,
    is_public_seo: true,
    page_breaks: null,
    section: MOCK_SECTIONS[1],
  });

  items.push({
    id: "item-toc",
    book_id: BOOK_ID,
    section_id: "sec-toc",
    kind: "page",
    title: "İçindekiler",
    slug: "icindekiler",
    excerpt: "Kitaptaki tüm bölüm ve metinlerin listesi.",
    body_md: `**İçindekiler**\n\nÖnsöz\nKitabın Hikayesi\n\n**Şiirler** (${POEM_COUNT})\n**Denemeler** (${ESSAY_COUNT})`,
    sort_order: order++,
    is_sample: false,
    is_public_seo: true,
    page_breaks: null,
    section: MOCK_SECTIONS[2],
  });

  for (let i = 1; i <= POEM_COUNT; i++) {
    const isZeytinAgaci = i === 1;
    const slug = isZeytinAgaci ? "zeytin-agaci" : `siir-${i}`;
    items.push({
      id: `item-poem-${i}`,
      book_id: BOOK_ID,
      section_id: "sec-poems",
      kind: "poem",
      title: isZeytinAgaci ? "Zeytin Ağacı" : `Şiir ${i}`,
      slug,
      excerpt: isZeytinAgaci
        ? "Zeytin ağacı, toprak ve kökler üzerine bir şiir."
        : `Üç Dört Sonsuz kitabının ${i}. şiiri — duygu, bellek ve dil üzerine.`,
      body_md: isZeytinAgaci ? ZEYTIN_AGACI : poemBody(i),
      sort_order: order++,
      is_sample: i <= 3,
      is_public_seo: true,
      page_breaks: null,
      section: MOCK_SECTIONS[3],
    });
  }

  for (let i = 1; i <= ESSAY_COUNT; i++) {
    const slug = `deneme-${i}`;
    items.push({
      id: `item-essay-${i}`,
      book_id: BOOK_ID,
      section_id: "sec-essays",
      kind: "essay",
      title: `Deneme ${i}`,
      slug,
      excerpt: `Samet Özkale'nin ${i}. denemesi — düşünce, bellek ve yazının izinde.`,
      body_md: essayBody(i),
      sort_order: order++,
      is_sample: i === 1,
      is_public_seo: true,
      page_breaks: null,
      section: MOCK_SECTIONS[4],
    });
  }

  return items;
}

export const MOCK_ITEMS = buildMockItems();

export const MOCK_AUTHOR_BIO = `Samet Özkale, şiir ve düzyazı üzerine çalışan bir yazardır. **Üç Dört Sonsuz**, 45 şiir ve 11 denemeden oluşan ilk şiir kitabıdır.

Yazılarında bellek, şehir, aile ve kelimelerin gölgesi öne çıkar. Türkçe edebiyatın çağdaş sesine katkı sunmayı hedefler.`;

export const MOCK_PRESS_RELEASE = `**Basın Bülteni — Üç Dört Sonsuz**

Samet Özkale'nin yeni şiir kitabı *Üç Dört Sonsuz*, 45 şiir ve 11 denemeden oluşuyor. Kitap, sayılar ile sonsuzluk arasında kurulan şiirsel bir diyaloğu okura sunuyor.

Dijital sürüm ucdortsonsuz.com üzerinden okunabilir ve satın alınabilir. Basın soruları için: info@ucdortsonsuz.com`;

export const MOCK_FAQ = [
  {
    question: "Üç Dört Sonsuz kitabı kaç şiir ve deneme içeriyor?",
    answer: `Kitap ${POEM_COUNT} şiir ve ${ESSAY_COUNT} denemeden oluşur; ayrıca önsöz, kitabın hikayesi ve içindekiler bölümleri yer alır.`,
  },
  {
    question: "Kitabı satın aldıktan sonra nasıl okuyabilirim?",
    answer:
      "Satın alım sonrası e-posta ile giriş bağlantısı alırsınız. Giriş yaptıktan sonra /oku sayfasından kitabı sayfa çevirerek okuyabilir, ayraç koyabilirsiniz.",
  },
  {
    question: "Ücretsiz örnek metinler var mı?",
    answer:
      "Evet. /ornekler sayfasında ücretsiz şiir ve deneme örneklerini tam metin olarak okuyabilirsiniz.",
  },
  {
    question: "e-kitap formatlarında indirme mümkün mü?",
    answer:
      "Satın alan okurlar PDF, EPUB ve Kindle uyumlu dosyaları /indir sayfasından indirebilir (Faz 2'de aktif).",
  },
  {
    question: "Kitabın yazarı kimdir?",
    answer: `${AUTHOR_NAME}, Üç Dört Sonsuz'un yazarıdır. Biyografi ve basın notu için /hakkimda sayfasını ziyaret edin.`,
  },
];

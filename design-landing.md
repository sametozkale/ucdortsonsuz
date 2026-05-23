# Landing Design — Üç Dört Sonsuz

Referans yapı: [Pulma](https://pulma.framer.website/) (Framer portfolyo şablonu).  
Global token’lar: [`design.md`](design.md) — landing bu dosyada **ek** kurallar tanımlar, palet/font değiştirmez.

## Pulma’dan uyarlanan prensipler

| Pulma | Landing karşılığı |
|-------|-------------------|
| Section eyebrow | `Kitaptan`, `Yazar`, `Nasıl okunur` |
| Display headline | Hero: kitap adı + tek cümle tez |
| Featured case | `FeaturedSample` — büyük görsel + alıntı + gerçek sayılar |
| Project grid | `ShowcaseGrid` — 2–3 sütun, görsel ağırlıklı kartlar |
| Soft whitespace | `--space-16` / `--space-24` section padding |
| Scroll motion | `LandingReveal` — max 400ms, `prefers-reduced-motion` |

**Yasaklar:** uydurma metrik (% dönüşüm vb.), Pulma stok moda görselleri, `/oku` okuyucu stillerine müdahale.

## Ziyaretçi hunisi

1. **Dikkat** — Hero + kapak görseli → birincil CTA `/satin-al`
2. **İlgi** — Öne çıkan örnek (Zeytin Ağacı) → `/siir/zeytin-agaci`
3. **Güven** — Yazar bölümü → `/hakkimda`, `/kitap`
4. **Arzu** — Vitrin grid → örnek metinler
5. **Eylem** — Kapanış CTA → `/satin-al`

## Section sırası (`app/page.tsx`)

1. `LandingHero`
2. `FeaturedSample`
3. `ShowcaseGrid`
4. `LandingAuthor`
5. `LandingPurchaseStrip`
6. `LandingClosingCta`

## CTA hiyerarşisi

- Birincil: `btn-primary` → Satın al (`/satin-al`)
- İkincil: `btn-ghost` veya `text-link` → Örnekler, Kitap, Hakkımda
- Metin linkleri: vitrin kartları, featured «Oku»

## Bileşenler (`components/landing/`)

| Bileşen | Rol |
|---------|-----|
| `LandingReveal` | Scroll fade-in (client) |
| `LandingHero` | Kapak + başlık + CTA |
| `FeaturedSample` | Pulma featured slot |
| `ShowcaseCard` / `ShowcaseGrid` | Vitrin kartları |
| `LandingAuthor` | Portre + kitap sözü |
| `LandingPurchaseStrip` | 3 adım, minimal şerit |
| `LandingClosingCta` | Son band + disclaimer |

## Tipografi

- Hero başlık: `clamp(2.75rem, 7vw, 4.5rem)`, `--font-display`, weight 600
- Section title: `--text-2xl` / display, `-0.02em` tracking
- Kart başlık: `--text-lg`, semibold
- Alıntı: `--font-serif`, italic, `clamp(1.25rem, 3vw, 1.75rem)`
- Eyebrow: `--text-xs`, uppercase, `0.08em` letter-spacing

## Görsel

- Hero / featured: `BOOK_COVER_BG_URL`, aspect 4/5 veya 16/10, `object-cover`, alt gradient overlay
- Vitrin: kapak türevi veya `landing-showcase-visual--n` CSS gradient (index % 4)
- Yazar: `AUTHOR_PHOTO_SRC` veya placeholder

## Motion

- `LandingReveal`: opacity 0→1, y 16→0, duration 0.4s, `viewport.once`
- Kart hover: `transform: translateY(-2px)`, border-color — CSS only
- `prefers-reduced-motion: reduce` → animasyon yok

## Erişilebilirlik

- Her `section` → `aria-labelledby`
- Görseller → anlamlı `alt`
- Focus: mevcut `--shadow-focus` / `btn-*` stilleri

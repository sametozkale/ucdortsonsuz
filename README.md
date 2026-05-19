# Üç Dört Sonsuz — ucdortsonsuz.com

Samet Özkale'nin şiir kitabı için Next.js sitesi: keşif (SEO/GEO), ücretsiz örnekler, Framer Motion okuyucu, Supabase içerik.

## Gereksinimler

- Node.js >= 20.9

## Kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Ortam değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `NEXT_PUBLIC_SITE_URL` | Canlı site URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Import script için |
| `READER_DEV_BYPASS` | `true` iken `/oku` herkese açık (Faz 1) |

## Notion içerik aktarımı

1. `content/notion-export.json` dosyasını `content/notion-export.example.json` yapısına göre hazırlayın
2. `npm run import:notion`

## Supabase

```bash
supabase db push
```

Migration: `supabase/migrations/20250519000000_initial_schema.sql`

## Komutlar

- `npm run dev` — geliştirme sunucusu
- `npm run build` — production build
- `npm run import:notion` — Notion JSON → Supabase

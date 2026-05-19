# -*- coding: utf-8 -*-
"""Şiir metinleri — mock / import kaynağı. poetry: python3 scripts/poem-content-data.py"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT_JSON = ROOT / "content" / "poems.json"
OUT_TS = ROOT / "lib" / "book" / "poem-bodies.ts"

# (slug, body) — catalog sırasıyla
POEMS: list[tuple[str, str]] = [
    (
        "zeytin-agaci",
        """Zeytin dallarının karmaşasıyım ben

Yeşilin hakimiyeti kahverenginin mağduriyetiyim

Fikirlerim köklerim ve ben köklerimin sahibiyim

Biçimim, biçemim ve asaletim

Yağan yağmurlar oldu sırdaşım

Ben, bu dünyada kayda geçmez vilayetim

Sen, gönlünü benden esirgemeyen toprağım

Ben senin sonu olmayan hikayenim

Ve yine ben, zeytin ağacı

Tek bir zeytinde olsa verebilmek için

Seni günlerce bekledim…""",
    ),
    (
        "harman",
        """Bir kaldırım taşı,

Binlerce ayak izi

Sabah,gülümseyen bulut

Milyonlarca yağmur damlası

Bir sokak lambası

Bir karanlığın daha aydınlanması

Saat 07:42,yeni doğan bir bebek

Taptaze ekmek kıvamında umutlar

Sonsuzluğa kanat açmış minik kuş

İlerliyor,ufkun paralelinde

Zaman durmak bilmez

Durdurabilmek imkansız

Bir şarkı,ruhumun yansıması

Beklenmedik anda geçmişin anımsanması

Parmaklarım,mürekkebe bulanmış

Kalemim kağıdın koynunda

Yıldızlar,seyre doyumsuzlar

Kimi sessiz kalırken kimileri ışığı haykırırlar

Gönül,ne yapacağını bilmez

Çaresiz,aslında ne idüğü belirsiz

Yaşam,eşsiz bir klarnet

Üflemesini bilene

Ölüm,geride kalanlara yas

Ölüye ise yepyeni bir başlangıç…""",
    ),
    (
        "kahverengi",
        """Huzurun tanımını değiştirirsek her gün

Yeni mutsuzluklar türetmenin formülünü keşfederiz

Oysa yeşilin huzuru öyle kadimdir ki

Yeni bir keşfe tenezzül etmez, ihtiyaç duymaz

Yüksek binaların arasına sıkışıp kalmışsa yaratıcılık

Bugün koşmak gerek maviden yeşile, yeşilden maviye

Ancak toprak bu hikayede hep unutulan olmuştur

Aynı sınıfın sessiz çocuğu gibi

Hiç duydunuz mu dün kahverengi diyeni

Suyun bedeninizden çok o dokunduğunda dans ettiğidir

Aynı ilhamın sizin zihninize tosladığı gibi

Güneşli havada devasa bir çam dibi

Bakın biz farketmeden buluşturdu fotoğraf karesinde

Sizi, bizi, ilimi ve bilimi..

Aa yine bir gökyüzü, masmavi

Bu benzersiz çamın yeşili

Ve bir de sınıfın sessiz çocuğu

Kahverengi…""",
    ),
]

# Remaining poems appended in generate script run via exec of part2
PART2_SLUGS = [
    "el-alem",
    "bir-kusak-geliyor",
    "sessiz-camia",
    "nar",
    "bizim-siirin-kizi",
    "makber",
    "iyi-sonsuzluklar",
    "bicak-alti",
    "bizim-kuslar-mezarliklarda-durmazlar",
    "kara-para",
    "ahh-galata",
    "sihirbaz",
    "yine-gunduz",
    "tukenmisligin-belirtileri",
    "hesabini-yapmak-kaybini-zamanin",
    "yorgun",
    "sabah-sulari",
    "benle",
    "aciya-bak",
    "ahh-kelimeler",
    "devam-yola",
    "eskiz",
    "felaket",
    "lale-sarhos",
    "manset",
    "pusulam",
    "rastlanti",
    "sectim",
    "lorem-ipsum",
    "luna-park",
    "kamp-hali",
    "yaz-beni",
    "gel-ecek",
    "licneb-anas",
    "imza",
    "emek",
    "bilincaltim-uyardi",
    "dusler-prensi",
    "ilham",
    "su-kurbagasi",
    "hikmet",
    "bazense-susmak",
]

def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

def write_outputs(poems: list[tuple[str, str]]) -> None:
    data = {slug: body.strip() for slug, body in poems}
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    lines = [
        "/** Şiir tam metinleri — scripts/poem-content-data.py ile üretilir */",
        "",
        "export const POEM_BODIES_BY_SLUG: Record<string, string> = {",
    ]
    for slug, body in poems:
        lines.append(f'  "{slug}": `{ts_escape(body.strip())}`,')
    lines.append("};")
    lines.append("")
    lines.append("export function getPoemBody(slug: string): string | undefined {")
    lines.append("  return POEM_BODIES_BY_SLUG[slug];")
    lines.append("}")
    lines.append("")

    OUT_TS.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(poems)} poems → {OUT_JSON.name}, {OUT_TS.name}")

if __name__ == "__main__":
    write_outputs(POEMS)

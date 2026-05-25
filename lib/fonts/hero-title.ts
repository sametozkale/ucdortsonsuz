import { Libre_Baskerville } from "next/font/google";

/** Hero başlık + üst menü kitap adı */
export const heroTitleFont = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  weight: ["400", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

import {
  AUTHOR_CONTACT_EMAIL,
  AUTHOR_NAME,
  BOOK_TITLE,
  ESSAY_COUNT,
  POEM_COUNT,
  CANONICAL_SITE_URL,
  SITE_NAME,
} from "@/lib/constants";

/** Yasal metinlerde kullanılan son güncelleme tarihi (gösterim) */
export const LEGAL_LAST_UPDATED = "25 Mayıs 2026";

const site = CANONICAL_SITE_URL.replace(/\/$/, "");

export const PRIVACY_POLICY_MD = `
Bu Gizlilik Politikası, **${site}** (“Site”) üzerinden sunulan hizmetler kapsamında kişisel verilerinizin nasıl işlendiğini açıklar. Site, **${AUTHOR_NAME}** tarafından **${BOOK_TITLE}** adlı eserin tanıtımı, ücretsiz örnek metinlerin paylaşımı, dijital okuyucu ve e-kitap indirme hizmetleri için işletilir.

## 1. Veri sorumlusu

6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) kapsamında veri sorumlusu:

- **${AUTHOR_NAME}** (yazar / site işleteni)
- **İletişim:** [${AUTHOR_CONTACT_EMAIL}](mailto:${AUTHOR_CONTACT_EMAIL})
- **Basın ve röportaj:** ${AUTHOR_CONTACT_EMAIL}

## 2. Kapsam

Bu politika Site’yi ziyaret ettiğinizde, bültene kayıt olduğunuzda, kitabı satın aldıktan sonra dijital okuyucuya (/oku) eriştiğinizde veya e-kitap indirdiğinizde geçerlidir. Ödeme işlemi harici bir satış sayfasında (ör. Stripe, iyzico veya yayıncı/mağaza altyapısı) tamamlanıyorsa, ödeme sırasında işlenen kart ve fatura verileri ilgili ödeme hizmeti sağlayıcısının politikalarına tabidir.

## 3. İşlenen kişisel veriler

- **Bülten formu:** E-posta, isteğe bağlı ad, onay kaydı — ana sayfadaki “Listeye katıl” formu
- **Dijital erişim:** E-posta, oturum kimliği, teknik oturum çerezleri — tam kitap okuyucusu (/oku) ve indirme yetkisi
- **Satın alma / yetki:** Kullanıcı kimliği, kitap yetkisi kaydı — ödeme sonrası erişim hakkının tanınması
- **Okuyucu (tarayıcı):** Ayraç konumu — yalnızca cihazınızda yerel depolama ile saklanır; sunucuya gönderilmez
- **Sunucu günlükleri:** IP, tarayıcı türü, istek zamanı — güvenlik ve teknik işletim (barındırma sağlayıcısı)

Site, ziyaretçi davranışını ölçmek için üçüncü taraf reklam veya profil oluşturma amaçlı izleme pikselleri kullanmaz.

## 4. İşleme amaçları

- Kitap ve yazar hakkında bilgilendirme
- Ücretsiz örnek şiir ve denemelerin sunulması
- Bülten aboneliği ve duyurular (yalnızca açık rızanız ile)
- Satın alma sonrası dijital okuyucu ve e-kitap (PDF, EPUB, Kindle/MOBI) erişiminin sağlanması
- Güvenlik, dolandırıcılık önleme ve teknik destek
- Yasal yükümlülüklerin yerine getirilmesi

## 5. Hukuki sebepler

KVKK m. 5 ve 6 uyarınca verileriniz; sözleşmenin kurulması veya ifası, veri sorumlusunun meşru menfaati, açık rızanız (bülten) ve kanunlarda öngörülmesi hâlinde hukuki yükümlülük kapsamında işlenebilir.

## 6. Saklama süreleri

- **Bülten:** Abonelik süresince; abonelikten çıkma talebinizde makul süre içinde silinir veya anonimleştirilir.
- **Hesap ve yetki kayıtları:** Erişim hakkınız sürdükçe ve yasal saklama süreleri boyunca.
- **Ayraç (localStorage):** Tarayıcı verisini siz silene kadar cihazınızda kalır.
- **Sunucu günlükleri:** Barındırma sağlayıcısının varsayılan saklama politikasına uygun, genelde kısa süreli.

## 7. Üçüncü taraflar ve aktarım

Verileriniz aşağıdaki hizmet sağlayıcılarla, yalnızca hizmetin sunulması için sınırlı olarak paylaşılabilir:

- **Supabase** — veritabanı, kimlik doğrulama ve bülten kayıtları (AB/ABD bölgesel sunucular; sağlayıcı sözleşmesi ve DPA çerçevesinde)
- **Barındırma (ör. Vercel)** — Site’nin yayını ve edge/sunucu günlükleri
- **Ödeme / satış ortağı** — “Satın Al” bağlantısı harici bir ödeme veya mağaza sayfasına gidiyorsa, ödeme verileri doğrudan o sağlayıcıda işlenir; Site kart bilgisi toplamaz

Kişisel verileriniz, açık rızanız veya KVKK’da öngörülen hâller dışında ticari amaçla üçüncü taraflara satılmaz veya kiralanmaz.

## 8. Çerezler ve benzer teknolojiler

- **Zorunlu oturum çerezleri:** Dijital okuyucuya giriş yaptığınızda kimliğinizin doğrulanması için Supabase Auth çerezleri kullanılır.
- **Yerel depolama:** Okuma ayraçları tarayıcı \`localStorage\` anahtarı (\`ucdortsonsuz:bookmark\`) ile saklanır.

Çerez tercih paneli bulunmamaktadır; yalnızca oturum çerezleri hizmet için gereklidir. Tarayıcı ayarlarından çerezleri ve yerel depolamayı silebilirsiniz; bu durumda okuyucu oturumunuz ve ayraçlarınız sıfırlanabilir.

## 9. Güvenlik

Veriler aktarım sırasında HTTPS ile şifrelenir. Veritabanı erişimi satır düzeyinde güvenlik (RLS) ve rol tabanlı politikalarla sınırlandırılmıştır. Hiçbir sistem %100 güvenli garanti edilemez; şüpheli bir durum fark ederseniz lütfen yazın.

## 10. KVKK kapsamındaki haklarınız

KVKK m. 11 uyarınca; verilerinizin işlenip işlenmediğini öğrenme, bilgi talep etme, düzeltme, silme, anonimleştirme, aktarılan üçüncü kişileri bilme, otomatik işleme itirazı ve zararın giderilmesini talep etme haklarına sahipsiniz. Taleplerinizi **${AUTHOR_CONTACT_EMAIL}** adresine iletebilirsiniz; kimliğinizi doğrulamak için ek bilgi istenebilir. Şikâyet hakkınız Kişisel Verileri Koruma Kurulu’na başvurmayı da kapsar.

## 11. Politika değişiklikleri

Bu metin güncellenebilir. Önemli değişikliklerde sayfa üzerindeki “son güncelleme” tarihi yenilenir. Site’yi kullanmaya devam etmeniz, güncellenmiş metni okuduğunuz anlamına gelmez; önemli değişiklikler için makul iletişim yolları kullanılır.

## 12. İlgili sayfalar

- [Kullanım Koşulları](${site}/kullanim)
- [Hakkımda](${site}/hakkimda)
`.trim();

export const TERMS_OF_USE_MD = `
Bu Kullanım Koşulları, **${site}** (“Site”) üzerinden sunulan içerik ve hizmetlerin kullanımına ilişkin kuralları belirler. Site’yi kullanarak bu koşulları kabul etmiş sayılırsınız.

## 1. Site ve hizmetler

**${SITE_NAME}** (**${BOOK_TITLE}**), **${AUTHOR_NAME}** tarafından yayımlanan ${POEM_COUNT} şiir ve ${ESSAY_COUNT} denemeden oluşan bir şiir kitabıdır. Site şunları sunar:

- Kitap tanıtımı, hakkımda ve bağış bilgisi (satış gelirinin TEMA Vakfı ve Darüşşafaka’ya aktarılacağı taahhüdü)
- Arama motorları ve okuyucular için açık örnek şiir/deneme sayfaları
- Satın alma sonrası dijital okuyucu (\`/oku\`)
- Yetkili kullanıcılar için e-kitap indirme (PDF, EPUB, Kindle/MOBI biçimleri)

Satın alma, Site’de tanımlı harici ödeme/satış adresine yönlendirme ile yapılır; fiyat, vergi ve iade koşulları o kanalın şartlarına tabidir.

## 2. Fikri mülkiyet

Sitedeki ve kitaptaki tüm metinler, görseller (kapak, yazar portresi vb.), marka ve arayüz unsurları **${AUTHOR_NAME}**’ye veya ilgili lisans verenlere aittir. Yazılı izin olmadan:

- Tam kitabın veya örnek dışı bölümlerin kopyalanması, dağıtılması veya ticari kullanımı
- Toplu veri çekme (scraping) ile içeriğin başka platformlarda yayınlanması
- Yapay zekâ eğitimi veya veri seti oluşturma amacıyla kitap metninin sistematik toplanması

yasaktır. Alıntı için makul ölçüde kaynak göstererek kısa alıntı yapılabilir; tam metin veya kitap paylaşımı için **${AUTHOR_CONTACT_EMAIL}** üzerinden yazmanız gerekir.

## 3. Ücretsiz örnekler ve SEO sayfaları

Örnek olarak yayımlanan şiir ve denemeler tanıtım amaçlıdır. Bu sayfalar kişisel okuma ve keşif içindir; örnek metinlerin başka sitelerde izinsiz yeniden yayımlanması koşul 2’deki kurallara aykırıdır.

## 4. Dijital okuyucu ve erişim

- **/oku** yolu, yapılandırılmış kimlik doğrulama (Supabase) ile korunur; oturum açmadan tam kitap okunamaz.
- Okuma ayraçları yalnızca tarayıcınızda saklanır; hesaplar arası senkronizasyon sunulmaz.
- Erişim hakkınız satın alma ve yetkilendirme kayıtlarına bağlıdır; hesabınızı üçüncü kişilerle paylaşmamanız beklenir.

## 5. E-kitap indirme

PDF, EPUB ve Kindle (MOBI) dosyaları \`/api/download/…\` üzerinden, geçerli erişim yetkisi ile sunulur. İndirilen dosyalar:

- Kişisel kullanım içindir
- Ticari yeniden satış, toplu dağıtım veya kamuya açık dosya paylaşım platformlarında yayın için kullanılamaz
- Teknik koruma kaldırma veya format dönüştürerek üçüncü taraflara dağıtım amaçlı çoğaltma yasaktır

Dosya henüz yüklenmemişse indirme geçici olarak kullanılamayabilir.

## 6. Bülten

E-posta listesine yalnızca [Gizlilik Politikası](${site}/gizlilik)’nı kabul ederek kayıt olunur. Dilediğiniz zaman abonelikten çıkmak için **${AUTHOR_CONTACT_EMAIL}** adresine yazabilirsiniz.

## 7. Bağış taahhüdü

Yazar, **${BOOK_TITLE}** satış gelirinin tamamını TEMA Vakfı ve Darüşşafaka’ya bağışlayacağını kamuya açık olarak beyan eder. Bu Site metni bağışın hukuki olarak sizin adınıza yapılacağına dair bir sözleşme değildir; uygulama satış ve muhasebe süreçlerine bağlıdır. Bağış kanıtı veya makbuz talepleri için yine **${AUTHOR_CONTACT_EMAIL}** kullanılabilir.

## 8. Sorumluluk sınırı

Site “olduğu gibi” sunulur. Barındırma veya üçüncü taraf kesintileri, veri kaybı veya yetkisiz erişim girişimleri için makul teknik önlemler alınır; ancak dolaylı zararlardan Site işleteni sorumlu tutulamaz. Yasal zorunlu haller saklıdır.

## 9. Bağlantılar

Site, TEMA, Darüşşafaka, samet.works, sosyal ağ profilleri ve satış ortağı gibi harici adreslere bağlantı verebilir. Bu sitelerin içerik ve gizlilik uygulamalarından **${AUTHOR_NAME}** sorumlu değildir.

## 10. Değişiklikler ve fesih

Koşullar güncellenebilir; “son güncelleme” tarihi değişir. Koşullara aykırı kullanımda erişim kısıtlanabilir veya sonlandırılabilir.

## 11. Uygulanacak hukuk

Bu koşullar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklarda İstanbul (Çağlayan) mahkemeleri ve icra daireleri yetkilidir; tüketici olarak yerleşim yerinizdeki zorunlu haklar saklıdır.

## 12. İletişim

- **Genel ve yasal:** [${AUTHOR_CONTACT_EMAIL}](mailto:${AUTHOR_CONTACT_EMAIL})
- **Basın:** ${AUTHOR_CONTACT_EMAIL} · [samet.works](https://www.samet.works/)

İlgili: [Gizlilik Politikası](${site}/gizlilik)
`.trim();

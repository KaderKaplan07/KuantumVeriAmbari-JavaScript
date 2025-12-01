const readline = require('readline');

// Konsol Okuma Arayüzü (Giriş çıkış işlemleri için)
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Yardımcı Fonksiyon: Kullanıcıdan soru sormak için Promise yapısı
const soruSor = (soru) => {
    return new Promise((resolve) => {
        rl.question(soru, (cevap) => {
            resolve(cevap);
        });
    });
};

// ==========================================
// 1. ÖZEL HATA SINIFI
// ==========================================
class KuantumCokusuException extends Error {
    constructor(patlayanNesneID) {
        super(`KRİTİK HATA! ${patlayanNesneID} kimlikli nesne çöktü! Kuantum dengesi bozuldu.`);
        this.name = "KuantumCokusuException";
    }
}

// ==========================================
// 2. SOYUT SINIF (KuantumNesnesi)
// JS'de 'abstract' kelimesi yoktur, mantıken engelleriz.
// ==========================================
class KuantumNesnesi {
    constructor(id, tehlikeSeviyesi, baslangicStabilite) {
        if (this.constructor === KuantumNesnesi) {
            throw new Error("KuantumNesnesi soyut bir sınıftır, new ile üretilemez!");
        }
        this.id = id;
        this.tehlikeSeviyesi = tehlikeSeviyesi;
        this._stabilite = 0; // Private alan (Convention olarak _ kullanılır)
        this.stabilite = baslangicStabilite; // Setter'ı tetikler
    }

    // Getter
    get stabilite() {
        return this._stabilite;
    }

    // Setter (Kapsülleme)
    set stabilite(deger) {
        if (deger > 100) {
            this._stabilite = 100;
        } else if (deger <= 0) {
            this._stabilite = 0;
            // Hata Fırlatma
            throw new KuantumCokusuException(this.id);
        } else {
            this._stabilite = deger;
        }
    }

    // Soyut Metot (Simülasyon)
    analizEt() {
        throw new Error("AnalizEt metodu override edilmelidir!");
    }

    durumBilgisi() {
        return `ID: ${this.id} | Stabilite: %${this.stabilite.toFixed(1)} | Tehlike: ${this.tehlikeSeviyesi}`;
    }
}

// ==========================================
// 3. SOMUT SINIFLAR
// ==========================================

class VeriPaketi extends KuantumNesnesi {
    constructor(id, stabilite) {
        super(id, 1, stabilite);
    }

    analizEt() {
        this.stabilite -= 5;
        console.log(`[VeriPaketi] Veri içeriği okundu. (Kalan: ${this.stabilite})`);
    }
}

class KaranlikMadde extends KuantumNesnesi {
    constructor(id, stabilite) {
        super(id, 5, stabilite);
    }

    analizEt() {
        this.stabilite -= 15;
        console.log(`[KaranlikMadde] Analiz tamamlandı. (Kalan: ${this.stabilite})`);
    }

    // IKritik Arayüzü Simülasyonu
    acilDurumSogutmasi() {
        try {
            this.stabilite += 50;
            console.log(`[SOGUTMA] Karanlık madde soğutuldu. Yeni Stabilite: ${this.stabilite}`);
        } catch (e) { /* Soğuturken patlama olmaz */ }
    }
}

class AntiMadde extends KuantumNesnesi {
    constructor(id, stabilite) {
        super(id, 9, stabilite);
    }

    analizEt() {
        this.stabilite -= 25;
        console.log("Evrenin dokusu titriyor...");
        console.log(`[AntiMadde] Çok riskli analiz yapıldı! (Kalan: ${this.stabilite})`);
    }

    // IKritik Arayüzü Simülasyonu
    acilDurumSogutmasi() {
        try {
            this.stabilite += 50;
            console.log(`[SOGUTMA] Anti-Madde stabilize edildi. Yeni Stabilite: ${this.stabilite}`);
        } catch (e) { }
    }
}

// ==========================================
// 4. ANA PROGRAM (MAIN LOOP)
// ==========================================
async function main() {
    const envanter = [];
    let sayac = 1;

    console.log("--- OMEGA SEKTÖRÜ KUANTUM VERİ AMBARI (JS) ---");

    while (true) {
        try {
            console.log("\n=== KONTROL PANELİ ===");
            console.log("1. Yeni Nesne Ekle");
            console.log("2. Envanteri Listele");
            console.log("3. Analiz Et");
            console.log("4. Soğutma Yap");
            console.log("5. Çıkış");
            
            // await ile kullanıcının yazmasını bekliyoruz
            const secim = await soruSor("Seçiminiz: ");

            if (secim === "1") {
                const tur = Math.floor(Math.random() * 3) + 1; // 1-3 arası
                const baslangicStab = Math.floor(Math.random() * 41) + 50; // 50-90 arası
                const yeniID = `NESNE-${sayac}`;
                let yeniNesne = null;

                if (tur === 1) yeniNesne = new VeriPaketi(yeniID, baslangicStab);
                else if (tur === 2) yeniNesne = new KaranlikMadde(yeniID, baslangicStab);
                else yeniNesne = new AntiMadde(yeniID, baslangicStab);

                envanter.push(yeniNesne);
                console.log(`[SİSTEM] Eklendi: ${yeniNesne.id} (${yeniNesne.constructor.name})`);
                sayac++;

            } else if (secim === "2") {
                console.log("\n--- ENVANTER ---");
                if (envanter.length === 0) console.log("Depo boş.");
                envanter.forEach(n => console.log(n.durumBilgisi()));

            } else if (secim === "3") {
                const analizID = await soruSor("Analiz ID: ");
                const bulunan = envanter.find(n => n.id === analizID);

                if (bulunan) {
                    bulunan.analizEt(); // Hata fırlatabilir!
                } else {
                    console.log("Bulunamadı.");
                }

            } else if (secim === "4") {
                const sogutmaID = await soruSor("Soğutma ID: ");
                const sogutulacak = envanter.find(n => n.id === sogutmaID);

                if (sogutulacak) {
                    // Type Checking: JS'de interface olmadığı için 
                    // "Bu nesnenin acilDurumSogutmasi diye bir fonksiyonu var mı?" diye bakarız.
                    if (typeof sogutulacak.acilDurumSogutmasi === 'function') {
                        sogutulacak.acilDurumSogutmasi();
                    } else {
                        console.log("HATA: Bu nesne soğutulamaz!");
                    }
                } else {
                    console.log("Bulunamadı.");
                }

            } else if (secim === "5") {
                console.log("Çıkış yapılıyor...");
                rl.close();
                break;
            } else {
                console.log("Geçersiz işlem.");
            }

        } catch (error) {
            if (error.name === "KuantumCokusuException") {
                console.log("\n************************************************");
                console.log("SİSTEM ÇÖKTÜ! (JAVASCRIPT EDITION)");
                console.log(`SEBEP: ${error.message}`);
                console.log("************************************************");
                rl.close();
                break;
            } else {
                console.log(`Beklenmedik Hata: ${error.message}`);
            }
        }
    }
}

// Programı başlat
main();
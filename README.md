#Kuantum Veri Ambarı JAVASCRIPT
Kod tekrarını önlemek için öncelikle tüm nesnelerin türetileceği KuantumNesnesi adında 
soyut (abstract) bir sınıf oluşturdum. Veri güvenliğini sağlamak için Stabilite özelliğini 
kapsülledim (Encapsulation), böylece 0-100 dışına çıkılmasını engelledim. Her nesnenin 
soğutulması gerekmediği için, Interface Segregation prensibine uyarak sadece tehlikeli 
sınıflara IKritik arayüzünü uyguladım. Envanter yönetiminde kolaylık olması açısından 
Polimorfizm kullanarak tüm nesneleri tek bir listede tuttum. Son olarak, sistemin çökme 
durumunu kontrol etmek için standart hatalar yerine kendi yazdığım 
KuantumCokusuException sınıfını kullanarak hata yönetimini sağladım. 

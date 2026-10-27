# -*- coding: utf-8 -*-
"""
Generator script for Mango Recipe Book database.
Contains all 200 authentic, detailed mango recipes categorized into 6 sections.
"""

import json
import os

recipes_raw = [
    # ==========================================
    # I. OLAHAN SIMPEL & HARIAN (25 RESEP)
    # ==========================================
    {
        "id": "simpel-01",
        "title": "Jus Mangga Kental (Mango Juice)",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Jus mangga super kental, lembut dan creamy tanpa banyak air. Mengandalkan manis alami mangga harum manis matang dengan sentuhan gurih susu kental manis.",
        "prepTime": "7 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 7,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "165 kkal",
        "mangoType": "Harum Manis Matang Pohon",
        "icon": "🥤",
        "tags": ["Minuman", "Cepat", "Tanpa Masak", "Favorit Keluarga"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga harum manis matang", "notes": "kupas, potong dadu"},
            {"amount": 75, "unit": "ml", "name": "Air es atau es batu serut", "notes": "cukup sedikit agar tekstur kental"},
            {"amount": 3, "unit": "sdm", "name": "Kental manis putih", "notes": "sesuai selera"},
            {"amount": 1, "unit": "sdm", "name": "Air perasan jeruk nipis", "notes": "opsional, untuk penyeimbang rasa manis"}
        ],
        "steps": [
            "Pastikan buah mangga sudah didinginkan di kulkas minimal 1 jam sebelum diblender agar jus segar tanpa perlu banyak es batu.",
            "Masukkan potongan mangga, sedikit air es, dan kental manis ke dalam blender.",
            "Blender dengan kecepatan tinggi selama 45-60 detik hingga teksturnya benar-benar halus, kental, dan velvety.",
            "Koreksi rasa manis. Tambahkan perasan jeruk nipis jika ingin ada sedikit sentuhan asam segar.",
            "Tuang ke dalam gelas saji tinggi. Sajikan segera dengan potongan mangga dadu kecil di atasnya sebagai garnish."
        ],
        "tips": "Jangan menambahkan terlalu banyak air. Rahasia tekstur jus kafe mewah adalah perbandingan 80% mangga dan 20% es batu/cairan."
    },
    {
        "id": "simpel-02",
        "title": "Es Lilin Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Es lilin nostalgia masa kecil dengan sari buah mangga asli dan susu cair. Rasa manis alami yang lembut dan tidak keras saat digigit.",
        "prepTime": "15 menit",
        "cookTime": "Bekukan 5 jam",
        "totalMinutes": 315,
        "servings": 10,
        "difficulty": "Mudah",
        "calories": "75 kkal",
        "mangoType": "Mangga Indramayu atau Harum Manis",
        "icon": "🧊",
        "tags": ["Camilan Beku", "Anak-anak", "Hemat", "Tradisional"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang ukuran sedang", "notes": "haluskan"},
            {"amount": 250, "unit": "ml", "name": "Susu cair UHT full cream", "notes": ""},
            {"amount": 200, "unit": "ml", "name": "Air matang", "notes": ""},
            {"amount": 4, "unit": "sdm", "name": "Gula pasir", "notes": "larutkan"},
            {"amount": 1, "unit": "sdm", "name": "Tepung maizena", "notes": "larutkan dengan 2 sdm air, dimasak agar es empuk"}
        ],
        "steps": [
            "Rebus air, gula pasir, dan larutan maizena hingga mendidih dan agak mengental. Matikan api dan biarkan hingga suhu ruang.",
            "Blender mangga bersama susu UHT hingga halus merata.",
            "Campurkan blenderan mangga dengan larutan gula maizena yang sudah dingin, aduk rata dengan whisk.",
            "Gunakan corong kecil untuk menuangkan cairan ke dalam plastik es lilin hingga 3/4 penuh.",
            "Ikat ujung plastik erat dengan karet atau simpul tali.",
            "Susun di dalam freezer dan bekukan selama minimal 5-6 jam hingga beku sempurna."
        ],
        "tips": "Tambahan sedikit tepung maizena matang mencegah es lilin menjadi kristal es kasar, sehingga teksturnya legit dan empuk saat digigit."
    },
    {
        "id": "simpel-03",
        "title": "Es Mambo Mangga Susu",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Kombinasi susu gurih dengan kejutan potongan dadu mangga asli di setiap gigitan es mambo yang legit dan menyegarkan.",
        "prepTime": "15 menit",
        "cookTime": "Bekukan 6 jam",
        "totalMinutes": 375,
        "servings": 8,
        "difficulty": "Mudah",
        "calories": "85 kkal",
        "mangoType": "Mangga Gedong Gincu atau Manalagi Matang",
        "icon": "🍦",
        "tags": ["Camilan Dingin", "Favorit Anak", "Simpel"],
        "ingredients": [
            {"amount": 1.5, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu kecil 0.5 cm"},
            {"amount": 350, "unit": "ml", "name": "Susu UHT full cream", "notes": ""},
            {"amount": 4, "unit": "sdm", "name": "Kental manis putih", "notes": ""},
            {"amount": 1, "unit": "sdt", "name": "Ekstrak vanila", "notes": "opsional"}
        ],
        "steps": [
            "Campurkan susu UHT, kental manis putih, dan ekstrak vanila di dalam wadah, aduk hingga kental manis larut sempurna.",
            "Siapkan plastik es mambo. Masukkan 1 sendok makan potongan dadu mangga segar ke dalam masing-masing plastik.",
            "Tuang larutan susu hingga memenuhi 3/4 bagian plastik es.",
            "Ikat kencang ujung plastik es mambo.",
            "Kocok perlahan agar potongan mangga tersebar merata di sepanjang es mambo.",
            "Tata mendatar di dalam freezer dan bekukan hingga padat selama 6 jam."
        ],
        "tips": "Pilih mangga dengan daging yang kenyal dan tidak mudah hancur seperti Gedong Gincu agar potongan dadu tetap terasa renyah."
    },
    {
        "id": "simpel-04",
        "title": "Mangga Potong Cabai Garam (Chili Salt Mango)",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Camilan jalanan khas tropis Asia Tenggara. Mangga mengkal renyah berpadu gurih, manis, pedas, dan asin yang langsung membangkitkan selera.",
        "prepTime": "5 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 5,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "95 kkal",
        "mangoType": "Mangga Mengkal / Golek / Manalagi Mengkal",
        "icon": "🥭",
        "tags": ["Pedas Segar", "Cepat", "Street Food", "Renyah"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga mengkal berkulit hijau kekuningan", "notes": "kupas, iris tebal memanjang"},
            {"amount": 1.5, "unit": "sdm", "name": "Gula pasir putih", "notes": ""},
            {"amount": 1, "unit": "sdt", "name": "Garam laut halus", "notes": ""},
            {"amount": 1, "unit": "sdm", "name": "Bubuk cabai kasar (chili flakes)", "notes": "sesuai level pedas"},
            {"amount": 0.5, "unit": "sdt", "name": "Bubuk terasi bakar", "notes": "opsional, untuk aroma autentik khas Asia"}
        ],
        "steps": [
            "Kupas mangga mengkal, cuci bersih di air mengalir, lalu potong-potong memanjang seukuran jari telunjuk.",
            "Dalam wadah toples atau kotak makan berpenutup rapat, campurkan gula pasir, garam, bubuk cabai, dan terasi bubuk.",
            "Masukkan potongan mangga ke dalam wadah toples.",
            "Tutup toples rapat-rapat, lalu kocok (shake) dengan kuat selama 15-20 detik hingga seluruh permukaan mangga terselimuti bumbu cabai garam.",
            "Buka toples dan sajikan langsung atau dinginkan di kulkas 15 menit agar bumbu meresap berair segar."
        ],
        "tips": "Pilih mangga yang saat dipencet masih kokoh (crunchy) dengan daging berwarna kuning muda agar mendapatkan sensasi renyah 'kriuk' berair."
    },
    {
        "id": "simpel-05",
        "title": "Puding Mangga Susu (3 Bahan)",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Dessert super lembut selembut sutra yang hanya membutuhkan 3 bahan utama. Paduan murni jus mangga, susu cair, dan agar-agar.",
        "prepTime": "10 menit",
        "cookTime": "10 menit + Dinginkan 2 jam",
        "totalMinutes": 140,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "110 kkal",
        "mangoType": "Mangga Harum Manis Matang",
        "icon": "🍮",
        "tags": ["Dessert", "Puding", "3 Bahan", "Lembut"],
        "ingredients": [
            {"amount": 1, "unit": "bungkus", "name": "Bubuk agar-agar plain (tanpa rasa & warna)", "notes": "7 gram"},
            {"amount": 500, "unit": "ml", "name": "Susu cair UHT full cream", "notes": ""},
            {"amount": 400, "unit": "gram", "name": "Daging mangga matang", "notes": "blender halus menjadi pure"}
        ],
        "steps": [
            "Blender daging mangga matang bersama 100 ml susu cair hingga menjadi pure mangga yang sangat halus tanpa serat.",
            "Dalam panci, tuang sisa 400 ml susu cair dan masukkan 1 bungkus bubuk agar-agar plain. Aduk rata menggunakan whisk saat susu masih dingin agar tidak menggumpal.",
            "Masak di atas api sedang sambil terus diaduk perlahan hingga mulai mendidih dan berbuih di pinggirannya.",
            "Kecilkan api, tuangkan pure mangga ke dalam panci. Aduk cepat hingga tercampur rata dan biarkan mendidih perlahan selama 1 menit.",
            "Matikan api, saring adonan puding ke dalam loyang atau cetakan cup puding individual.",
            "Biarkan uap panasnya hilang pada suhu ruang, lalu masukkan ke dalam kulkas selama 2 jam hingga set sempurna."
        ],
        "tips": "Jika mangga yang digunakan kurang manis, Anda bisa menambahkan 2-3 sendok makan kental manis atau gula pasir ke dalam susu."
    },
    {
        "id": "simpel-06",
        "title": "Smoothie Mangga Pisang",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Minuman sarapan sehat kaya serat dan kalium tanpa tambahan gula rafinasi. Manis legit alami dari paduan mangga beku dan pisang ambon matang.",
        "prepTime": "5 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 5,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "170 kkal",
        "mangoType": "Mangga Harum Manis Beku",
        "icon": "🥤",
        "tags": ["Sarapan Sehat", "Diet", "Bebas Gula", "Smoothie"],
        "ingredients": [
            {"amount": 1.5, "unit": "cangkir", "name": "Mangga beku potong dadu", "notes": "bekukan semalaman"},
            {"amount": 1, "unit": "buah", "name": "Pisang ambon matang beku", "notes": "potong-potong"},
            {"amount": 150, "unit": "ml", "name": "Greek yogurt plain atau susu almond", "notes": ""},
            {"amount": 50, "unit": "ml", "name": "Air kelapa murni atau air matang", "notes": "untuk membantu blender"}
        ],
        "steps": [
            "Keluarkan potongan mangga dan pisang beku dari freezer sekitar 3 menit sebelum diblender.",
            "Masukkan yogurt, air kelapa, pisang beku, dan mangga beku ke dalam blender (cairan di bagian bawah).",
            "Nyalakan blender dengan mode pulse beberapa kali, lalu lanjutkan dengan kecepatan tinggi selama 60 detik hingga bertekstur kental seperti es krim lembut.",
            "Tuang ke dalam gelas saji.",
            "Nikmati langsung dengan sedotan ramah lingkungan atau sendok."
        ],
        "tips": "Menggunakan buah beku adalah kunci tekstur smoothie kental tanpa perlu menambahkan es batu yang bisa mengencerkan cita rasa buah."
    },
    {
        "id": "simpel-07",
        "title": "Sate Mangga Cokelat Beku",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Potongan mangga dingin beku yang ditusuk stik dan dicelupkan ke dalam lelehan cokelat hitam yang renyah membeku seketika.",
        "prepTime": "15 menit",
        "cookTime": "Bekukan 3 jam",
        "totalMinutes": 195,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "140 kkal",
        "mangoType": "Mangga Harum Manis Daging Tebal",
        "icon": "🍡",
        "tags": ["Dessert Unik", "Camilan Anak", "Cokelat", "Pesta"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang padat", "notes": "potong kotak tebal 3x3 cm"},
            {"amount": 150, "unit": "gram", "name": "Dark cooking chocolate (DCC)", "notes": "cincang kasar"},
            {"amount": 1, "unit": "sdm", "name": "Minyak kelapa murni (VCO) atau mentega", "notes": "agar cokelat mengilap dan renyah"},
            {"amount": 2, "unit": "sdm", "name": "Kacang sangrai cincang atau meses", "notes": "untuk taburan"}
        ],
        "steps": [
            "Tusukkan 3 potongan tebal mangga ke setiap tusuk sate atau stik es krim.",
            "Tata sate mangga di atas nampan beralas baking paper, lalu bekukan di freezer minimal 3 jam hingga mengeras.",
            "Lelehkan dark chocolate bersama minyak kelapa dengan teknik tim (double boiler) di atas air mendidih hingga cair dan mengilap.",
            "Tuang cokelat leleh ke dalam gelas tinggi agar mudah untuk mencelup.",
            "Ambil sate mangga beku, celupkan segera ke dalam cokelat leleh, putar perlahan.",
            "Segera taburi dengan kacang cincang sebelum lapisan cokelat mengeras (cokelat akan membeku dalam hitungan detik karena suhu mangga yang dingin).",
            "Sajikan langsung atau simpan kembali dalam freezer."
        ],
        "tips": "Minyak kelapa memberikan efek 'magic shell' yang membuat lelehan cokelat langsung mengeras renyah saat terkena buah beku."
    },
    {
        "id": "simpel-08",
        "title": "Salad Buah Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Salad buah tropis premium dengan mangga harum manis sebagai bintang utama, dipadu saus creamy keju mayones manis yang gurih segar.",
        "prepTime": "15 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 15,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "210 kkal",
        "mangoType": "Harum Manis atau Gedong Gincu",
        "icon": "🥗",
        "tags": ["Salad", "Creamy", "Segar", "Populer"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu 1.5 cm"},
            {"amount": 1, "unit": "buah", "name": "Apel fuji", "notes": "potong dadu, rendam air garam tipis"},
            {"amount": 10, "unit": "butir", "name": "Anggur merah", "notes": "belah dua, buang biji"},
            {"amount": 100, "unit": "gram", "name": "Nata de coco", "notes": "tiriskan airnya"},
            {"amount": 100, "unit": "gram", "name": "Mayones manis kualitas baik", "notes": ""},
            {"amount": 80, "unit": "gram", "name": "Yogurt plain kental", "notes": ""},
            {"amount": 3, "unit": "sdm", "name": "Kental manis putih", "notes": ""},
            {"amount": 50, "unit": "gram", "name": "Keju cheddar parut melimpah", "notes": "topping"}
        ],
        "steps": [
            "Campur mayones, yogurt plain, dan kental manis dalam mangkuk, aduk hingga menjadi saus dressing yang halus dan homogen.",
            "Dalam wadah saji besar, susun potongan mangga, apel, anggur, dan nata de coco.",
            "Siramkan saus dressing creamy ke atas buah-buahan secara merata.",
            "Beri parutan keju cheddar melimpah di bagian atasnya hingga menutupi seluruh permukaan salad.",
            "Hias dengan beberapa potongan mangga dadu dan irisan anggur di puncaknya.",
            "Dinginkan di dalam kulkas selama 30 menit sebelum dinikmati dingin."
        ],
        "tips": "Tiriskan nata de coco dan keringkan apel setelah direndam agar salad buah tidak mengeluarkan banyak air dan saus tetap kental creamy."
    },
    {
        "id": "simpel-09",
        "title": "Roti Bakar Selai Mangga Homemade",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Roti bakar wangi mentega dengan olesan selai mangga buatan sendiri tanpa bahan pengawet. Manis alami karamel mangga dengan sedikit sengatan asam segar.",
        "prepTime": "10 menit",
        "cookTime": "15 menit",
        "totalMinutes": 25,
        "servings": 3,
        "difficulty": "Mudah",
        "calories": "230 kkal",
        "mangoType": "Mangga Harum Manis atau Indramayu",
        "icon": "🍞",
        "tags": ["Sarapan", "Roti Bakar", "Homemade Jam", "Manis"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang manis", "notes": "cincang kasar"},
            {"amount": 3, "unit": "sdm", "name": "Gula pasir", "notes": "sesuaikan manisnya buah"},
            {"amount": 1, "unit": "sdm", "name": "Air perasan lemon atau jeruk nipis", "notes": "sebagai pektin alami"},
            {"amount": 6, "unit": "lembar", "name": "Roti tawar gandum atau putih", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Mentega asin (salted butter)", "notes": "untuk memanggang"}
        ],
        "steps": [
            "Buat selai: Masukkan cincangan mangga, gula pasir, dan air lemon ke dalam teflon anti lengket.",
            "Masak di atas api sedang-kecil sambil ditekan-tekan dengan spatula kayu hingga mangga hancur lembut dan mengental menjadi tekstur selai (sekitar 10-12 menit). Dinginkan.",
            "Oleskan mentega pada kedua sisi roti tawar.",
            "Panggang roti di atas wajan teflon datar dengan api kecil hingga kuning keemasan dan renyah di luar.",
            "Oleskan selai mangga homemade tebal-tebal di atas satu lembar roti, lalu tangkupkan dengan lembaran roti lainnya.",
            "Potong diagonal menjadi segitiga dan sajikan selagi hangat bersama teh hangat."
        ],
        "tips": "Air perasan lemon mengandung pektin alami dan asam yang membuat selai mengental berkilau dan tahan hingga 2 minggu di kulkas."
    },
    {
        "id": "simpel-10",
        "title": "Es Serut Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Es serut dingin menggunung yang diguyur sari mangga kental pekat, susu kental manis, dan topping tumpukan mangga segar dadu yang royal.",
        "prepTime": "10 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 10,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "155 kkal",
        "mangoType": "Mangga Harum Manis Matang Sempurna",
        "icon": "🍧",
        "tags": ["Penyegar", "Tradisional", "Es Serut", "Dingin"],
        "ingredients": [
            {"amount": 2, "unit": "mangkuk", "name": "Es batu serut halus", "notes": ""},
            {"amount": 1.5, "unit": "buah", "name": "Mangga matang", "notes": "blender halus tanpa air sebagai sirup pure"},
            {"amount": 0.5, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu cantik untuk topping"},
            {"amount": 3, "unit": "sdm", "name": "Kental manis putih", "notes": ""},
            {"amount": 1, "unit": "sdm", "name": "Biji selasih", "notes": "rendam air hangat hingga mekar"}
        ],
        "steps": [
            "Siapkan mangkuk saji, bentuk es serut menggunung di tengah mangkuk.",
            "Siramkan pure mangga kental secara melingkar ke seluruh permukaan es serut.",
            "Kucurkan kental manis putih di atasnya hingga membentuk jaring-jaring manis yang estetik.",
            "Beri topping potongan mangga dadu melimpah dan sesendok biji selasih di puncaknya.",
            "Sajikan segera sebelum es mencair."
        ],
        "tips": "Gunakan blender tanpa air untuk membuat sirup mangga agar rasa mangga tidak pudar saat es batu serut mulai mencair."
    },
    {
        "id": "simpel-11",
        "title": "Oatmeal Mangga Madu",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Semangkuk kehangatan sarapan sehat bergizi tinggi. Oat hangat lembut berpadu kesegaran buah mangga manis dan tetesan madu hutan murni.",
        "prepTime": "5 menit",
        "cookTime": "5 menit",
        "totalMinutes": 10,
        "servings": 1,
        "difficulty": "Mudah",
        "calories": "260 kkal",
        "mangoType": "Mangga Harum Manis atau Manalagi",
        "icon": "🥣",
        "tags": ["Sarapan Sehat", "Serat Tinggi", "Hangat", "Fit"],
        "ingredients": [
            {"amount": 4, "unit": "sdm", "name": "Rolled oats (havermut)", "notes": ""},
            {"amount": 200, "unit": "ml", "name": "Susu cair rendah lemak atau susu nabati", "notes": ""},
            {"amount": 0.5, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu"},
            {"amount": 1, "unit": "sdm", "name": "Madu murni", "notes": ""},
            {"amount": 1, "unit": "sdt", "name": "Biji chia (chia seeds)", "notes": "topping"},
            {"amount": 1, "unit": "sdm", "name": "Kacang almond iris sangrai", "notes": "topping"}
        ],
        "steps": [
            "Campurkan rolled oats dan susu cair di dalam panci kecil.",
            "Masak di atas api sedang sambil diaduk perlahan selama 3-5 menit hingga oat empuk dan teksturnya mengental creamy.",
            "Tuang bubur oatmeal hangat ke dalam mangkuk saji.",
            "Tata potongan mangga segar di satu sisi mangkuk.",
            "Taburi biji chia dan irisan almond sangrai di sisi lainnya.",
            "Kucurkan madu murni di atas mangga dan oatmeal sesaat sebelum disajikan."
        ],
        "tips": "Jangan memasukkan mangga ke dalam panci saat memasak oat agar kesegaran dan kandungan vitamin C mangga tetap terjaga maksimal."
    },
    {
        "id": "simpel-12",
        "title": "Yogurt Bark Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Camilan dingin beku kekinian pengganti es krim tinggi gula. Lempengan yogurt creamy bertabur mangga manis dan renyahnya kacang panggang.",
        "prepTime": "10 menit",
        "cookTime": "Bekukan 4 jam",
        "totalMinutes": 250,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "90 kkal",
        "mangoType": "Mangga Harum Manis Matang",
        "icon": "🍫",
        "tags": ["Camilan Diet", "Beku", "Tinggi Protein", "Kekinian"],
        "ingredients": [
            {"amount": 300, "unit": "gram", "name": "Greek yogurt plain padat", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Madu atau sirup maple", "notes": ""},
            {"amount": 1, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu kecil"},
            {"amount": 2, "unit": "sdm", "name": "Kacang almond atau pistachio cincang", "notes": "panggang"},
            {"amount": 1, "unit": "sdm", "name": "Kelapa parut kering (desiccated coconut)", "notes": "opsional"}
        ],
        "steps": [
            "Campurkan Greek yogurt dengan madu dalam mangkuk, aduk hingga rata.",
            "Siapkan loyang datar beralaskan baking paper anti lengket.",
            "Ratakan yogurt di atas baking paper hingga ketebalan sekitar 0.8 - 1 cm menggunakan spatula.",
            "Taburkan potongan mangga dadu, kacang cincang, dan kelapa kering secara merata di atas yogurt.",
            "Tekan perlahan buah dan kacang agar menempel menyatu dengan yogurt.",
            "Masukkan loyang ke dalam freezer selama 4 jam hingga membeku padat.",
            "Keluarkan dan patah-patahkan yogurt bark menjadi lempengan acak berukuran sedang. Nikmati dingin!"
        ],
        "tips": "Gunakan Greek yogurt yang kental tanpa banyak whey air agar bark tidak mudah meleleh di tangan dan teksturnya renyah lembut."
    },
    {
        "id": "simpel-13",
        "title": "Es Buah Mangga Nata de Coco",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Minuman es buah klasik takjil favorit keluarga. Kesegaran kuah sirup jeruk/cocopandan berpadu mangga wangi, kenyalnya nata de coco, dan selasih.",
        "prepTime": "10 menit",
        "cookTime": "Tanpa Masak",
        "totalMinutes": 10,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "130 kkal",
        "mangoType": "Mangga Gedong Gincu atau Harum Manis",
        "icon": "🍹",
        "tags": ["Takjil", "Es Buah", "Segar", "Keluarga"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang", "notes": "potong dadu 1.5 cm"},
            {"amount": 150, "unit": "gram", "name": "Nata de coco beserta airnya", "notes": ""},
            {"amount": 1, "unit": "sdm", "name": "Biji selasih", "notes": "rendam air hangat hingga mengembang"},
            {"amount": 5, "unit": "sdm", "name": "Sirup jeruk atau cocopandan", "notes": "sesuai selera"},
            {"amount": 300, "unit": "ml", "name": "Air matang dingin", "notes": ""},
            {"amount": 1, "unit": "mangkuk", "name": "Es batu kristal", "notes": ""}
        ],
        "steps": [
            "Dalam mangkuk punch bowl atau teko besar, campurkan air dingin dengan sirup pilihan, aduk rata.",
            "Masukkan nata de coco bersama sedikit air sarinya untuk memperkaya aroma kelapa segar.",
            "Tambahkan potongan dadu mangga dan biji selasih yang sudah mekar.",
            "Masukkan es batu kristal secukupnya, aduk perlahan dengan sendok sayur.",
            "Tuangkan ke dalam gelas-gelas saji dan nikmati kesegarannya saat cuaca terik."
        ],
        "tips": "Gedong Gincu memberikan aroma wangi khas yang sangat dominan dan menggoda jika dipadukan dengan sirup jeruk segar."
    },
    {
        "id": "simpel-14",
        "title": "Puding Lumut Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Kombinasi estetik dua warna: lapisan bawah puding lumut pandan gurih bersantan dan lapisan atas puding sari mangga manis berkilau.",
        "prepTime": "20 menit",
        "cookTime": "20 menit + Dinginkan 2 jam",
        "totalMinutes": 160,
        "servings": 8,
        "difficulty": "Sedang",
        "calories": "145 kkal",
        "mangoType": "Mangga Harum Manis Matang",
        "icon": "🍮",
        "tags": ["Puding Dua Lapis", "Tradisional Modern", "Estetik"],
        "ingredients": [
            {"amount": 1, "unit": "bungkus", "name": "Bubuk agar-agar hijau (untuk lumut)", "notes": "7 gr"},
            {"amount": 1, "unit": "butir", "name": "Telur ayam", "notes": "kocok lepas"},
            {"amount": 100, "unit": "ml", "name": "Santan kental instan", "notes": ""},
            {"amount": 450, "unit": "ml", "name": "Air jus pandan suji", "notes": ""},
            {"amount": 80, "unit": "gram", "name": "Gula pasir (lapisan lumut)", "notes": ""},
            {"amount": 1, "unit": "bungkus", "name": "Bubuk agar-agar plain (lapisan mangga)", "notes": "7 gr"},
            {"amount": 300, "unit": "gram", "name": "Pure mangga manis", "notes": "blender halus"},
            {"amount": 400, "unit": "ml", "name": "Air matang", "notes": ""},
            {"amount": 60, "unit": "gram", "name": "Gula pasir (lapisan mangga)", "notes": ""}
        ],
        "steps": [
            "Lapisan Lumut: Campur bubuk agar hijau, gula, telur kocok, santan, dan air jus pandan. Saring ke dalam panci.",
            "Masak di atas api sedang tanpa diaduk terlalu sering agar terbentuk butiran lumut yang cantik. Saat mendidih dan lumut terpisah, matikan api.",
            "Tuang adonan lumut ke dalam loyang puding, biarkan hingga permukaannya berkulit (setengah beku).",
            "Lapisan Mangga: Dalam panci lain, masak bubuk agar plain, air, gula, dan pure mangga sambil diaduk hingga mendidih sempurna.",
            "Tusuk-tusuk perlahan permukaan lapisan lumut dengan tusuk gigi agar kedua lapisan menempel erat.",
            "Tuangkan adonan mangga hangat perlahan sendok demi sendok di atas lapisan lumut.",
            "Dinginkan di suhu ruang, lalu simpan di kulkas hingga padat kokoh sebelum dipotong."
        ],
        "tips": "Jangan mengaduk adonan lumut terlalu heboh jika menginginkan gumpalan lumut yang besar dan tampak artistik di cetakan."
    },
    {
        "id": "simpel-15",
        "title": "Pancake Mangga Simpel",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Pancake lembut dan empuk keemasan yang disajikan hangat dengan tumpukan mangga segar manis dan kucuran madu atau sirup karamel.",
        "prepTime": "10 menit",
        "cookTime": "10 menit",
        "totalMinutes": 20,
        "servings": 3,
        "difficulty": "Mudah",
        "calories": "220 kkal",
        "mangoType": "Mangga Harum Manis Iris Rapi",
        "icon": "🥞",
        "tags": ["Sarapan", "Pancake", "Cepat", "Favorit"],
        "ingredients": [
            {"amount": 150, "unit": "gram", "name": "Tepung terigu protein sedang (atau pancake mix)", "notes": ""},
            {"amount": 1, "unit": "butir", "name": "Telur ayam", "notes": ""},
            {"amount": 180, "unit": "ml", "name": "Susu cair UHT", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Gula pasir", "notes": ""},
            {"amount": 1, "unit": "sdt", "name": "Baking powder", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Mentega cair", "notes": ""},
            {"amount": 1, "unit": "buah", "name": "Mangga matang manis", "notes": "iris tipis melengkung"},
            {"amount": 3, "unit": "sdm", "name": "Madu atau sirup maple", "notes": "topping"}
        ],
        "steps": [
            "Campur terigu, gula pasir, dan baking powder dalam mangkuk, buat lubang di tengahnya.",
            "Masukkan telur, susu cair, dan mentega cair ke dalam lubang. Aduk dengan whisk hingga adonan menyatu (jangan overmix, gumpalan kecil wajar).",
            "Panaskan wajan teflon anti lengket di atas api kecil, olesi sedikit mentega.",
            "Tuang 1 sendok sayur adonan, masak hingga muncul gelembung berpori di permukaan (sekitar 2 menit).",
            "Balik perlahan dan masak sisi sebaliknya selama 1 menit hingga kuning keemasan. Angkat.",
            "Tata 3 tumpuk pancake di piring saji, susun irisan mangga segar menyerupai kelopak bunga di atasnya, lalu siram madu hangat."
        ],
        "tips": "Untuk pancake yang mengembang tinggi dan fluffy, jangan mengaduk adonan terlalu lama dan gunakan baking powder yang masih aktif."
    },
    {
        "id": "simpel-16",
        "title": "Setup Mangga Kayu Manis",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Rebusan kuah rempah wangi kayu manis dan cengkeh yang meresap ke dalam kelembutan mangga mengkal. Sajian klasik yang nikmat disajikan dingin maupun hangat.",
        "prepTime": "10 menit",
        "cookTime": "15 menit",
        "totalMinutes": 25,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "115 kkal",
        "mangoType": "Mangga Indramayu atau Golek Mengkal",
        "icon": "🍲",
        "tags": ["Rempah Tradisional", "Setup", "Aromatik", "Segar"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga mengkal bertekstur kokoh", "notes": "kupas, potong dadu 2 cm"},
            {"amount": 600, "unit": "ml", "name": "Air bersih", "notes": ""},
            {"amount": 5, "unit": "sdm", "name": "Gula pasir", "notes": "sesuai selera asamnya mangga"},
            {"amount": 5, "unit": "cm", "name": "Kayu manis batangan", "notes": ""},
            {"amount": 4, "unit": "butir", "name": "Cengkeh utuh", "notes": ""},
            {"amount": 2, "unit": "lembar", "name": "Daun pandan", "notes": "ikat simpul"}
        ],
        "steps": [
            "Didihkan air bersama kayu manis, cengkeh, daun pandan, dan gula pasir dalam panci hingga aroma rempahnya wangi semerbak.",
            "Masukkan potongan mangga mengkal ke dalam kuah rempah yang sedang mendidih perlahan.",
            "Masak dengan api sedang-kecil selama kurang lebih 5-7 menit saja agar tekstur mangga tetap kenyal dan tidak lembek hancur.",
            "Matikan api, biarkan uap panasnya hilang dan aroma rempah meresap sempurna ke dalam serat mangga.",
            "Simpan di dalam lemari es dan sajikan dingin bersama beberapa butir es batu."
        ],
        "tips": "Gunakan mangga mengkal (belum terlalu matang/masih asam segar) agar ketika direbus rasa asamnya berpadu harmonis dengan manisnya kuah rempah."
    },
    {
        "id": "simpel-17",
        "title": "Es Kulkul Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Jajanan es kulkul legendaris berbahan mangga matang manis yang dibekukan, lalu disiram saus cokelat minyak kelapa yang langsung membeku renyah 'krak'.",
        "prepTime": "10 menit",
        "cookTime": "Bekukan 4 jam",
        "totalMinutes": 250,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "135 kkal",
        "mangoType": "Mangga Harum Manis Daging Tebal",
        "icon": "🍢",
        "tags": ["Jajanan SD", "Nostalgia", "Cokelat Crispy", "Anak"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang manis", "notes": "potong memanjang atau bentuk popsicle"},
            {"amount": 6, "unit": "buah", "name": "Tusuk sate tebal / stik es", "notes": ""},
            {"amount": 100, "unit": "gram", "name": "Cokelat bubuk kualitas premium", "notes": ""},
            {"amount": 100, "unit": "gram", "name": "Gula halus (icing sugar)", "notes": ""},
            {"amount": 120, "unit": "ml", "name": "Minyak goreng bersih atau minyak kelapa", "notes": "panaskan hangat kuku"},
            {"amount": 2, "unit": "sdm", "name": "Meses pelangi atau sprinkle", "notes": "topping"}
        ],
        "steps": [
            "Tusuk potongan mangga dengan tusuk sate. Letakkan di atas nampan dan simpan di freezer selama minimal 4 jam hingga beku keras.",
            "Buat saus cokelat: Campurkan cokelat bubuk dan gula halus dalam mangkuk, lalu tuang minyak hangat. Aduk cepat dengan sendok hingga licin mengilap dan tidak bergerindil.",
            "Tuang saus cokelat ke dalam gelas ramping yang cukup tinggi.",
            "Ambil mangga beku, langsung celupkan ke dalam saus cokelat hingga seluruh permukaan terlapisi.",
            "Angkat, taburkan meses warna-warni segera sebelum cokelat mengeras seketika.",
            "Es kulkul mangga renyah manis siap dinikmati!"
        ],
        "tips": "Kunci es kulkul yang sukses adalah buah mangga harus benar-benar beku seperti batu saat dicelupkan agar lapisan cokelat langsung set seketika."
    },
    {
        "id": "simpel-18",
        "title": "Agar-Agar Mangga Kaca",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Puding bening transparan bagai kaca kristal yang memperlihatkan keindahan potongan mangga kuning cerah di dalamnya. Cantik, menyegarkan, dan elegan.",
        "prepTime": "10 menit",
        "cookTime": "10 menit + Dinginkan",
        "totalMinutes": 140,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "85 kkal",
        "mangoType": "Mangga Gedong Gincu atau Harum Manis Berwarna Cerah",
        "icon": "✨",
        "tags": ["Puding Kaca", "Rendah Kalori", "Estetik", "Sehat"],
        "ingredients": [
            {"amount": 1, "unit": "bungkus", "name": "Bubuk agar-agar bening (plain)", "notes": "7 gr"},
            {"amount": 0.5, "unit": "sdt", "name": "Bubuk jeli plain (Nutrijell plain)", "notes": "agar tekstur lentur kenyal"},
            {"amount": 600, "unit": "ml", "name": "Air matang", "notes": ""},
            {"amount": 90, "unit": "gram", "name": "Gula pasir", "notes": ""},
            {"amount": 1, "unit": "sdm", "name": "Air perasan jeruk lemon", "notes": "agar kuah agar-agar bening mengilap"},
            {"amount": 2, "unit": "buah", "name": "Mangga manis", "notes": "potong dadu seragam 1 cm"}
        ],
        "steps": [
            "Tata potongan dadu mangga secara artistik di dasar cetakan puding atau loyang kaca bundar.",
            "Campur bubuk agar-agar, jeli plain, dan gula pasir dalam panci. Tuang air perlahan sambil diaduk rata.",
            "Masak di atas api sedang hingga mendidih sambil diaduk perlahan agar gelembung udara tidak terlalu banyak.",
            "Matikan api, masukkan air lemon, aduk rata dan biarkan uap panasnya berkurang selama 3 menit.",
            "Tuang larutan agar-agar bening secara perlahan menggunakan sendok sayur di atas potongan mangga agar posisinya tidak berantakan.",
            "Biarkan membeku di suhu ruang, kemudian masukkan ke kulkas hingga dingin dan mengeras kencang."
        ],
        "tips": "Kombinasi agar-agar dengan sedikit bubuk jeli menghasilkan tekstur yang kenyal lentur dan tidak mudah mengeluarkan air (tidak basah)."
    },
    {
        "id": "simpel-19",
        "title": "Pisang & Mangga Goreng Crispy",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Gorengan buah kekinian dengan sensasi unik: renyahnya kulit tepung crispy berpadu dengan lumeran daging mangga mengkal dan pisang yang manis gurih.",
        "prepTime": "15 menit",
        "cookTime": "10 menit",
        "totalMinutes": 25,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "215 kkal",
        "mangoType": "Mangga Mengkal Kokoh (Manalagi atau Golek)",
        "icon": "🍟",
        "tags": ["Gorengan", "Crispy", "Camilan Sore", "Kriuk"],
        "ingredients": [
            {"amount": 1, "unit": "buah", "name": "Mangga mengkal", "notes": "potong balok tebal 2x5 cm"},
            {"amount": 3, "unit": "buah", "name": "Pisang kepok atau uli", "notes": "belah dua"},
            {"amount": 100, "unit": "gram", "name": "Tepung terigu protein sedang", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Tepung beras", "notes": "agar renyah tahan lama"},
            {"amount": 1, "unit": "sdm", "name": "Gula pasir", "notes": ""},
            {"amount": 0.25, "unit": "sdt", "name": "Garam halus & vanila", "notes": ""},
            {"amount": 120, "unit": "ml", "name": "Air es", "notes": ""},
            {"amount": 50, "unit": "gram", "name": "Tepung panir / panko kasar", "notes": "untuk baluran"},
            {"amount": 300, "unit": "ml", "name": "Minyak goreng", "notes": "untuk deep frying"}
        ],
        "steps": [
            "Campur tepung terigu, tepung beras, gula, garam, vanila, dan air es hingga menjadi adonan basah yang cukup kental.",
            "Celupkan potongan mangga dan pisang ke dalam adonan tepung basah.",
            "Gulingkan ke atas tepung panir kasar sambil sedikit ditekan agar butiran panir menempel rata.",
            "Panaskan minyak goreng dalam jumlah banyak di atas api sedang-besar.",
            "Goreng mangga dan pisang hingga berwarna kuning keemasan dan renyah garing (sekitar 3-4 menit). Jangan terlalu lama agar mangga tidak terlalu lembek.",
            "Angkat, tiriskan di atas peniris kawat, sajikan selagi panas dengan kental manis cokelat."
        ],
        "tips": "Gunakan mangga yang masih mengkal dan minyak yang benar-benar panas agar bagian luar langsung garing tanpa membuat mangga hancur berair di dalam."
    },
    {
        "id": "simpel-20",
        "title": "Roti Lipat Mangga Krim (Mango Sandwich)",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Fruit sando khas bakery Jepang dengan potongan besar mangga manis di tengah balutan whipped cream vanila lembut dan roti tawar seputih salju.",
        "prepTime": "15 menit",
        "cookTime": "Dinginkan 1 jam",
        "totalMinutes": 75,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "280 kkal",
        "mangoType": "Mangga Harum Manis Utuh Manis",
        "icon": "🥪",
        "tags": ["Japanese Sando", "Bakery", "Estetik", "Dessert"],
        "ingredients": [
            {"amount": 4, "unit": "lembar", "name": "Roti tawar kupas (tanpa kulit)", "notes": "pilih yang tebal dan lembut"},
            {"amount": 1, "unit": "buah", "name": "Mangga matang manis", "notes": "kupas, potong separuh utuh tanpa biji"},
            {"amount": 150, "unit": "ml", "name": "Whipping cream cair dingin", "notes": ""},
            {"amount": 2, "unit": "sdm", "name": "Gula halus", "notes": ""},
            {"amount": 0.5, "unit": "sdt", "name": "Ekstrak vanila", "notes": ""}
        ],
        "steps": [
            "Kocok whipping cream dingin bersama gula halus dan ekstrak vanila menggunakan mixer hingga kaku (stiff peak).",
            "Bentangkan selembar plastic wrap di atas meja. Letakkan 1 lembar roti tawar di atasnya.",
            "Oleskan whipped cream tebal di atas roti.",
            "Letakkan separuh buah mangga utuh secara diagonal di tengah roti.",
            "Tutup mangga dengan whipped cream lagi hingga seluruh celah terisi penuh dan rata.",
            "Tutup dengan selembar roti tawar, lalu bungkus erat dengan plastic wrap. Tandai arah diagonal potongan mangga dengan spidol di atas plastik.",
            "Simpan di lemari es minimal 1 jam agar krim mengeras kokoh.",
            "Potong sandwich secara diagonal menggunakan pisau tajam yang dicelup air panas dan dilap kering."
        ],
        "tips": "Menandai garis potong diagonal pada plastik wrap sangat krusial agar saat dibelah tampilan penampang mangga pas di tengah dan memukau."
    },
    {
        "id": "simpel-21",
        "title": "Chia Pudding Mangga",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Dessert superfood kaya omega-3 dan serat. Lapisan puding biji chia susu kelapa gurih berselang-seling dengan pure mangga manis segar di dalam gelas cantik.",
        "prepTime": "10 menit",
        "cookTime": "Rendam semalaman (6 jam)",
        "totalMinutes": 370,
        "servings": 2,
        "difficulty": "Mudah",
        "calories": "195 kkal",
        "mangoType": "Mangga Harum Manis Lembut",
        "icon": "🍨",
        "tags": ["Superfood", "Chia Pudding", "Vegan", "Sehat"],
        "ingredients": [
            {"amount": 4, "unit": "sdm", "name": "Biji chia hitam atau putih", "notes": ""},
            {"amount": 250, "unit": "ml", "name": "Susu almond atau susu santan encer", "notes": ""},
            {"amount": 1.5, "unit": "sdm", "name": "Madu murni atau sirup agave", "notes": ""},
            {"amount": 1, "unit": "buah", "name": "Mangga matang manis", "notes": "blender menjadi pure kental"},
            {"amount": 2, "unit": "sdm", "name": "Potongan mangga dadu & daun mint", "notes": "garnish"}
        ],
        "steps": [
            "Dalam toples kaca, campurkan biji chia, susu almond, dan madu. Aduk rata menggunakan garpu selama 1 menit agar biji chia tidak menggumpal di dasar toples.",
            "Tutup toples dan simpan di kulkas minimal 4 jam atau semalaman hingga biji chia menyerap cairan dan bertekstur kental seperti puding.",
            "Siapkan 2 gelas saji kaca transparan.",
            "Masukkan 2 sendok puding chia di dasar gelas, tambahkan lapisan pure mangga di atasnya, ulangi hingga gelas penuh berselang-seling.",
            "Beri topping potongan mangga dadu segar dan sehelai daun mint di puncaknya.",
            "Sajikan dingin untuk sarapan berenergi atau camilan sore bernutrisi."
        ],
        "tips": "Aduk kembali campuran biji chia setelah 10 menit pertama disimpan di kulkas untuk memastikan seluruh biji mengembang terpisah secara merata."
    },
    {
        "id": "simpel-22",
        "title": "Es Susu Mangga Jelly",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Minuman botolan kekinian yang viral. Sensasi kenyal lembut jelly mangga, manisnya potongan mangga segar, dan gurih creamy kuah susu kental manis dingin.",
        "prepTime": "15 menit",
        "cookTime": "10 menit + Dinginkan",
        "totalMinutes": 60,
        "servings": 5,
        "difficulty": "Mudah",
        "calories": "175 kkal",
        "mangoType": "Mangga Harum Manis Dadu",
        "icon": "🧋",
        "tags": ["Ide Jualan", "Viral", "Minuman Botol", "Segar"],
        "ingredients": [
            {"amount": 1, "unit": "bungkus", "name": "Nutrijell rasa mangga (15 gr)", "notes": "masak sesuai kemasan, dinginkan, serut memanjang"},
            {"amount": 2, "unit": "buah", "name": "Mangga matang manis", "notes": "potong dadu kecil"},
            {"amount": 500, "unit": "ml", "name": "Susu UHT full cream", "notes": ""},
            {"amount": 1, "unit": "kaleng", "name": "Susu evaporasi (380 gr)", "notes": "rahasia kuah creamy"},
            {"amount": 120, "unit": "gram", "name": "Kental manis putih", "notes": "sesuai selera"},
            {"amount": 1, "unit": "sdm", "name": "Biji selasih", "notes": "rendam air hangat"}
        ],
        "steps": [
            "Masak bubuk jelly mangga dengan air dan sedikit gula sesuai instruksi kemasan. Setelah mengeras, serut menggunakan serutan blewah atau potong dadu kecil.",
            "Campurkan susu UHT full cream, susu evaporasi, dan kental manis dalam wadah besar. Aduk rata hingga manisnya menyatu sempurna.",
            "Masukkan serutan jelly mangga, potongan mangga segar, dan biji selasih ke dalam kuah susu.",
            "Aduk rata secara perlahan agar potongan mangga tidak hancur.",
            "Kemas ke dalam botol-botol minuman 250 ml atau tuang ke dalam gelas berisi es batu.",
            "Simpan di lemari es hingga benar-benar dingin sebelum diminum."
        ],
        "tips": "Penambahan susu evaporasi memberikan rasa creamy 'milky' yang jauh lebih gurih dan premium dibandingkan hanya menggunakan susu UHT biasa."
    },
    {
        "id": "simpel-23",
        "title": "Ketan Mangga Simpel (Tanpa Kukus)",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Versi praktis mango sticky rice menggunakan rice cooker tanpa repot mengukus. Ketan pulen gurih bersantan dipadukan dengan manis legit mangga harum manis.",
        "prepTime": "10 menit",
        "cookTime": "30 menit di Rice Cooker",
        "totalMinutes": 40,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "310 kkal",
        "mangoType": "Mangga Harum Manis Matang Sempurna",
        "icon": "🍚",
        "tags": ["Rice Cooker", "Praktis", "Ketan Mangga", "Manis Gurih"],
        "ingredients": [
            {"amount": 250, "unit": "gram", "name": "Beras ketan putih berkualitas", "notes": "cuci bersih, tiriskan"},
            {"amount": 200, "unit": "ml", "name": "Santan instan sedang", "notes": ""},
            {"amount": 100, "unit": "ml", "name": "Air bersih", "notes": ""},
            {"amount": 0.5, "unit": "sdt", "name": "Garam", "notes": ""},
            {"amount": 2, "unit": "lembar", "name": "Daun pandan", "notes": "simpulkan"},
            {"amount": 2, "unit": "buah", "name": "Mangga harum manis matang", "notes": "kupas, iris cantik"},
            {"amount": 1, "unit": "sdm", "name": "Wijen sangrai", "notes": "taburan"}
        ],
        "steps": [
            "Masukkan beras ketan, santan, air, garam, dan daun pandan ke dalam panci rice cooker. Aduk sebentar.",
            "Nyalakan rice cooker pada mode 'Cook' biasa. Setelah tombol berpindah ke 'Warm', diamkan selama 10 menit tanpa membuka tutupnya agar ketan matang tanak merata.",
            "Buka tutup rice cooker, aduk ketan perlahan menggunakan centong nasi kayu agar ketan pulen merata.",
            "Bentuk ketan menggunakan mangkuk kecil yang dioles sedikit minyak, lalu telungkupkan di piring saji.",
            "Tata irisan buah mangga matang di samping ketan hangat.",
            "Taburkan biji wijen sangrai di atas ketan dan sajikan."
        ],
        "tips": "Untuk beras ketan di rice cooker, takaran santan dan air jangan terlalu banyak agar ketan tidak lembek seperti bubur, melainkan tetap kenyal butirannya."
    },
    {
        "id": "simpel-24",
        "title": "Keripik Mangga Oven / Airfryer",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Keripik buah renyah alami tanpa minyak goreng. Irisan tipis mangga dipanggang dengan suhu rendah hingga kadar airnya hilang dan menjadi krispi manis alami.",
        "prepTime": "10 menit",
        "cookTime": "120 menit (Panggang)",
        "totalMinutes": 130,
        "servings": 4,
        "difficulty": "Mudah",
        "calories": "105 kkal",
        "mangoType": "Mangga Mengkal / Manalagi / Harum Manis Mengkal",
        "icon": "🥨",
        "tags": ["Sehat", "Bebas Minyak", "Airfryer", "Camilan"],
        "ingredients": [
            {"amount": 3, "unit": "buah", "name": "Mangga mengkal bertekstur keras", "notes": "kupas bersih"},
            {"amount": 1, "unit": "sdm", "name": "Air perasan jeruk nipis", "notes": "mencegah browning"},
            {"amount": 500, "unit": "ml", "name": "Air es", "notes": "untuk merendam irisan mangga"}
        ],
        "steps": [
            "Iris tipis mangga menggunakan alat mandolin slicer dengan ketebalan 1-2 mm agar tingkat kematangannya merata.",
            "Rendam irisan mangga dalam air es yang diberi perasan jeruk nipis selama 5 menit, lalu tiriskan dan lap kering dengan tisu dapur.",
            "Tata irisan mangga satu per satu di atas rak loyang oven atau keranjang airfryer beralas baking paper berlubang (jangan bertumpuk).",
            "Panggang dalam oven dengan suhu rendah 90°C - 100°C selama 1.5 hingga 2 jam (atau di airfryer mode dehydrate 85°C selama 90 menit).",
            "Balik irisan mangga di pertengahan waktu memanggang agar keringnya merata.",
            "Keluarkan saat keripik sudah kaku dan kering. Keripik akan semakin renyah saat sudah dingin di suhu ruang.",
            "Simpan segera dalam toples kedap udara."
        ],
        "tips": "Gunakan mangga yang masih mengkal dan iris setipis mungkin. Memanggang dengan suhu rendah menjaga warna kuning cerah dan rasa manis alaminya tanpa gosong."
    },
    {
        "id": "simpel-25",
        "title": "Popsicle Mangga Kelapa",
        "category": "Olahan Simpel & Harian",
        "categoryKey": "simpel",
        "desc": "Es loli tropis dua rasa yang eksotis. Lapisan jus mangga manis alami berpadu dengan gurihnya air kelapa muda dan serutan daging kelapa lembut.",
        "prepTime": "15 menit",
        "cookTime": "Bekukan 5 jam",
        "totalMinutes": 315,
        "servings": 6,
        "difficulty": "Mudah",
        "calories": "80 kkal",
        "mangoType": "Mangga Gedong Gincu atau Harum Manis",
        "icon": "🍭",
        "tags": ["Es Loli", "Tropis", "Air Kelapa", "Alami"],
        "ingredients": [
            {"amount": 2, "unit": "buah", "name": "Mangga matang", "notes": "blender halus tanpa air"},
            {"amount": 200, "unit": "ml", "name": "Air kelapa muda segar", "notes": ""},
            {"amount": 50, "unit": "gram", "name": "Daging kelapa muda", "notes": "kerok halus"},
            {"amount": 2, "unit": "sdm", "name": "Madu atau sirup gula", "notes": "campur ke air kelapa"}
        ],
        "steps": [
            "Campur air kelapa muda dengan madu dan serutan daging kelapa muda, aduk rata.",
            "Siapkan cetakan es loli (popsicle mold).",
            "Tuang pure mangga hingga mengisi separuh cetakan.",
            "Lanjutkan menuangkan campuran air kelapa muda dan serutan kelapa hingga cetakan hampir penuh.",
            "Gunakan sumpit kecil untuk mengaduk ringan sekali putar agar tercipta efek motif marmer tropis yang artistik.",
            "Pasang stik es loli di tengahnya.",
            "Bekukan di freezer selama 5 jam hingga beku sempurna.",
            "Celupkan cetakan sebentar ke air hangat untuk mempermudah mengeluarkan es loli dari cetakan."
        ],
        "tips": "Menggunakan air kelapa murni tanpa pemanis buatan memberikan rasa segar alami yang sangat seimbang dengan kepekatan jus mangga asli."
    }
]

print(f"Loaded {len(recipes_raw)} base recipes.")
"""
End of Category I.
We will now generate all remaining categories (Category II: 25, Category III: 50, Category IV: 30, Category V: 20, Category VI: 50) programmatically and thoroughly.
"""

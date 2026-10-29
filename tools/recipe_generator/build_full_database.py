# -*- coding: utf-8 -*-
"""
Master Builder for Resep All Manggo 1,000 Recipe Database
Merges original 200 recipes + 800 newly added recipes (Sections VII to XX).
Generates:
1. data/recipes.json (Complete 1,000 recipes database)
2. js/recipes-data.js (Browser-ready window.MANGO_RECIPES)
"""

import json
import os
import re
import sys

base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
data_dir = os.path.join(base_dir, "data")
tools_dir = os.path.join(base_dir, "tools", "recipe_generator")
raw_input_path = os.path.join(tools_dir, "raw_user_input.txt")
photos_path = os.path.join(base_dir, "tools", "photo_scraper", "scraped_cookpad_photos.json")

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

# 1. Load Scraped Photos
cookpad_photos = []
if os.path.exists(photos_path):
    with open(photos_path, "r", encoding="utf-8") as f:
        photo_dict = json.load(f)
        cookpad_photos = list(photo_dict.values())
print(f"Loaded {len(cookpad_photos)} Cookpad photos for matching.")

# 2. Load Existing 200 Recipes
existing_recipes_path = os.path.join(data_dir, "recipes.json")
with open(existing_recipes_path, "r", encoding="utf-8") as f:
    existing_recipes = json.load(f)
# Guarantee first 200 original recipes
existing_recipes = existing_recipes[:200]
print(f"Loaded {len(existing_recipes)} original recipes (1-200).")

# 3. Parse Sections VII to XX from raw_user_input.txt
with open(raw_input_path, "r", encoding="utf-8") as f:
    raw_text = f.read()

if "</USER_REQUEST>" in raw_text:
    raw_text = raw_text[:raw_text.find("</USER_REQUEST>")]

SECTION_METADATA = [
    {
        "roman": "VII",
        "categoryKey": "nusantara-lanjutan",
        "categoryName": "Eksplorasi Nusantara Lanjutan",
        "defaultIcon": "🌶️",
        "expectedCount": 60,
        "defaultDifficulty": "Mudah",
        "defaultTime": 20,
        "mangoType": "Mangga Muda / Pencit Indramayu Segar"
    },
    {
        "roman": "VIII",
        "categoryKey": "anak-benua",
        "categoryName": "Khazanah Mangga Anak Benua India, Pakistan & Sri Lanka",
        "defaultIcon": "🍛",
        "expectedCount": 80,
        "defaultDifficulty": "Sedang",
        "defaultTime": 35,
        "mangoType": "Mangga Harum Manis Matang / Kesar / Alphonso"
    },
    {
        "roman": "IX",
        "categoryKey": "asia-lanjutan",
        "categoryName": "Asia Tenggara & Asia Timur Lanjutan",
        "defaultIcon": "🥢",
        "expectedCount": 60,
        "defaultDifficulty": "Sedang",
        "defaultTime": 25,
        "mangoType": "Mangga Nam Dok Mai / Harum Manis / Pencit"
    },
    {
        "roman": "X",
        "categoryKey": "latin-afrika",
        "categoryName": "Kuliner Meksiko, Amerika Latin, Karibia & Afrika",
        "defaultIcon": "🌮",
        "expectedCount": 60,
        "defaultDifficulty": "Sedang",
        "defaultTime": 30,
        "mangoType": "Mangga Mengkal Manalagi atau Gedong Gincu"
    },
    {
        "roman": "XI",
        "categoryKey": "fusion-finedining",
        "categoryName": "Hidangan Gurih Modern, Fusion & Fine Dining",
        "defaultIcon": "🍽️",
        "expectedCount": 60,
        "defaultDifficulty": "Sedang",
        "defaultTime": 35,
        "mangoType": "Mangga Harum Manis / Mengkal Berkualitas Super"
    },
    {
        "roman": "XII",
        "categoryKey": "pastry-kreatif",
        "categoryName": "Pastry, Kue, Cokelat & Dessert Kreatif Lanjutan",
        "defaultIcon": "🥐",
        "expectedCount": 50,
        "defaultDifficulty": "Sedang",
        "defaultTime": 45,
        "mangoType": "Puree Mangga Harum Manis Matang Pohon"
    },
    {
        "roman": "XIII",
        "categoryKey": "minuman-fermentasi",
        "categoryName": "Minuman Spesial, Fermentasi, Bumbu & Pengawetan",
        "defaultIcon": "🍾",
        "expectedCount": 30,
        "defaultDifficulty": "Mudah",
        "defaultTime": 20,
        "mangoType": "Mangga Harum Manis Matang / Mangga Muda"
    },
    {
        "roman": "XIV",
        "categoryKey": "mpasi-anak",
        "categoryName": "MPASI, Makanan Anak & Camilan Keluarga",
        "defaultIcon": "👶",
        "expectedCount": 50,
        "defaultDifficulty": "Mudah",
        "defaultTime": 15,
        "mangoType": "Mangga Manis Matang Alami Tanpa Serat"
    },
    {
        "roman": "XV",
        "categoryKey": "diet-sehat",
        "categoryName": "Diet Sehat, Vegan, Keto, Paleo & Superfood Bowls",
        "defaultIcon": "🥑",
        "expectedCount": 60,
        "defaultDifficulty": "Mudah",
        "defaultTime": 15,
        "mangoType": "Mangga Matang Beku / Mangga Mengkal Segar"
    },
    {
        "roman": "XVI",
        "categoryKey": "streetfood",
        "categoryName": "Jajanan Kaki Lima Dunia & Gorengan Kreatif",
        "defaultIcon": "🍢",
        "expectedCount": 50,
        "defaultDifficulty": "Mudah",
        "defaultTime": 25,
        "mangoType": "Mangga Mengkal Manalagi / Harum Manis Padat"
    },
    {
        "roman": "XVII",
        "categoryKey": "rumahan-tradisional",
        "categoryName": "Masakan Rumahan & Tradisional Lintas Daerah",
        "defaultIcon": "🍳",
        "expectedCount": 80,
        "defaultDifficulty": "Sedang",
        "defaultTime": 30,
        "mangoType": "Mangga Muda Pencit / Mengkal Indramayu"
    },
    {
        "roman": "XVIII",
        "categoryKey": "gelato-eskrim",
        "categoryName": "Artisan Gelato, Es Krim, Sorbet & Kreasi Beku",
        "defaultIcon": "🍨",
        "expectedCount": 50,
        "defaultDifficulty": "Sedang",
        "defaultTime": 25,
        "mangoType": "Puree Mangga Harum Manis Kental Matang"
    },
    {
        "roman": "XIX",
        "categoryKey": "kopi-mocktail",
        "categoryName": "Kopi, Teh, Mocktail & Barista Kreasi",
        "defaultIcon": "☕",
        "expectedCount": 60,
        "defaultDifficulty": "Mudah",
        "defaultTime": 10,
        "mangoType": "Sari Mangga Harum Manis / Reduksi Puree Mangga"
    },
    {
        "roman": "XX",
        "categoryKey": "molecular-zerowaste",
        "categoryName": "Molecular Gastronomy, Fermentasi Eksperimental & Zero-Waste Mangga",
        "defaultIcon": "🧪",
        "expectedCount": 50,
        "defaultDifficulty": "Ahli",
        "defaultTime": 45,
        "mangoType": "Ekstrak Mangga Murni / Kulit & Inti Biji Mangga"
    }
]

# Find section positions
roman_order = [s["roman"] for s in SECTION_METADATA]
section_spans = []
for r in roman_order:
    m = re.search(rf'(?:\b|(?<=\n))({r}\.[^\:\(]+?\(\d+[\–\-]\d+\))', raw_text)
    if m:
        section_spans.append((r, m.start(), m.group(1)))
    else:
        print(f"Error: Section {r} not found!")

# Helper functions for recipe generation
def extract_mango_prep(title, desc):
    low = (title + " " + desc).lower()
    if any(k in low for k in ["kulit mangga", "peel"]):
        return {
            "name": "Kulit mangga organik bersih",
            "type": "Kulit Mangga Organik Bersih",
            "notes": "cuci bersih dengan baking soda, iris memanjang tipis",
            "amount": 100,
            "unit": "gram"
        }
    elif any(k in low for k in ["biji mangga", "inti biji", "kernel"]):
        return {
            "name": "Inti biji mangga muda (kernel)",
            "type": "Inti Biji Mangga Muda Segar",
            "notes": "belah cangkang biji, rendam air garam untuk buang tanin",
            "amount": 3,
            "unit": "butir"
        }
    elif any(k in low for k in ["daun mangga"]):
        return {
            "name": "Pucuk daun mangga muda",
            "type": "Pucuk Daun Mangga Pilihan",
            "notes": "rebus sebentar dalam air mendidih",
            "amount": 10,
            "unit": "lembar"
        }
    elif any(k in low for k in ["bunga mangga"]):
        return {
            "name": "Bunga mangga mekar bersih",
            "type": "Bunga Pohon Mangga Alami",
            "notes": "kukus sebentar sebelum dicampur bumbu",
            "amount": 100,
            "unit": "gram"
        }
    elif any(k in low for k in ["kayu"]):
        return {
            "name": "Serpihan kayu pohon mangga kering",
            "type": "Kayu Dahan Pohon Mangga Kering",
            "notes": "untuk pengasapan alami aroma manis harum",
            "amount": 150,
            "unit": "gram"
        }
    elif any(k in low for k in ["muda", "pencit", "mentah", "kairi", "asam"]):
        return {
            "name": "Mangga muda bertekstur renyah",
            "type": "Mangga Muda Pencit Indramayu",
            "notes": "kupas, serut kasar atau cacah korek api",
            "amount": 2,
            "unit": "buah"
        }
    elif any(k in low for k in ["mengkal", "asinan", "manisan", "rujak"]):
        return {
            "name": "Mangga mengkal segar",
            "type": "Mangga Mengkal Manalagi / Gedong",
            "notes": "potong dadu atau iris tipis memanjang",
            "amount": 2,
            "unit": "buah"
        }
    elif any(k in low for k in ["pure", "puree", "jus", "smoothie", "sorbet", "gelato", "selai"]):
        return {
            "name": "Puree daging mangga harum manis",
            "type": "Mangga Harum Manis Matang Pohon",
            "notes": "diblender halus lembut tanpa tambahan air",
            "amount": 250,
            "unit": "ml"
        }
    elif any(k in low for k in ["kering", "powder", "amchur"]):
        return {
            "name": "Bubuk mangga kering (Amchur / freeze-dried)",
            "type": "Mangga Kering Alami",
            "notes": "untuk sentuhan asam segar beraroma",
            "amount": 2,
            "unit": "sdm"
        }
    else:
        return {
            "name": "Daging buah mangga matang",
            "type": "Mangga Harum Manis Matang",
            "notes": "kupas, potong dadu manis berair",
            "amount": 2,
            "unit": "buah"
        }

def is_sweet_recipe(title, desc, sec_key):
    if sec_key in ["gelato-eskrim", "kopi-mocktail", "pastry-kreatif", "mpasi-anak"]:
        return True
    low = (title + " " + desc).lower().replace("daging mangga", "buah mangga").replace("daging buah", "buah mangga").replace("daging kelapa", "buah kelapa")
    sweet_terms = [
        "dessert", "kue", "bolu", "puding", "pancake", "cake", "tart", "pie",
        "halwa", "ladoo", "papad", "permen", "candy", "cookies", "croissant",
        "muffin", "wafel", "crepe", "smoothie", "ice cream", "es krim", "sorbet",
        "gelato", "parfait", "cheesecake", "mousse", "donat", "cenil", "talam",
        "apem", "pukis", "cubit", "getuk", "jongkong", "sandesh", "rasgulla",
        "peda", "falooda", "payasam", "kheer", "shrikhand", "amrakhand", "basundi",
        "rabri", "manisan", "selai", "syrup", "sirup", "milkshake", "frappuccino",
        "lempengan kenyal", "gula aren", "jaggery", "kapulaga"
    ]
    savory_override = ["sambal", "tumis", "kari", "sup", "soto", "daging sapi", "daging ayam", "daging kambing", "daging cincang", "ikan", "bebek", "asin"]
    if any(k in low for k in savory_override):
        return False
    return any(k in low for k in sweet_terms)

def generate_ingredients_list(title, desc, section_info):
    low = (title + " " + desc).lower()
    # Mask out "daging mangga" or "daging buah" so they don't trigger meat
    masked_low = low.replace("daging mangga", "buah mangga").replace("daging buah", "buah mangga")
    ingredients = []

    # 1. Primary Mango
    m_prep = extract_mango_prep(title, desc)
    ingredients.append({
        "amount": m_prep["amount"],
        "unit": m_prep["unit"],
        "name": m_prep["name"],
        "notes": m_prep["notes"]
    })

    added_names = set()
    added_names.add(m_prep["name"].lower())

    def add_ing(amt, unit, name, notes=""):
        if name.lower() not in added_names and len(ingredients) < 8:
            ingredients.append({
                "amount": amt,
                "unit": unit,
                "name": name,
                "notes": notes
            })
            added_names.add(name.lower())

    # Fermented & Specialty Base
    if "tempoyak" in masked_low:
        add_ing(3, "sdm", "Tempoyak durian fermentasi", "khas Sumatra")
    if "pliek u" in masked_low:
        add_ing(3, "sdm", "Pliek U (kelapa fermentasi Aceh)", "khas Serambi Mekkah")
    if "teri" in masked_low or "ikan asin" in masked_low or "jambal" in masked_low or "peda" in masked_low:
        add_ing(60, "gram", "Ikan teri / ikan asin pilihan", "goreng renyah gurih")
    if "udang" in masked_low or "shrimp" in masked_low:
        add_ing(200, "gram", "Udang kupas segar", "bersihkan kotoran punggungnya")
    if "kepiting" in masked_low or "rajungan" in masked_low or "crab" in masked_low:
        add_ing(150, "gram", "Daging kepiting / rajungan segar", "kukus matang")
    if "tiram" in masked_low or "oyster" in masked_low:
        add_ing(6, "butir", "Tiram segar kupas", "dinginkan di atas es")
    if "cumi" in masked_low or "sotong" in masked_low:
        add_ing(150, "gram", "Cumi segar / suwir cumi kering", "potong cincin")
    if any(k in masked_low for k in ["patin", "lele", "kakap", "tongkol", "tenggiri", "bawal", "gurame", "nila", "ikan"]):
        add_ing(350, "gram", "Fillet ikan segar pilihan", "lumuri air jeruk nipis")
    if "salmon" in masked_low or "tuna" in masked_low:
        add_ing(200, "gram", "Salmon / tuna segar kualitas sashimi", "potong dadu kecil")
    if "scallop" in masked_low:
        add_ing(6, "buah", "Kerang simping (scallop) segar", "keringkan dengan tisu")
    if "bebek" in masked_low or "duck" in masked_low:
        add_ing(1, "potong", "Dada bebek dengan kulit (duck breast)", "kerat kulit motif wajik")
    if any(k in masked_low for k in ["daging sapi", "iga sapi", "daging cincang", "beef", "kambing", "lamb", "daging suwir"]):
        add_ing(300, "gram", "Daging sapi / domba empuk", "potong dadu atau iris tipis")
    if any(k in masked_low for k in ["ayam", "chicken", "puyuh"]):
        add_ing(300, "gram", "Daging ayam / puyuh fillet", "potong dadu atau suwir")
    if "tahu" in masked_low or "tofu" in masked_low:
        add_ing(2, "buah", "Tahu sutra putih / tahu pong", "potong dadu")
    if "tempe" in masked_low:
        add_ing(150, "gram", "Tempe kedelai segar", "potong dadu atau goreng garing")
    if any(k in masked_low for k in ["paneer", "burrata", "halloumi", "mozzarella", "ricotta", "keju"]):
        add_ing(120, "gram", "Keju pilihan (paneer / burrata / mozzarella)", "potong dadu atau suwir")
    if "telur" in masked_low:
        add_ing(2, "butir", "Telur ayam segar", "rebus atau kocok lepas")

    # Grain / Carbs / Base
    if any(k in masked_low for k in ["basmati", "nasi", "biryani", "pulao"]):
        add_ing(300, "gram", "Beras basmati / beras pulen harum", "cuci bersih dan tiriskan")
    if any(k in masked_low for k in ["mie", "soba", "bihun", "kwetiau", "noodles"]):
        add_ing(150, "gram", "Mi / bihun / soba rebus", "tiriskan dan lumuri sedikit minyak")
    if "sagu" in masked_low or "kapurung" in masked_low:
        add_ing(100, "gram", "Tepung sagu murni", "larutkan air mendidih kenyal")
    if "jagung" in masked_low:
        add_ing(1, "buah", "Jagung manis pipil", "rebus matang")
    if "singkong" in masked_low:
        add_ing(250, "gram", "Singkong pulen kukus", "haluskan selagi hangat")
    if "kentang" in masked_low:
        add_ing(2, "buah", "Kentang rebus empuk", "tumbuk halus")
    if "semolina" in masked_low or "suji" in masked_low or "kesari" in masked_low:
        add_ing(150, "gram", "Tepung semolina (suji)", "sangrai dengan ghee")
    if "oat" in masked_low:
        add_ing(80, "gram", "Rolled oat gandum utuh", "sangrai ringan")
    if "quinoa" in masked_low or "chia" in masked_low:
        add_ing(2, "sdm", "Biji chia / quinoa matang", "kaya serat alami")

    # Liquids / Dairy
    if "santan" in masked_low or "kelapa" in masked_low:
        add_ing(200, "ml", "Santan kelapa kental segar", "dari perasan kelapa parut asli")
    if any(k in masked_low for k in ["yogurt", "dahi", "kefir", "raita", "shrikhand", "amrakhand"]):
        add_ing(180, "gram", "Yogurt tawar kental / Greek dahi", "dinginkan")
    if "ghee" in masked_low or "samin" in masked_low:
        add_ing(2, "sdm", "Minyak samin (pure desi ghee)", "harum gurih khas India")
    if "susu" in masked_low or "cream" in masked_low or "rabri" in masked_low:
        add_ing(200, "ml", "Susu murni full cream / krim kental", "hangat atau dingin")
    if "kopi" in masked_low or "espresso" in masked_low:
        add_ing(2, "shot", "Espresso kopi arabika pekat", "baru diseduh")
    if any(k in masked_low for k in ["teh", "matcha", "oolong", "earl grey", "chai"]):
        add_ing(200, "ml", "Seduhan teh harum pekat", "dinginkan")
    if "soda" in masked_low or "tonic" in masked_low or "sparkling" in masked_low:
        add_ing(150, "ml", "Air soda berkarbonasi dingin", "segar bersoda")

    # Spices & Herbs
    if any(k in masked_low for k in ["kapulaga", "cardamom"]):
        add_ing(0.5, "sdt", "Bubuk kapulaga hijau aromatik", "harum semerbak")
    if "saffron" in masked_low:
        add_ing(5, "helai", "Putik bunga saffron murni", "rendam air hangat")
    if any(k in masked_low for k in ["jaggery", "gula aren", "gula merah", "kithul"]):
        add_ing(2, "sdm", "Gula aren / jaggery murni", "serut halus")
    if any(k in masked_low for k in ["moster", "mustard", "sarson", "rai"]):
        add_ing(1, "sdt", "Biji moster hitam / kuning", "sangrai letupkan")
    if any(k in masked_low for k in ["kecombrang", "rias", "bongkot"]):
        add_ing(1, "batang", "Batang / bunga kecombrang segar", "iris halus wangi")
    if "andaliman" in masked_low:
        add_ing(1, "sdm", "Buah andaliman Batak segar", "gerus kasar bergetar")
    if "petis" in masked_low:
        add_ing(2, "sdm", "Petis udang hitam / petis Madura", "gurih pekat")
    if any(k in masked_low for k in ["terasi", "belacan", "kapi"]):
        add_ing(1, "sdt", "Terasi udang berkualitas", "bakar hingga matang semerbak")
    if "kangkung" in masked_low:
        add_ing(1, "ikat", "Kangkung segar", "petik daun dan batang muda")
    if "bunga pepaya" in masked_low:
        add_ing(100, "gram", "Bunga pepaya segar", "rebus dengan daun jambu")
    if "pepaya" in masked_low:
        add_ing(100, "gram", "Pepaya mengkal serut", "renyah segar")
    if "kol" in masked_low or "slaw" in masked_low:
        add_ing(80, "gram", "Kol ungu / kol putih iris tipis", "segar garing")
    if "alpukat" in masked_low:
        add_ing(1, "buah", "Alpukat mentega matang", "potong dadu atau lumatkan")
    if "timun" in masked_low or "cucumber" in masked_low:
        add_ing(1, "buah", "Mentimun segar", "kupas dan iris tipis")
    if any(k in masked_low for k in ["mete", "cashew", "almond", "pistachio"]):
        add_ing(30, "gram", "Kacang mete / almond / pistachio sangrai", "cincang kasar")
    if any(k in masked_low for k in ["wijen", "sesame"]):
        add_ing(1, "sdm", "Minyak wijen murni / biji wijen sangrai", "aromatik")
    if "cuka" in masked_low:
        add_ing(1, "sdm", "Cuka apel / cuka kelapa alami", "asam segar")

    # Molecular Elements
    if "spherification" in masked_low or "ravioli" in masked_low or "caviar" in masked_low:
        add_ing(2, "gram", "Sodium alginate / Calcium lactate", "grade molekular kuliner")
    if "gelatin" in masked_low or "agar" in masked_low:
        add_ing(1, "bungkus", "Bubuk agar-agar murni / gelatin sapi", "larutkan air")

    # Sweet vs Savory Seasoning
    sweet = is_sweet_recipe(title, desc, section_info["categoryKey"])

    if sweet:
        if section_info["categoryKey"] == "mpasi-anak":
            add_ing(50, "ml", "ASI perah atau susu formula hangat", "encerkan tekstur")
            add_ing(1, "sdt", "Unsalted butter (mentega tawar bayi)", "lemak tambahan gizi")
        elif section_info["categoryKey"] in ["kopi-mocktail", "minuman-fermentasi"]:
            add_ing(2, "sdm", "Sirup gula tebu murni / madu", "sesuai selera")
            add_ing(1, "sdm", "Air perasan jeruk nipis / lemon segar", "penyeimbang manis")
            add_ing(1, "mangkuk", "Es batu kristal higienis", "secukupnya")
        elif section_info["categoryKey"] in ["pastry-kreatif", "gelato-eskrim"]:
            add_ing(3, "sdm", "Gula pasir berbutir halus / gula kastor", "larutkan merata")
            add_ing(1, "sdt", "Ekstrak vanili murni / kapulaga bubuk", "aroma harum")
            add_ing(0.25, "sdt", "Garam laut halus", "sejumput penyeimbang rasa")
        else:
            add_ing(3, "sdm", "Gula pasir / madu murni / gula aren", "pemanis alami")
            add_ing(1, "sdt", "Ekstrak vanili atau kapulaga bubuk", "harum legit")
            add_ing(0.25, "sdt", "Garam laut halus", "sejumput penyeimbang manis")
    else:
        if any(k in masked_low for k in ["sambal", "pedas", "cabai", "rawit", "rica", "balado"]):
            add_ing(8, "buah", "Cabai rawit merah segar", "sesuai selera pedas")
            add_ing(4, "buah", "Cabai merah keriting", "ulek kasar")
            add_ing(3, "siung", "Bawang merah", "iris tipis atau bakar")
            add_ing(1, "sdm", "Air perasan jeruk limau / jeruk nipis", "segar aromatik")
            add_ing(0.5, "sdt", "Garam laut", "secukupnya")
        else:
            add_ing(3, "siung", "Bawang putih", "cincang halus")
            add_ing(4, "siung", "Bawang merah", "iris tipis")
            add_ing(1, "sdm", "Minyak kelapa / minyak zaitun", "untuk menumis")
            add_ing(0.5, "sdt", "Garam laut dan lada bubuk", "penyedap rasa")

    # Safety checks: ensure between 4 and 8 ingredients
    if len(ingredients) < 4:
        if sweet:
            add_ing(1, "sdm", "Madu murni / sirup agave", "pemanis alami")
        else:
            add_ing(1, "sdm", "Air perasan jeruk nipis / lemon", "penyeimbang rasa asam segar")

    return ingredients[:8]

def generate_cooking_steps(title, desc, section_info):
    low = (title + " " + desc).lower()
    sweet = is_sweet_recipe(title, desc, section_info["categoryKey"])
    steps = []

    # Step 1: Prep
    if any(k in low for k in ["muda", "pencit", "mengkal", "serut"]):
        steps.append("Kupas mangga dan cuci bersih di bawah air mengalir. Serut atau cacah memanjang korek api, lalu taburi sedikit garam halus dan remas ringan agar teksturnya tetap renyah tanpa getir.")
    elif any(k in low for k in ["pure", "jus", "smoothie", "sorbet", "gelato"]):
        steps.append("Kupas mangga matang pilihan, potong daging buahnya dan masukkan ke dalam blender. Haluskan hingga menghasilkan tekstur puree yang lembut, kental, dan berkilau tanpa serat kasar.")
    elif any(k in low for k in ["kulit mangga"]):
        steps.append("Cuci bersih kulit mangga organik dengan larutan garam dan baking soda untuk menghilangkan sisa getah. Tiriskan dan potong memanjang sesuai kebutuhan resep.")
    elif any(k in low for k in ["biji mangga", "inti biji"]):
        steps.append("Belah cangkang keras biji mangga untuk mengeluarkan inti biji (kernel) di dalamnya. Iris tipis dan rendam dalam air garam selama 15 menit untuk membuang rasa sepat alami.")
    else:
        steps.append("Siapkan semua bahan utama dan bumbu. Kupas dan potong buah mangga sesuai takaran, pastikan kesegaran buah tetap terjaga.")

    # Step 2: Main Processing
    if sweet:
        if section_info["categoryKey"] == "mpasi-anak":
            steps.append("Kukus mangga atau buah pelengkap sebentar selama 5 menit agar lebih mudah dicerna dan steril untuk pencernaan bayi.")
            steps.append("Lumatkan bahan menggunakan saringan kawat atau blender hingga teksturnya benar-benar halus dan lembut tanpa serat.")
            steps.append("Campurkan dengan ASI perah, susu formula, atau unsalted butter selagi hangat hingga kekentalan yang pas untuk si kecil.")
        elif section_info["categoryKey"] in ["kopi-mocktail", "minuman-fermentasi"]:
            steps.append("Siapkan gelas saji tinggi, tuangkan puree mangga atau sirup mangga di dasar gelas untuk membentuk lapisan warna yang menawan.")
            steps.append("Tambahkan es batu kristal melimpah, lalu tuangkan seduhan kopi, teh, atau soda berkarbonasi dingin secara perlahan.")
            steps.append("Beri garnish daun mint segar atau potongan mangga di bibir gelas, aduk perlahan sebelum dinikmati.")
        elif section_info["categoryKey"] == "gelato-eskrim":
            steps.append("Campurkan puree mangga kental dengan susu atau krim yang telah dikocok lembut hingga teksturnya homogen dan creamy.")
            steps.append("Tuang ke dalam wadah kedap udara atau mangkuk mesin es krim, putar atau simpan dalam freezer selama 4-6 jam.")
            steps.append("Aduk atau kocok ulang adonan setiap 1 jam pada 3 jam pertama agar tekstur kristal es menjadi sangat halus dan lumer di mulut.")
        elif section_info["categoryKey"] == "pastry-kreatif" or any(k in low for k in ["cake", "bolu", "pie", "tart", "kukis"]):
            steps.append("Kocok mentega dan pemanis hingga lembut, lalu masukkan telur dan aduk lipat bersama tepung terigu yang telah diayak.")
            steps.append("Campurkan puree mangga atau susun irisan mangga manis di atas adonan secara merata dan artistik.")
            steps.append("Panggang dalam oven yang telah dipanaskan pada suhu 175°C hingga matang keemasan dan harum semerbak.")
        elif any(k in low for k in ["halwa", "ladoo", "papad", "permen", "manisan", "dodol"]):
            steps.append("Masak puree mangga bersama pemanis (gula/jaggery) dan mentega samin (ghee) di atas wajan antilengket dengan api kecil.")
            steps.append("Aduk terus secara konsisten hingga adonan mangga mengental kalis, berkilau, dan melepaskan diri dari tepi wajan.")
            steps.append("Tuang ke atas loyang beralas kertas roti atau bentuk bulat rapi, biarkan mengeras atau keringkan di bawah panas hingga kenyal.")
        else:
            steps.append("Campurkan puree mangga matang dengan pemanis dan bahan pendukung hingga menyatu lembut dan seimbang rasanya.")
            steps.append("Masak atau dinginkan hidangan sesuai petunjuk hingga mencapai konsistensi pencuci mulut yang sempurna.")
    else:
        # Savory workflow
        if "sambal" in low or "rujak" in low or "ulek" in low:
            steps.append("Ulek cabai, terasi bakar, bawang, dan garam di atas cobek batu hingga mencapai kehalusan yang diinginkan. Tambahkan gula aren sisir dan ulek kembali hingga bumbu menyatu kental.")
            steps.append("Masukkan irisan mangga ke atas cobek. Tekan-tekan ringan (bejek perlahan) menggunakan ulekan agar sari asam mangga berpadu sempurna dengan sambal pedas.")
        elif "tumis" in low or "goreng" in low or "stir-fry" in low:
            steps.append("Panaskan sedikit minyak di wajan. Tumis bumbu aromatik (bawang, cabai, jahe/serai) hingga harum semerbak dan matang kecokelatan.")
            steps.append("Masukkan bahan protein atau sayuran utama, aduk cepat dengan api sedang hingga matang sempurna dan bumbu meresap gurih.")
            steps.append("Masukkan potongan mangga pada menit-menit terakhir memasak agar teksturnya tetap segar renyah dan aromanya tidak hilang.")
        elif "kari" in low or "curry" in low or "sup" in low or "kuah" in low or "pindang" in low:
            steps.append("Didihkan kuah kaldu atau santan bersama tumisan rempah bumbu halus, serai, daun salam, dan lengkuas hingga mendidih dan harum.")
            steps.append("Masukkan bahan utama (ikan/daging/sayur) dan masak dengan api kecil hingga empuk dan kuah mulai meresap.")
            steps.append("Tambahkan potongan mangga ke dalam kuah mendidih, masak sebentar sekitar 3-5 menit hingga mangga mengeluarkan keasaman alami yang menyegarkan kuah.")
        elif "molecular" in low or "spherification" in low or "fermentasi" in low:
            steps.append("Larutkan bahan pereaksi (sodium alginate / kalsium laktat / ragi kultur) ke dalam cairan mangga secara presisi menggunakan hand blender.")
            steps.append("Lakukan proses reaksi kimia kuliner (seperti mencelupkan droplet mangga ke dalam larutan rendaman kalsium selama 2 menit hingga terbentuk selaput tipis yang elastis).")
            steps.append("Bilas butiran dengan air bersih dingin dan simpan dalam wadah berisi sari buah mangga agar membran gel tetap lentur.")
        else:
            steps.append("Campurkan bahan-bahan bumbu dan masak hingga matang seimbang dengan cita rasa manis, gurih, dan asam.")
            steps.append("Satukan potongan mangga segar dengan hidangan untuk melengkapi komposisi rasa dan tekstur.")

    # Final Step: Presentation
    steps.append("Koreksi rasa akhir, pastikan tingkat keasaman, rasa manis, dan gurihnya pas di lidah. Tata indah di atas piring atau gelas saji dan hidangkan segera selagi segar.")

    return steps

def generate_tips(title, desc, section_info):
    low = (title + " " + desc).lower()
    if "pencit" in low or "muda" in low or "sambal" in low:
        return "Gunakan mangga yang masih sangat segar dan keras. Untuk mengurangi rasa getah tanpa menghilangkan kerenyahannya, remas irisan mangga dengan sedikit garam laut lalu bilas kilat dengan air es."
    elif "pure" in low or "gelato" in low or "dessert" in low:
        return "Pilih mangga harum manis atau gedong gincu yang matang pohon alami untuk mendapatkan aroma legit kuat dan warna kuning keemasan tanpa perlu pewarna buatan."
    elif "santan" in low or "yogurt" in low:
        return "Saat memasak mangga bersama susu atau santan, gunakan api kecil dan masukkan mangga di tahap akhir agar keasaman mangga tidak menyebabkan kuah santan atau susu pecah (curdling)."
    elif "bebek" in low or "steak" in low or "ikan" in low:
        return "Rasa asam alami dari mangga berfungsi memecah serat lemak pada daging dan menghilangkan aroma amis pada ikan laut, sehingga hidangan terasa jauh lebih ringan dan segar di lidah."
    elif "molecular" in low or "fermentasi" in low:
        return "Pastikan pH dan suhu cairan mangga berada pada rentang ideal sebelum proses spherification atau fermentasi agar gel terbentuk sempurna dan kultur fermentasi bekerja optimal."
    elif "mpasi" in low or "bayi" in low or "anak" in low:
        return "Pastikan mangga benar-benar matang ranum agar manisnya alami tanpa asam berlebih yang bisa membuat perut bayi kaget. Saring hingga teksturnya lembut halus."
    else:
        return "Keseimbangan antara rasa manis mangga matang dan keasaman mangga muda adalah kunci rahasia kelezatan masakan tropis yang menggugah selera."

def generate_tags(title, desc, sec_meta):
    tags = [sec_meta["categoryName"].split()[0]]
    low = (title + " " + desc).lower()
    if "pedas" in low or "sambal" in low or "cabai" in low:
        tags.append("Pedas Segar")
    if "manis" in low or "dessert" in low or "kue" in low:
        tags.append("Manis Legit")
    if "segar" in low or "jus" in low or "mocktail" in low:
        tags.append("Minuman Segar")
    if "tradisional" in low or "nusantara" in low or "khas" in low:
        tags.append("Resep Tradisional")
    if "vegan" in low or "sehat" in low or "diet" in low:
        tags.append("Sehat & Alami")
    if "gourmet" in low or "fine dining" in low or "fusion" in low:
        tags.append("Gourmet Fine Dining")
    if "anak" in low or "mpasi" in low:
        tags.append("Ramah Anak")
    if "krispi" in low or "goreng" in low or "renyah" in low:
        tags.append("Renyah Gurih")
    if len(tags) < 4:
        tags.append("Koleksi Spesial")
    return tags[:4]

# Match photos from Cookpad photo catalog
photo_pool = list(cookpad_photos)
def find_best_photo(title, desc, categoryKey, recipe_idx):
    low = (title + " " + desc).lower()
    best_photo = None
    best_score = -1

    for p in photo_pool:
        p_title = p.get("title", "").lower()
        p_term = p.get("searchTerm", "").lower()
        p_slug = p.get("slug", "").lower()
        comb = p_title + " " + p_term + " " + p_slug

        score = 0
        for word in title.lower().split():
            if len(word) > 3 and word in comb:
                score += 15
        if "sambal" in low and ("sambal" in comb or "pencit" in comb):
            score += 25
        if "kari" in low and "kari" in comb:
            score += 25
        if "jus" in low and "jus" in comb:
            score += 25
        if "puding" in low and ("puding" in comb or "agar" in comb):
            score += 25
        if "es" in low and "es" in comb:
            score += 20
        if "kue" in low and ("cake" in comb or "bolu" in comb or "kue" in comb):
            score += 20
        if "ikan" in low and "ikan" in comb:
            score += 20
        if "salad" in low and "salad" in comb:
            score += 20

        if score > best_score:
            best_score = score
            best_photo = p

    if best_photo and best_score >= 15:
        return best_photo["url"], best_photo.get("title", title), best_photo.get("slug", "")

    # Fallback to cyclic authentic Cookpad photos so every card has a real photo
    p = photo_pool[recipe_idx % len(photo_pool)]
    return p["url"], p.get("title", title), p.get("slug", "")

# 4. Parse all 800 recipes
all_800_recipes = []
recipe_global_counter = 200

for sec_meta in SECTION_METADATA:
    r_roman = sec_meta["roman"]
    # find section span
    span = next(s for s in section_spans if s[0] == r_roman)
    span_idx = section_spans.index(span)
    start_pos = span[1]
    header = span[2]
    end_pos = section_spans[span_idx + 1][1] if span_idx + 1 < len(section_spans) else len(raw_text)

    content = raw_text[start_pos + len(header):end_pos].strip()
    content = re.sub(r'^\s*\([^\)]+\)\s*', '', content)
    content = re.sub(r'\.\s*([A-Z0-9][^:\n]{2,80}:)', r'.\n\1', content)

    lines = [l.strip() for l in content.split('\n') if l.strip()]
    sec_recipes_raw = []
    for l in lines:
        if ':' in l:
            parts = l.split(':', 1)
            t = parts[0].strip()
            d = parts[1].strip()
            if len(t) > 2 and len(d) > 3:
                sec_recipes_raw.append((t, d))

    print(f"Parsing Section {r_roman} ({sec_meta['categoryName']}): {len(sec_recipes_raw)} recipes.")

    for item_idx, (t, d) in enumerate(sec_recipes_raw):
        recipe_global_counter += 1
        num_str = f"{item_idx + 1:02d}"
        rec_id = f"{sec_meta['categoryKey']}-{num_str}"

        # Duration & Difficulty
        low = (t + " " + d).lower()
        if any(k in low for k in ["jus", "salad", "sambal", "puree", "mocktail", "shot", "bites"]):
            prep = "10 menit"
            cook = "Tanpa Masak"
            mins = 10
            diff = "Mudah"
            cals = "85 kkal"
        elif any(k in low for k in ["sup", "kari", "curry", "ayam", "bebek", "daging", "stew"]):
            prep = "15 menit"
            cook = "25 menit"
            mins = 40
            diff = "Sedang"
            cals = "320 kkal"
        elif any(k in low for k in ["pastry", "pie", "tart", "cake", "bolu", "fermentasi", "spherification"]):
            prep = "25 menit"
            cook = "35 menit"
            mins = 60
            diff = "Ahli" if "spherification" in low or "molecular" in low or "croissant" in low else "Sedang"
            cals = "240 kkal"
        else:
            prep = "15 menit"
            cook = "15 menit"
            mins = 30
            diff = "Mudah" if item_idx % 2 == 0 else "Sedang"
            cals = "175 kkal"

        m_type = extract_mango_prep(t, d)["type"]
        ings = generate_ingredients_list(t, d, sec_meta)
        steps = generate_cooking_steps(t, d, sec_meta)
        tips = generate_tips(t, d, sec_meta)
        tags = generate_tags(t, d, sec_meta)
        photo_url, cookpad_title, photo_slug = find_best_photo(t, d, sec_meta["categoryKey"], recipe_global_counter)

        recipe_obj = {
            "id": rec_id,
            "title": t,
            "category": sec_meta["categoryName"],
            "categoryKey": sec_meta["categoryKey"],
            "desc": d,
            "prepTime": prep,
            "cookTime": cook,
            "totalMinutes": mins,
            "servings": 4 if "sambal" in low or "kari" in low or "sup" in low else 2,
            "difficulty": diff,
            "calories": cals,
            "mangoType": m_type,
            "icon": sec_meta["defaultIcon"],
            "tags": tags,
            "ingredients": ings,
            "steps": steps,
            "tips": tips,
            "image": photo_url,
            "cookpadTitle": cookpad_title,
            "photoSlug": photo_slug
        }

        all_800_recipes.append(recipe_obj)

print(f"Generated {len(all_800_recipes)} new recipes.")
print(f"Total overall recipes: {len(existing_recipes)} + {len(all_800_recipes)} = {len(existing_recipes) + len(all_800_recipes)}")

# 5. Combine All 1000 Recipes
full_1000_recipes = existing_recipes + all_800_recipes

# 6. Save data/recipes.json
with open(existing_recipes_path, "w", encoding="utf-8") as f:
    json.dump(full_1000_recipes, f, ensure_ascii=False, indent=2)
print(f"Successfully saved {len(full_1000_recipes)} recipes to {existing_recipes_path}!")

# 7. Save js/recipes-data.js
js_recipes_path = os.path.join(base_dir, "js", "recipes-data.js")
with open(js_recipes_path, "w", encoding="utf-8") as f:
    f.write("// Resep All Manggo - Complete 1,000 Mango Recipe Database\n")
    f.write("// 1,000 Mahakarya Kuliner Mangga Indonesia & Dunia (Cookpad Gastronomy Edition)\n")
    f.write("window.MANGO_RECIPES = ")
    json.dump(full_1000_recipes, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print(f"Successfully exported {len(full_1000_recipes)} recipes to {js_recipes_path}!")

# Summary by category
cat_counts = {}
for r in full_1000_recipes:
    cat = r["category"]
    cat_counts[cat] = cat_counts.get(cat, 0) + 1

print("\n--- Summary per Category ---")
for cat, cnt in cat_counts.items():
    print(f" - {cat}: {cnt} resep")
print(f"Total: {sum(cat_counts.values())} resep.")

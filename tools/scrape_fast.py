import urllib.request
import urllib.parse
import re
import json
import concurrent.futures
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load existing
photos_path = os.path.join(os.path.dirname(__file__), "photo_scraper", "scraped_cookpad_photos.json")
with open(photos_path, "r", encoding="utf-8") as f:
    collected = json.load(f)

print(f"Starting with {len(collected)} existing photos.")

SEARCH_TERMS = [
    # Nusantara & Tradisional
    "sambal mangga", "sambal pencit", "rujak mangga", "asinan mangga", "manisan mangga",
    "pindang mangga", "sayur mangga", "ikan mangga", "ayam mangga", "bebek mangga",
    "ikan asin mangga", "udang mangga", "gulai mangga", "pepes mangga", "tumis mangga",
    "dabu dabu mangga", "sambal matah mangga", "beberuk mangga", "kerabu mangga",
    "pencit", "rujak serut", "rujak gobet", "asinan bogor", "sambal tempoyak",
    
    # Minuman & Kafe
    "jus mangga", "smoothie mangga", "mango yakult", "es mangga", "mango sago",
    "king mango", "es kuwut mangga", "es teh mangga", "mango mojito", "mango boba",
    "mango squash", "mango milk cheese", "mango latte", "kopi mangga", "mango mocktail",
    "es lilin mangga", "es mambo mangga", "es kulkul", "mango chia", "mango float",
    "es teler mangga", "es buah mangga", "es campur mangga", "cendol mangga", "setup mangga",
    
    # Pastry & Dessert
    "puding mangga", "mango cheesecake", "bolu mangga", "mango cake", "mango pie",
    "mango tart", "mango mousse", "mango pancake", "mango chiffon", "mango roll cake",
    "mango muffin", "mango cookies", "mango bread", "mango crepe", "mille crepes mangga",
    "cupcake mangga", "donat mangga", "dessert box mangga", "panna cotta mangga",
    "mango sticky rice", "ketan mangga", "mango kulfi", "mango sorbet", "es krim mangga",
    
    # Gurih, Salad, Western, Asia
    "mango salad", "mango salsa", "ceviche mangga", "mango curry", "mango chicken",
    "taco mangga", "mango habanero", "mango dressing", "ayam bakar mangga", "gurame mangga",
    "som tum mangga", "mango chutney", "singkong mangga", "puree mangga", "cireng mangga"
]

urls = []
for term in SEARCH_TERMS:
    for page in [1, 2, 3]:
        encoded = urllib.parse.quote(term)
        urls.append((term, f"https://cookpad.com/id/cari/{encoded}?page={page}"))

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

def fetch_page(item):
    term, url = item
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=8) as res:
            html = res.read().decode('utf-8', errors='ignore')
            matches = re.findall(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]{16})/([^\s"\'\?]+)', html)
            return term, matches
    except Exception as e:
        return term, []

print(f"Fetching {len(urls)} pages concurrently with 15 workers...")
with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
    results = executor.map(fetch_page, urls)
    for term, matches in results:
        for img_hash, slug in matches:
            if img_hash not in collected:
                clean_title = slug.split('/')[-1].replace('-foto-resep-utama.webp', '').replace('-foto-resep-utama.jpg', '').replace('-', ' ')
                clean_title = re.sub(r'^\d+\s*', '', clean_title).title()
                if not clean_title or len(clean_title) < 3 or clean_title == 'Photo.Jpg':
                    clean_title = term.title()
                collected[img_hash] = {
                    "id": img_hash,
                    "title": clean_title,
                    "slug": slug,
                    "url": f"https://img-global.cpcdn.com/recipes/{img_hash}/600x440cq80/photo.jpg",
                    "searchTerm": term
                }

print(f"Total collected unique Cookpad photos: {len(collected)}")

with open(photos_path, "w", encoding="utf-8") as f:
    json.dump(collected, f, ensure_ascii=False, indent=2)

print(f"Successfully saved to {photos_path}!")


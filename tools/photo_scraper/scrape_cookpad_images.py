import urllib.request
import urllib.parse
import re
import json
import time

SEARCH_TERMS = [
    "mangga",
    "sambal mangga",
    "rujak mangga",
    "asinan mangga",
    "manisan mangga",
    "mango sticky rice",
    "mango sago",
    "jus mangga",
    "smoothie mangga",
    "king mango",
    "es mangga",
    "mango yakult",
    "puding mangga",
    "mango cheesecake",
    "mango crepe",
    "mango tart",
    "mango pie",
    "mango mousse",
    "mango cake",
    "bolu mangga",
    "salad mangga",
    "mango salsa",
    "ikan mangga",
    "ayam mangga",
    "gulai mangga",
    "lempah mangga",
    "nasi goreng mangga",
    "mango float",
    "mango boba",
    "mango ice cream",
    "sorbet mangga",
    "mango pancake",
    "mango pastry",
    "mango dessert",
    "olahan mangga",
    "sayur asem mangga",
    "acar mangga",
    "dodol mangga",
    "kolak mangga",
    "bubur mangga",
    "kerabu mangga",
    "mango kulfi",
    "mango mojito",
    "mango curry",
    "mango habanero",
    "mango quesadilla",
    "ceviche mangga",
    "taco mangga",
    "mango parfait",
    "mango roll cake"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9'
}

collected = {}

for term in SEARCH_TERMS:
    encoded = urllib.parse.quote(term)
    url = f"https://cookpad.com/id/cari/{encoded}"
    try:
        req = urllib.request.Request(url, headers=headers)
        html = urllib.request.urlopen(req, timeout=10).read().decode('utf-8', errors='ignore')
        
        # Extract recipe items with title and photo
        # Look for recipe links: <li id="recipe_(\d+)"
        pattern = re.findall(r'<li id="recipe_(\d+)"[^>]*>(.*?)</li>', html, re.DOTALL)
        for rid, block in pattern:
            # find title
            t_match = re.search(r'<a[^>]+class="block-link__main"[^>]*>\s*([^<]+?)\s*</a>', block)
            title = t_match.group(1).strip() if t_match else ""
            
            # find img hash
            img_match = re.search(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]+)/([^\s"\'\?]+)', block)
            if img_match:
                img_hash = img_match.group(1)
                slug = img_match.group(2)
                if img_hash not in collected:
                    collected[img_hash] = {
                        "id": rid,
                        "title": title,
                        "slug": slug,
                        "url": f"https://img-global.cpcdn.com/recipes/{img_hash}/600x440cq80/photo.jpg",
                        "searchTerm": term
                    }
        print(f"[{term}] Total collected so far: {len(collected)}")
        time.sleep(0.3)
    except Exception as e:
        print(f"Error fetching {term}: {e}")

print(f"\nFinal collected unique photos: {len(collected)}")
with open('data/scraped_cookpad_photos.json', 'w', encoding='utf-8') as out:
    json.dump(collected, out, ensure_ascii=False, indent=2)
print("Saved to data/scraped_cookpad_photos.json")

# -*- coding: utf-8 -*-
"""
High-Speed Bulk Scraper for Cookpad Mango Photos
Scrapes 1,000+ unique, authentic Cookpad photos matching various mango dishes.
"""

import urllib.request
import urllib.parse
import re
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load existing scraped photos so we don't discard what we already have
existing_photos = {}
photos_path = os.path.join(os.path.dirname(__file__), "photo_scraper", "scraped_cookpad_photos.json")
if os.path.exists(photos_path):
    with open(photos_path, "r", encoding="utf-8") as f:
        existing_photos = json.load(f)
print(f"Existing photos loaded: {len(existing_photos)}")

collected = dict(existing_photos)

SEARCH_TERMS = [
    # Nusantara & Sambal
    "sambal mangga", "sambal pencit", "rujak mangga", "asinan mangga", "manisan mangga",
    "pindang mangga", "sayur mangga", "ikan mangga", "ayam mangga", "bebek mangga",
    "ikan asin mangga", "udang mangga", "gulai mangga", "pepes mangga", "tumis mangga",
    "dabu dabu mangga", "sambal matah mangga", "beberuk mangga", "kerabu mangga",
    
    # Minuman & Kafe
    "jus mangga", "smoothie mangga", "mango yakult", "es mangga", "mango sago",
    "king mango thai", "es kuwut mangga", "es teh mangga", "mango mojito", "mango boba",
    "mango squash", "mango milk cheese", "mango latte", "kopi mangga", "mango mocktail",
    "es lilin mangga", "es mambo mangga", "es kulkul mangga", "mango chia",
    
    # Pastry & Bakery
    "puding mangga", "mango cheesecake", "bolu mangga", "mango cake", "mango pie",
    "mango tart", "mango mousse", "mango pancake", "mango chiffon", "mango roll cake",
    "mango muffin", "mango cookies", "mango bread", "mango crepe", "mille crepes mangga",
    "cupcake mangga", "donat mangga", "dessert box mangga",
    
    # Asia & Kuliner Dunia
    "mango sticky rice", "ketan mangga", "som tum mangga", "mango float", "mango salsa",
    "mango curry", "mango chutney", "ceviche mangga", "mango salad", "mango habanero",
    "mango kulfi", "mango lassi", "mango shrikhand", "taco mangga", "mango chicken",
    "mango guacamole", "mango glazed", "mango dressing",
    
    # Es Krim & Gelato
    "es krim mangga", "mango ice cream", "sorbet mangga", "gelato mangga",
    "mango popsicles", "es serut mangga", "es campur mangga", "es teler mangga",
    
    # Jajanan & Gorengan & MPASI
    "mangga goreng", "martabak mangga", "puree mangga", "bubur mangga", "singkong mangga",
    "piscok mangga", "molen mangga", "bakwan mangga", "cireng mangga", "tahu mangga",
    "salad buah mangga", "setup mangga", "kolak mangga", "cendol mangga", "selai mangga",
    "keripik mangga", "mangga asam manis", "sup mangga", "oatmeal mangga", "pancake mangga"
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
}

print(f"Starting crawl across {len(SEARCH_TERMS)} terms...")

for term_idx, term in enumerate(SEARCH_TERMS):
    # Crawl page 1 and page 2 for high diversity
    for page in [1, 2]:
        encoded = urllib.parse.quote(term)
        url = f"https://cookpad.com/id/cari/{encoded}?page={page}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=6) as response:
                html = response.read().decode('utf-8', errors='ignore')
            
            # Find photo URLs: https://img-global.cpcdn.com/recipes/([a-f0-9]{16})/([^\s"'\?]+)
            matches = re.findall(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]{16})/([^\s"\'\?]+)', html)
            added_this_page = 0
            for img_hash, slug in matches:
                # filter out non-recipe thumbs if any
                if img_hash not in collected:
                    # clean title from slug
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
                    added_this_page += 1
            
            print(f"[{term_idx+1}/{len(SEARCH_TERMS)}] '{term}' (p.{page}): +{added_this_page} new | Total: {len(collected)}")
            time.sleep(0.2)
        except Exception as e:
            print(f"[{term_idx+1}/{len(SEARCH_TERMS)}] '{term}' (p.{page}) err: {e}")
            time.sleep(0.5)

print(f"\nFinal unique Cookpad photos collected: {len(collected)}")

# Save updated scraped_cookpad_photos.json
with open(photos_path, "w", encoding="utf-8") as f:
    json.dump(collected, f, ensure_ascii=False, indent=2)

print(f"Saved {len(collected)} photos to {photos_path}")


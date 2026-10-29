import json

with open('tools/photo_scraper/scraped_cookpad_photos.json', 'r', encoding='utf-8') as f:
    photos = json.load(f)

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

used_urls = set(r.get('image') for r in recipes)
used_titles = set((r.get('cookpadTitle') or '').lower() for r in recipes)

for k, v in photos.items():
    t = (v.get('title') or '').lower()
    s = (v.get('slug') or '').lower()
    url = v.get('url', '')
    if url in used_urls or t in used_titles:
        continue
    if any(w in t or w in s for w in ['candil', 'biji salak', 'kolak', 'bubur']):
        print(k, "|", v.get('title'))

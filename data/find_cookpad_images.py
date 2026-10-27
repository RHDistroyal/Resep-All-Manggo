import urllib.request
import re

url = 'https://cookpad.com/id/cari/sambal%20mangga'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})
html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# Find all recipe photos
matches = re.findall(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]+)/([^\s"\'\?]+)', html)
unique_recipes = {}
for rid, rest in matches:
    if rid not in unique_recipes:
        unique_recipes[rid] = rest

print(f"Unique recipe photos in sambal mangga: {len(unique_recipes)}")
for rid, rest in list(unique_recipes.items())[:10]:
    # Cookpad standard format: https://img-global.cpcdn.com/recipes/{rid}/600x440cq80/photo.jpg
    high_res = f"https://img-global.cpcdn.com/recipes/{rid}/600x440cq80/photo.jpg"
    print(rid, "->", rest, "->", high_res)

import urllib.request
import re

url = 'https://cookpad.com/id/cari/sambal%20mangga'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept-Language': 'id-ID,id;q=0.9'
})

html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')

# Match recipe title and image
# In cookpad, each item is <li id="recipe_XXXX" ...>
pattern = re.findall(r'<li id="recipe_(\d+)"[^>]*>(.*?)</li>', html, re.DOTALL)
print(f"Total recipe items in page: {len(pattern)}")

results = []
for rid, block in pattern:
    t_match = re.search(r'<a[^>]+class="block-link__main"[^>]*>\s*([^<]+?)\s*</a>', block)
    title = t_match.group(1).strip() if t_match else "Unknown"
    
    # Cookpad images have multiple resolutions, e.g. 300x220, 600x440, 160x176, photo.jpg
    # We want a high-res clean URL like 600x440cq80 or 400x300cq80
    img_match = re.search(r'(https://img-global\.cpcdn\.com/recipes/[a-f0-9]+/[^"\s\?]+)', block)
    if img_match:
        raw_url = img_match.group(1)
        # Convert thumbnail size to 600x440cq80 or 400x300cq80
        # Typical raw url: .../recipes/abcd1234/120x160.../photo.jpg or /puding.jpg
        # Let's inspect raw_url
        results.append((rid, title, raw_url))

print(f"Items with images: {len(results)}")
for r in results[:8]:
    print(r[1], "->", r[2])

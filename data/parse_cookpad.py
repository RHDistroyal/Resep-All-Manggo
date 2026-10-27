from bs4 import BeautifulSoup
import re

path = r'C:/Users/ASUS/.gemini/antigravity-ide/brain/208eb0d0-ed38-46fa-965f-e137022daddc/.system_generated/steps/171/content.md'
with open(path, encoding='utf-8') as f:
    text = f.read()

# Match recipe cards: often contain a title link and an image
# e.g. <a href="/id/resep/...">...</a> with img inside or nearby
pattern = re.findall(r'<li id="recipe_(\d+)"[^>]*>(.*?)</li>', text, re.DOTALL)
print(f"Recipe blocks found: {len(pattern)}")

results = []
for rid, block in pattern:
    # find title
    t_match = re.search(r'<a[^>]+class="block-link__main"[^>]*>\s*([^<]+?)\s*</a>', block)
    title = t_match.group(1).strip() if t_match else "Unknown"
    
    # find img
    img_match = re.search(r'src="(https://img-global\.cpcdn\.com/recipes/[^"]+)"', block)
    if not img_match:
        img_match = re.search(r'srcset="([^"\s]+)', block)
    img = img_match.group(1) if img_match else None
    if img:
        results.append((rid, title, img))

print(f"Parsed {len(results)} recipes with images:")
for r in results[:10]:
    print(r)

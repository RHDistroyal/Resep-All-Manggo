import re

path = r'C:/Users/ASUS/.gemini/antigravity-ide/brain/208eb0d0-ed38-46fa-965f-e137022daddc/.system_generated/steps/171/content.md'
with open(path, encoding='utf-8') as f:
    text = f.read()

pattern = re.findall(r'<li id="recipe_(\d+)"[^>]*>(.*?)</li>', text, re.DOTALL)
found = 0
for rid, block in pattern:
    imgs = re.findall(r'https://img-global\.cpcdn\.com/recipes/[a-f0-9]+/[^\s"\']+\.jpg', block)
    t_match = re.search(r'<a[^>]+class="block-link__main"[^>]*>\s*([^<]+?)\s*</a>', block)
    t = t_match.group(1).strip() if t_match else "Unknown"
    print(rid, "::", t, "::", imgs[0] if imgs else "NO IMG")
    if imgs: found += 1

print("Total found:", found)

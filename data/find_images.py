import re

path = r'C:/Users/ASUS/.gemini/antigravity-ide/brain/208eb0d0-ed38-46fa-965f-e137022daddc/.system_generated/steps/171/content.md'
with open(path, encoding='utf-8') as f:
    text = f.read()

urls = list(set(re.findall(r'https://img-global\.cpcdn\.com/recipes/[a-f0-9]+/[^\s"\']+\.jpg', text)))
print("Found cookpad URLs:", len(urls))
for u in urls[:10]:
    print(u)

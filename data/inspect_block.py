import re

text = open(r'C:/Users/ASUS/.gemini/antigravity-ide/brain/208eb0d0-ed38-46fa-965f-e137022daddc/.system_generated/steps/171/content.md', encoding='utf-8').read()
m = re.search(r'<li id="recipe_26774686"[^>]*>(.*?)</li>', text, re.DOTALL)
if m:
    with open('data/sample_block.html', 'w', encoding='utf-8') as out:
        out.write(m.group(1))
    print("Wrote sample_block.html, length:", len(m.group(1)))

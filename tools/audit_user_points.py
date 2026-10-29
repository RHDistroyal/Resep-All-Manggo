import json
import sys

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# 1. Image URL uniqueness
images = [r.get('image', '').strip() for r in recipes]
unique_images = set(images)
print(f"Total recipes: {len(recipes)}")
print(f"Unique images: {len(unique_images)}")
print(f"Duplicate images count: {len(images) - len(unique_images)}")

# Check duplicate images in detail
from collections import Counter
img_counts = Counter(images)
dupes = {k: v for k, v in img_counts.items() if v > 1}
print(f"Total URLs appearing >1 time: {len(dupes)}")

# 2. Check the specific items mentioned by user
check_ids = ['simpel-04', 'simpel-11', 'nusantara-42', 'nusantara-43', 'nusantara-45', 'asia-15', 'asia-24', 'asia-29', 'barat-07']
recipe_map = {r['id']: r for r in recipes}

print("\n--- CHECKING USER MENTIONED MISMATCH IMAGES ---")
for rid in check_ids:
    r = recipe_map.get(rid, {})
    title = r.get('title')
    img = r.get('image')
    cp = r.get('cookpadTitle')
    print(f"{rid} | {title} | cookpad: {cp} | image: {img}")

# 3. Check molecular step leak into savory
molecular_in_savory = []
for r in recipes:
    cat = r.get('categoryKey', '')
    if cat != 'molecular-zerowaste':
        steps_text = ' '.join(r.get('steps', [])).lower()
        if 'alginat' in steps_text or 'pipet' in steps_text or 'hidrokoloid' in steps_text or 'kalsium laktat' in steps_text:
            molecular_in_savory.append((r['id'], r.get('title')))
print(f"\nMolecular steps in non-molecular: {len(molecular_in_savory)}")
if molecular_in_savory:
    for item in molecular_in_savory[:10]:
        print(" ", item)

# 4. Check meat/fish in pastry/beverage/dessert
meat_in_sweet = []
for r in recipes:
    cat = r.get('categoryKey', '')
    if cat in ['pastry', 'pastry-kreatif', 'gelato-eskrim', 'kopi-mocktail', 'minuman']:
        for ing in r.get('ingredients', []):
            name = ing.get('name', '').lower()
            if any(w in name for w in ['fillet ikan', 'daging sapi', 'dada ayam', 'ikan teri', 'udang', 'cumi', 'ikan', 'daging', 'ayam', 'bebek', 'kambing']):
                meat_in_sweet.append((r['id'], r['title'], name))
print(f"\nMeat/fish in sweets: {len(meat_in_sweet)}")
if meat_in_sweet:
    for item in meat_in_sweet[:10]:
        print(" ", item)

# 5. Check garlic/onion in dessert/drinks
onion_in_sweet = []
for r in recipes:
    cat = r.get('categoryKey', '')
    t_low = r.get('title', '').lower()
    # Also check asian desserts like kanten jelly, halo-halo, mochi, etc.
    is_sweet = cat in ['pastry', 'pastry-kreatif', 'gelato-eskrim', 'kopi-mocktail', 'minuman', 'minuman-fermentasi'] or any(w in t_low for w in ['jelly', 'kanten', 'halo-halo', 'es campur', 'puding', 'mochi', 'popcorn'])
    if is_sweet:
        for ing in r.get('ingredients', []):
            name = ing.get('name', '').lower()
            if 'bawang' in name or 'cabai' in name:
                onion_in_sweet.append((r['id'], r['title'], name))
print(f"\nOnions/chili in sweets: {len(onion_in_sweet)}")
if onion_in_sweet:
    for item in onion_in_sweet[:15]:
        print(" ", item)


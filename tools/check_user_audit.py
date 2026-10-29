import json

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = {r['id']: r for r in json.load(f)}

check_ids = [
    'pastry-kreatif-07', 'pastry-kreatif-15', 'kopi-mocktail-20', 'kopi-mocktail-22',
    'asia-lanjutan-15', 'asia-lanjutan-59', 'mpasi-anak-44',
    'nusantara-lanjutan-38', 'anak-benua-61', 'fusion-finedining-10', 'rumahan-tradisional-55'
]

for rid in check_ids:
    r = recipes.get(rid, {})
    print(f"=== {rid}: {r.get('title')} ({r.get('categoryKey')}) ===")
    print("Ingredients:", [i['name'] for i in r.get('ingredients', [])])
    print("Step 1:", r.get('steps', [''])[0])
    print()


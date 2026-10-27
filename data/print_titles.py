import json

with open('data/recipes.json', encoding='utf-8') as f:
    recipes = json.load(f)

for r in recipes:
    print(r['id'], "::", r['categoryKey'], "::", r['title'])

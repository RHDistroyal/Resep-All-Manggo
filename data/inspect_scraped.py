import json
import re

with open('data/recipes.json', encoding='utf-8') as f:
    recipes = json.load(f)

with open('data/scraped_cookpad_photos.json', encoding='utf-8') as f:
    photos = json.load(f)

print(f"Total recipes: {len(recipes)}")
print(f"Total available unique photos: {len(photos)}")

# Inspect some photos
items = list(photos.values())
for item in items[:15]:
    print(f"Search: {item['searchTerm']} | Slug: {item['slug']} | Title: {item.get('title')}")

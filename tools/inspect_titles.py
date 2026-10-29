import json
from collections import Counter

data = json.load(open('data/recipes.json', encoding='utf-8'))

print("--- Check Titles Pattern ---")
for sec in set(r['category'] for r in data):
    sec_recipes = [r for r in data if r['category'] == sec]
    titles = [r['title'] for r in sec_recipes]
    print(f"\n[{sec}] ({len(sec_recipes)} resep):")
    # First 5 titles
    for t in titles[:8]:
        print(f"  - {t}")
    # Check if many start with same word
    first_words = [t.split()[0] for t in titles]
    top_first = Counter(first_words).most_common(3)
    print(f"  Top starting words: {top_first}")


import json

data = json.load(open('data/recipes.json', encoding='utf-8'))
p1 = data[:200]
p2 = data[200:]

t1 = {r['title'].lower().strip(): r for r in p1}
t2 = {r['title'].lower().strip(): r for r in p2}

overlap = []
for title_low, r in t2.items():
    if title_low in t1:
        overlap.append((t1[title_low], r))

print(f"Direct title overlaps between 1-200 and 201-1000: {len(overlap)}")
for r1, r2 in overlap:
    print(f" - [{r1['id']}] {r1['title']} ({r1['category']})  VS  [{r2['id']}] {r2['title']} ({r2['category']})")


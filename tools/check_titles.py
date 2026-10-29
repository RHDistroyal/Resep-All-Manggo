import json
from collections import Counter
from difflib import SequenceMatcher

data = json.load(open('data/recipes.json', encoding='utf-8'))
titles = [r['title'] for r in data]

print('Total titles:', len(titles))
title_counts = Counter(titles)
exact_duplicates = [t for t, c in title_counts.items() if c > 1]
print('Exact duplicate titles:', len(exact_duplicates))

# Check titles in initial 200 vs 800
first_200_titles = set(t.lower() for t in titles[:200])
new_800_titles = [t for t in titles[200:]]

cross_duplicates = []
for t in new_800_titles:
    if t.lower() in first_200_titles:
        cross_duplicates.append(t)

print(f'Cross duplicates between new 800 and first 200: {len(cross_duplicates)}')
for c in cross_duplicates:
    print(' Cross duplicate:', c)

# Check similar titles across all
similar = []
for i in range(len(titles)):
    for j in range(i+1, len(titles)):
        ratio = SequenceMatcher(None, titles[i].lower(), titles[j].lower()).ratio()
        if ratio >= 0.90:
            similar.append((data[i]['id'], titles[i], data[j]['id'], titles[j], ratio))

print(f'\nHighly similar titles (ratio >= 0.90): {len(similar)}')
for id1, t1, id2, t2, r in similar[:25]:
    print(f' - [{id1}] "{t1}" <==> [{id2}] "{t2}" ({r:.2f})')


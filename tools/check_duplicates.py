import json
from collections import Counter

data = json.load(open('data/recipes.json', encoding='utf-8'))
print('Total recipes:', len(data))

# 1. Check title duplicates
titles = [r['title'].strip() for r in data]
title_counts = Counter(titles)
duplicates = {t: c for t, c in title_counts.items() if c > 1}
print('Duplicate titles count:', len(duplicates))
for t, c in duplicates.items():
    matching_ids = [r['id'] for r in data if r['title'].strip() == t]
    print(f' - "{t}": {c} times -> IDs: {matching_ids}')

# 2. Check images
images = [r.get('image', '') for r in data]
img_counts = Counter(images)
print('\nTotal unique images:', len(img_counts))
print('Top 15 most repeated images:')
for img, c in img_counts.most_common(15):
    # Find which recipes have this image
    sample_titles = [r['title'] for r in data if r.get('image') == img][:3]
    print(f' - {c} times: {img} -> Examples: {sample_titles}')


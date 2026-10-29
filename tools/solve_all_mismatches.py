import json
import re

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

with open('tools/photo_scraper/scraped_cookpad_photos.json', 'r', encoding='utf-8') as f:
    photos = json.load(f)

sweet_patterns = [
    r'\b(es|ice cream|ice|gelato|sorbet|sherbet|popsicles?|paletas?)\b',
    r'\b(jus|juice|smoothie|shake|milkshake|frappe|mocktail|latte|coffee|kopi|teh|tea)\b',
    r'\b(kue|cake|bolu|puding|pudding|jelly|kanten|agar|pie|tart|tartlet|pastry)\b',
    r'\b(churros|donat|doughnut|bomboloni|croissant|danish|eclair|strudel|macaron)\b',
    r'\b(mousse|panna cotta|creme brulee|parfait|custard|vla|flan|souffle|clafoutis)\b',
    r'\b(pancake|crepe|crepes|waffle|mille-feuille|pavlova|meringue|sponge)\b',
    r'\b(buko pandan|halo-halo|bingsu|cendol|dawet|teler|campur|kuwut|doger)\b',
    r'\b(kheer|pradhaman|payasam|halwa|ladoo|laddu|barfi|jalebi|rasmalai|rabri|mithai|shrikhand)\b',
    r'\b(lassi|aam panna|aamras|falooda|kulfi)\b',
    r'\b(manisan|candied|permen|candy|gummy|marshmallow|jam|selai|compote)\b',
    r'\b(mochi|daifuku|dorayaki|pastillas|fluff|dulce|horchata|granola|oatmeal|chia pudding)\b',
    r'\b(bubur sumsum|bubur candil|bubur ketan hitam|lupis|klepon|nagasari|dadar gulung|ongol-ongol)\b'
]

savory_patterns = [
    r'\b(sambal|rujak|asinan|acar|pico de gallo|salsa|ceviche|aguachile)\b',
    r'\b(ikan|gurame|lele|nila|patin|kakap|salmon|tuna|tongkol|teri|anchovy|scallop|kerang)\b',
    r'\b(udang|prawn|shrimp|cumi|squid|kepiting|crab|seafood)\b',
    r'\b(ayam|chicken|bebek|duck|daging|sapi|beef|iga|ribs|kambing|lamb|steak)\b',
    r'\b(sup|soup|soto|pindang|gulai|kari|curry|pesmol|lodeh|pliek u|keueng|sebie|singang)\b',
    r'\b(tumis|oseng|stir-fry|nasi goreng|fried rice|biryani|pulao|nasi ulam|rendang|rawon)\b',
    r'\b(tacos?|quesadillas?|enchiladas?|nachos?|tostones?|burritos?|empanadas?)\b',
    r'\b(sushi|roll|gimbap|som tum|yam mamuang|pla tod|pepes|tahu telur|tempe|belacan|terasi|petis)\b'
]

def classify(r):
    t = r['title'].lower()
    d = r['desc'].lower()
    cat = r.get('categoryKey', '')
    full = f"{t} {d}"

    if cat in ['gelato-eskrim', 'pastry', 'pastry-kreatif', 'kopi-mocktail', 'minuman']:
        return 'sweet'
    if cat == 'mpasi-anak':
        if any(w in full for w in ['ayam', 'salmon', 'daging', 'hati', 'ikan', 'telur', 'sayur']):
            return 'mpasi-savory'
        return 'mpasi-sweet'

    for p in savory_patterns:
        if re.search(p, full):
            return 'savory'
    for p in sweet_patterns:
        if re.search(p, full):
            return 'sweet'
    if cat in ['nusantara', 'nusantara-lanjutan', 'rumahan-tradisional', 'streetfood', 'latin-afrika', 'anak-benua', 'asia', 'asia-lanjutan', 'barat', 'fusion-finedining']:
        return 'savory'
    return 'sweet'

savory_photo_keywords = ['ikan', 'ayam', 'daging', 'sapi', 'bebek', 'kambing', 'udang', 'cumi', 'sambal', 'gulai', 'kari', 'pindang', 'rawon', 'soto', 'sop ', 'sup ', 'nasgor', 'nasi goreng', 'pepes', 'acar', 'sayur asem', 'rendang']
sweet_photo_keywords = ['cake', 'bolu', 'puding', 'pudding', 'es ', 'ice cream', 'gelato', 'sorbet', 'jus', 'juice', 'smoothie', 'tart', 'pie', 'donat', 'churros', 'kue', 'kolak', 'mochi']

def is_photo_mismatched(dish_class, photo_title, dish_title):
    pt = photo_title.lower()
    dt = dish_title.lower()

    if dish_class in ['sweet', 'mpasi-sweet']:
        for w in savory_photo_keywords:
            if re.search(r'\b' + re.escape(w.strip()) + r'\b', pt):
                return True
    elif dish_class in ['savory', 'mpasi-savory']:
        for w in sweet_photo_keywords:
            if re.search(r'\b' + re.escape(w.strip()) + r'\b', pt):
                if 'rujak' in dt and 'rujak' in pt:
                    return False
                return True
    return False

# Collect current valid photos
used_urls = set()
used_titles = set()
mismatched_recipes = []

for r in recipes:
    c = classify(r)
    cp = r.get('cookpadTitle') or ''
    if is_photo_mismatched(c, cp, r['title']):
        mismatched_recipes.append(r)
    else:
        used_urls.add(r['image'])
        used_titles.add(cp.lower())

print(f"Current well-matched: {len(recipes) - len(mismatched_recipes)}, Mismatched: {len(mismatched_recipes)}")

# Find best candidate from pool for each mismatched recipe
def find_best_photo(r, dish_class):
    t_words = [w for w in re.findall(r'\w+', r['title'].lower()) if len(w) > 3 and w not in ['mangga', 'mango', 'resep', 'khas', 'ala', 'gaya']]
    
    # Candidate scoring
    best_cand = None
    best_score = -1

    for k, v in photos.items():
        url = v.get('url', '')
        title = (v.get('title') or '').lower()
        if url in used_urls or title in used_titles:
            continue
        
        # Check domain constraint
        if dish_class in ['sweet', 'mpasi-sweet']:
            # must not contain savory words
            if any(re.search(r'\b' + re.escape(w.strip()) + r'\b', title) for w in savory_photo_keywords):
                continue
            # bonus if contains sweet words
            sweet_bonus = 5 if any(re.search(r'\b' + re.escape(w.strip()) + r'\b', title) for w in sweet_photo_keywords) else 0
        else:
            # must not contain sweet words
            if any(re.search(r'\b' + re.escape(w.strip()) + r'\b', title) for w in sweet_photo_keywords):
                if 'rujak' not in r['title'].lower() or 'rujak' not in title:
                    continue
            sweet_bonus = 5 if any(re.search(r'\b' + re.escape(w.strip()) + r'\b', title) for w in savory_photo_keywords) else 0

        # Word overlap score
        score = sweet_bonus
        for w in t_words:
            if w in title:
                score += 10

        if score > best_score:
            best_score = score
            best_cand = v
            if score >= 25: # Very strong match
                break
                
    return best_cand

reassigned = 0
for r in mismatched_recipes:
    c = classify(r)
    best = find_best_photo(r, c)
    if best:
        r['image'] = best['url']
        r['cookpadTitle'] = best['title']
        r['photoSlug'] = best.get('slug', '')
        used_urls.add(best['url'])
        used_titles.add(best['title'].lower())
        reassigned += 1
    else:
        print("FAILED to find match for:", r['id'], r['title'])

print(f"Successfully reassigned {reassigned} / {len(mismatched_recipes)} mismatched photos!")
print(f"Total unique image URLs now: {len(set(r['image'] for r in recipes))}")
print(f"Total unique Cookpad titles now: {len(set((r.get('cookpadTitle') or '').lower() for r in recipes))}")

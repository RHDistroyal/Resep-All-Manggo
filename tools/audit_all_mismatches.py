import json
import re

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

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

mismatches = []

for r in recipes:
    c = classify(r)
    cp = (r.get('cookpadTitle') or '').lower()
    rid = r['id']
    title = r['title']

    if c in ['sweet', 'mpasi-sweet']:
        for w in savory_photo_keywords:
            if re.search(r'\b' + re.escape(w.strip()) + r'\b', cp):
                mismatches.append((rid, title, cp, 'SWEET has SAVORY photo', w))
                break
    elif c in ['savory', 'mpasi-savory']:
        for w in sweet_photo_keywords:
            if re.search(r'\b' + re.escape(w.strip()) + r'\b', cp):
                if 'rujak' in title.lower() and 'rujak' in cp:
                    continue
                mismatches.append((rid, title, cp, 'SAVORY has SWEET photo', w))
                break

print(f"Total visual category mismatches detected: {len(mismatches)}")
for m in mismatches:
    print(f"  {m[0]} | {m[1]} -> cookpad: '{m[2]}' ({m[3]}: '{m[4]}')")

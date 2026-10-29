import json
import re

with open('data/recipes.json', 'r', encoding='utf-8') as f:
    recipes = json.load(f)

# Obvious sweet keywords
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

# Obvious savory patterns
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

    # Priority 1: Specific categories that are strictly sweet
    if cat in ['gelato-eskrim', 'pastry', 'pastry-kreatif']:
        return 'sweet'
    if cat in ['kopi-mocktail', 'minuman']:
        return 'sweet'
    if cat == 'mpasi-anak':
        # Check if savory MPASI (e.g. bubur tim ayam, salmon) or sweet fruit puree
        if any(w in full for w in ['ayam', 'salmon', 'daging', 'hati', 'ikan', 'telur', 'sayur']):
            return 'mpasi-savory'
        return 'mpasi-sweet'

    # Check savory regex
    for p in savory_patterns:
        if re.search(p, full):
            return 'savory'

    # Check sweet regex
    for p in sweet_patterns:
        if re.search(p, full):
            return 'sweet'

    # Default based on category
    if cat in ['nusantara', 'nusantara-lanjutan', 'rumahan-tradisional', 'streetfood', 'latin-afrika', 'anak-benua', 'asia', 'asia-lanjutan', 'barat', 'fusion-finedining']:
        return 'savory'
    
    return 'sweet'

counts = {}
for r in recipes:
    res = classify(r)
    counts[res] = counts.get(res, 0) + 1

print("Recipe classifications across 1,000 recipes:")
for k, v in counts.items():
    print(f"  {k}: {v}")


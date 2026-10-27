import json
import re

with open('data/recipes.json', encoding='utf-8') as f:
    recipes = json.load(f)

with open('data/scraped_cookpad_photos.json', encoding='utf-8') as f:
    photos_dict = json.load(f)

photos = list(photos_dict.values())

DISH_RULES = [
    # (Keywords in recipe title, Keywords in photo slug/search/title)
    (['sambal', 'pencit', 'dabu', 'matah', 'roa', 'gami'], ['sambal', 'pencit', 'dabu', 'matah']),
    (['rujak', 'gobet'], ['rujak', 'gobet']),
    (['asinan'], ['asinan']),
    (['manisan'], ['manisan']),
    (['sticky rice', 'ketan'], ['sticky', 'rice', 'ketan']),
    (['sago'], ['sago']),
    (['jus', 'juice'], ['jus', 'juice']),
    (['smoothie', 'bowl'], ['smoothie', 'smoothies', 'bowl']),
    (['yakult'], ['yakult']),
    (['mojito', 'mocktail', 'punch', 'squash'], ['mojito', 'punch', 'squash', 'segar']),
    (['boba', 'bubble', 'tea'], ['boba', 'tea']),
    (['cendol', 'dawet'], ['cendol', 'dawet', 'es']),
    (['puding', 'agar', 'jelly', 'jeli', 'kaca'], ['puding', 'pudding', 'agar', 'jelly']),
    (['cheesecake'], ['cheesecake', 'cheese']),
    (['crepe', 'crepes', 'mille'], ['crepe', 'crepes', 'mille']),
    (['pancake', 'pillow'], ['pancake']),
    (['tart', 'tartlet', 'pie', 'galette'], ['tart', 'pie', 'galette']),
    (['mousse'], ['mousse']),
    (['roll', 'bolu gulung', 'swiss'], ['roll', 'gulung', 'swiss']),
    (['chiffon', 'sponge', 'tres leches', 'upside-down', 'bread'], ['chiffon', 'cake', 'bolu', 'bread']),
    (['muffin', 'cupcake', 'scones'], ['muffin', 'cupcake', 'scones', 'cake']),
    (['sorbet', 'granita'], ['sorbet', 'granita', 'ice']),
    (['gelato', 'ice cream', 'eskrim', 'es krim', 'kulfi', 'bingsu', 'kakigori'], ['ice', 'cream', 'eskrim', 'gelato', 'kulfi', 'bingsu']),
    (['es lilin', 'es mambo', 'es kulkul', 'popsicles'], ['lilin', 'mambo', 'kulkul', 'es', 'ice']),
    (['es serut', 'es buah', 'es campur', 'setup', 'es teler'], ['es', 'kolak', 'serut', 'campur', 'segar']),
    (['kolak'], ['kolak']),
    (['bubur', 'sumsum', 'candil'], ['bubur', 'candil', 'sumsum']),
    (['nasi goreng', 'nasgor'], ['nasi goreng', 'nasgor']),
    (['sayur asem'], ['sayur asem', 'sayur']),
    (['gulai', 'curry', 'kari'], ['gulai', 'curry', 'kari']),
    (['lempah', 'garang asem', 'pepes'], ['lempah', 'garang', 'pepes', 'ikan', 'ayam']),
    (['ikan', 'gurame', 'salmon', 'udang', 'ceviche', 'seafood'], ['ikan', 'gurame', 'salmon', 'udang', 'ceviche', 'seafood']),
    (['ayam', 'wings', 'chicken', 'dendeng'], ['ayam', 'wings', 'chicken', 'dendeng']),
    (['salsa', 'pico de gallo', 'guacamole', 'dip'], ['salsa', 'pico', 'guacamole']),
    (['salad', 'kerabu', 'som tum', 'slaw', 'gohu', 'pecel', 'karedok', 'urap', 'plecing', 'lawar', 'acar'], ['salad', 'kerabu', 'som tum', 'acar', 'gohu', 'pecel']),
    (['parfait', 'trifle', 'fool', 'tiramisu', 'mangomisu', 'panna cotta'], ['parfait', 'trifle', 'panna cotta', 'tiramisu', 'dessert']),
    (['macaron', 'choux', 'sus', 'eclair', 'bomboloni', 'pastry', 'danish', 'strudel'], ['macaron', 'choux', 'sus', 'eclair', 'bomboloni', 'pastry']),
    (['french toast', 'waffle', 'toast', 'roti'], ['toast', 'waffle', 'roti', 'pancake']),
    (['klepon', 'kue lumpur', 'nagasari', 'lapis', 'bika ambon', 'ongol', 'serabi', 'lupis', 'dadar gulung'], ['kue', 'lapis', 'tradisional', 'dodol', 'ketan', 'manisan']),
    (['dodol', 'lempok'], ['dodol', 'lempok', 'manisan']),
    (['king mango'], ['king mango', 'king', 'jus', 'smoothie'])
]

def get_rule_priority(title):
    t = title.lower()
    for rec_kws, photo_kws in DISH_RULES:
        if any(k in t for k in rec_kws):
            return rec_kws, photo_kws
    return [], []

def score_photo_for_recipe(recipe, photo):
    rec_title = recipe['title'].lower()
    rec_desc = recipe.get('desc', '').lower()
    cat = recipe.get('categoryKey', '')
    
    p_title = photo.get('title', '').lower()
    p_slug = photo.get('slug', '').lower()
    p_term = photo.get('searchTerm', '').lower()
    p_combined = f"{p_title} {p_slug} {p_term}"
    
    score = 0
    rec_kws, photo_kws = get_rule_priority(rec_title)
    
    # Rule match
    if photo_kws:
        matches = [k for k in photo_kws if k in p_combined]
        if matches:
            score += 200 + len(matches) * 50
    
    # Exact word match
    words = re.findall(r'[a-z0-9]{3,}', rec_title)
    for w in words:
        if w not in ['resep', 'olahan', 'mangga', 'dan', 'yang', 'dengan', 'ala', 'khas']:
            if w in p_combined:
                score += 40
                
    # Category bonus
    if cat == 'minuman' and any(k in p_combined for k in ['jus', 'smoothie', 'drink', 'yakult', 'mojito', 'boba', 'es', 'punch', 'king']):
        score += 30
    elif cat == 'nusantara' and any(k in p_combined for k in ['sambal', 'rujak', 'asinan', 'manisan', 'ikan', 'ayam', 'gulai', 'sayur', 'acar', 'dodol', 'kolak', 'bubur']):
        score += 30
    elif cat == 'pastry' and any(k in p_combined for k in ['puding', 'cheesecake', 'crepe', 'tart', 'pie', 'mousse', 'cake', 'bolu', 'sorbet', 'ice', 'parfait', 'dessert']):
        score += 30
    elif cat == 'asia' and any(k in p_combined for k in ['sticky', 'rice', 'sago', 'float', 'pancake', 'curry', 'kulfi', 'kerabu']):
        score += 30
    elif cat == 'barat' and any(k in p_combined for k in ['salsa', 'salad', 'taco', 'ceviche', 'quesadilla', 'wings', 'guacamole', 'bbq']):
        score += 30

    return score

# Greedy assignment with highest scores first
recipe_candidates = []
for idx, rec in enumerate(recipes):
    scores = []
    for p_idx, p in enumerate(photos):
        s = score_photo_for_recipe(rec, p)
        scores.append((s, p_idx))
    scores.sort(key=lambda x: x[0], reverse=True)
    recipe_candidates.append((idx, scores))

# Sort recipes by their max score descending so strict dishes get first pick
recipe_candidates.sort(key=lambda x: x[1][0][0], reverse=True)

assigned_photos = set()
final_map = {}

for rec_idx, scores in recipe_candidates:
    rec = recipes[rec_idx]
    chosen = False
    for s, p_idx in scores:
        if p_idx not in assigned_photos:
            assigned_photos.add(p_idx)
            final_map[rec_idx] = photos[p_idx]
            chosen = True
            break
    if not chosen:
        print("ERROR: Unassigned recipe", rec['id'], rec['title'])

print(f"Total recipes: {len(recipes)}")
print(f"Total assigned unique photos: {len(final_map)}")
print(f"Total distinct photo URLs: {len(set(p['url'] for p in final_map.values()))}")

for idx, rec in enumerate(recipes):
    photo = final_map[idx]
    rec['image'] = photo['url']
    rec['cookpadTitle'] = photo.get('title', '')
    rec['photoSlug'] = photo.get('slug', '')

with open('data/recipes.json', 'w', encoding='utf-8') as out:
    json.dump(recipes, out, ensure_ascii=False, indent=2)

with open('js/recipes-data.js', 'w', encoding='utf-8') as out:
    out.write('// Resep All Manggo - Complete 200 Mango Recipe Database\n')
    out.write('// 1 Resep = 1 Unique Authentic Food Photo (Cookpad Engine)\n')
    out.write('window.MANGO_RECIPES = ')
    json.dump(recipes, out, ensure_ascii=False, indent=2)
    out.write(';\n')

print("Saved updated recipes.json and js/recipes-data.js!")

# Sample print verification
test_ids = ['nusantara-01', 'nusantara-02', 'nusantara-03', 'nusantara-11', 'minuman-01', 'minuman-02', 'minuman-04', 'asia-01', 'pastry-01', 'pastry-05', 'pastry-07', 'barat-01', 'barat-05']
for r in recipes:
    if r['id'] in test_ids:
        t = r['title'].encode('ascii', 'replace').decode('ascii')
        slug = r['photoSlug'].encode('ascii', 'replace').decode('ascii')
        print(f"[{r['id']}] {t} -> Photo: {slug[:50]}")

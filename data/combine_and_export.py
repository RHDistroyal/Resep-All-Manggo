# -*- coding: utf-8 -*-
"""
Master Compiler for Resep All Manggo Database
Merges all 200 recipes from generator parts into:
1. data/recipes.json (JSON format)
2. js/recipes-data.js (Browser-ready global window.MANGO_RECIPES)
"""

import json
import os
import sys

# Ensure data directory is in sys.path
data_dir = os.path.dirname(os.path.abspath(__file__))
if data_dir not in sys.path:
    sys.path.insert(0, data_dir)

from generator_part1 import simpel_recipes
from generator_part2 import minuman_recipes
from generator_part3a import nusantara_recipes_partA
from generator_part3b import nusantara_recipes_partB
from generator_part4 import asia_recipes
from generator_part5 import barat_recipes
from generator_part6a import pastry_recipes_partA
from generator_part6b import pastry_recipes_partB

all_recipes = []

# 1. Olahan Simpel & Harian (25)
all_recipes.extend(simpel_recipes)

# 2. Minuman Kekinian & Segar (25)
all_recipes.extend(minuman_recipes)

# 3. Resep Daerah & Nusantara (50)
all_recipes.extend(nusantara_recipes_partA)
all_recipes.extend(nusantara_recipes_partB)

# 4. Hidangan Asia (30)
all_recipes.extend(asia_recipes)

# 5. Hidangan Barat & Latin (20)
all_recipes.extend(barat_recipes)

# 6. Pastry & Dessert Internasional (50)
all_recipes.extend(pastry_recipes_partA)
all_recipes.extend(pastry_recipes_partB)

print(f"Total compiled recipes: {len(all_recipes)}")

# Verification
categories = {}
for r in all_recipes:
    cat = r["category"]
    categories[cat] = categories.get(cat, 0) + 1

print("Recipe count per category:")
for cat, count in categories.items():
    print(f" - {cat}: {count}")

# Base project dir
base_dir = os.path.dirname(data_dir)

# 1. Write data/recipes.json
json_path = os.path.join(data_dir, "recipes.json")
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(all_recipes, f, ensure_ascii=False, indent=2)
print(f"Exported JSON to {json_path}")

# 2. Write js/recipes-data.js
js_path = os.path.join(base_dir, "js", "recipes-data.js")
js_content = f"""// Resep All Manggo - Complete 200 Mango Recipe Database
// Generated with rich culinary specifications
window.MANGO_RECIPES = {json.dumps(all_recipes, ensure_ascii=False, indent=2)};
"""

with open(js_path, "w", encoding="utf-8") as f:
    f.write(js_content)
print(f"Exported JS to {js_path}")

print("COMPILATION SUCCESSFUL!")

# -*- coding: utf-8 -*-
"""
Master Compiler for Resep All Manggo Database
Compiles all 1,000 recipes across 20 culinary categories into:
1. data/recipes.json (JSON format)
2. js/recipes-data.js (Browser-ready global window.MANGO_RECIPES)
"""

import os
import subprocess
import sys

cur_dir = os.path.dirname(os.path.abspath(__file__))
build_script = os.path.join(cur_dir, "build_full_database.py")

result = subprocess.run([sys.executable, build_script], capture_output=True, text=True, encoding="utf-8")
print(result.stdout)
if result.stderr:
    print(result.stderr, file=sys.stderr)

if result.returncode == 0:
    print("COMPILATION OF 1,000 RECIPES SUCCESSFUL!")
else:
    sys.exit(result.returncode)

import urllib.request
import urllib.parse
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
terms = ['sambal mangga', 'jus mangga', 'puding mangga', 'bolu mangga', 'kue mangga', 'es mangga', 'kari mangga', 'salad mangga', 'ikan mangga', 'ayam mangga']
collected = {}

for t in terms:
    url = f'https://cookpad.com/id/cari/{urllib.parse.quote(t)}'
    req = urllib.request.Request(url, headers=headers)
    try:
        html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]+)/([^\s"\'\?]+)', html)
        for h, s in matches:
            if h not in collected:
                collected[h] = s
    except Exception as e:
        print(f'Error {t}:', e)

print(f'Test collected: {len(collected)} photos from 10 terms')


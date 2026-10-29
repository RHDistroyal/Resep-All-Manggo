import urllib.request
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
url = 'https://cookpad.com/id/cari/mangga'
req = urllib.request.Request(url, headers=headers)
html = urllib.request.urlopen(req, timeout=5).read().decode('utf-8', errors='ignore')

matches = re.findall(r'https://img-global\.cpcdn\.com/recipes/([a-f0-9]{16})/([^\s"\'\?]+)', html)
print(f"Total img-global recipe matches on page: {len(matches)}")
for m in matches[:5]:
    print(m)
